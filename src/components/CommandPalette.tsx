import { useEffect, useMemo, useRef, useState } from 'react';
import { getCommands } from '../commands';
import { SNIPPETS } from '../snippets';
import { useTest } from '../store/test';
import { useUI } from '../store/ui';
import { LangIcon } from './LangIcon';
import { Icon } from './icons';

interface Item {
  key: string;
  label: string;
  detail?: string;
  hint?: string;
  icon?: React.ReactNode;
  checked?: boolean;
  run: () => void;
}

/** subsequence fuzzy match; returns matched indices or null */
function fuzzy(text: string, query: string): number[] | null {
  if (!query) return [];
  const t = text.toLowerCase();
  const q = query.toLowerCase();
  // prefer a contiguous match
  const idx = t.indexOf(q);
  if (idx !== -1) return Array.from({ length: q.length }, (_, i) => idx + i);
  const out: number[] = [];
  let j = 0;
  for (let i = 0; i < t.length && j < q.length; i++) {
    if (t[i] === q[j]) {
      out.push(i);
      j++;
    }
  }
  return j === q.length ? out : null;
}

function Highlighted({ text, hits }: { text: string; hits: number[] }) {
  if (!hits.length) return <>{text}</>;
  const set = new Set(hits);
  return (
    <>
      {text.split('').map((ch, i) =>
        set.has(i) ? (
          <mark key={i}>{ch}</mark>
        ) : (
          <span key={i}>{ch}</span>
        ),
      )}
    </>
  );
}

export function CommandPalette() {
  const mode = useUI((s) => s.palette);
  const initialQuery = useUI((s) => s.paletteQuery);
  const close = useUI((s) => s.closePalette);
  const [query, setQuery] = useState(initialQuery);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mode) {
      setQuery(initialQuery);
      setActive(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [mode, initialQuery]);

  const isCommands = query.startsWith('>');
  const q = (isCommands ? query.slice(1) : query).trim();

  type Row = Item & { hits: number[] };
  const items = useMemo((): Row[] => {
    if (!mode) return [];
    if (isCommands) {
      return getCommands()
        .map((c) => {
          const label = `${c.category}: ${c.label}`;
          const hits = fuzzy(label, q);
          return hits
            ? ({
                key: c.id,
                label,
                hint: c.keybinding,
                checked: c.checked?.(),
                run: c.run,
                hits,
              } as Row)
            : null;
        })
        .filter((x): x is NonNullable<typeof x> => x !== null);
    }
    const current = useTest.getState().snippet.id;
    return SNIPPETS.map((s) => {
      const hits = fuzzy(s.filename, q);
      const descHit = !hits && q.length > 2 && s.description.toLowerCase().includes(q.toLowerCase());
      if (!hits && !descHit) return null;
      const row: Row = {
        key: s.id,
        label: s.filename,
        detail: s.description,
        icon: <LangIcon lang={s.lang} />,
        checked: s.id === current,
        run: () => useTest.getState().open(s),
        hits: hits ?? [],
      };
      return row;
    })
      .filter((x): x is NonNullable<typeof x> => x !== null)
      .slice(0, 80);
  }, [mode, isCommands, q]);

  useEffect(() => setActive(0), [query]);

  useEffect(() => {
    listRef.current?.querySelector('.pal-item.active')?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  if (!mode) return null;

  const run = (item: Item | undefined) => {
    if (!item) return;
    close();
    item.run();
    useTest.getState().requestFocus();
  };

  return (
    <div className="palette-backdrop" onMouseDown={close}>
      <div className="palette" role="dialog" aria-label="Command palette" onMouseDown={(e) => e.stopPropagation()}>
        <div className="palette-input">
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={isCommands ? 'Type a command' : 'Search snippets by name, or type > for commands'}
            aria-label="Command palette input"
            onKeyDown={(e) => {
              e.stopPropagation();
              if (e.key === 'ArrowDown') {
                e.preventDefault();
                setActive((a) => Math.min(items.length - 1, a + 1));
              } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setActive((a) => Math.max(0, a - 1));
              } else if (e.key === 'Enter') {
                e.preventDefault();
                run(items[active]);
              } else if (e.key === 'Escape') {
                e.preventDefault();
                close();
                useTest.getState().requestFocus();
              }
            }}
          />
        </div>
        <div className="palette-list" ref={listRef} role="listbox">
          {items.length === 0 && <div className="pal-empty">No matching {isCommands ? 'commands' : 'snippets'}</div>}
          {items.map((it, i) => (
            <div
              key={it.key}
              role="option"
              aria-selected={i === active}
              className={`pal-item ${i === active ? 'active' : ''}`}
              onMouseMove={() => setActive(i)}
              onClick={() => run(it)}
            >
              <span className="pal-check">{it.checked ? <Icon name="check" size={14} /> : null}</span>
              {it.icon}
              <span className="pal-label">
                <Highlighted text={it.label} hits={it.hits} />
              </span>
              {it.detail && <span className="pal-detail">{it.detail}</span>}
              {it.hint && (
                <span className="pal-hint">
                  {it.hint.split('+').map((k) => (
                    <kbd key={k}>{k}</kbd>
                  ))}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
