import { useState, useCallback } from 'react';

/**
 * A generic hook for reading/writing to localStorage with JSON serialization.
 * Provides a state value synced with localStorage and a setter that persists changes.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  // Initialize state from localStorage or use initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item !== null ? (JSON.parse(item) as T) : initialValue;
    } catch {
      console.warn(`Error reading localStorage key "${key}". Using initial value.`);
      return initialValue;
    }
  });

  // Setter that updates both state and localStorage
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const nextValue = value instanceof Function ? value(prev) : value;
        try {
          localStorage.setItem(key, JSON.stringify(nextValue));
        } catch {
          console.warn(`Error writing to localStorage key "${key}".`);
        }
        return nextValue;
      });
    },
    [key]
  );

  return [storedValue, setValue];
}
