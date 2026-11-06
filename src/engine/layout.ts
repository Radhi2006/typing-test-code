/** Static, per-snippet layout facts used by the editor view. */

export interface LineInfo {
  text: string;
  start: number;
  /** true when a '\n' follows this line */
  hasNewline: boolean;
}

export function splitLines(code: string): LineInfo[] {
  const out: LineInfo[] = [];
  let start = 0;
  const parts = code.split('\n');
  parts.forEach((text, i) => {
    out.push({ text, start, hasNewline: i < parts.length - 1 });
    start += text.length + 1;
  });
  return out;
}

/** index of the line that contains `pos` */
export function lineIndexAt(lines: LineInfo[], pos: number): number {
  let lo = 0;
  let hi = lines.length - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (lines[mid].start <= pos) lo = mid;
    else hi = mid - 1;
  }
  return lo;
}

/** Columns where vertical indent guides are drawn, per line. */
export function indentGuides(lines: LineInfo[], unit: number): number[][] {
  const ind = lines.map((l) => (l.text.trim() === '' ? -1 : l.text.length - l.text.trimStart().length));
  const resolved = ind.map((v, i) => {
    if (v >= 0) return v;
    let prev = 0;
    for (let j = i - 1; j >= 0; j--) if (ind[j] >= 0) { prev = ind[j]; break; }
    let next = 0;
    for (let j = i + 1; j < ind.length; j++) if (ind[j] >= 0) { next = ind[j]; break; }
    return Math.min(prev, next);
  });
  return resolved.map((v) => {
    const cols: number[] = [];
    for (let c = 0; c < v; c += unit) cols.push(c);
    return cols;
  });
}

const OPEN = '([{';
const CLOSE = ')]}';

/** partner index for each bracket character, -1 elsewhere */
export function matchBrackets(code: string): Int32Array {
  const partner = new Int32Array(code.length).fill(-1);
  const stack: number[] = [];
  for (let i = 0; i < code.length; i++) {
    const ch = code[i];
    if (OPEN.includes(ch)) stack.push(i);
    else {
      const ci = CLOSE.indexOf(ch);
      if (ci === -1) continue;
      const top = stack[stack.length - 1];
      if (top !== undefined && code[top] === OPEN[ci]) {
        stack.pop();
        partner[i] = top;
        partner[top] = i;
      }
    }
  }
  return partner;
}
