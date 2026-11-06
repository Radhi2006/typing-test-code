import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Sample } from '../engine/metrics';
import type { LangId } from '../snippets/languages';
import { storage, type Mode } from './settings';

export interface Result {
  id: string;
  date: number;
  mode: Mode;
  /** seconds for time mode, otherwise null */
  timeLimit: number | null;
  lang: LangId | 'mixed';
  snippetId: string;
  filename: string;
  snippets: number;
  durationMs: number;
  wpm: number;
  raw: number;
  accuracy: number;
  consistency: number;
  errors: number;
  chars: number;
  samples: Sample[];
  isPersonalBest: boolean;
}

interface HistoryStore {
  results: Result[];
  add: (r: Result) => void;
  clear: () => void;
}

const MAX = 300;

export const useHistory = create<HistoryStore>()(
  persist(
    (set) => ({
      results: [],
      add: (r) =>
        set((s) => ({
          // keep samples only for the most recent runs to stay small
          results: [r, ...s.results.map((x, i) => (i < 20 ? x : { ...x, samples: [] }))].slice(
            0,
            MAX,
          ),
        })),
      clear: () => set({ results: [] }),
    }),
    { name: 'codetype-history', storage, version: 1 },
  ),
);

export function bestFor(results: Result[], lang: LangId | 'mixed' | 'any'): Result | null {
  let best: Result | null = null;
  for (const r of results) {
    if (lang !== 'any' && r.lang !== lang) continue;
    if (r.accuracy < 75) continue;
    if (!best || r.wpm > best.wpm) best = r;
  }
  return best;
}
