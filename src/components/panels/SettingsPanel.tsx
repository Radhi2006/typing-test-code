import React from 'react';
import { useThemeContext } from '../../context/ThemeContext';
import { useGameContext } from '../../context/GameContext';
import { TimerDuration } from '../../types/game';
import { Difficulty } from '../../types/snippet';

const TIMER_OPTIONS: { value: TimerDuration; label: string }[] = [
  { value: 15, label: '15s' },
  { value: 30, label: '30s' },
  { value: 60, label: '60s' },
  { value: 120, label: '2m' },
  { value: 300, label: '5m' },
  { value: 0, label: '∞' },
];

const DIFFICULTY_OPTIONS: { value: Difficulty | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
];

const FONT_SIZES = [12, 13, 14, 15, 16, 17, 18, 20, 22, 24];

export const SettingsPanel: React.FC = () => {
  const { theme, setThemeById, availableThemes } = useThemeContext();
  const { state, updateSettings, loadNewSnippet } = useGameContext();
  const c = theme.colors;
  const settings = state.settings;

  const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="text-[10px] font-semibold tracking-wider uppercase mt-4 mb-2 first:mt-0 opacity-60" style={{ color: c.sidebarFg }}>
      {children}
    </div>
  );

  const ToggleRow: React.FC<{ label: string; checked: boolean; onChange: (v: boolean) => void }> = ({ label, checked, onChange }) => (
    <div className="flex items-center justify-between py-1.5 text-xs" style={{ color: c.sidebarFg }}>
      <span>{label}</span>
      <button
        onClick={() => onChange(!checked)}
        className="w-9 h-5 rounded-full relative transition-colors"
        style={{ backgroundColor: checked ? c.buttonBg : c.inputBg }}
      >
        <div
          className="w-3.5 h-3.5 rounded-full absolute top-[3px] transition-all duration-200"
          style={{
            backgroundColor: checked ? c.buttonFg : c.inputFg,
            left: checked ? '18px' : '3px',
          }}
        />
      </button>
    </div>
  );

  return (
    <div className="py-2 px-2 text-xs">
      {/* Timer */}
      <SectionTitle>Timer Duration</SectionTitle>
      <div className="flex flex-wrap gap-1">
        {TIMER_OPTIONS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => updateSettings({ timerDuration: value })}
            className="px-2.5 py-1 rounded text-[11px] transition-colors"
            style={{
              backgroundColor: settings.timerDuration === value ? c.buttonBg : c.inputBg,
              color: settings.timerDuration === value ? c.buttonFg : c.inputFg,
              border: `1px solid ${settings.timerDuration === value ? c.buttonBg : c.inputBorder}`,
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Difficulty */}
      <SectionTitle>Difficulty</SectionTitle>
      <div className="flex flex-wrap gap-1">
        {DIFFICULTY_OPTIONS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => { updateSettings({ difficulty: value }); }}
            className="px-2.5 py-1 rounded text-[11px] transition-colors"
            style={{
              backgroundColor: settings.difficulty === value ? c.buttonBg : c.inputBg,
              color: settings.difficulty === value ? c.buttonFg : c.inputFg,
              border: `1px solid ${settings.difficulty === value ? c.buttonBg : c.inputBorder}`,
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Theme */}
      <SectionTitle>Theme</SectionTitle>
      <select
        value={theme.id}
        onChange={(e) => setThemeById(e.target.value)}
        className="w-full px-2 py-1.5 rounded text-xs"
        style={{
          backgroundColor: c.inputBg,
          color: c.inputFg,
          border: `1px solid ${c.inputBorder}`,
        }}
      >
        {availableThemes.map((t) => (
          <option key={t.id} value={t.id}>{t.name}</option>
        ))}
      </select>

      {/* Font Size */}
      <SectionTitle>Font Size</SectionTitle>
      <select
        value={settings.fontSize}
        onChange={(e) => updateSettings({ fontSize: Number(e.target.value) })}
        className="w-full px-2 py-1.5 rounded text-xs"
        style={{
          backgroundColor: c.inputBg,
          color: c.inputFg,
          border: `1px solid ${c.inputBorder}`,
        }}
      >
        {FONT_SIZES.map((s) => (
          <option key={s} value={s}>{s}px</option>
        ))}
      </select>

      {/* Tab Size */}
      <SectionTitle>Tab Size</SectionTitle>
      <div className="flex gap-1">
        {([2, 4] as const).map((size) => (
          <button
            key={size}
            onClick={() => updateSettings({ tabSize: size })}
            className="px-3 py-1 rounded text-[11px] transition-colors"
            style={{
              backgroundColor: settings.tabSize === size ? c.buttonBg : c.inputBg,
              color: settings.tabSize === size ? c.buttonFg : c.inputFg,
              border: `1px solid ${settings.tabSize === size ? c.buttonBg : c.inputBorder}`,
            }}
          >
            {size} spaces
          </button>
        ))}
      </div>

      {/* Toggles */}
      <SectionTitle>Preferences</SectionTitle>
      <ToggleRow label="Show Minimap" checked={settings.showMinimap} onChange={(v) => updateSettings({ showMinimap: v })} />
      <ToggleRow label="Smooth Cursor" checked={settings.smoothCursor} onChange={(v) => updateSettings({ smoothCursor: v })} />
      <ToggleRow label="Sound Effects" checked={settings.soundEnabled} onChange={(v) => updateSettings({ soundEnabled: v })} />

      {/* Apply */}
      <div className="mt-4">
        <button
          onClick={loadNewSnippet}
          className="w-full py-1.5 rounded font-medium text-xs transition-colors"
          style={{ backgroundColor: c.buttonBg, color: c.buttonFg }}
        >
          Apply & Load New Snippet
        </button>
      </div>
    </div>
  );
};

