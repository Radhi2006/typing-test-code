import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { GameSettings, GameStatus, TypingState, DEFAULT_SETTINGS, SidebarPanel } from '../types/game';
import { CodeSnippet } from '../types/snippet';
import { TestResult } from '../types/stats';
import { getRandomSnippet } from '../data/snippets';
import { saveSettings, getSettings, saveTestResult, updateLeaderboard } from '../utils/storage';

interface GameState {
  status: GameStatus;
  settings: GameSettings;
  currentSnippet: CodeSnippet | null;
  activeSidebarPanel: SidebarPanel;
  lastResult: TestResult | null;
  showResults: boolean;
}

type GameAction =
  | { type: 'LOAD_SNIPPET'; snippet: CodeSnippet }
  | { type: 'SET_STATUS'; status: GameStatus }
  | { type: 'COMPLETE_TEST'; result: TestResult }
  | { type: 'RESET_TEST' }
  | { type: 'UPDATE_SETTINGS'; settings: Partial<GameSettings> }
  | { type: 'SET_SIDEBAR'; panel: SidebarPanel }
  | { type: 'DISMISS_RESULTS' };

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'LOAD_SNIPPET':
      return {
        ...state,
        currentSnippet: action.snippet,
        status: 'ready',
        showResults: false,
        lastResult: null,
      };
    case 'SET_STATUS':
      return { ...state, status: action.status };
    case 'COMPLETE_TEST':
      return {
        ...state,
        status: 'complete',
        lastResult: action.result,
        showResults: true,
      };
    case 'RESET_TEST':
      return {
        ...state,
        status: 'ready',
        showResults: false,
        lastResult: null,
      };
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.settings },
      };
    case 'SET_SIDEBAR':
      return {
        ...state,
        activeSidebarPanel: state.activeSidebarPanel === action.panel ? null : action.panel,
      };
    case 'DISMISS_RESULTS':
      return { ...state, showResults: false };
    default:
      return state;
  }
}

function getInitialState(): GameState {
  const savedSettings = getSettings();
  const settings = savedSettings || DEFAULT_SETTINGS;
  return {
    status: 'idle',
    settings,
    currentSnippet: null,
    activeSidebarPanel: 'languages',
    lastResult: null,
    showResults: false,
  };
}

interface GameContextValue {
  state: GameState;
  loadNewSnippet: () => void;
  startTyping: () => void;
  pauseTyping: () => void;
  resumeTyping: () => void;
  completeTest: (result: TestResult) => void;
  resetTest: () => void;
  retryTest: () => void;
  updateSettings: (settings: Partial<GameSettings>) => void;
  setActiveSidebarPanel: (panel: SidebarPanel) => void;
  dismissResults: () => void;
}

const GameContext = createContext<GameContextValue>(null!);

export const useGameContext = () => useContext(GameContext);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, undefined, getInitialState);

  const loadNewSnippet = useCallback(() => {
    const snippet = getRandomSnippet(
      state.settings.selectedLanguages,
      state.settings.difficulty
    );
    if (snippet) {
      dispatch({ type: 'LOAD_SNIPPET', snippet });
    }
  }, [state.settings.selectedLanguages, state.settings.difficulty]);

  // Load initial snippet on mount
  useEffect(() => {
    loadNewSnippet();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const startTyping = useCallback(() => {
    dispatch({ type: 'SET_STATUS', status: 'typing' });
  }, []);

  const pauseTyping = useCallback(() => {
    dispatch({ type: 'SET_STATUS', status: 'paused' });
  }, []);

  const resumeTyping = useCallback(() => {
    dispatch({ type: 'SET_STATUS', status: 'typing' });
  }, []);

  const completeTest = useCallback((result: TestResult) => {
    const fullResult = { ...result, timerDuration: state.settings.timerDuration };
    saveTestResult(fullResult);
    updateLeaderboard(fullResult);
    dispatch({ type: 'COMPLETE_TEST', result: fullResult });
  }, [state.settings.timerDuration]);

  const resetTest = useCallback(() => {
    dispatch({ type: 'RESET_TEST' });
    // Reload same snippet — just reset status
    if (state.currentSnippet) {
      dispatch({ type: 'LOAD_SNIPPET', snippet: state.currentSnippet });
    }
  }, [state.currentSnippet]);

  const retryTest = useCallback(() => {
    dispatch({ type: 'RESET_TEST' });
    if (state.currentSnippet) {
      dispatch({ type: 'LOAD_SNIPPET', snippet: state.currentSnippet });
    }
  }, [state.currentSnippet]);

  const updateSettingsAction = useCallback((newSettings: Partial<GameSettings>) => {
    dispatch({ type: 'UPDATE_SETTINGS', settings: newSettings });
    const merged = { ...state.settings, ...newSettings };
    saveSettings(merged);
  }, [state.settings]);

  const setActiveSidebarPanel = useCallback((panel: SidebarPanel) => {
    dispatch({ type: 'SET_SIDEBAR', panel });
  }, []);

  const dismissResults = useCallback(() => {
    dispatch({ type: 'DISMISS_RESULTS' });
  }, []);

  return (
    <GameContext.Provider
      value={{
        state,
        loadNewSnippet,
        startTyping,
        pauseTyping,
        resumeTyping,
        completeTest,
        resetTest,
        retryTest,
        updateSettings: updateSettingsAction,
        setActiveSidebarPanel,
        dismissResults,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
