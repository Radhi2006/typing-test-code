import { LANG_BY_ID, type LangId } from '../snippets/languages';

export function LangIcon({ lang, size = 16 }: { lang: LangId; size?: number }) {
  const info = LANG_BY_ID[lang];
  const len = info.badge.length;
  const fontSize = len >= 3 ? size * 0.42 : len === 2 ? size * 0.52 : size * 0.66;
  return (
    <span
      className="lang-icon"
      style={{ width: size, height: size, color: `color-mix(in srgb, ${info.color} 60%, var(--text))`, fontSize }}
      aria-hidden="true"
    >
      {info.badge}
    </span>
  );
}
