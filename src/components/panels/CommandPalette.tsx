import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, Palette, Code, Clock, RotateCcw, Volume2, Layout, Zap } from 'lucide-react';
import { useThemeContext } from '../../context/ThemeContext';
import { useGameContext } from '../../context/GameContext';
import { ALL_LANGUAGES, LANGUAGE_DISPLAY_NAMES, Language } from '../../types/snippet';
import { TimerDuration } from '../../types/game';

interface CommandItem {
  id: string;
  title: string;
  category: string;
  icon: React.ReactNode;
  action: () => void;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const { theme, setThemeById, availableThemes } = useThemeContext();
  const { state, updateSettings, loadNewSnippet, resetTest } = useGameContext();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const c = theme.colors;

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const commands = useMemo<CommandItem[]>(() => {
    const list: CommandItem[] = [
      {
        id: 'restart',
        title: 'Restart Test',
        category: 'Game',
        icon: <RotateCcw size={14} />,
        action: () => {
          resetTest();
          onClose();
        },
      },
      {
        id: 'new-snippet',
        title: 'New Random Snippet',
        category: 'Game',
        icon: <Zap size={14} />,
        action: () => {
          loadNewSnippet();
          onClose();
        },
      },
      {
        id: 'toggle-sound',
        title: `Toggle Keyboard Sound (Currently ${state.settings.soundEnabled ? 'ON' : 'OFF'})`,
        category: 'Preferences',
        icon: <Volume2 size={14} />,
        action: () => {
          updateSettings({ soundEnabled: !state.settings.soundEnabled });
          onClose();
        },
      },
      {
        id: 'toggle-minimap',
        title: `Toggle Minimap (Currently ${state.settings.showMinimap ? 'ON' : 'OFF'})`,
        category: 'Preferences',
        icon: <Layout size={14} />,
        action: () => {
          updateSettings({ showMinimap: !state.settings.showMinimap });
          onClose();
        },
      },
    ];

    // Theme commands
    availableThemes.forEach((t) => {
      list.push({
        id: `theme-${t.id}`,
        title: `Preferences: Color Theme: ${t.name}`,
        category: 'Theme',
        icon: <Palette size={14} />,
        action: () => {
          setThemeById(t.id);
          onClose();
        },
      });
    });

    // Language commands
    ALL_LANGUAGES.forEach((lang) => {
      list.push({
        id: `lang-${lang}`,
        title: `Filter Language: Only ${LANGUAGE_DISPLAY_NAMES[lang]}`,
        category: 'Language',
        icon: <Code size={14} />,
        action: () => {
          updateSettings({ selectedLanguages: [lang as Language] });
          loadNewSnippet();
          onClose();
        },
      });
    });

    // Timer commands
    const timerDurations: { dur: TimerDuration; label: string }[] = [
      { dur: 15, label: '15 seconds' },
      { dur: 30, label: '30 seconds' },
      { dur: 60, label: '60 seconds (Standard)' },
      { dur: 120, label: '2 minutes' },
      { dur: 300, label: '5 minutes' },
      { dur: 0, label: 'Unlimited mode' },
    ];
    timerDurations.forEach(({ dur, label }) => {
      list.push({
        id: `timer-${dur}`,
        title: `Set Timer: ${label}`,
        category: 'Timer',
        icon: <Clock size={14} />,
        action: () => {
          updateSettings({ timerDuration: dur });
          resetTest();
          onClose();
        },
      });
    });

    return list;
  }, [availableThemes, setThemeById, state.settings, updateSettings, loadNewSnippet, resetTest, onClose]);

  const filtered = useMemo(() => {
    if (!query.trim()) return commands;
    const lower = query.toLowerCase();
    return commands.filter(
      (cmd) => cmd.title.toLowerCase().includes(lower) || cmd.category.toLowerCase().includes(lower)
    );
  }, [commands, query]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filtered.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % Math.max(1, filtered.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        filtered[selectedIndex].action();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-center pt-10"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.45)' }}
      onClick={onClose}
    >
      <div
        className="w-[560px] max-h-[420px] rounded-md shadow-2xl flex flex-col overflow-hidden animate-slide-up"
        style={{
          backgroundColor: c.dropdownBg || c.sidebarBg,
          border: `1px solid ${c.focusBorder}`,
          color: c.dropdownFg || c.sidebarFg,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input */}
        <div
          className="flex items-center px-3 py-2 border-b"
          style={{ borderColor: c.border }}
        >
          <Search size={16} className="opacity-50 mr-2 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a command or search (e.g. theme, python, timer)..."
            className="flex-1 bg-transparent text-sm outline-none font-mono"
            style={{ color: c.dropdownFg || c.sidebarFg }}
          />
          <kbd
            className="text-[10px] px-1.5 py-0.5 rounded opacity-50 ml-2"
            style={{ backgroundColor: c.inputBg }}
          >
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-1 text-xs">
          {filtered.length === 0 ? (
            <div className="py-6 text-center opacity-40">No matching commands</div>
          ) : (
            filtered.map((cmd, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={cmd.id}
                  onClick={() => cmd.action()}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className="flex items-center justify-between px-3 py-2 rounded cursor-pointer transition-colors"
                  style={{
                    backgroundColor: isSelected ? c.buttonBg : 'transparent',
                    color: isSelected ? c.buttonFg : c.dropdownFg || c.sidebarFg,
                  }}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="opacity-70">{cmd.icon}</span>
                    <span className="truncate">{cmd.title}</span>
                  </div>
                  <span
                    className="text-[10px] uppercase font-semibold tracking-wider ml-2 shrink-0 opacity-60"
                  >
                    {cmd.category}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

