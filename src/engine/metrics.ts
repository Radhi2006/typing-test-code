export interface Totals {
  correctChars: number;
  keystrokes: number;
  correctKeys: number;
  errors: number;
}

export const EMPTY_TOTALS: Totals = { correctChars: 0, keystrokes: 0, correctKeys: 0, errors: 0 };

export function addTotals(a: Totals, b: Totals): Totals {
  return {
    correctChars: a.correctChars + b.correctChars,
    keystrokes: a.keystrokes + b.keystrokes,
    correctKeys: a.correctKeys + b.correctKeys,
    errors: a.errors + b.errors,
  };
}

/** standard definition: one "word" is five characters */
export function wpm(chars: number, ms: number): number {
  if (ms <= 0) return 0;
  return chars / 5 / (ms / 60000);
}

export function accuracy(correctKeys: number, keystrokes: number): number {
  if (keystrokes === 0) return 100;
  return (correctKeys / keystrokes) * 100;
}

/** 100 = perfectly even pace. Based on the coefficient of variation of
 *  per-second raw speed. */
export function consistency(values: number[]): number {
  const v = values.filter((x) => Number.isFinite(x));
  if (v.length < 2) return 100;
  const mean = v.reduce((a, b) => a + b, 0) / v.length;
  if (mean === 0) return 0;
  const variance = v.reduce((a, b) => a + (b - mean) ** 2, 0) / v.length;
  const cv = Math.sqrt(variance) / mean;
  return Math.max(0, Math.min(100, 100 * (1 - Math.tanh(cv))));
}

export interface Sample {
  /** seconds since start */
  t: number;
  /** cumulative wpm at this second */
  wpm: number;
  /** raw speed during this one second */
  raw: number;
  /** errors that happened during this second */
  errors: number;
}

export function formatTime(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}
