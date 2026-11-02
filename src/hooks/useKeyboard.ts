import { useEffect, useRef } from 'react';

interface UseKeyboardOptions {
  /** Callback for typeable key presses */
  onType: (key: string, ctrlKey: boolean, shiftKey: boolean) => void;
  /** Called when Escape is pressed */
  onEscape: () => void;
  /** Called on Ctrl+R (restart) */
  onRestart: () => void;
  /** Called on Ctrl+N (new snippet) */
  onNewSnippet: () => void;
  /** Called on Ctrl+, (open settings) */
  onOpenSettings: () => void;
  /** Whether keyboard events should be processed */
  enabled: boolean;
}

/** Set of keys that are considered "typeable" and routed to onType */
const TYPING_KEYS = new Set([
  'Backspace',
  'Tab',
  'Enter',
]);

/**
 * Global keyboard event handler hook.
 * Attaches a keydown listener to the window and routes key events
 * to the appropriate handler. Prevents default behavior for handled keys.
 */
export function useKeyboard(options: UseKeyboardOptions): void {
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const { onType, onEscape, onRestart, onNewSnippet, onOpenSettings, enabled } =
        optionsRef.current;

      if (!enabled) return;

      const { key, ctrlKey, metaKey, shiftKey } = e;
      const isModifier = ctrlKey || metaKey;

      // --- Shortcut keys (Ctrl/Cmd combinations) ---
      if (isModifier) {
        switch (key.toLowerCase()) {
          case 'r':
            e.preventDefault();
            onRestart();
            return;
          case 'n':
            e.preventDefault();
            onNewSnippet();
            return;
          case ',':
            e.preventDefault();
            onOpenSettings();
            return;
        }

        // Ctrl+Backspace is a typing action
        if (key === 'Backspace') {
          e.preventDefault();
          onType(key, true, shiftKey);
          return;
        }

        // Don't handle other Ctrl combinations as typing
        return;
      }

      // --- Escape ---
      if (key === 'Escape') {
        e.preventDefault();
        onEscape();
        return;
      }

      // --- Tab, Enter, Backspace ---
      if (TYPING_KEYS.has(key)) {
        e.preventDefault();
        onType(key, ctrlKey, shiftKey);
        return;
      }

      // --- Printable characters (single character keys) ---
      if (key.length === 1) {
        e.preventDefault();
        onType(key, ctrlKey, shiftKey);
        return;
      }

      // Ignore all other keys (Shift, Alt, F-keys, arrows, etc.)
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
}
