import { useEffect, useState } from 'react';
import { highlightChars, peekHighlight, type CharColors } from '../highlight/highlighter';
import type { WorldId } from '../garden/worlds';
import type { Snippet } from '../snippets/types';

/** Per-character syntax colors for a snippet; null until shiki has loaded. */
export function useHighlight(snippet: Snippet, theme: WorldId): CharColors | null {
  const [state, setState] = useState<{ key: string; colors: CharColors } | null>(null);
  const key = `${theme}::${snippet.id}`;
  const cached = peekHighlight(theme, snippet.id);
  useEffect(() => {
    if (cached) return;
    let alive = true;
    highlightChars(snippet.code, snippet.lang, theme, snippet.id)
      .then((colors) => {
        if (alive) setState({ key, colors });
      })
      .catch((err) => console.error('highlight failed', err));
    return () => {
      alive = false;
    };
  }, [snippet, theme, key, cached]);
  if (cached) return cached;
  return state && state.key === key ? state.colors : null;
}
