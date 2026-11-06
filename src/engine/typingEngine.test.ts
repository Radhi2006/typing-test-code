import { describe, expect, it } from 'vitest';
import {
  AUTO,
  CORRECT,
  UNTYPED,
  WRONG,
  backspace,
  correctChars,
  createEngine,
  deleteWord,
  isFinished,
  typeChar,
  typeEnter,
  typeTab,
  type EngineState,
} from './typingEngine';
import { accuracy, consistency, wpm } from './metrics';
import { detectSymbol, normalizeCode, parseSource } from './normalize';

const opts = { indentUnit: 2, autoIndent: true };

function typeAll(s: EngineState, text: string): EngineState {
  for (const ch of text) s = ch === '\n' ? typeEnter(s) : typeChar(s, ch);
  return s;
}

describe('typing engine', () => {
  it('marks correct and wrong characters', () => {
    let s = createEngine('abc', opts);
    s = typeChar(s, 'a');
    s = typeChar(s, 'x');
    expect(s.status[0]).toBe(CORRECT);
    expect(s.status[1]).toBe(WRONG);
    expect(s.pos).toBe(2);
    expect(s.errors).toBe(1);
    expect(s.mistakes[1]).toBe(1);
  });

  it('finishes at the end of the text', () => {
    const s = typeAll(createEngine('ab\ncd', opts), 'ab\ncd');
    expect(isFinished(s)).toBe(true);
    expect(s.errors).toBe(0);
    expect(correctChars(s)).toBe(5);
  });

  it('does not let regular characters cross a line break', () => {
    let s = typeAll(createEngine('ab\ncd', opts), 'ab');
    s = typeChar(s, 'c');
    expect(s.pos).toBe(2);
    expect(s.errors).toBe(1);
    expect(s.rejectTick).toBe(1);
  });

  it('rejects Enter in the middle of a line', () => {
    let s = createEngine('ab\ncd', opts);
    s = typeEnter(s);
    expect(s.pos).toBe(0);
    expect(s.errors).toBe(1);
  });

  it('auto-indents after Enter', () => {
    let s = typeAll(createEngine('if {\n  x\n}', opts), 'if {\n');
    expect(s.pos).toBe(7);
    expect(s.status[5]).toBe(AUTO);
    expect(s.status[6]).toBe(AUTO);
    s = typeAll(s, 'x\n}');
    expect(isFinished(s)).toBe(true);
  });

  it('requires typing the indentation when auto-indent is off', () => {
    let s = typeAll(createEngine('a\n    b', { indentUnit: 2, autoIndent: false }), 'a\n');
    expect(s.pos).toBe(2);
    s = typeTab(s);
    expect(s.pos).toBe(4);
    s = typeTab(s);
    expect(s.pos).toBe(6);
    expect(s.keystrokes).toBe(4);
    s = typeChar(s, 'b');
    expect(isFinished(s)).toBe(true);
  });

  it('rejects Tab when no whitespace is expected', () => {
    const s = typeTab(createEngine('abc', opts));
    expect(s.pos).toBe(0);
    expect(s.errors).toBe(1);
  });

  it('backspace removes auto-indent together with the line break', () => {
    let s = typeAll(createEngine('a\n  b', opts), 'a\n');
    expect(s.pos).toBe(4);
    s = backspace(s);
    expect(s.pos).toBe(1);
    expect(s.status[1]).toBe(UNTYPED);
    expect(s.status[2]).toBe(UNTYPED);
  });

  it('backspace does nothing before any typed character', () => {
    const s = createEngine('  a', opts);
    expect(s.pos).toBe(2);
    expect(backspace(s)).toBe(s);
  });

  it('ctrl+backspace deletes the previous word only', () => {
    let s = typeAll(createEngine('const value = 1', opts), 'const value');
    s = deleteWord(s);
    expect(s.pos).toBe(6);
    s = typeAll(s, 'value ');
    s = deleteWord(s);
    expect(s.pos).toBe(6);
  });
});

describe('metrics', () => {
  it('computes wpm from characters and time', () => {
    expect(wpm(300, 60000)).toBe(60);
    expect(wpm(0, 0)).toBe(0);
  });
  it('computes accuracy', () => {
    expect(accuracy(9, 10)).toBe(90);
    expect(accuracy(0, 0)).toBe(100);
  });
  it('gives perfect consistency for a constant pace', () => {
    expect(consistency([60, 60, 60])).toBe(100);
    expect(consistency([10, 120, 5, 90])).toBeLessThan(60);
  });
});

describe('normalize', () => {
  it('parses the metadata line and strips it', () => {
    const p = parseSource('// @codetype medium | Does a thing\nconst a = 1;\n');
    expect(p?.difficulty).toBe('medium');
    expect(p?.description).toBe('Does a thing');
    expect(p?.body.trim()).toBe('const a = 1;');
  });
  it('normalizes whitespace', () => {
    expect(normalizeCode('\n\tfoo  \r\n\n\n\tbar\n', 4)).toBe('    foo\n\n    bar');
  });
  it('detects a symbol name', () => {
    expect(detectSymbol('export function binarySearch(a) {}')).toBe('binarySearch');
    expect(detectSymbol('def merge_sort(xs):')).toBe('merge_sort');
    expect(detectSymbol('fn main() {}')).toBe('main');
  });
});
