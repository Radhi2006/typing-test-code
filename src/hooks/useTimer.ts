import { useState, useRef, useCallback, useEffect } from 'react';

interface UseTimerReturn {
  /** Seconds remaining (countdown mode) or seconds elapsed (unlimited mode) */
  timeLeft: number;
  /** Seconds elapsed since the timer started */
  timeElapsed: number;
  /** Whether the timer is currently running */
  isRunning: boolean;
  /** Start the timer */
  start: () => void;
  /** Pause the timer */
  pause: () => void;
  /** Resume the timer after pause */
  resume: () => void;
  /** Reset the timer, optionally with a new duration */
  reset: (duration?: number) => void;
}

/**
 * Countdown/count-up timer hook.
 *
 * @param duration - Timer duration in seconds. If 0, counts UP (unlimited mode).
 * @param onComplete - Callback invoked when countdown reaches 0 (not called in unlimited mode).
 */
export function useTimer(duration: number, onComplete: () => void): UseTimerReturn {
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [currentDuration, setCurrentDuration] = useState(duration);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const pausedElapsedRef = useRef(0);
  const onCompleteRef = useRef(onComplete);

  // Keep onComplete ref up to date
  onCompleteRef.current = onComplete;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startInterval = useCallback(() => {
    clearTimer();
    startTimeRef.current = Date.now();

    intervalRef.current = setInterval(() => {
      const now = Date.now();
      const elapsed = pausedElapsedRef.current + (now - (startTimeRef.current || now)) / 1000;

      setTimeElapsed(elapsed);

      // Countdown mode: check if time is up
      if (currentDuration > 0 && elapsed >= currentDuration) {
        clearTimer();
        setTimeElapsed(currentDuration);
        setIsRunning(false);
        onCompleteRef.current();
      }
    }, 100);
  }, [clearTimer, currentDuration]);

  const start = useCallback(() => {
    pausedElapsedRef.current = 0;
    setTimeElapsed(0);
    setIsRunning(true);
    startTimeRef.current = Date.now();
    startInterval();
  }, [startInterval]);

  const pause = useCallback(() => {
    if (!isRunning) return;
    clearTimer();
    // Save elapsed time accumulated so far
    const now = Date.now();
    pausedElapsedRef.current += (now - (startTimeRef.current || now)) / 1000;
    setIsRunning(false);
  }, [isRunning, clearTimer]);

  const resume = useCallback(() => {
    if (isRunning) return;
    setIsRunning(true);
    startInterval();
  }, [isRunning, startInterval]);

  const reset = useCallback(
    (newDuration?: number) => {
      clearTimer();
      const dur = newDuration !== undefined ? newDuration : duration;
      setCurrentDuration(dur);
      setTimeElapsed(0);
      setIsRunning(false);
      pausedElapsedRef.current = 0;
      startTimeRef.current = null;
    },
    [clearTimer, duration]
  );

  // Calculate timeLeft: in countdown mode it's remaining time, in unlimited mode same as elapsed
  const timeLeft =
    currentDuration > 0
      ? Math.max(0, Math.ceil(currentDuration - timeElapsed))
      : Math.floor(timeElapsed);

  return {
    timeLeft,
    timeElapsed,
    isRunning,
    start,
    pause,
    resume,
    reset,
  };
}
