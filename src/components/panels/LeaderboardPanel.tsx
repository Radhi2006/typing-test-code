import React, { useState } from 'react';
import { Trophy, Medal } from 'lucide-react';
import { useThemeContext } from '../../context/ThemeContext';
import { getLeaderboard } from '../../utils/storage';
import { ALL_LANGUAGES, LANGUAGE_DISPLAY_NAMES, Language } from '../../types/snippet';

export const LeaderboardPanel: React.FC = () => {
  const { theme } = useThemeContext();
  const c = theme.colors;
  const [filter, setFilter] = useState<Language | 'all'>('all');
  const leaderboard = getLeaderboard();

  const filtered = filter === 'all'
    ? leaderboard
    : leaderboard.filter((e) => e.language === filter);

  const sorted = [...filtered].sort((a, b) => b.wpm - a.wpm).slice(0, 20);

  const getRankIcon = (rank: number) => {
    if (rank === 0) return <Trophy size={14} className="text-yellow-400" />;
    if (rank === 1) return <Medal size={14} className="text-gray-300" />;
    if (rank === 2) return <Medal size={14} className="text-amber-600" />;
    return <span className="text-[10px] opacity-40 w-[14px] text-center">{rank + 1}</span>;
  };

  return (
    <div className="py-2 px-2 text-xs">
      {/* Filter */}
      <div className="mb-3">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as Language | 'all')}
          className="w-full px-2 py-1.5 rounded text-xs"
          style={{
            backgroundColor: c.inputBg,
            color: c.inputFg,
            border: `1px solid ${c.inputBorder}`,
          }}
        >
          <option value="all">All Languages</option>
          {ALL_LANGUAGES.map((lang) => (
            <option key={lang} value={lang}>{LANGUAGE_DISPLAY_NAMES[lang]}</option>
          ))}
        </select>
      </div>

      {/* Leaderboard */}
      {sorted.length === 0 ? (
        <div className="text-center py-8 opacity-40" style={{ color: c.sidebarFg }}>
          No scores yet. Complete a test!
        </div>
      ) : (
        <div className="space-y-1">
          {sorted.map((entry, idx) => (
            <div
              key={entry.id}
              className="flex items-center gap-2 rounded p-2"
              style={{
                backgroundColor: idx === 0 ? `${c.buttonBg}15` : c.inputBg,
                border: idx === 0 ? `1px solid ${c.buttonBg}30` : '1px solid transparent',
              }}
            >
              <div className="w-5 shrink-0 flex justify-center">
                {getRankIcon(idx)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{entry.snippetTitle}</div>
                <div className="text-[10px] opacity-50 flex gap-2">
                  <span>{LANGUAGE_DISPLAY_NAMES[entry.language]}</span>
                  <span>{entry.accuracy.toFixed(1)}%</span>
                  <span>{new Date(entry.date).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="font-bold text-sm shrink-0" style={{ color: c.buttonBg }}>
                {Math.round(entry.wpm)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

