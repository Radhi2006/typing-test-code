import React, { useState } from 'react';
import { Files, BarChart2, History, Trophy, Settings } from 'lucide-react';
import { useThemeContext } from '../../context/ThemeContext';
import { useGameContext } from '../../context/GameContext';
import { SidebarPanel } from '../../types/game';

const ITEMS: { icon: React.ElementType; panel: SidebarPanel; label: string }[] = [
  { icon: Files, panel: 'languages', label: 'Languages' },
  { icon: BarChart2, panel: 'history', label: 'Stats & History' },
  { icon: Trophy, panel: 'leaderboard', label: 'Leaderboard' },
  { icon: Settings, panel: 'settings', label: 'Settings' },
];

export const ActivityBar: React.FC = () => {
  const { theme } = useThemeContext();
  const { state, setActiveSidebarPanel } = useGameContext();
  const c = theme.colors;
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <div
      className="flex flex-col items-center w-[48px] shrink-0 py-1"
      style={{
        backgroundColor: c.activityBarBg,
        borderRight: `1px solid ${c.activityBarBorder}`,
      }}
    >
      {ITEMS.map(({ icon: Icon, panel, label }) => {
        const isActive = state.activeSidebarPanel === panel;
        return (
          <div key={panel} className="relative">
            <button
              onClick={() => setActiveSidebarPanel(panel!)}
              onMouseEnter={() => setHoveredItem(panel)}
              onMouseLeave={() => setHoveredItem(null)}
              className="w-[48px] h-[48px] flex items-center justify-center relative transition-colors duration-150"
              style={{
                color: isActive ? c.activityBarActiveFg : c.activityBarFg,
              }}
            >
              {isActive && (
                <div
                  className="absolute left-0 top-1 bottom-1 w-[2px]"
                  style={{ backgroundColor: c.activityBarActiveFg }}
                />
              )}
              <Icon size={22} strokeWidth={1.5} />
            </button>
            {hoveredItem === panel && (
              <div
                className="activity-tooltip text-xs px-2 py-1 rounded"
                style={{ backgroundColor: c.tooltipBg, color: c.tooltipFg }}
              >
                {label}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

