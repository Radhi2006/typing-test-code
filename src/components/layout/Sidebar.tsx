import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeContext } from '../../context/ThemeContext';
import { useGameContext } from '../../context/GameContext';
import { LanguageSelector } from '../controls/LanguageSelector';
import { SettingsPanel } from '../panels/SettingsPanel';
import { HistoryPanel } from '../panels/HistoryPanel';
import { LeaderboardPanel } from '../panels/LeaderboardPanel';

const PANEL_TITLES: Record<string, string> = {
  languages: 'EXPLORER: LANGUAGES',
  settings: 'SETTINGS',
  history: 'STATS & HISTORY',
  leaderboard: 'LEADERBOARD',
};

export const Sidebar: React.FC = () => {
  const { theme } = useThemeContext();
  const { state, setActiveSidebarPanel } = useGameContext();
  const c = theme.colors;
  const panel = state.activeSidebarPanel;

  return (
    <AnimatePresence>
      {panel && (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 280, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="shrink-0 overflow-hidden flex flex-col h-full"
          style={{
            backgroundColor: c.sidebarBg,
            borderRight: `1px solid ${c.sidebarBorder}`,
          }}
        >
          {/* Panel Header */}
          <div
            className="flex items-center justify-between px-4 h-[35px] shrink-0 text-[11px] font-semibold tracking-wider uppercase"
            style={{ color: c.sidebarFg }}
          >
            <span className="truncate">{PANEL_TITLES[panel] || ''}</span>
            <button
              onClick={() => setActiveSidebarPanel(panel)}
              className="opacity-60 hover:opacity-100 transition-opacity"
              style={{ color: c.sidebarFg }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Panel Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar px-2 pb-4">
            {panel === 'languages' && <LanguageSelector />}
            {panel === 'settings' && <SettingsPanel />}
            {panel === 'history' && <HistoryPanel />}
            {panel === 'leaderboard' && <LeaderboardPanel />}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

