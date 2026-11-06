import { detectSymbol, normalizeCode, parseSource } from '../engine/normalize';
import { LANG_BY_ID, LANGUAGES, isLangId, type LangId } from './languages';
import type { Difficulty, Snippet } from './types';

const files = import.meta.glob('/snippets/*/*', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

function build(): Snippet[] {
  const out: Snippet[] = [];
  for (const [path, raw] of Object.entries(files)) {
    const [, , lang, filename] = path.split('/');
    if (!lang || !filename || !isLangId(lang)) continue;
    const parsed = parseSource(raw);
    if (!parsed) continue;
    const code = normalizeCode(parsed.body, LANG_BY_ID[lang].indent);
    out.push({
      id: `${lang}/${filename}`,
      lang,
      filename,
      difficulty: parsed.difficulty,
      description: parsed.description,
      code,
      symbol: detectSymbol(code),
    });
  }
  const order = new Map(LANGUAGES.map((l, i) => [l.id, i]));
  return out.sort(
    (a, b) => order.get(a.lang)! - order.get(b.lang)! || a.filename.localeCompare(b.filename),
  );
}

export const SNIPPETS: Snippet[] = build();
export const SNIPPET_BY_ID = new Map(SNIPPETS.map((s) => [s.id, s]));

export function snippetsByLang(lang: LangId): Snippet[] {
  return SNIPPETS.filter((s) => s.lang === lang);
}

export type LangFilter = LangId | 'all';
export type DifficultyFilter = Difficulty | 'all';

export function filterSnippets(lang: LangFilter, difficulty: DifficultyFilter): Snippet[] {
  return SNIPPETS.filter(
    (s) =>
      (lang === 'all' || s.lang === lang) && (difficulty === 'all' || s.difficulty === difficulty),
  );
}

/** Shuffle-bag picker: every snippet of a filter shows up once before
 *  any of them repeats, and the current one is never picked twice in a row. */
const bags = new Map<string, string[]>();

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function pickRandom(
  lang: LangFilter,
  difficulty: DifficultyFilter,
  currentId?: string,
): Snippet {
  let pool = filterSnippets(lang, difficulty);
  if (pool.length === 0) pool = filterSnippets(lang, 'all');
  if (pool.length === 0) pool = SNIPPETS;
  const key = `${lang}:${difficulty}`;
  let bag = bags.get(key);
  if (!bag || bag.length === 0) {
    bag = shuffle(pool.map((s) => s.id));
    bags.set(key, bag);
  }
  let id = bag.pop()!;
  if (id === currentId && bag.length > 0) {
    const next = bag.pop()!;
    bag.unshift(id);
    id = next;
  }
  return SNIPPET_BY_ID.get(id) ?? pool[0];
}
