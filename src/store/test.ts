import { create } from 'zustand';
import {
  EMPTY_TOTALS,
  accuracy,
  addTotals,
  consistency,
  wpm,
  type Sample,
  type Totals,
} from '../engine/metrics';
import {
  backspace,
  correctChars,
  createEngine,
  deleteWord,
  isFinished,
  typeChar,
  typeEnter,
  typeTab,
  type EngineState,
} from '../engine/typingEngine';
import { SNIPPETS, pickRandom } from '../snippets';
import { LANG_BY_ID } from '../snippets/languages';
import type { Snippet } from '../snippets/types';
import { bestFor, useHistory, type Result } from './history';
import { useSettings } from './settings';

export type Phase = 'idle' | 'running' | 'finished';

/** a run only counts toward personal bests when it is a real attempt */
export const MIN_VALID_ACCURACY = 75;
const MIN_VALID_CHARS = 20;
export type InputKind = 'char' | 'enter' | 'tab' | 'backspace' | 'deleteWord';

interface TestStore {
  snippet: Snippet;
  engine: EngineState;
  phase: Phase;
  startedAt: number | null;
  endedAt: number | null;
  /** totals of snippets already completed in this run (time mode) */
  carried: Totals;
  snippetsDone: number;
  samples: Sample[];
  lastSample: Totals;
  result: Result | null;
  /** increments to ask the UI to refocus the input */
  focusTick: number;

  open: (snippet: Snippet) => void;
  next: () => void;
  restart: () => void;
  input: (kind: InputKind, ch?: string) => void;
  tick: (now: number) => void;
  requestFocus: () => void;
}

function engineFor(snippet: Snippet): EngineState {
  const { autoIndent } = useSettings.getState();
  return createEngine(snippet.code, { autoIndent, indentUnit: LANG_BY_ID[snippet.lang].indent });
}

function engineTotals(e: EngineState): Totals {
  return {
    correctChars: correctChars(e),
    keystrokes: e.keystrokes,
    correctKeys: e.correctKeys,
    errors: e.errors,
  };
}

function firstSnippet(): Snippet {
  const { lang, difficulty } = useSettings.getState();
  return SNIPPETS.length ? pickRandom(lang, difficulty) : placeholder();
}

function placeholder(): Snippet {
  return {
    id: 'empty',
    lang: 'javascript',
    filename: 'empty.js',
    difficulty: 'easy',
    description: 'No snippets found',
    code: '// no snippets found',
    symbol: null,
  };
}

function freshRun(snippet: Snippet) {
  return {
    snippet,
    engine: engineFor(snippet),
    phase: 'idle' as Phase,
    startedAt: null,
    endedAt: null,
    carried: EMPTY_TOTALS,
    snippetsDone: 0,
    samples: [],
    lastSample: EMPTY_TOTALS,
    result: null,
  };
}

const initial = firstSnippet();

