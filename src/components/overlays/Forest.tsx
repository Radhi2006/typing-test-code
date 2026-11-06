import { useEffect, useMemo, useRef, useState } from 'react';
import { paintLeaves, treeSprite, bugSprites, glowSprite, easeOutBack, clamp01 } from '../../garden/render';
import { treeFor } from '../../garden/plant';
import { SPECIES } from '../../garden/species';
import { buildTree, hashSeed } from '../../garden/tree';
import { WORLD_BY_ID, type World } from '../../garden/worlds';
import { SNIPPET_BY_ID } from '../../snippets';
import { LANGUAGES, LANG_BY_ID, type LangId } from '../../snippets/languages';
import { bestFor, useHistory, type Result } from '../../store/history';
import { useSettings } from '../../store/settings';
import { Icon } from '../icons';
import { LangIcon } from '../LangIcon';
import { Sheet } from './Sheet';

const MAX_TREES = 80;
const SPACING = 132;
const VIEW_H = 300;
const SPRITE_W = 240;
const SPRITE_H = 270;

function resultLang(r: Result): LangId {
  if (r.lang !== 'mixed') return r.lang;
  return SNIPPET_BY_ID.get(r.snippetId)?.lang ?? 'javascript';
}

function spriteFor(r: Result, world: World): HTMLCanvasElement {
  const snippet = SNIPPET_BY_ID.get(r.snippetId);
  const lang = resultLang(r);
  const tree = snippet
    ? treeFor(snippet)
    : buildTree(`seed ${r.id}\n  a\n  b\nc`, SPECIES[lang], hashSeed(r.id));
  const painted = paintLeaves(tree, SPECIES[lang].leaf, null, world.leaves, world.accent);
  const wanted = 90 + Math.min(1, r.wpm / 110) * 170;
  const width = Math.max(-tree.minX, tree.maxX) * 2 || 1;
  const scale = Math.min(wanted / (-tree.minY || 1), (SPRITE_W - 10) / width);
  return treeSprite(painted, world, SPRITE_W, SPRITE_H, scale, {
    leafKeep: clamp01((r.accuracy - 55) / 45),
  });
}

