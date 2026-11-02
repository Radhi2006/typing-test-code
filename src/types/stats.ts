export interface TestResult {
  id: string;
  date: string;
  wpm: number;
  rawWpm: number;
  accuracy: number;
  totalChars: number;
  correctChars: number;
  incorrectChars: number;
  corrections: number;
  totalKeystrokes: number;
  timeElapsed: number;
  timerDuration: number;
  language: import('./snippet').Language;
  difficulty: import('./snippet').Difficulty;
  snippetId: string;
  snippetTitle: string;
  wpmOverTime: { time: number; wpm: number }[];
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  wpm: number;
  accuracy: number;
  language: import('./snippet').Language;
  date: string;
}

export interface UserStats {
  totalTests: number;
  totalTimeSpent: number;
  averageWpm: number;
  averageAccuracy: number;
  bestWpm: number;
  bestAccuracy: number;
  favoriteLanguage: import('./snippet').Language | null;
  history: TestResult[];
}

