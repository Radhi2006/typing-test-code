/**
 * WPM and accuracy calculation utilities for CodeType.
 * Standard WPM uses 5 characters per "word".
 */

/**
 * Calculate net WPM based on correctly typed characters.
 * WPM = (correctChars / 5) / (elapsedMinutes)
 */
export function calculateWpm(correctChars: number, elapsedSeconds: number): number {
  if (elapsedSeconds <= 0) return 0;
  const elapsedMinutes = elapsedSeconds / 60;
  const wpm = (correctChars / 5) / elapsedMinutes;
  return Math.max(0, Math.round(wpm * 100) / 100);
}

/**
 * Calculate raw WPM based on all typed characters (including errors).
 * Raw WPM = (totalChars / 5) / (elapsedMinutes)
 */
export function calculateRawWpm(totalChars: number, elapsedSeconds: number): number {
  if (elapsedSeconds <= 0) return 0;
  const elapsedMinutes = elapsedSeconds / 60;
  const rawWpm = (totalChars / 5) / elapsedMinutes;
  return Math.max(0, Math.round(rawWpm * 100) / 100);
}

/**
 * Calculate typing accuracy as a percentage.
 * Accuracy = (correctChars / totalChars) * 100
 */
export function calculateAccuracy(correctChars: number, totalChars: number): number {
  if (totalChars <= 0) return 100;
  const accuracy = (correctChars / totalChars) * 100;
  return Math.max(0, Math.min(100, Math.round(accuracy * 100) / 100));
}

/**
 * Format seconds into "M:SS" display string.
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Format WPM as a rounded integer string.
 */
export function formatWpm(wpm: number): string {
  return Math.round(wpm).toString();
}
