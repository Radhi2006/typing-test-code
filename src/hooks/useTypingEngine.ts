import { useState, useCallback, useRef } from 'react';
import { CharState, TypingState } from '../types/game';
import { CodeSnippet } from '../types/snippet';

interface UseTypingEngineReturn {
  /** Current typing state with char states, index, errors, etc. */
  typingState: TypingState;
  /** Current line index (0-based) based on newlines before currentIndex */
  currentLineIndex: number;
  /** Handle a keypress event */
  handleKeyPress: (key: string, ctrlKey: boolean, shiftKey: boolean) => void;
  /** Reset the engine with a new snippet */
  reset: (snippet: CodeSnippet) => void;
  /** Whether the user has finished typing the entire snippet */
  isComplete: boolean;
}

/**
 * Create a fresh TypingState for a given code string.
 */
function createInitialState(code: string): TypingState {
  return {
    charStates: new Array<CharState>(code.length).fill('pending'),
    currentIndex: 0,
    startTime: null,
    endTime: null,
    totalKeystrokes: 0,
    errors: 0,
    corrections: 0,
  };
}

/**
 * Count the number of newlines before a given index in a string.
 */
function getLineIndex(code: string, index: number): number {
  let line = 0;
  for (let i = 0; i < index && i < code.length; i++) {
    if (code[i] === '\n') line++;
  }
  return line;
}

/**
 * Core typing engine hook. Manages character-by-character comparison
 * against a code snippet, handling printable chars, Backspace, Tab, and Enter.
 */
export function useTypingEngine(): UseTypingEngineReturn {
  const [typingState, setTypingState] = useState<TypingState>(createInitialState(''));
  const snippetRef = useRef<CodeSnippet | null>(null);

  const currentLineIndex = snippetRef.current
    ? getLineIndex(snippetRef.current.code, typingState.currentIndex)
    : 0;

  const isComplete = snippetRef.current
    ? typingState.currentIndex >= snippetRef.current.code.length
    : false;

  const reset = useCallback((snippet: CodeSnippet) => {
    snippetRef.current = snippet;
    setTypingState(createInitialState(snippet.code));
  }, []);

  const handleKeyPress = useCallback(
    (key: string, ctrlKey: boolean, _shiftKey: boolean) => {
      const snippet = snippetRef.current;
      if (!snippet) return;

      const code = snippet.code;

      setTypingState((prev) => {
        // Don't process if already complete
        if (prev.currentIndex >= code.length && key !== 'Backspace') {
          return prev;
        }

        const newState: TypingState = {
          ...prev,
          charStates: [...prev.charStates],
          startTime: prev.startTime ?? Date.now(),
          totalKeystrokes: prev.totalKeystrokes + 1,
        };

        // --- Backspace ---
        if (key === 'Backspace') {
          if (ctrlKey) {
            // Ctrl+Backspace: delete back to the start of the current "word" / whitespace boundary
            let idx = newState.currentIndex - 1;
            // Skip trailing whitespace (but not newlines)
            while (idx >= 0 && code[idx] !== '\n' && code[idx] === ' ') {
              newState.charStates[idx] = 'pending';
              idx--;
              newState.corrections++;
            }
            // Skip non-space characters
            while (idx >= 0 && code[idx] !== ' ' && code[idx] !== '\n') {
              newState.charStates[idx] = 'pending';
              idx--;
              newState.corrections++;
            }
            newState.currentIndex = idx + 1;
          } else {
            // Single backspace
            if (newState.currentIndex > 0) {
              newState.currentIndex--;
              newState.charStates[newState.currentIndex] = 'pending';
              newState.corrections++;
            }
          }
          return newState;
        }

        // --- Tab ---
        if (key === 'Tab') {
          // Auto-match spaces at current position that represent indentation
          let idx = newState.currentIndex;
          while (idx < code.length && code[idx] === ' ') {
            newState.charStates[idx] = 'correct';
            idx++;
          }
          // If we didn't advance at all but expected a tab, try to match tab character
          if (idx === newState.currentIndex && idx < code.length && code[idx] === '\t') {
            newState.charStates[idx] = 'correct';
            idx++;
          }
          newState.currentIndex = idx;
          return newState;
        }

        // --- Enter ---
        if (key === 'Enter') {
          const idx = newState.currentIndex;
          if (idx < code.length && code[idx] === '\n') {
            newState.charStates[idx] = 'correct';
            newState.currentIndex = idx + 1;

            // Auto-advance through leading whitespace on the next line
            let nextIdx = newState.currentIndex;
            while (nextIdx < code.length && (code[nextIdx] === ' ' || code[nextIdx] === '\t')) {
              newState.charStates[nextIdx] = 'correct';
              nextIdx++;
            }
            newState.currentIndex = nextIdx;
          } else {
            // If Enter is pressed but expected char isn't newline, treat as incorrect
            if (idx < code.length) {
              newState.charStates[idx] = 'incorrect';
              newState.currentIndex = idx + 1;
              newState.errors++;
            }
          }
          return newState;
        }

        // --- Printable characters ---
        if (key.length === 1 && !ctrlKey) {
          const idx = newState.currentIndex;
          if (idx < code.length) {
            const expected = code[idx];

            if (key === expected) {
              // Check if this was previously incorrect and is now being corrected
              newState.charStates[idx] = 'correct';
            } else {
              newState.charStates[idx] = 'incorrect';
              newState.errors++;
            }
            newState.currentIndex = idx + 1;

            // Mark complete if we've reached the end
            if (newState.currentIndex >= code.length) {
              newState.endTime = Date.now();
            }
          }
          return newState;
        }

        return newState;
      });
    },
    []
  );

  return {
    typingState,
    currentLineIndex,
    handleKeyPress,
    reset,
    isComplete,
  };
}
