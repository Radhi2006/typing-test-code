import { useMemo, useState } from 'react';
import { closeOverlay, setFilterAndLoad } from '../../commands';
import { SPECIES } from '../../garden/species';
import { filterSnippets, SNIPPETS, type DifficultyFilter } from '../../snippets';
import { LANGUAGES, LANG_BY_ID } from '../../snippets/languages';
import type { Snippet } from '../../snippets/types';
import { useSettings } from '../../store/settings';
import { useTest } from '../../store/test';
import { Icon } from '../icons';
import { LangIcon } from '../LangIcon';
import { Sheet } from './Sheet';

const LEVELS: { value: DifficultyFilter; label: string }[] = [
  { value: 'all', label: 'Any' },
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
];

function firstCodeHit(s: Snippet, query: string): string | null {
  for (const line of s.code.split('\n')) {
    if (line.toLowerCase().includes(query)) return line.trim();
  }
  return null;
}

export function Library() {
  const lang = useSettings((s) => s.lang);
  const difficulty = useSettings((s) => s.difficulty);
  const open = useTest((s) => s.open);
  const currentId = useTest((s) => s.snippet.id);
  const [q, setQ] = useState('');
  const query = q.trim().toLowerCase();

  const rows = useMemo(() => {
    const pool = query.length >= 2 ? SNIPPETS : filterSnippets(lang, difficulty);
    return pool
      .map((s) => {
        if (query.length < 2) return { s, hit: null };
        const named =
          s.filename.toLowerCase().includes(query) || s.description.toLowerCase().includes(query);
        const hit = firstCodeHit(s, query);
        return named || hit ? { s, hit } : null;
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);
  }, [query, lang, difficulty]);

  const pick = (s: Snippet) => {
    open(s);
    closeOverlay();
  };

  return (
    <Sheet title="Library" wide>
      <div className="library">
        <div className="seed-rail" role="radiogroup" aria-label="Language">
          <button
            role="radio"
            aria-checked={lang === 'all'}
            className={lang === 'all' ? 'on' : ''}
            onClick={() => setFilterAndLoad({ lang: 'all' })}
          >
            <Icon name="shuffle" size={16} />
            <span className="seed-name">All languages</span>
            <span className="seed-tree">Mixed trees</span>
          </button>
          {LANGUAGES.map((l) => (
            <button
              key={l.id}
              role="radio"
              aria-checked={lang === l.id}
              className={lang === l.id ? 'on' : ''}
              onClick={() => setFilterAndLoad({ lang: l.id })}
            >
              <LangIcon lang={l.id} size={18} />
              <span className="seed-name">{l.name}</span>
              <span className="seed-tree">{SPECIES[l.id].name}</span>
            </button>
          ))}
        </div>

        <div className="seed-list">
          <div className="seed-tools">
            <label className="search-box">
              <Icon name="search" size={15} />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search names, descriptions and code"
                aria-label="Search snippets"
              />
            </label>
            <div className="segmented" role="radiogroup" aria-label="Difficulty">
              {LEVELS.map((d) => (
                <button
                  key={d.value}
                  role="radio"
                  aria-checked={difficulty === d.value}
                  className={difficulty === d.value ? 'on' : ''}
                  onClick={() => setFilterAndLoad({ difficulty: d.value })}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          <p className="seed-count">
            {rows.length} {rows.length === 1 ? 'snippet' : 'snippets'}
          </p>
          {rows.length === 0 && (
            <p className="empty-hint">Nothing matches. Try binary, async, struct, JOIN or cache.</p>
          )}
          <ul className="snippet-rows">
            {rows.map(({ s, hit }) => (
              <li key={s.id}>
                <button className={s.id === currentId ? 'current' : ''} onClick={() => pick(s)}>
                  <LangIcon lang={s.lang} size={18} />
                  <span className="snippet-text">
                    <strong>{s.filename}</strong>
                    <span>{hit ?? s.description}</span>
                  </span>
                  <span className={`level level-${s.difficulty}`}>{s.difficulty}</span>
                  <span className="sr-only">{LANG_BY_ID[s.lang].name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Sheet>
  );
}