function ForestView({ results }: { results: Result[] }) {
  const worldId = useSettings((s) => s.world);
  const scene = useSettings((s) => s.scene);
  const world = WORLD_BY_ID[worldId];
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<{ r: Result; x: number } | null>(null);

  // oldest on the left so the forest grows to the right, like a timeline
  const trees = useMemo(() => results.slice(0, MAX_TREES).reverse(), [results]);
  const sprites = useRef(new Map<string, HTMLCanvasElement>());
  const totalW = (trees.length + 1) * SPACING;

  useEffect(() => {
    sprites.current.clear();
    const scroller = scrollRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!scroller || !canvas || !ctx) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const bugs = bugSprites(world.bug, world.firefly, 2);
    const glow = glowSprite(world.firefly, 90);
    const opened = performance.now();
    const calm =
      scene === 'calm' || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;

    const groundAt = (x: number) => VIEW_H - 44 + Math.sin(x * 0.006) * 10 + Math.sin(x * 0.017) * 4;

    const paint = () => {
      raf = 0;
      const view = scroller.clientWidth;
      if (canvas.width !== Math.round(view * dpr)) {
        canvas.width = Math.round(view * dpr);
        canvas.height = Math.round(VIEW_H * dpr);
      }
      const left = scroller.scrollLeft;
      // a young forest stands in the middle of the hill
      const inset = Math.max(0, (view - totalW) / 2);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, view, VIEW_H);

      ctx.fillStyle = world.hills[1];
      ctx.beginPath();
      ctx.moveTo(0, VIEW_H);
      for (let x = 0; x <= view + 12; x += 12) ctx.lineTo(x, groundAt(x + left));
      ctx.lineTo(view + 12, VIEW_H);
      ctx.fill();

      let growing = false;
      trees.forEach((r, i) => {
        const cx = SPACING * (i + 0.75) - left + inset;
        if (cx < -SPRITE_W || cx > view + SPRITE_W) return;
        let sprite = sprites.current.get(r.id);
        if (!sprite) {
          sprite = spriteFor(r, world);
          sprites.current.set(r.id, sprite);
        }
        const delay = (trees.length - 1 - i) * 45;
        const t = calm ? 1 : clamp01((performance.now() - opened - delay) / 520);
        if (t < 1) growing = true;
        if (t <= 0) return;
        const k = easeOutBack(t);
        const base = groundAt(cx + left) + 4;
        const w = SPRITE_W * 0.82 * k;
        const h = SPRITE_H * 0.82 * k;
        ctx.drawImage(sprite, cx - w / 2, base - h, w, h);
        if (r.isPersonalBest) {
          ctx.drawImage(glow, cx - 45, base - 46);
          ctx.fillStyle = world.firefly;
          ctx.fillRect(cx - 4, base - 6, 8, 10);
        }
        const shown = Math.min(3, r.errors);
        for (let b = 0; b < shown; b++) {
          const f = hashSeed(`${r.id}${b}`);
          ctx.drawImage(
            bugs[b % 2],
            cx - 34 + (f % 68),
            base - h * 0.2 - ((f >> 8) % Math.max(20, Math.floor(h * 0.5))),
          );
        }
      });
      ctx.fillStyle = world.hills[2];
      ctx.beginPath();
      ctx.moveTo(0, VIEW_H);
      for (let x = 0; x <= view + 12; x += 12) ctx.lineTo(x, groundAt(x + left * 1.15 + 300) + 26);
      ctx.lineTo(view + 12, VIEW_H);
      ctx.fill();
      if (growing) raf = requestAnimationFrame(paint);
    };

    const queue = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };
    scroller.scrollLeft = scroller.scrollWidth;
    queue();
    scroller.addEventListener('scroll', queue, { passive: true });
    const ro = new ResizeObserver(queue);
    ro.observe(scroller);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      scroller.removeEventListener('scroll', queue);
      ro.disconnect();
    };
  }, [trees, world, scene, totalW]);

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const scroller = scrollRef.current;
    if (!scroller) return;
    const box = scroller.getBoundingClientRect();
    const x = e.clientX - box.left + scroller.scrollLeft;
    const inset = Math.max(0, (box.width - totalW) / 2);
    const i = Math.round((x - inset) / SPACING - 0.75);
    const r = trees[i];
    const tipX = SPACING * (i + 0.75) - scroller.scrollLeft + inset - 95;
    setHover(r ? { r, x: Math.min(box.width - 200, Math.max(0, tipX)) } : null);
  };

  return (
    <div className="forest-frame">
      <canvas ref={canvasRef} className="forest-canvas" style={{ height: VIEW_H }} aria-hidden="true" />
      <div
        ref={scrollRef}
        className="forest-scroll"
        tabIndex={0}
        role="img"
        aria-label={`Forest of your last ${trees.length} runs. The same runs are listed under Recent runs.`}
        onPointerMove={onPointerMove}
        onPointerLeave={() => setHover(null)}
      >
        <div style={{ width: totalW, height: 1 }} />
      </div>
      {hover && (
        <div className="forest-tip" style={{ left: hover.x }}>
          <strong>{Math.round(hover.r.wpm)} wpm</strong>
          <span>{hover.r.accuracy.toFixed(1)}% accuracy</span>
          <span>{hover.r.mode === 'time' ? `Timed ${hover.r.timeLimit}s` : hover.r.filename}</span>
        </div>
      )}
    </div>
  );
}

