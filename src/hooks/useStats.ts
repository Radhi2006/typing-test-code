import { useRef, useCallback, useMemo } from 'react';
import { TypingState } from '../types/game';
import { TestResult } from '../types/stats';
import { CodeSnippet } from '../types/snippet';
import { calculateWpm, calculateRawWpm, calculateAccuracy } from '../utils/wpm';

interface UseStatsReturn {
  /** Net WPM (based on correct characters) */
  wpm: number;
  /** Raw WPM (based on all typed characters) */
  rawWpm: number;
  /** Accuracy percentage (0–100) */
  accuracy: number;
  /** Number of correctly typed characters */
  correctChars: number;
  /** Number of incorrectly typed characters */
  incorrectChars: number;
  /** Total characters typed (correct + incorrect) */
  totalChars: number;
  /** Typing progress as a percentage (0–100) */
  progress: number;
  /** WPM sampled over time each second for the results chart */
  wpmOverTime: { time: number; wpm: number }[];
  /** Build the final TestResult object for recording */
  calculateFinalStats: () => TestResult;
}

/**
 * Real-time WPM and accuracy calculation hook.
 *
 * @param typingState - Current typing state from the typing engine
 * @param snippet - The code snippet being typed
 * @param timeElapsed - Seconds elapsed since typing began
 */
export function useStats(
  typingState: TypingState,
  snippet: CodeSnippet | null,
  timeElapsed: number
): UseStatsReturn {
  const wpmOverTimeRef = useRef<{ time: number; wpm: number }[]>([]);
  const lastRecordedSecondRef = useRef(0);

  // Count correct and incorrect characters from the charStates array
  const { correctChars, incorrectChars } = useMemo(() => {
    let correct = 0;
    let incorrect = 0;
    for (const state of typingState.charStates) {
      if (state === 'correct' || state === 'corrected') correct++;
      else if (state === 'incorrect') incorrect++;
    }
    return { correctChars: correct, incorrectChars: incorrect };
  }, [typingState.charStates]);

  const totalChars = correctChars + incorrectChars;
  const codeLength = snippet ? snippet.code.length : 0;

  const wpm = calculateWpm(correctChars, timeElapsed);
  const rawWpm = calculateRawWpm(totalChars, timeElapsed);
  const accuracy = calculateAccuracy(correctChars, totalChars);
  const progress = codeLength > 0 ? Math.min(100, (typingState.currentIndex / codeLength) * 100) : 0;

  // Record WPM every second for the chart
  const currentSecond = Math.floor(timeElapsed);
  if (currentSecond > lastRecordedSecondRef.current && timeElapsed > 0) {
    wpmOverTimeRef.current.push({ time: currentSecond, wpm });
    lastRecordedSecondRef.current = currentSecond;
  }

  // Reset tracking when the typing state resets (currentIndex goes to 0)
  if (typingState.currentIndex === 0 && wpmOverTimeRef.current.length > 0) {
    wpmOverTimeRef.current = [];
    lastRecordedSecondRef.current = 0;
  }

  const calculateFinalStats = useCallback((): TestResult => {
    const now = new Date();
    return {
      id: `test_${now.getTime()}_${Math.random().toString(36).slice(2, 9)}`,
      date: now.toISOString(),
      wpm,
      rawWpm,
      accuracy,
      totalChars,
      correctChars,
      incorrectChars,
      corrections: typingState.corrections,
      totalKeystrokes: typingState.totalKeystrokes,
      timeElapsed,
      timerDuration: 0, // Will be set by the consumer
      language: snippet?.language ?? 'javascript',
      difficulty: snippet?.difficulty ?? 'easy',
      snippetId: snippet?.id ?? '',
      snippetTitle: snippet?.title ?? '',
      wpmOverTime: [...wpmOverTimeRef.current],
    };
  }, [
    wpm,
    rawWpm,
    accuracy,
    totalChars,
    correctChars,
    incorrectChars,
    typingState.corrections,
    typingState.totalKeystrokes,
    timeElapsed,
    snippet,
  ]);

  return {
    wpm,
    rawWpm,
    accuracy,
    correctChars,
    incorrectChars,
    totalChars,
    progress,
    wpmOverTime: wpmOverTimeRef.current,
    calculateFinalStats,
  };
}
