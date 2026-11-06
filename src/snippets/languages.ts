export type LangId =
  | 'javascript'
  | 'typescript'
  | 'python'
  | 'java'
  | 'c'
  | 'cpp'
  | 'go'
  | 'rust'
  | 'php'
  | 'csharp'
  | 'sql'
  | 'kotlin';

export interface LangInfo {
  id: LangId;
  name: string;
  /** shiki grammar id */
  shiki: string;
  /** spaces per indentation level */
  indent: number;
  /** short label used as a file icon */
  badge: string;
  color: string;
}

export const LANGUAGES: LangInfo[] = [
  { id: 'javascript', name: 'JavaScript', shiki: 'javascript', indent: 2, badge: 'JS', color: '#f1d84b' },
  { id: 'typescript', name: 'TypeScript', shiki: 'typescript', indent: 2, badge: 'TS', color: '#3d8fd6' },
  { id: 'python', name: 'Python', shiki: 'python', indent: 4, badge: 'PY', color: '#4b8bbe' },
  { id: 'java', name: 'Java', shiki: 'java', indent: 4, badge: 'J', color: '#e76f00' },
  { id: 'c', name: 'C', shiki: 'c', indent: 4, badge: 'C', color: '#8a9ec7' },
  { id: 'cpp', name: 'C++', shiki: 'cpp', indent: 4, badge: 'C++', color: '#f34b7d' },
  { id: 'go', name: 'Go', shiki: 'go', indent: 4, badge: 'GO', color: '#00add8' },
  { id: 'rust', name: 'Rust', shiki: 'rust', indent: 4, badge: 'RS', color: '#dea584' },
  { id: 'php', name: 'PHP', shiki: 'php', indent: 4, badge: 'PHP', color: '#8892bf' },
  { id: 'csharp', name: 'C#', shiki: 'csharp', indent: 4, badge: 'C#', color: '#a179dc' },
  { id: 'sql', name: 'SQL', shiki: 'sql', indent: 2, badge: 'SQL', color: '#e38c00' },
  { id: 'kotlin', name: 'Kotlin', shiki: 'kotlin', indent: 4, badge: 'KT', color: '#a97bff' },
];

export const LANG_BY_ID = Object.fromEntries(LANGUAGES.map((l) => [l.id, l])) as Record<
  LangId,
  LangInfo
>;

export function isLangId(v: string): v is LangId {
  return v in LANG_BY_ID;
}