function Trend({ values }: { values: number[] }) {
  if (values.length < 2) return <p className="empty-hint">Finish two runs to see your trend.</p>;
  const w = 320;
  const h = 72;
  const max = Math.max(...values) * 1.1;
  const min = Math.min(...values) * 0.9;
  const span = max - min || 1;
  const d = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * w;
      const y = h - ((v - min) / span) * (h - 8) - 4;
      return `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');
  return (
    <svg className="trend" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" role="img" aria-label="Speed across recent runs">
      <path d={d} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function ago(ts: number): string {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

export function Forest() {
  const results = useHistory((s) => s.results);
  const clear = useHistory((s) => s.clear);
  const [confirm, setConfirm] = useState(false);

  const summary = useMemo(() => {
    const last10 = results.slice(0, 10);
    const avg = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0);
    return {
      best: bestFor(results, 'any'),
      avgWpm: avg(last10.map((r) => r.wpm)),
      avgAcc: avg(last10.map((r) => r.accuracy)),
      minutes: Math.round(results.reduce((a, r) => a + r.durationMs, 0) / 60000),
      chars: results.reduce((a, r) => a + r.chars, 0),
    };
  }, [results]);

  if (results.length === 0) {
    return (
      <Sheet title="Forest" wide>
        <p className="forest-empty">Your forest is empty. Finish a run to plant your first tree.</p>
      </Sheet>
    );
  }

  const trend = results.slice(0, 30).map((r) => r.wpm).reverse();

  return (
    <Sheet title="Forest" wide>
      <ForestView results={results} />
      <p className="forest-key">
        Every tree is one run. Taller trees were typed faster, fuller trees more accurately, and
        personal bests glow.
      </p>

      <dl className="forest-summary">
        <div>
          <dd>{results.length}</dd>
          <dt>trees planted</dt>
        </div>
        <div>
          <dd>{summary.best ? Math.round(summary.best.wpm) : 'None'}</dd>
          <dt>best wpm</dt>
        </div>
        <div>
          <dd>{Math.round(summary.avgWpm)}</dd>
          <dt>wpm, last 10</dt>
        </div>
        <div>
          <dd>{summary.avgAcc.toFixed(1)}%</dd>
          <dt>accuracy, last 10</dt>
        </div>
        <div>
          <dd>{summary.minutes}</dd>
          <dt>minutes typing</dt>
        </div>
        <div>
          <dd>{summary.chars.toLocaleString()}</dd>
          <dt>correct characters</dt>
        </div>
      </dl>

      <div className="forest-columns">
        <section>
          <h3 className="sheet-section">Trend</h3>
          <Trend values={trend} />
          <h3 className="sheet-section">Best per language</h3>
          <ul className="pb-list">
            {LANGUAGES.map((l) => {
              const b = bestFor(results, l.id);
              const share = b ? Math.min(100, (b.wpm / Math.max(1, summary.best?.wpm ?? 1)) * 100) : 0;
              return (
                <li key={l.id}>
                  <LangIcon lang={l.id} />
                  <span>{l.name}</span>
                  <span className="pb-bar">
                    <span style={{ width: `${share}%` }} />
                  </span>
                  <span className="pb-wpm">{b ? Math.round(b.wpm) : 'None'}</span>
                </li>
              );
            })}
          </ul>
        </section>
        <section>
          <h3 className="sheet-section">Recent runs</h3>
          <ul className="recent-list">
            {results.slice(0, 15).map((r) => (
              <li key={r.id}>
                {r.lang === 'mixed' ? <Icon name="shuffle" size={14} /> : <LangIcon lang={r.lang} />}
                <span className="recent-name">
                  {r.mode === 'time' ? `Timed ${r.timeLimit}s` : r.filename}
                  {r.isPersonalBest && <Icon name="star" size={11} filled className="pb-star" />}
                </span>
                <span>{Math.round(r.wpm)} wpm</span>
                <span>{r.accuracy.toFixed(0)}%</span>
                <span className="recent-ago">{ago(r.date)}</span>
                <span className="sr-only">{r.lang === 'mixed' ? 'mixed' : LANG_BY_ID[r.lang].name}</span>
              </li>
            ))}
          </ul>
          <div className="danger-zone">
            {confirm ? (
              <>
                <span>Delete all {results.length} runs and their trees?</span>
                <button
                  className="btn danger"
                  onClick={() => {
                    clear();
                    setConfirm(false);
                  }}
                >
                  Delete runs
                </button>
                <button className="btn ghost-btn" onClick={() => setConfirm(false)}>
                  Keep them
                </button>
              </>
            ) : (
              <button className="btn ghost-btn" onClick={() => setConfirm(true)}>
                <Icon name="trash" size={14} /> Clear history
              </button>
            )}
          </div>
        </section>
      </div>
    </Sheet>
  );
}
