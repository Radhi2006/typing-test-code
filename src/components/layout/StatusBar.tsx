import React from 'react';
import { Zap, CheckCircle, Clock, AlertCircle, GitBranch, Volume2, VolumeX, Bell } from 'lucide-react';
import { useThemeContext } from '../../context/ThemeContext';
import { useGameContext } from '../../context/GameContext';
import { LANGUAGE_DISPLAY_NAMES } from '../../types/snippet';
import { formatTime } from '../../utils/wpm';

interface StatusBarProps {
  wpm: number;
  accuracy: number;
  timeDisplay: number;
  errors: number;
  currentLine: number;
  currentCol: number;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  wpm,
  accuracy,
  timeDisplay,
  errors,
  currentLine,
  currentCol,
}) => {
  const { theme } = useThemeContext();
  const { state, updateSettings } = useGameContext();
  const c = theme.colors;
  const snippet = state.currentSnippet;

  const toggleSound = () => {
    updateSettings({ soundEnabled: !state.settings.soundEnabled });
  };

  return (
    <div
      className="flex items-center justify-between px-3 h-[24px] shrink-0 text-[11px] select-none font-mono"
      style={{
        backgroundColor: c.statusBarBg,
        color: c.statusBarFg,
      }}
    >
      {/* Left side: Git branch & Errors */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 hover:opacity-100 cursor-pointer opacity-90 transition-opacity">
          <GitBranch size={12} />
          <span className="font-sans font-medium">main*</span>
        </div>

        <div
          className="flex items-center gap-1 hover:opacity-100 cursor-pointer opacity-90 transition-opacity"
          title={`${errors} Errors`}
        >
          <AlertCircle size={12} className={errors > 0 ? 'text-red-400' : ''} />
          <span>{errors}</span>
        </div>
      </div>

      {/* Center: Live Typing Metrics */}
      <div className="flex items-center gap-5">
        <div
          className="flex items-center gap-1.5 px-2 py-0.5 rounded cursor-default font-medium"
          style={{ backgroundColor: `${c.editorBg}30` }}
        >
          <Zap size={12} className="text-yellow-400" />
          <span className="font-bold">{Math.round(wpm)}</span>
          <span className="opacity-70 text-[10px]">WPM</span>
        </div>

        <div
          className="flex items-center gap-1.5 px-2 py-0.5 rounded cursor-default font-medium"
          style={{ backgroundColor: `${c.editorBg}30` }}
        >
          <CheckCircle size={12} className="text-emerald-400" />
          <span className="font-bold">{accuracy.toFixed(1)}%</span>
          <span className="opacity-70 text-[10px]">ACC</span>
        </div>

        <div
          className="flex items-center gap-1.5 px-2 py-0.5 rounded cursor-default font-medium"
          style={{ backgroundColor: `${c.editorBg}30` }}
        >
          <Clock size={12} className="text-blue-400" />
          <span className="font-bold">{formatTime(timeDisplay)}</span>
        </div>
      </div>

      {/* Right side: Language, UTF-8, Line/Col, Sound toggle, Bell */}
      <div className="flex items-center gap-3">
        {/* Sound toggle button */}
        <button
          onClick={toggleSound}
          className="flex items-center gap-1 hover:opacity-100 opacity-75 transition-opacity px-1.5 py-0.5 rounded hover:bg-white/10"
          title={`Click to toggle typing sounds (Currently ${state.settings.soundEnabled ? 'ON' : 'OFF'})`}
        >
          {state.settings.soundEnabled ? (
            <Volume2 size={12} className="text-emerald-400" />
          ) : (
            <VolumeX size={12} className="opacity-60" />
          )}
          <span className="text-[10px] hidden sm:inline">
            {state.settings.soundEnabled ? 'Sound' : 'Mute'}
          </span>
        </button>

        {snippet && (
          <span className="font-medium hover:opacity-100 cursor-pointer opacity-90 hidden sm:inline">
            {LANGUAGE_DISPLAY_NAMES[snippet.language]}
          </span>
        )}

        <span className="opacity-75 hidden md:inline">UTF-8</span>
        <span className="opacity-90">
          Ln {currentLine}, Col {currentCol}
        </span>
        <span className="opacity-75 hidden lg:inline">Spaces: {state.settings.tabSize}</span>

        {snippet && (
          <span
            className="px-1.5 py-0 rounded text-[10px] font-semibold uppercase hidden sm:inline"
            style={{ backgroundColor: c.badgeBg, color: c.badgeFg }}
          >
            {snippet.difficulty}
          </span>
        )}

        <Bell size={12} className="opacity-70 hover:opacity-100 cursor-pointer ml-1" />
      </div>
    </div>
  );
};
