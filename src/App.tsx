import React, { useState, useEffect } from 'react';
import { ThemeProvider, useThemeContext } from './context/ThemeContext';
import { GameProvider, useGameContext } from './context/GameContext';
import { Header } from './components/layout/Header';
import { ActivityBar } from './components/layout/ActivityBar';
import { Sidebar } from './components/layout/Sidebar';
import { TabBar } from './components/layout/TabBar';
import { CodeEditor } from './components/editor/CodeEditor';
import { ResultsModal } from './components/panels/ResultsModal';
import { CommandPalette } from './components/panels/CommandPalette';
import { AnimatePresence } from 'framer-motion';

export default function App() {
  return (
    <ThemeProvider>
      <GameProvider>
        <AppContent />
      </GameProvider>
    </ThemeProvider>
  );
}

function AppContent() {
  const { theme } = useThemeContext();
  const { state } = useGameContext();
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Global shortcut for Command Palette (Ctrl+Shift+P, Cmd+Shift+P, F1)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      } else if (e.key === 'F1') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div
      className="h-screen w-screen flex flex-col overflow-hidden font-mono"
      style={{ backgroundColor: theme.colors.editorBg, color: theme.colors.editorFg }}
    >
      <Header onOpenCommandPalette={() => setIsCommandPaletteOpen(true)} />
      <div className="flex flex-1 overflow-hidden">
        <ActivityBar />
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TabBar />
          <CodeEditor onOpenCommandPalette={() => setIsCommandPaletteOpen(true)} />
        </div>
      </div>

      <AnimatePresence>
        {state.showResults && <ResultsModal />}
      </AnimatePresence>

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />
    </div>
  );
}
