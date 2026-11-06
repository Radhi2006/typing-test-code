import { createHighlighterCore, type HighlighterCore } from 'shiki/core';
import { createOnigurumaEngine } from 'shiki/engine/oniguruma';
import type { LangId } from '../snippets/languages';
import { LANG_BY_ID } from '../snippets/languages';
import { liftContrast } from '../garden/color';
import { WORLD_BY_ID, type ShikiThemeId, type WorldId } from '../garden/worlds';

type Loader = () => Promise<{ default: unknown }>;

const THEME_LOADERS: Record<ShikiThemeId, Loader> = {
  'rose-pine-moon': () => import('shiki/themes/rose-pine-moon.mjs'),
  nord: () => import('shiki/themes/nord.mjs'),
  'night-owl': () => import('shiki/themes/night-owl.mjs'),
  monokai: () => import('shiki/themes/monokai.mjs'),
  'github-light-default': () => import('shiki/themes/github-light-default.mjs'),
};

/** contrast every syntax color must keep on the world's plate, even before it is typed */
const MIN_CONTRAST = 4.5;

const LANG_LOADERS: Record<LangId, Loader> = {
  javascript: () => import('shiki/langs/javascript.mjs'),
  typescript: () => import('shiki/langs/typescript.mjs'),
  python: () => import('shiki/langs/python.mjs'),
  java: () => import('shiki/langs/java.mjs'),
  c: () => import('shiki/langs/c.mjs'),
  cpp: () => import('shiki/langs/cpp.mjs'),
  go: () => import('shiki/langs/go.mjs'),
  rust: () => import('shiki/langs/rust.mjs'),
  php: () => import('shiki/langs/php.mjs'),
  csharp: () => import('shiki/langs/csharp.mjs'),
  sql: () => import('shiki/langs/sql.mjs'),
  kotlin: () => import('shiki/langs/kotlin.mjs'),
};

let highlighterPromise: Promise<HighlighterCore> | null = null;
const loadedThemes = new Map<ShikiThemeId, Promise<void>>();
const loadedLangs = new Map<LangId, Promise<void>>();

function getHighlighter(): Promise<HighlighterCore> {
  highlighterPromise ??= createHighlighterCore({
    themes: [],
    langs: [],
    engine: createOnigurumaEngine(import('shiki/wasm')),
  });
  return highlighterPromise;
}

function ensureTheme(id: ShikiThemeId): Promise<void> {
  let p = loadedThemes.get(id);
  if (!p) {
    p = (async () => {
      const [h, mod] = await Promise.all([getHighlighter(), THEME_LOADERS[id]()]);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await h.loadTheme(mod.default as any);
    })();
    loadedThemes.set(id, p);
  }
  return p;
}

function ensureLang(id: LangId): Promise<void> {
  let p = loadedLangs.get(id);
  if (!p) {
    p = (async () => {
      const [h, mod] = await Promise.all([getHighlighter(), LANG_LOADERS[id]()]);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await h.loadLanguage(mod.default as any);
    })();
    loadedLangs.set(id, p);
  }
  return p;
}

export const FONT_ITALIC = 1;
export const FONT_BOLD = 2;

export interface CharColors {
  /** color for every character index of the code ('' for line breaks) */
  colors: string[];
  styles: Uint8Array;
}

const tokenCache = new Map<string, CharColors>();

export function peekHighlight(world: WorldId, cacheKey: string): CharColors | null {
  return tokenCache.get(`${world}::${cacheKey}`) ?? null;
}

export async function highlightChars(
  code: string,
  lang: LangId,
  worldId: WorldId,
  cacheKey: string,
): Promise<CharColors> {
  const key = `${worldId}::${cacheKey}`;
  const hit = tokenCache.get(key);
  if (hit) return hit;
  const world = WORLD_BY_ID[worldId];
  await Promise.all([ensureTheme(world.shiki), ensureLang(lang)]);
  const h = await getHighlighter();
  const { tokens } = h.codeToTokens(code, { lang: LANG_BY_ID[lang].shiki, theme: world.shiki });
  const readable = new Map<string, string>();
  const lift = (color: string) => {
    let out = readable.get(color);
    if (!out) {
      out = liftContrast(color, world.plate, world.text, MIN_CONTRAST, world.untyped);
      readable.set(color, out);
    }
    return out;
  };
  const colors: string[] = new Array(code.length).fill('');
  const styles = new Uint8Array(code.length);
  let i = 0;
  tokens.forEach((line, li) => {
    for (const tok of line) {
      let fs = 0;
      if (tok.fontStyle && tok.fontStyle > 0) {
        if (tok.fontStyle & 1) fs |= FONT_ITALIC;
        if (tok.fontStyle & 2) fs |= FONT_BOLD;
      }
      const color = tok.color ? lift(tok.color) : '';
      for (let k = 0; k < tok.content.length && i < code.length; k++, i++) {
        colors[i] = color;
        styles[i] = fs;
      }
    }
    if (li < tokens.length - 1) i++; // skip the line break
  });
  const result = { colors, styles };
  tokenCache.set(key, result);
  return result;
}
