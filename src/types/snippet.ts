export type Language =
  | 'javascript'
  | 'typescript'
  | 'python'
  | 'java'
  | 'cpp'
  | 'go'
  | 'rust'
  | 'csharp'
  | 'php'
  | 'ruby'
  | 'swift'
  | 'kotlin'
  | 'html'
  | 'css'
  | 'sql';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface CodeSnippet {
  id: string;
  language: Language;
  title: string;
  description: string;
  code: string;
  difficulty: Difficulty;
  tags: string[];
}

export const LANGUAGE_DISPLAY_NAMES: Record<Language, string> = {
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  python: 'Python',
  java: 'Java',
  cpp: 'C++',
  go: 'Go',
  rust: 'Rust',
  csharp: 'C#',
  php: 'PHP',
  ruby: 'Ruby',
  swift: 'Swift',
  kotlin: 'Kotlin',
  html: 'HTML',
  css: 'CSS',
  sql: 'SQL',
};

export const LANGUAGE_FILE_EXTENSIONS: Record<Language, string> = {
  javascript: '.js',
  typescript: '.ts',
  python: '.py',
  java: '.java',
  cpp: '.cpp',
  go: '.go',
  rust: '.rs',
  csharp: '.cs',
  php: '.php',
  ruby: '.rb',
  swift: '.swift',
  kotlin: '.kt',
  html: '.html',
  css: '.css',
  sql: '.sql',
};

export const LANGUAGE_PRISM_KEYS: Record<Language, string> = {
  javascript: 'javascript',
  typescript: 'typescript',
  python: 'python',
  java: 'java',
  cpp: 'cpp',
  go: 'go',
  rust: 'rust',
  csharp: 'csharp',
  php: 'php',
  ruby: 'ruby',
  swift: 'swift',
  kotlin: 'kotlin',
  html: 'markup',
  css: 'css',
  sql: 'sql',
};

export const ALL_LANGUAGES: Language[] = [
  'javascript', 'typescript', 'python', 'java', 'cpp',
  'go', 'rust', 'csharp', 'php', 'ruby',
  'swift', 'kotlin', 'html', 'css', 'sql',
];

