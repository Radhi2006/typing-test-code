import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { WORLD_BY_ID } from '../../garden/worlds';
import { lineIndexAt, matchBrackets, splitLines } from '../../engine/layout';
import { AUTO, CORRECT, WRONG } from '../../engine/typingEngine';
import { FONT_BOLD, FONT_ITALIC, type CharColors } from '../../highlight/highlighter';
import { handleTypingKey } from '../../hooks/keys';
import { useHighlight } from '../../hooks/useHighlight';
import { useSettings } from '../../store/settings';
import { useTest } from '../../store/test';
import { useUI } from '../../store/ui';
import { Icon } from '../icons';

const STATUS_CLASS: Record<number, string> = {
  0: 'u',
  [CORRECT]: 'c',
  [WRONG]: 'w',
  [AUTO]: 'a',
};

interface LineProps {
  text: string;
  start: number;
  colors: CharColors | null;
  /** one digit per char (+1 for the line break), see STATUS_CLASS */
  statusKey: string;
  /** comma separated columns of highlighted brackets */
  bracketCols: string;
  showWs: boolean;
  eolHint: boolean;
}

const Line = memo(function Line({ text, start, colors, statusKey, bracketCols, showWs, eolHint }: LineProps) {
  const brackets = bracketCols ? bracketCols.split(',').map(Number) : [];
  const segs: { text: string; cls: string; color?: string; fs: number; key: string }[] = [];
  for (let i = 0; i < text.length; i++) {
    const abs = start + i;
    const st = statusKey.charCodeAt(i) - 48;
    const color = colors ? colors.colors[abs] : undefined;
    const fs = colors ? colors.styles[abs] : 0;
    const isBracket = brackets.includes(i);
    const isWs = text[i] === ' ';
    let cls = STATUS_CLASS[st] ?? 'u';
    if (isBracket) cls += ' bm';
    if (showWs && isWs) cls += ' ws';
    const key = `${cls}|${color}|${fs}`;
    const last = segs[segs.length - 1];
    const ch = showWs && isWs ? '·' : text[i];
    if (last && last.key === key && !isBracket) last.text += ch;
    else segs.push({ text: ch, cls, color, fs, key });
  }
  return (
    <div className="line">
      {segs.map((s, i) => (
        <span
          key={i}
          className={s.cls}
          style={{
            color: s.cls.startsWith('w') ? undefined : s.color || undefined,
            fontStyle: s.fs & FONT_ITALIC ? 'italic' : undefined,
            fontWeight: s.fs & FONT_BOLD ? 700 : undefined,
          }}
        >
          {s.text}
        </span>
      ))}
      {eolHint && <span className="eol-hint">↵</span>}
    </div>
  );
});

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function TypingStage() {
  const snippet = useTest((s) => s.snippet);
  const engine = useTest((s) => s.engine);
  const phase = useTest((s) => s.phase);
  const focusTick = useTest((s) => s.focusTick);
  const worldId = useSettings((s) => s.world);
  const caretStyle = useSettings((s) => s.caretStyle);
  const smoothCaret = useSettings((s) => s.smoothCaret);
  const showWs = useSettings((s) => s.showWhitespace);
  const fontSize = useSettings((s) => s.fontSize);
  const focused = useUI((s) => s.focused);
  const setFocused = useUI((s) => s.setFocused);
  const palette = useUI((s) => s.palette);
  const overlay = useUI((s) => s.overlay);

  const colors = useHighlight(snippet, worldId);
  const lines = useMemo(() => splitLines(snippet.code), [snippet]);
  const partners = useMemo(() => matchBrackets(snippet.code), [snippet]);

  const windowRef = useRef<HTMLDivElement>(null);
  const probeRef = useRef<HTMLSpanElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const caretRef = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  const lastPos = useRef(0);
  const [visibleCols, setVisibleCols] = useState(200);
  const lh = Math.round(fontSize * 1.7);

  const pos = engine.pos;
  const caretLine = lineIndexAt(lines, Math.min(pos, snippet.code.length));
  const caretCol = pos - lines[caretLine].start;

  // long lines pan sideways only once the caret gets close to the edge
  const panCols = Math.max(0, caretCol + 8 - visibleCols);

  useEffect(() => {
    const win = windowRef.current;
    const probe = probeRef.current;
    if (!win || !probe) return;
    const measure = () => {
      const ch = probe.getBoundingClientRect().width || fontSize * 0.6;
      setVisibleCols(Math.floor(win.clientWidth / ch));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(win);
    return () => ro.disconnect();
  }, [fontSize]);

  // bracket pair next to the caret
  const bracketPair = useMemo(() => {
    for (const p of [pos - 1, pos]) {
      if (p >= 0 && p < partners.length && partners[p] !== -1) return [p, partners[p]];
    }
    return [] as number[];
  }, [pos, partners]);

  // Caret effects are driven through the DOM (no React state) so a burst of
  // keystrokes never cascades into extra renders.
  useEffect(() => {
    const el = caretRef.current;
    if (!el) return;
    el.classList.remove('blink');
    const id = window.setTimeout(() => el.classList.add('blink'), 800);
    return () => window.clearTimeout(id);
  }, [pos, snippet]);

  useEffect(() => {
    const el = caretRef.current;
    if (!el || engine.rejectTick === 0) return;
    el.classList.remove('reject');
    void el.offsetWidth; // restart the animation
    el.classList.add('reject');
    const id = window.setTimeout(() => el.classList.remove('reject'), 220);
    return () => window.clearTimeout(id);
  }, [engine.rejectTick]);

  // the letter just typed pops once on its way into the line
  useEffect(() => {
    const prev = lastPos.current;
    lastPos.current = pos;
    const el = ghostRef.current;
    if (!el || pos !== prev + 1) return;
    if (useSettings.getState().scene === 'calm' || reducedMotion()) return;
    const ch = snippet.code[prev];
    if (!ch || !ch.trim()) return;
    const line = lineIndexAt(lines, prev);
    const wrong = engine.status[prev] === WRONG;
    el.textContent = ch;
    el.style.translate = `${prev - lines[line].start}ch ${line * lh}px`;
    el.style.color = wrong ? 'var(--bug)' : colors?.colors[prev] || 'var(--text)';
    el.animate(
      wrong
        ? [
            { opacity: 1, transform: 'translateX(-3px)' },
            { opacity: 1, transform: 'translateX(3px)' },
            { opacity: 1, transform: 'translateX(-2px)' },
            { opacity: 0, transform: 'translateX(0)' },
          ]
        : [
            { opacity: 0.9, transform: 'translateY(-0.18em) scale(1.5)' },
            { opacity: 0, transform: 'translateY(0) scale(1)' },
          ],
      { duration: wrong ? 240 : 170, easing: 'ease-out' },
    );
  }, [pos]); // eslint-disable-line react-hooks/exhaustive-deps

  // keep focus on the hidden input
  useEffect(() => {
    if (!palette && !overlay) inputRef.current?.focus({ preventScroll: true });
  }, [focusTick, snippet, palette, overlay]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    handleTypingKey(e.nativeEvent);
  };

  // mobile keyboards / IME deliver text through input events instead
  const onInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const el = e.currentTarget;
    const value = el.value;
    el.value = '';
    const input = useTest.getState().input;
    for (const ch of value) {
      if (ch === '\n') input('enter');
      else if (ch === '\t') input('tab');
      else input('char', ch);
    }
  };

  const grabFocus = (e: React.MouseEvent) => {
    e.preventDefault();
    inputRef.current?.focus({ preventScroll: true });
  };

  const caretClasses = [
    'caret',
    `caret-${caretStyle}`,
    smoothCaret ? 'smooth' : '',
    phase === 'finished' ? 'done' : '',
  ].join(' ');

  return (
    <div className="typing">
      <div
        className="code-window"
        ref={windowRef}
        onMouseDown={grabFocus}
        data-world-kind={WORLD_BY_ID[worldId].kind}
        style={{ ['--lh' as string]: `${lh}px`, ['--fs' as string]: `${fontSize}px` }}
      >
        <span ref={probeRef} className="ch-probe" aria-hidden="true">
          0
        </span>
        <div
          className="lines"
          aria-label={`Code to type: ${snippet.filename}`}
          style={{ ['--line' as string]: caretLine, ['--pan' as string]: panCols }}
        >
          <div className="active-line" style={{ translate: `0 ${caretLine * lh}px` }} />
          <div key={snippet.id} className="lines-text">
            {lines.map((l, i) => {
              const end = l.start + l.text.length + (l.hasNewline ? 1 : 0);
              let statusKey = '';
              for (let k = l.start; k < end; k++) statusKey += engine.status[k];
              const bcols = bracketPair
                .filter((p) => p >= l.start && p < l.start + l.text.length)
                .map((p) => p - l.start)
                .join(',');
              return (
                <Line
                  key={i}
                  text={l.text}
                  start={l.start}
                  colors={colors}
                  statusKey={statusKey}
                  bracketCols={bcols}
                  showWs={showWs}
                  eolHint={i === caretLine && l.hasNewline && pos === l.start + l.text.length && phase !== 'finished'}
                />
              );
            })}
          </div>
          <div ref={ghostRef} className="ghost" aria-hidden="true" />
          <div
            ref={caretRef}
            className={caretClasses}
            style={{ translate: `${caretCol}ch ${caretLine * lh}px` }}
          />
          <textarea
            ref={inputRef}
            data-typing-input=""
            className="hidden-input"
            style={{ translate: `${caretCol}ch ${caretLine * lh}px` }}
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            aria-label="Typing input"
            onKeyDown={onKeyDown}
            onInput={onInput}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
        </div>
      </div>
      {!focused && !palette && !overlay && phase !== 'finished' && (
        <button className="focus-hint" onMouseDown={grabFocus} tabIndex={-1}>
          <Icon name="keyboard" size={16} />
          Click here or start typing
        </button>
      )}
    </div>
  );
}
