import React from 'react';
import { X, FileCode, FileType, FileJson, RotateCcw, SkipForward, ChevronRight, Clock } from 'lucide-react';
import { useThemeContext } from '../../context/ThemeContext';
import { useGameContext } from '../../context/GameContext';
import { LANGUAGE_FILE_EXTENSIONS } from '../../types/snippet';

function getFileIcon(ext: string) {
  if (['.ts', '.tsx'].includes(ext)) return <FileType size={14} className="text-blue-400 shrink-0" />;
  if (['.js', '.jsx'].includes(ext)) return <FileCode size={14} className="text-yellow-400 shrink-0" />;
  if (ext === '.json') return <FileJson size={14} className="text-yellow-300 shrink-0" />;
  if (ext === '.py') return <FileCode size={14} className="text-green-400 shrink-0" />;
  if (ext === '.html') return <FileCode size={14} className="text-orange-400 shrink-0" />;
  if (ext === '.css') return <FileCode size={14} className="text-blue-300 shrink-0" />;
  return <FileCode size={14} className="text-gray-400 shrink-0" />;
}

export const TabBar: React.FC = () => {
  const { theme } = useThemeContext();
  const { state, loadNewSnippet, resetTest } = useGameContext();
  const c = theme.colors;
  const snippet = state.currentSnippet;

  if (!snippet) return null;

  const ext = LANGUAGE_FILE_EXTENSIONS[snippet.language] || '.txt';
  const fileName = snippet.title.toLowerCase().replace(/[^a-z0-9]+/g, '_') + ext;

  return (
    <div className="flex flex-col shrink-0 select-none">
      {/* Tab Header Bar */}
      <div
        className="flex items-center h-[35px] overflow-x-auto justify-between border-b"
        style={{
          backgroundColor: c.tabBarBg,
          borderColor: c.tabBorder || c.border,
        }}
      >
        <div className="flex items-center h-full">
          {/* Active Tab */}
          <div
            className="group flex items-center gap-2 px-3 h-full text-xs cursor-default min-w-0 border-r border-t-2"
            style={{
              backgroundColor: c.tabActiveBg,
              color: c.tabActiveFg,
              borderRightColor: c.tabBorder || c.border,
              borderTopColor: c.focusBorder,
            }}
          >
            {getFileIcon(ext)}
            <span className="truncate max-w-[180px] font-medium">{fileName}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                loadNewSnippet();
              }}
              className="ml-1 opacity-60 hover:opacity-100 transition-opacity rounded p-0.5 hover:bg-white/10"
              style={{ color: c.tabActiveFg }}
              title="Close & next snippet (Ctrl+N)"
            >
              <X size={12} />
            </button>
          </div>
        </div>

        {/* Action icons on right side of tab bar */}
        <div className="flex items-center gap-1 px-3 text-xs opacity-75">
          <button
            onClick={resetTest}
            className="p-1 rounded hover:opacity-100 hover:bg-white/10 flex items-center gap-1 transition-colors"
            style={{ color: c.tabInactiveFg }}
            title="Restart Snippet (Ctrl+R)"
          >
            <RotateCcw size={13} />
            <span className="hidden sm:inline text-[10px]">Restart</span>
          </button>
          <button
            onClick={loadNewSnippet}
            className="p-1 rounded hover:opacity-100 hover:bg-white/10 flex items-center gap-1 transition-colors"
            style={{ color: c.tabInactiveFg }}
            title="Next Snippet (Ctrl+N)"
          >
            <SkipForward size={13} />
            <span className="hidden sm:inline text-[10px]">Next</span>
          </button>
        </div>
      </div>

      {/* VS Code Breadcrumb Bar */}
      <div
        className="flex items-center gap-1.5 px-4 h-[24px] text-[11px] border-b opacity-80"
        style={{
          backgroundColor: c.editorBg,
          borderColor: c.tabBorder || c.border,
          color: c.editorFg,
        }}
      >
        <span className="opacity-50">src</span>
        <ChevronRight size={11} className="opacity-40" />
        <span className="opacity-50">{snippet.language}</span>
        <ChevronRight size={11} className="opacity-40" />
        <span className="font-medium">{fileName}</span>
        <ChevronRight size={11} className="opacity-40" />
        <span className="opacity-60 truncate">{snippet.title}</span>

        {/* Right tags */}
        <div className="ml-auto flex items-center gap-2 text-[10px]">
          <span
            className="px-1.5 py-0.5 rounded capitalize"
            style={{ backgroundColor: c.badgeBg, color: c.badgeFg }}
          >
            {snippet.difficulty}
          </span>
          <span className="opacity-50 flex items-center gap-1">
            <Clock size={10} />
            {state.settings.timerDuration > 0 ? `${state.settings.timerDuration}s` : 'Unlimited'}
          </span>
        </div>
      </div>
    </div>
  );
};