export const useTest = create<TestStore>()((set, get) => ({
  ...freshRun(initial),
  focusTick: 0,

  open: (snippet) => set((s) => ({ ...freshRun(snippet), focusTick: s.focusTick + 1 })),

  next: () => {
    const { lang, difficulty } = useSettings.getState();
    get().open(pickRandom(lang, difficulty, get().snippet.id));
  },

  restart: () => set((s) => ({ ...freshRun(s.snippet), focusTick: s.focusTick + 1 })),

  input: (kind, ch) => {
    const s = get();
    if (s.phase === 'finished') return;
    let engine = s.engine;
    switch (kind) {
      case 'char':
        engine = typeChar(engine, ch ?? '');
        break;
      case 'enter':
        engine = typeEnter(engine);
        break;
      case 'tab':
        engine = typeTab(engine);
        break;
      case 'backspace':
        engine = backspace(engine);
        break;
      case 'deleteWord':
        engine = deleteWord(engine);
        break;
    }
    if (engine === s.engine) return;
    const now = performance.now();
    const patch: Partial<TestStore> = { engine };
    if (s.phase === 'idle') {
      if (kind === 'backspace' || kind === 'deleteWord') return;
      patch.phase = 'running';
      patch.startedAt = now;
    }
    set(patch);
    if (isFinished(engine)) {
      const { mode } = useSettings.getState();
      if (mode === 'time') {
        // keep the clock running and roll over to another snippet
        const { lang, difficulty } = useSettings.getState();
        const n = pickRandom(lang, difficulty, s.snippet.id);
        set((cur) => ({
          carried: addTotals(cur.carried, engineTotals(engine)),
          snippetsDone: cur.snippetsDone + 1,
          snippet: n,
          engine: engineFor(n),
        }));
      } else {
        finish(now);
      }
    }
  },

  tick: (now) => {
    const s = get();
    if (s.phase !== 'running' || s.startedAt === null) return;
    const { mode, timeLimit } = useSettings.getState();
    const elapsed = now - s.startedAt;
    const limitMs = timeLimit * 1000;
    const capped = mode === 'time' ? Math.min(elapsed, limitMs) : elapsed;
    const whole = Math.floor(capped / 1000);
    if (whole > s.samples.length) {
      const samples = s.samples.slice();
      let last = s.lastSample;
      const totals = currentTotals(s);
      for (let t = s.samples.length + 1; t <= whole; t++) {
        // only the newest second carries the delta; earlier skipped seconds get zero
        const isLatest = t === whole;
        samples.push({
          t,
          wpm: Math.round(wpm(totals.correctChars, t * 1000)),
          raw: isLatest ? Math.round(((totals.keystrokes - last.keystrokes) / 5) * 60) : 0,
          errors: isLatest ? totals.errors - last.errors : 0,
        });
        if (isLatest) last = totals;
      }
      set({ samples, lastSample: last });
    }
    if (mode === 'time' && elapsed >= limitMs) finish(s.startedAt + limitMs);
  },

  requestFocus: () => set((s) => ({ focusTick: s.focusTick + 1 })),
}));

function currentTotals(s: Pick<TestStore, 'carried' | 'engine'>): Totals {
  return addTotals(s.carried, engineTotals(s.engine));
}

export function liveStats(s: Pick<TestStore, 'carried' | 'engine' | 'startedAt' | 'phase' | 'endedAt'>, now: number) {
  const totals = currentTotals(s);
  const elapsed =
    s.startedAt === null ? 0 : (s.phase === 'finished' && s.endedAt ? s.endedAt : now) - s.startedAt;
  return {
    elapsed,
    wpm: elapsed > 1000 ? wpm(totals.correctChars, elapsed) : 0,
    accuracy: accuracy(totals.correctKeys, totals.keystrokes),
    errors: totals.errors,
  };
}

function finish(endedAt: number) {
  const s = useTest.getState();
  if (s.phase !== 'running' || s.startedAt === null) return;
  const { mode, timeLimit, lang } = useSettings.getState();
  const totals = currentTotals(s);
  const duration = Math.max(1, endedAt - s.startedAt);
  const samples = s.samples.slice();
  const lastT = samples.length ? samples[samples.length - 1].t : 0;
  const tailSec = duration / 1000 - lastT;
  if (tailSec > 0.2) {
    samples.push({
      t: Math.round((duration / 1000) * 10) / 10,
      wpm: Math.round(wpm(totals.correctChars, duration)),
      raw: Math.round(((totals.keystrokes - s.lastSample.keystrokes) / 5) * (60 / tailSec)),
      errors: totals.errors - s.lastSample.errors,
    });
  }
  const resultLang = mode === 'time' && lang === 'all' ? 'mixed' : s.snippet.lang;
  const history = useHistory.getState();
  const prevBest = bestFor(history.results, resultLang);
  const finalWpm = wpm(totals.correctChars, duration);
  const result: Result = {
    id: `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
    date: Date.now(),
    mode,
    timeLimit: mode === 'time' ? timeLimit : null,
    lang: resultLang,
    snippetId: s.snippet.id,
    filename: s.snippet.filename,
    snippets: s.snippetsDone + (mode === 'snippet' ? 1 : 0),
    durationMs: duration,
    wpm: finalWpm,
    raw: wpm(totals.keystrokes, duration),
    accuracy: accuracy(totals.correctKeys, totals.keystrokes),
    consistency: consistency(samples.map((x) => x.raw)),
    errors: totals.errors,
    chars: totals.correctChars,
    samples,
    isPersonalBest:
      totals.correctChars >= MIN_VALID_CHARS &&
      accuracy(totals.correctKeys, totals.keystrokes) >= MIN_VALID_ACCURACY &&
      (!prevBest || finalWpm > prevBest.wpm),
  };
  history.add(result);
  useTest.setState({
    phase: 'finished',
    endedAt,
    samples,
    result,
  });
}
