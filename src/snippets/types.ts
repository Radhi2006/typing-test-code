import type { LangId } from './languages';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Snippet {
  /** `${lang}/${filename}` */
  id: string;
  lang: LangId;
  filename: string;
  difficulty: Difficulty;
  description: string;
  /** normalized code that will be typed */
  code: string;
  /** name of the main symbol, shown in breadcrumbs */
  symbol: string | null;
}
