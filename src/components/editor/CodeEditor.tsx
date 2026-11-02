import React, { useEffect, useRef, useMemo, useCallback } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-php';
import 'prismjs/components/prism-ruby';
import 'prismjs/components/prism-swift';
import 'prismjs/components/prism-kotlin';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-markup';

import { useThemeContext } from '../../context/ThemeContext';
import { useGameContext } from '../../context/GameContext';
import { useTypingEngine } from '../../hooks/useTypingEngine';
import { useTimer } from '../../hooks/useTimer';
import { useStats } from '../../hooks/useStats';
import { useKeyboard } from '../../hooks/useKeyboard';
import { StatusBar } from '../layout/StatusBar';
import { LANGUAGE_PRISM_KEYS } from '../../types/snippet';
import { CharState } from '../../types/game';
import { soundEngine } from '../../utils/sound';

interface CharInfo {
  char: string;
  syntaxType: string;
}

function flattenTokens(tokens: (string | Prism.Token)[]): CharInfo[] {
  const result: CharInfo[] = [];
  for (const token of tokens) {
    if (typeof token === 'string') {
      for (const ch of token) {
        result.push({ char: ch, syntaxType: 'plain' });
      }
    } else if (token instanceof Prism.Token) {
      if (typeof token.content === 'string') {
        for (const ch of token.content) {
          result.push({ char: ch, syntaxType: token.type });
        }
      } else if (Array.isArray(token.content)) {
        result.push(...flattenTokens(token.content as (string | Prism.Token)[]));
      }
    }
  }
  return result;
}

function getSyntaxColor(syntaxType: string, colors: Record<string, string>): string {
  const map: Record<string, string> = {
    keyword: colors.keyword,
    string: colors.string,
    number: colors.number,
    comment: colors.comment,
    function: colors.function,
    'function-variable': colors.function,
    variable: colors.variable,
    'class-name': colors.className,
    operator: colors.operator,
    punctuation: colors.punctuation,
    tag: colors.tag,
    'attr-name': colors.attribute,
    'attr-value': colors.string,
    property: colors.property,
    boolean: colors.number,
    regex: colors.regexp,
    builtin: colors.type,
    'template-string': colors.string,
    'template-punctuation': colors.string,
    'interpolation-punctuation': colors.punctuation,
    parameter: colors.variable,
    constant: colors.number,
    macro: colors.keyword,
    attribute: colors.attribute,
    namespace: colors.type,
    decorator: colors.function,
    annotation: colors.function,
    type: colors.type,
    'generic-function': colors.function,
    'return-type': colors.type,
    key: colors.property,
    selector: colors.tag,
    'pseudo-class': colors.keyword,
    'pseudo-element': colors.keyword,
    unit: colors.number,
    hexcode: colors.number,
    atrule: colors.keyword,
    rule: colors.keyword,
    plain: colors.editorFg,
  };
  return map[syntaxType] || colors.editorFg;
}

