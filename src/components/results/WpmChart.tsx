import { useEffect, useRef, useState } from 'react';
import type { Sample } from '../../engine/metrics';

export function WpmChart({ samples }: { samples: Sample[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(320);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setWidth(Math.max(220, e.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const h = 150;
  const pad = { l: 30, r: 8, t: 10, b: 20 };
  const data = samples.length ? samples : [{ t: 0, wpm: 0, raw: 0, errors: 0 }];
  const maxT = Math.max(1, data[data.length - 1].t);
  const maxV = Math.max(10, ...data.map((d) => Math.max(d.wpm, d.raw)));
  const niceMax = Math.ceil(maxV / 20) * 20;
  const x = (t: number) => pad.l + (t / maxT) * (width - pad.l - pad.r);
  const y = (v: number) => pad.t + (1 - v / niceMax) * (h - pad.t - pad.b);
  const line = (key: 'wpm' | 'raw') =>
    data.map((d, i) => `${i ? 'L' : 'M'}${x(d.t).toFixed(1)} ${y(d[key]).toFixed(1)}`).join(' ');
  const ticks = [0, niceMax / 2, niceMax];
  const xTicks = Math.min(4, Math.floor(maxT));
  const wpmPath = line('wpm');

  return (
    <div className="wpm-chart" ref={ref}>
      <svg width={width} height={h} role="img" aria-label="Words per minute over time">
        {ticks.map((v) => (
          <g key={v}>
            <line x1={pad.l} x2={width - pad.r} y1={y(v)} y2={y(v)} className="grid" />
            <text x={pad.l - 6} y={y(v) + 4} textAnchor="end" className="axis">
              {v}
            </text>
          </g>
        ))}
        {Array.from({ length: xTicks + 1 }, (_, i) => (i / Math.max(1, xTicks)) * maxT).map((t) => (
          <text key={t} x={x(t)} y={h - 4} textAnchor="middle" className="axis">
            {Math.round(t)}s
          </text>
        ))}
        <path d={line('raw')} className="raw-line" />
        <path
          d={`${wpmPath} L${x(data[data.length - 1].t)} ${y(0)} L${x(data[0].t)} ${y(0)} Z`}
          className="wpm-fill"
        />
        <path d={wpmPath} pathLength={1} className="wpm-line" />
        {data
          .filter((d) => d.errors > 0)
          .map((d) => (
            <g key={`e${d.t}`} className="err-mark" transform={`translate(${x(d.t)}, ${y(d.raw)})`}>
              <circle r="3.2" />
              <title>
                {d.errors} error{d.errors > 1 ? 's' : ''} at {d.t}s
              </title>
            </g>
          ))}
      </svg>
      <div className="chart-legend">
        <span>
          <i className="lg-wpm" /> wpm
        </span>
        <span>
          <i className="lg-raw" /> raw
        </span>
        <span>
          <i className="lg-err" /> errors
        </span>
      </div>
    </div>
  );
}
