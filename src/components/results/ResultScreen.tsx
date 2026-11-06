import { animate, motion, useReducedMotion } from 'motion/react';
import { useEffect, useMemo, useRef } from 'react';
import { lineIndexAt, splitLines } from '../../engine/layout';
import { LANG_BY_ID } from '../../snippets/languages';
import { bestFor, useHistory, type Result } from '../../store/history';
import { MIN_VALID_ACCURACY, useTest } from '../../store/test';
import { Icon } from '../icons';
import { WpmChart } from './WpmChart';

function CountUp({ value, decimals = 0, suffix = '' }: { value: number; decimals?: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const text = (v: number) => `${v.toFixed(decimals)}${suffix}`;
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduce) {
      el.textContent = text(value);
      return;
    }
    const controls = animate(0, value, {
      duration: 1.2,
      delay: 0.25,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        el.textContent = text(v);
      },
    });
    return () => controls.stop();
  }, [value, reduce]); // eslint-disable-line react-hooks/exhaustive-deps
  return <span ref={ref}>{text(reduce ? value : 0)}</span>;
}

function headlineFor(r: Result) {
  if (r.isPersonalBest) return 'New personal best';
  if (r.accuracy < MIN_VALID_ACCURACY) return 'Too many bugs to count';
  return 'Tree grown';
}

function describeChar(ch: string): string {
  if (ch === ' ') return 'space';
  if (ch === '\n') return 'Enter';
  return ch;
}

function Slips() {
  const engine = useTest((s) => s.engine);
  const snippet = useTest((s) => s.snippet);
  const lines = useMemo(() => splitLines(snippet.code), [snippet]);
  const items = useMemo(() => {
    const out: { pos: number; count: number }[] = [];
    engine.mistakes.forEach((count, pos) => {
      if (count > 0) out.push({ pos, count });
    });
    return out;
  }, [engine.mistakes]);

  if (items.length === 0) return <p className="slips-clean">No slips in this code.</p>;
  return (
    <ul className="slips">
      {items.map(({ pos, count }) => (
        <li key={pos}>
          <code>{describeChar(snippet.code[pos])}</code>
          <span>
            line {lineIndexAt(lines, pos) + 1}
            {count > 1 ? `, missed ${count} times` : ''}
          </span>
        </li>
      ))}
    </ul>
  );
}

const panel = {
  hidden: { opacity: 0, y: 18, rotate: -0.6 },
  shown: { opacity: 1, y: 0, rotate: 0 },
};

export function ResultScreen() {
  const r = useTest((s) => s.result);
  const results = useHistory((s) => s.results);
  if (!r) return null;
  const best = bestFor(results, r.lang);
  const lang = r.lang === 'mixed' ? 'mixed' : LANG_BY_ID[r.lang].name;
  const title = r.mode === 'time' ? `${r.snippets} snippets in ${r.timeLimit}s` : r.filename;
  const counted = r.accuracy >= MIN_VALID_ACCURACY;

  return (
    <motion.section
      className="result"
      aria-label="Results"
      initial="hidden"
      animate="shown"
      exit="hidden"
      transition={{ staggerChildren: 0.12, delayChildren: 0.28 }}
    >
      <motion.div className="result-card result-main" variants={panel}>
        <h2 className={r.isPersonalBest ? 'result-title pb' : 'result-title'} role="status">
          {r.isPersonalBest && <Icon name="trophy" size={20} />}
          {headlineFor(r)}
        </h2>
        <p className="result-file">{title}</p>
        <div className="result-wpm">
          <CountUp value={r.wpm} />
          <span className="unit">wpm</span>
        </div>
        <div className="result-acc">
          <CountUp value={r.accuracy} decimals={1} suffix="%" /> accuracy
        </div>
        {!counted && <p className="result-note">Below {MIN_VALID_ACCURACY}% accuracy, so this run does not count for records.</p>}
        <dl className="result-metrics">
          <div>
            <dt>Raw</dt>
            <dd>{Math.round(r.raw)}</dd>
          </div>
          <div>
            <dt>Consistency</dt>
            <dd>{Math.round(r.consistency)}%</dd>
          </div>
          <div>
            <dt>Errors</dt>
            <dd>{r.errors}</dd>
          </div>
          <div>
            <dt>Characters</dt>
            <dd>{r.chars}</dd>
          </div>
          <div>
            <dt>Time</dt>
            <dd>{(r.durationMs / 1000).toFixed(1)}s</dd>
          </div>
          <div>
            <dt>Best in {lang}</dt>
            <dd>{best ? Math.round(best.wpm) : 'None yet'}</dd>
          </div>
        </dl>
        <div className="result-actions">
          <button className="btn" onClick={() => useTest.getState().next()}>
            Next snippet <kbd>Enter</kbd>
          </button>
          <button className="btn ghost-btn" onClick={() => useTest.getState().restart()}>
            Retry <kbd>Esc</kbd>
          </button>
        </div>
      </motion.div>

      <div className="result-tree" aria-hidden="true" />

      <motion.div className="result-card result-side" variants={panel}>
        <h3>Speed over time</h3>
        <WpmChart samples={r.samples} />
        <h3>Where you slipped</h3>
        <Slips />
      </motion.div>
    </motion.section>
  );
}