interface CodeEditorProps {
  onOpenCommandPalette?: () => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ onOpenCommandPalette }) => {
  const { theme } = useThemeContext();
  const { state, startTyping, pauseTyping, resumeTyping, completeTest, resetTest, loadNewSnippet } = useGameContext();
  const c = theme.colors;

  const snippet = state.currentSnippet;
  const { typingState, currentLineIndex, handleKeyPress, reset, isComplete } = useTypingEngine();

  const timerCompleteRef = useRef(false);
  const onTimerComplete = useCallback(() => {
    timerCompleteRef.current = true;
  }, []);

  const timer = useTimer(state.settings.timerDuration, onTimerComplete);
  const stats = useStats(typingState, snippet, timer.timeElapsed);

  const editorRef = useRef<HTMLDivElement>(null);
  const activeLineRef = useRef<HTMLDivElement>(null);

  // Reset engine when snippet changes or timer settings change
  useEffect(() => {
    if (snippet) {
      reset(snippet);
      timer.reset(state.settings.timerDuration);
      timerCompleteRef.current = false;
    }
  }, [snippet, state.settings.timerDuration]); // eslint-disable-line react-hooks/exhaustive-deps

  // Check completion
  useEffect(() => {
    if ((isComplete || timerCompleteRef.current) && state.status === 'typing') {
      const result = stats.calculateFinalStats();
      completeTest(result);
      timer.pause();
    }
  }, [isComplete, state.status]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-scroll to active line
  useEffect(() => {
    if (activeLineRef.current) {
      activeLineRef.current.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [currentLineIndex]);

  const handleType = useCallback(
    (key: string, ctrlKey: boolean, shiftKey: boolean) => {
      if (state.status === 'complete') return;

      // Start timer on first keypress
      if (state.status === 'ready') {
        startTyping();
        timer.start();
      }

      // Play mechanical keyboard sound if enabled
      if (state.settings.soundEnabled) {
        if (key === 'Enter') soundEngine.playKeyClick('enter');
        else if (key === 'Backspace') soundEngine.playKeyClick('backspace');
        else if (key === ' ') soundEngine.playKeyClick('space');
        else soundEngine.playKeyClick('normal');
      }

      handleKeyPress(key, ctrlKey, shiftKey);
    },
    [state.status, state.settings.soundEnabled, startTyping, timer, handleKeyPress]
  );

  const handleEscape = useCallback(() => {
    if (state.status === 'typing') {
      pauseTyping();
      timer.pause();
    } else if (state.status === 'paused') {
      resumeTyping();
      timer.resume();
    }
  }, [state.status, pauseTyping, resumeTyping, timer]);

  const handleRestart = useCallback(() => {
    resetTest();
  }, [resetTest]);

  const handleNewSnippet = useCallback(() => {
    loadNewSnippet();
  }, [loadNewSnippet]);

  useKeyboard({
    onType: handleType,
    onEscape: handleEscape,
    onRestart: handleRestart,
    onNewSnippet: handleNewSnippet,
    onOpenSettings: () => onOpenCommandPalette?.(),
    enabled: state.status !== 'complete',
  });

  // Tokenize code
  const charInfos = useMemo(() => {
    if (!snippet) return [];
    const prismKey = LANGUAGE_PRISM_KEYS[snippet.language] || 'plain';
    const grammar = Prism.languages[prismKey];
    if (!grammar) {
      return snippet.code.split('').map((ch) => ({ char: ch, syntaxType: 'plain' }));
    }
    const tokens = Prism.tokenize(snippet.code, grammar);
    return flattenTokens(tokens);
  }, [snippet]);

  // Split into lines
  const lines = useMemo(() => {
    if (!charInfos.length) return [];
    const result: { charInfo: CharInfo; globalIndex: number }[][] = [[]];
    charInfos.forEach((ci, idx) => {
      if (ci.char === '\n') {
        result[result.length - 1].push({ charInfo: ci, globalIndex: idx });
        result.push([]);
      } else {
        result[result.length - 1].push({ charInfo: ci, globalIndex: idx });
      }
    });
    return result;
  }, [charInfos]);

  // Calculate current column
  const currentCol = useMemo(() => {
    if (!snippet) return 1;
    const code = snippet.code;
    let col = 1;
    for (let i = typingState.currentIndex - 1; i >= 0; i--) {
      if (code[i] === '\n') break;
      col++;
    }
    return col;
  }, [snippet, typingState.currentIndex]);

  if (!snippet) {
    return (
      <div
        className="flex-1 flex items-center justify-center font-mono text-sm"
        style={{ backgroundColor: c.editorBg }}
      >
        <span style={{ color: c.editorFg, opacity: 0.5 }}>Loading snippet...</span>
      </div>
    );
  }

  const fontSize = state.settings.fontSize;
  const lineHeight = fontSize * 1.65;
  const gutterWidth = Math.max(48, (lines.length.toString().length + 2) * (fontSize * 0.65));

  return (
    <>
      <div
        ref={editorRef}
        className="flex-1 overflow-auto custom-scrollbar relative cursor-text outline-none select-none"
        style={{ backgroundColor: c.editorBg }}
        onClick={() => editorRef.current?.focus()}
        tabIndex={0}
      >
        {/* Paused Overlay */}
        {state.status === 'paused' && (
          <div
            className="absolute inset-0 flex items-center justify-center z-30 backdrop-blur-sm transition-all"
            style={{ backgroundColor: `${c.editorBg}d0` }}
          >
            <div
              className="text-center p-6 rounded-lg border shadow-xl animate-fade-in"
              style={{
                backgroundColor: c.sidebarBg,
                borderColor: c.border,
                color: c.editorFg,
              }}
            >
              <p className="text-xl font-bold mb-1" style={{ color: c.editorFg }}>
                Test Paused
              </p>
              <p className="text-xs opacity-60 mb-4">Press Escape to resume typing</p>
              <button
                onClick={handleEscape}
                className="px-4 py-1.5 rounded text-xs font-medium transition-colors"
                style={{ backgroundColor: c.buttonBg, color: c.buttonFg }}
              >
                Resume
              </button>
            </div>
          </div>
        )}

        {/* Ready Prompt (before first keystroke) */}
        {state.status === 'ready' && typingState.currentIndex === 0 && (
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
            <div
              className="text-center animate-fade-in px-6 py-4 rounded-lg pointer-events-none"
              style={{
                backgroundColor: `${c.sidebarBg}b0`,
                border: `1px solid ${c.border}`,
                color: c.editorFg,
              }}
            >
              <p className="text-sm font-semibold mb-1" style={{ color: c.buttonBg }}>
                Ready! Start typing any key to begin
              </p>
              <p className="text-[11px] opacity-60">
                Tab: auto-indent · Enter: newline · Esc: pause · Ctrl+R: restart
              </p>
            </div>
          </div>
        )}

        {/* Code Lines Container */}
        <div
          className="min-h-full py-3"
          style={{
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            fontSize: `${fontSize}px`,
          }}
        >
          {lines.map((lineChars, lineIdx) => {
            const isActiveLine = lineIdx === currentLineIndex;

            return (
              <div
                key={lineIdx}
                ref={isActiveLine ? activeLineRef : undefined}
                className="flex code-line transition-colors relative"
                style={{
                  height: `${lineHeight}px`,
                  lineHeight: `${lineHeight}px`,
                  backgroundColor: isActiveLine ? c.lineHighlight : 'transparent',
                }}
              >
                {/* Gutter Line Number */}
                <div
                  className="shrink-0 text-right pr-4 select-none opacity-60 transition-opacity"
                  style={{
                    width: `${gutterWidth}px`,
                    color: isActiveLine ? c.gutterActiveFg : c.gutterFg,
                    backgroundColor: c.gutterBg,
                    fontSize: `${Math.max(11, fontSize - 2)}px`,
                    fontWeight: isActiveLine ? 600 : 400,
                  }}
                >
                  {lineIdx + 1}
                </div>

                {/* Line Code Content */}
                <div className="flex-1 whitespace-pre pl-3 relative flex items-center">
                  {lineChars.length === 0 ? (
                    <span className="opacity-0 select-none">&nbsp;</span>
                  ) : (
                    lineChars.map(({ charInfo, globalIndex }) => {
                      const charState: CharState = typingState.charStates[globalIndex] || 'pending';
                      const isCursor = globalIndex === typingState.currentIndex;
                      const syntaxColor = getSyntaxColor(charInfo.syntaxType, c as unknown as Record<string, string>);

                      let color = syntaxColor;
                      let opacity = 1;
                      let bgColor = 'transparent';
                      let textDecoration = 'none';

                      switch (charState) {
                        case 'pending':
                          opacity = 0.35;
                          break;
                        case 'correct':
                          opacity = 1;
                          break;
                        case 'incorrect':
                          color = c.incorrect;
                          bgColor = c.incorrectBg;
                          textDecoration = 'underline wavy';
                          break;
                        case 'corrected':
                          opacity = 1;
                          textDecoration = 'underline dotted';
                          break;
                      }

                      const isNewline = charInfo.char === '\n';
                      const isSpace = charInfo.char === ' ';
                      const displayChar = isNewline ? '↵' : isSpace ? '\u00A0' : charInfo.char;

                      return (
                        <span
                          key={globalIndex}
                          className="relative inline-block"
                          style={{
                            color,
                            opacity: isNewline && charState === 'pending' ? 0.2 : opacity,
                            backgroundColor: bgColor,
                            textDecoration,
                            textDecorationColor: charState === 'incorrect' ? c.incorrect : undefined,
                            textUnderlineOffset: '3px',
                          }}
                        >
                          {/* Precise Inline Cursor */}
                          {isCursor && (
                            <span
                              className="cursor-blink absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none"
                              style={{
                                width: '2px',
                                height: `${fontSize + 3}px`,
                                backgroundColor: c.cursor,
                                zIndex: 20,
                              }}
                            />
                          )}
                          {displayChar}
                        </span>
                      );
                    })
                  )}

                  {/* End of Line Cursor (when at end of current line) */}
                  {lineChars.length > 0 &&
                    typingState.currentIndex === lineChars[lineChars.length - 1].globalIndex + 1 &&
                    lineIdx === lines.length - 1 && (
                      <span
                        className="cursor-blink inline-block relative"
                        style={{
                          width: '2px',
                          height: `${fontSize + 3}px`,
                          backgroundColor: c.cursor,
                          verticalAlign: 'middle',
                          marginLeft: '1px',
                        }}
                      />
                    )}
                </div>
              </div>
            );
          })}

          {/* Padding lines at bottom for realistic scroll space */}
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={`empty-pad-${i}`}
              className="flex opacity-25"
              style={{ height: `${lineHeight}px`, lineHeight: `${lineHeight}px` }}
            >
              <div
                className="shrink-0 text-right pr-4 select-none"
                style={{
                  width: `${gutterWidth}px`,
                  color: c.gutterFg,
                  backgroundColor: c.gutterBg,
                  fontSize: `${Math.max(11, fontSize - 2)}px`,
                }}
              >
                {lines.length + i + 1}
              </div>
              <div className="flex-1" />
            </div>
          ))}
        </div>

        {/* Minimap (Right side) */}
        {state.settings.showMinimap && (
          <div
            className="absolute top-0 right-0 w-[64px] h-full overflow-hidden select-none pointer-events-none border-l opacity-70 hover:opacity-100 transition-opacity"
            style={{
              backgroundColor: c.minimapBg,
              borderColor: `${c.border}40`,
            }}
          >
            <div className="p-1.5 pt-2">
              {lines.map((lineChars, lineIdx) => {
                const progress = typingState.currentIndex;
                const lineStart = lineChars.length > 0 ? lineChars[0].globalIndex : 0;
                const isTyped = lineStart < progress;
                return (
                  <div key={lineIdx} className="flex gap-px mb-0.5" style={{ height: '2px' }}>
                    {lineChars
                      .filter((ch) => ch.charInfo.char !== '\n')
                      .slice(0, 24)
                      .map((_, ci) => (
                        <div
                          key={ci}
                          style={{
                            width: '1.5px',
                            height: '2px',
                            backgroundColor: isTyped ? c.cursor : c.editorFg,
                            opacity: isTyped ? 0.7 : 0.15,
                          }}
                        />
                      ))}
                  </div>
                );
              })}
            </div>
            {/* Minimap Viewport indicator */}
            <div
              className="absolute right-0 w-full rounded"
              style={{
                top: `${(currentLineIndex / Math.max(1, lines.length)) * 80}%`,
                height: `${Math.min(60, Math.max(20, (10 / Math.max(1, lines.length)) * 100))}%`,
                backgroundColor: c.minimapSlider || `${c.focusBorder}25`,
              }}
            />
          </div>
        )}
      </div>

      {/* Status Bar */}
      <StatusBar
        wpm={stats.wpm}
        accuracy={stats.accuracy}
        timeDisplay={timer.timeLeft}
        errors={typingState.errors}
        currentLine={currentLineIndex + 1}
        currentCol={currentCol}
      />
    </>
  );
};
