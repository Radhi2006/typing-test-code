import React from 'react';
import { Trash2, Clock, Zap, Target } from 'lucide-react';
import { useThemeContext } from '../../context/ThemeContext';
import { getHistory, clearHistory, getUserStats } from '../../utils/storage';
import { LANGUAGE_DISPLAY_NAMES } from '../../types/snippet';
import { formatTime } from '../../utils/wpm';

export const HistoryPanel: React.FC = () => {
  const { theme } = useThemeContext();
  const c = theme.colors;
  const [history, setHistory] = React.useState(getHistory());
  const stats = getUserStats();

  const handleClear = () => {
    clearHistory();
    setHistory([]);
  };

  return (
    <div className="py-2 px-2 text-xs">
      {/* Overall Stats */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="rounded p-2 text-center" style={{ backgroundColor: c.inputBg }}>
          <div className="text-[10px] opacity-50 flex items-center justify-center gap-1">
            <Zap size={10} /> Best WPM
          </div>
          <div className="text-lg font-bold" style={{ color: c.buttonBg }}>
            {stats.bestWpm > 0 ? Math.round(stats.bestWpm) : '-'}
          </div>
        </div>
        <div className="rounded p-2 text-center" style={{ backgroundColor: c.inputBg }}>
          <div className="text-[10px] opacity-50 flex items-center justify-center gap-1">
            <Target size={10} /> Avg Accuracy
          </div>
          <div className="text-lg font-bold" style={{ color: c.buttonBg }}>
            {stats.totalTests > 0 ? `${stats.averageAccuracy.toFixed(1)}%` : '-'}
          </div>
        </div>
        <div className="rounded p-2 text-center" style={{ backgroundColor: c.inputBg }}>
          <div className="text-[10px] opacity-50">Tests</div>
          <div className="text-sm font-bold">{stats.totalTests}</div>
        </div>
        <div className="rounded p-2 text-center" style={{ backgroundColor: c.inputBg }}>
          <div className="text-[10px] opacity-50 flex items-center justify-center gap-1">
            <Clock size={10} /> Time
          </div>
          <div className="text-sm font-bold">{formatTime(stats.totalTimeSpent)}</div>
        </div>
      </div>

      {/* History List */}
      <div className="text-[10px] font-semibold tracking-wider uppercase mb-2 opacity-60" style={{ color: c.sidebarFg }}>
        Recent Tests
      </div>

      {history.length === 0 ? (
        <div className="text-center py-8 opacity-40" style={{ color: c.sidebarFg }}>
          No tests yet. Start typing!
        </div>
      ) : (
        <div className="space-y-1.5">
          {history.slice().reverse().slice(0, 30).map((entry) => (
            <div
              key={entry.id}
              className="rounded p-2 space-y-1"
              style={{ backgroundColor: c.inputBg }}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium truncate flex-1">{entry.snippetTitle}</span>
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded ml-2 shrink-0"
                  style={{ backgroundColor: c.badgeBg, color: c.badgeFg }}
                >
                  {LANGUAGE_DISPLAY_NAMES[entry.language]}
                </span>
              </div>
              <div className="flex items-center gap-3 text-[10px] opacity-70">
                <span className="font-semibold" style={{ color: c.buttonBg }}>
                  {Math.round(entry.wpm)} WPM
                </span>
                <span>{entry.accuracy.toFixed(1)}%</span>
                <span>{Math.round(entry.timeElapsed)}s</span>
                <span className="ml-auto opacity-50">
                  {new Date(entry.date).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Clear button */}
      {history.length > 0 && (
        <button
          onClick={handleClear}
          className="w-full mt-4 py-1.5 rounded text-xs flex items-center justify-center gap-1 transition-colors opacity-60 hover:opacity-100"
          style={{
            backgroundColor: c.inputBg,
            color: c.incorrect,
            border: `1px solid ${c.inputBorder}`,
          }}
        >
          <Trash2 size={12} />
          Clear History
        </button>
      )}
    </div>
  );
};

