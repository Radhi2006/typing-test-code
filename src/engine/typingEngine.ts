/** Pure typing engine. Every function returns a new state; nothing mutates. */

export const UNTYPED = 0;
export const CORRECT = 1;
export const WRONG = 2;
/** whitespace skipped automatically by auto-indent (not typed by the user) */
export const AUTO = 3;

export interface EngineOptions {
  indentUnit: number;
  autoIndent: boolean;
}

export interface EngineState {
  target: string;
  status: Uint8Array;
  /** how many wrong keystrokes happened at each position */
  mistakes: Uint16Array;
  pos: number;
  /** every counted key press: characters, Enter, Tab */
  keystrokes: number;
  correctKeys: number;
  errors: number;
  /** bumps whenever a key is rejected without moving the caret (for a shake/flash) */
  rejectTick: number;
  opts: EngineOptions;
}

export function createEngine(target: string, opts: EngineOptions): EngineState {
  const state: EngineState = {
    target,
    status: new Uint8Array(target.length),
    mistakes: new Uint16Array(target.length),
    pos: 0,
    keystrokes: 0,
    correctKeys: 0,
    errors: 0,
    rejectTick: 0,
    opts,
  };
  if (opts.autoIndent) skipIndent(state);
  return state;
}

export function isFinished(s: EngineState): boolean {
  return s.pos >= s.target.length;
}

function clone(s: EngineState): EngineState {
  return { ...s, status: s.status.slice(), mistakes: s.mistakes.slice() };
}

/** advance over leading spaces of the current line (mutates a fresh clone) */
function skipIndent(s: EngineState) {
  while (s.pos < s.target.length && s.target[s.pos] === ' ') {
    s.status[s.pos] = AUTO;
    s.pos++;
  }
}

function reject(s: EngineState): EngineState {
  const n = clone(s);
  n.keystrokes++;
  n.errors++;
  n.rejectTick++;
  if (n.pos < n.target.length) n.mistakes[n.pos]++;
  return n;
}

export function typeChar(s: EngineState, ch: string): EngineState {
  if (isFinished(s)) return s;
  const expected = s.target[s.pos];
  // never type across a line break with a regular character
  if (expected === '\n') return reject(s);
  const n = clone(s);
  n.keystrokes++;
  if (ch === expected) {
    n.status[n.pos] = CORRECT;
    n.correctKeys++;
  } else {
    n.status[n.pos] = WRONG;
    n.mistakes[n.pos]++;
    n.errors++;
  }
  n.pos++;
  return n;
}

export function typeEnter(s: EngineState): EngineState {
  if (isFinished(s)) return s;
  if (s.target[s.pos] !== '\n') return reject(s);
  const n = clone(s);
  n.keystrokes++;
  n.correctKeys++;
  n.status[n.pos] = CORRECT;
  n.pos++;
  if (n.opts.autoIndent) skipIndent(n);
  return n;
}

/** Tab types spaces up to the next indentation stop. */
export function typeTab(s: EngineState): EngineState {
  if (isFinished(s)) return s;
  if (s.target[s.pos] !== ' ') return reject(s);
  const unit = s.opts.indentUnit;
  const col = column(s.target, s.pos);
  const want = unit - (col % unit);
  const n = clone(s);
  n.keystrokes++;
  n.correctKeys++;
  for (let i = 0; i < want && n.target[n.pos] === ' '; i++) {
    n.status[n.pos] = CORRECT;
    n.pos++;
  }
  return n;
}

export function backspace(s: EngineState): EngineState {
  if (s.pos === 0) return s;
  let p = s.pos - 1;
  // auto-indent whitespace goes away together with the line break before it
  while (p >= 0 && s.status[p] === AUTO) p--;
  if (p < 0) return s;
  const n = clone(s);
  for (let i = p; i < s.pos; i++) n.status[i] = UNTYPED;
  n.pos = p;
  return n;
}

type CharClass = 'space' | 'word' | 'punct' | 'newline';

function classOf(ch: string): CharClass {
  if (ch === '\n') return 'newline';
  if (ch === ' ') return 'space';
  if (/[A-Za-z0-9_$]/.test(ch)) return 'word';
  return 'punct';
}

/** Ctrl+Backspace: delete the previous word (stays within the line, like editors do). */
export function deleteWord(s: EngineState): EngineState {
  if (s.pos === 0) return s;
  let n = backspace(s);
  const first = classOf(s.target[n.pos]);
  if (first === 'newline') return n;
  // when the caret sat right after spaces, drop them and then the word before
  let cls = first;
  while (n.pos > 0) {
    const prevIdx = n.pos - 1;
    if (n.status[prevIdx] === AUTO) break;
    const prev = classOf(s.target[prevIdx]);
    if (prev === 'newline') break;
    if (cls === 'space' && prev !== 'space') cls = prev;
    else if (prev !== cls) break;
    n = backspace(n);
  }
  return n;
}

export function column(text: string, pos: number): number {
  const lineStart = text.lastIndexOf('\n', pos - 1) + 1;
  return pos - lineStart;
}

export function lineOf(text: string, pos: number): number {
  let line = 0;
  for (let i = 0; i < pos && i < text.length; i++) if (text[i] === '\n') line++;
  return line;
}

/** characters the user actually typed correctly (auto-indent excluded) */
export function correctChars(s: EngineState): number {
  let c = 0;
  for (let i = 0; i < s.pos; i++) if (s.status[i] === CORRECT) c++;
  return c;
}

export function wrongChars(s: EngineState): number {
  let c = 0;
  for (let i = 0; i < s.pos; i++) if (s.status[i] === WRONG) c++;
  return c;
}
