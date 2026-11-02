export type CharState = 'pending' | 'correct' | 'incorrect' | 'corrected' | 'extra';

export type GameStatus = 'idle' | 'ready' | 'typing' | 'paused' | 'complete';

export type TimerDuration = 15 | 30 | 60 | 120 | 300 | 0; // 0 = unlimited

export type SidebarPanel = 'languages' | 'settings' | 'history' | 'leaderboard' | null;

export interface TypingState {
  charStates: CharState[];
  currentIndex: number;
  startTime: number | null;
  endTime: number | null;
  totalKeystrokes: number;
  errors: number;
  corrections: number;
}

export interface GameSettings {
  timerDuration: TimerDuration;
  difficulty: import('./snippet').Difficulty | 'all';
  selectedLanguages: import('./snippet').Language[];
  themeId: string;
  fontSize: number;
  showMinimap: boolean;
  soundEnabled: boolean;
  smoothCursor: boolean;
  tabSize: 2 | 4;
}

export const DEFAULT_SETTINGS: GameSettings = {
  timerDuration: 60,
  difficulty: 'all',
  selectedLanguages: ['javascript', 'typescript', 'python'],
  themeId: 'one-dark-pro',
  fontSize: 16,
  showMinimap: true,
  soundEnabled: false,
  smoothCursor: true,
  tabSize: 2,
};

