import { TestResult, UserStats } from '../types/stats';
import { GameSettings } from '../types/game';
import { Language } from '../types/snippet';

const KEYS = {
  HISTORY: 'codetype_history',
  SETTINGS: 'codetype_settings',
  LEADERBOARD: 'codetype_leaderboard',
};

const MAX_LEADERBOARD_SIZE = 50;

/**
 * Safely parse JSON from localStorage.
 */
function safeGetItem<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (item === null) return fallback;
    return JSON.parse(item) as T;
  } catch {
    return fallback;
  }
}

/**
 * Safely write JSON to localStorage.
 */
function safeSetItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    console.warn(`Failed to save to localStorage key: ${key}`);
  }
}

/**
 * Save a test result to history.
 */
export function saveTestResult(result: TestResult): void {
  const history = getHistory();
  history.push(result);
  safeSetItem(KEYS.HISTORY, history);
}

/**
 * Get all test results from history.
 */
export function getHistory(): TestResult[] {
  return safeGetItem<TestResult[]>(KEYS.HISTORY, []);
}

/**
 * Clear all test history.
 */
export function clearHistory(): void {
  safeSetItem(KEYS.HISTORY, []);
}

/**
 * Save game settings to localStorage.
 */
export function saveSettings(settings: GameSettings): void {
  safeSetItem(KEYS.SETTINGS, settings);
}

/**
 * Get game settings from localStorage.
 */
export function getSettings(): GameSettings | null {
  return safeGetItem<GameSettings | null>(KEYS.SETTINGS, null);
}

/**
 * Get the leaderboard (top results sorted by WPM).
 */
export function getLeaderboard(): TestResult[] {
  return safeGetItem<TestResult[]>(KEYS.LEADERBOARD, []);
}

/**
 * Update the leaderboard with a new result. Keeps top 50 by WPM.
 */
export function updateLeaderboard(result: TestResult): void {
  const leaderboard = getLeaderboard();
  leaderboard.push(result);
  leaderboard.sort((a, b) => b.wpm - a.wpm);
  const trimmed = leaderboard.slice(0, MAX_LEADERBOARD_SIZE);
  safeSetItem(KEYS.LEADERBOARD, trimmed);
}

/**
 * Compute aggregate user stats from test history.
 */
export function getUserStats(): UserStats {
  const history = getHistory();

  if (history.length === 0) {
    return {
      totalTests: 0,
      totalTimeSpent: 0,
      averageWpm: 0,
      averageAccuracy: 0,
      bestWpm: 0,
      bestAccuracy: 0,
      favoriteLanguage: null,
      history,
    };
  }

  const totalTests = history.length;
  const totalTimeSpent = history.reduce((sum, r) => sum + r.timeElapsed, 0);
  const averageWpm = history.reduce((sum, r) => sum + r.wpm, 0) / totalTests;
  const averageAccuracy = history.reduce((sum, r) => sum + r.accuracy, 0) / totalTests;
  const bestWpm = Math.max(...history.map((r) => r.wpm));
  const bestAccuracy = Math.max(...history.map((r) => r.accuracy));

  // Determine favorite language by frequency
  const languageCounts: Partial<Record<Language, number>> = {};
  for (const result of history) {
    languageCounts[result.language] = (languageCounts[result.language] || 0) + 1;
  }

  let favoriteLanguage: Language | null = null;
  let maxCount = 0;
  for (const [lang, count] of Object.entries(languageCounts)) {
    if (count! > maxCount) {
      maxCount = count!;
      favoriteLanguage = lang as Language;
    }
  }

  return {
    totalTests,
    totalTimeSpent,
    averageWpm: Math.round(averageWpm * 100) / 100,
    averageAccuracy: Math.round(averageAccuracy * 100) / 100,
    bestWpm,
    bestAccuracy,
    favoriteLanguage,
    history,
  };
}
