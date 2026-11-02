import React from 'react';
import { Terminal, Minus, Square, X, Search, Command } from 'lucide-react';
import { useThemeContext } from '../../context/ThemeContext';
import { useGameContext } from '../../context/GameContext';

interface HeaderProps {
  onOpenCommandPalette?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCommandPalette }) => {
  const { theme } = useThemeContext();
  const { state } = useGameContext();
  const c = theme.colors;
  const snippet = state.currentSnippet;

  const menuItems = ['File', 'Edit', 'Selection', 'View', 'Go', 'Run', 'Terminal', 'Help'];

  return (
    <div
      className="flex items-center justify-between px-3 h-[36px] shrink-0 select-none text-xs border-b"
      style={{
        backgroundColor: c.titleBarBg,
        color: c.titleBarFg,
        borderColor: c.tabBorder || c.border,
      }}
    >
      {/* Left side: macOS dots + Menu items */}
      <div className="flex items-center gap-4">
        {/* macOS dots */}
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57] hover:brightness-110 cursor-pointer" />
          <div className="w-3 h-3 rounded-full bg-[#febc2e] hover:brightness-110 cursor-pointer" />
          <div className="w-3 h-3 rounded-full bg-[#28c840] hover:brightness-110 cursor-pointer" />
        </div>

        {/* Menu Items (VS Code style) */}
        <div className="hidden md:flex items-center gap-2 text-[11px] opacity-80">
          <Terminal size={13} className="text-blue-400 mr-1" />
          {menuItems.map((item) => (
            <span
              key={item}
              className="px-1.5 py-0.5 rounded cursor-pointer hover:bg-white/10 transition-colors"
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Center: Command Palette Search Bar */}
      <button
        onClick={onOpenCommandPalette}
        className="flex items-center justify-center gap-2 px-4 py-1 rounded text-[11px] max-w-[420px] w-full mx-2 transition-all hover:ring-1"
        style={{
          backgroundColor: c.inputBg,
          color: c.inputFg,
          border: `1px solid ${c.inputBorder}`,
          outlineColor: c.focusBorder,
        }}
        title="Open Command Palette (Ctrl+Shift+P / F1)"
      >
        <Search size={12} className="opacity-60 shrink-0" />
        <span className="truncate opacity-80">
          {snippet ? `${snippet.title} — CodeType` : 'CodeType — Coding Typing Test'}
        </span>
        <div className="flex items-center gap-0.5 ml-auto opacity-50 text-[10px] shrink-0 font-sans">
          <Command size={10} />
          <span>Shift+P</span>
        </div>
      </button>

      {/* Right side: Window controls */}
      <div className="flex items-center gap-3 opacity-60">
        <button
          onClick={onOpenCommandPalette}
          className="hover:opacity-100 p-1 rounded hover:bg-white/10 text-[10px] hidden sm:block"
          title="Command Palette"
        >
          Palette
        </button>
        <Minus size={13} className="cursor-pointer hover:opacity-100" />
        <Square size={11} className="cursor-pointer hover:opacity-100" />
        <X size={13} className="cursor-pointer hover:opacity-100" />
      </div>
    </div>
  );
};
