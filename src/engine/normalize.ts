/** Matches the metadata line every library file carries, e.g.
 *  `// @codetype easy | Binary search over a sorted array` */
export const META_RE = /@codetype\s+(easy|medium|hard)\s*\|\s*(.+?)\s*(?:\*\/)?\s*$/;

export interface ParsedSource {
  difficulty: 'easy' | 'medium' | 'hard';
  description: string;
  body: string;
}

export function parseSource(raw: string): ParsedSource | null {
  const lines = raw.replace(/\r\n?/g, '\n').split('\n');
  const idx = lines.findIndex((l) => META_RE.test(l));
  if (idx === -1) return null;
  const m = lines[idx].match(META_RE)!;
  lines.splice(idx, 1);
  return {
    difficulty: m[1] as ParsedSource['difficulty'],
    description: m[2],
    body: lines.join('\n'),
  };
}

/** Make code safe and predictable to type: LF endings, tabs to spaces,
 *  no trailing whitespace, no leading/trailing blank lines, no runs of
 *  more than one blank line. */
export function normalizeCode(code: string, tabSize: number): string {
  const lines = code
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .map((line) => {
      let out = '';
      for (const ch of line) {
        if (ch === '\t') out += ' '.repeat(tabSize - (out.length % tabSize));
        else out += ch;
      }
      return out.replace(/\s+$/, '');
    });
  while (lines.length && lines[0] === '') lines.shift();
  while (lines.length && lines[lines.length - 1] === '') lines.pop();
  const collapsed: string[] = [];
  for (const l of lines) {
    if (l === '' && collapsed[collapsed.length - 1] === '') continue;
    collapsed.push(l);
  }
  return collapsed.join('\n');
}

const SYMBOL_PATTERNS: RegExp[] = [
  /\bclass\s+([A-Za-z_]\w*)/,
  /\bfunction\s*\*?\s*([A-Za-z_$][\w$]*)/,
  /\bdef\s+([A-Za-z_]\w*)/,
  /\bfn\s+([A-Za-z_]\w*)/,
  /\bfunc\s+(?:\([^)]*\)\s*)?([A-Za-z_]\w*)/,
  /\bfun\s+(?:<[^>]*>\s*)?(?:[\w.]+\.)?([A-Za-z_]\w*)/,
  /\b(?:struct|enum|trait|interface|record|object)\s+([A-Za-z_]\w*)/,
  /\b(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=/,
  /\bCREATE\s+(?:TABLE|VIEW|INDEX|FUNCTION)\s+(?:IF\s+NOT\s+EXISTS\s+)?([A-Za-z_]\w*)/i,
  /^[\w<>,:\s*&]+?\b([A-Za-z_]\w*)\s*\([^;]*\)\s*\{?\s*$/m,
];

export function detectSymbol(code: string): string | null {
  for (const re of SYMBOL_PATTERNS) {
    const m = code.match(re);
    if (m) return m[1];
  }
  return null;
}
