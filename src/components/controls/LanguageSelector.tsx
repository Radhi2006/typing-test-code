import React, { useState, useMemo } from 'react';
import { Search, Check, RefreshCw } from 'lucide-react';
import { useThemeContext } from '../../context/ThemeContext';
import { useGameContext } from '../../context/GameContext';
import { ALL_LANGUAGES, LANGUAGE_DISPLAY_NAMES, Language } from '../../types/snippet';
import { getSnippetCount } from '../../data/snippets';

export const LanguageSelector: React.FC = () => {
  const { theme } = useThemeContext();
  const { state, updateSettings, loadNewSnippet } = useGameContext();
  const [search, setSearch] = useState('');
  const c = theme.colors;
  const selected = state.settings.selectedLanguages;
  const snippetCounts = getSnippetCount();

  const toggle = (lang: Language) => {
    let newSelected: Language[];
    if (selected.includes(lang)) {
      if (selected.length === 1) return; // Keep at least one
      newSelected = selected.filter((l) => l !== lang);
    } else {
      newSelected = [...selected, lang];
    }
    updateSettings({ selectedLanguages: newSelected });
  };

  const selectAll = () => {
    updateSettings({ selectedLanguages: [...ALL_LANGUAGES] });
  };

  const selectWeb = () => {
    updateSettings({ selectedLanguages: ['javascript', 'typescript', 'html', 'css'] });
  };

  const selectBackend = () => {
    updateSettings({ selectedLanguages: ['python', 'java', 'go', 'rust', 'csharp'] });
  };

  const filteredLanguages = useMemo(() => {
    if (!search.trim()) return ALL_LANGUAGES;
    const lower = search.toLowerCase();
    return ALL_LANGUAGES.filter(
      (lang) =>
        LANGUAGE_DISPLAY_NAMES[lang].toLowerCase().includes(lower) ||
        lang.toLowerCase().includes(lower)
    );
  }, [search]);

  return (
    <div className="py-2 px-1 text-xs select-none">
      {/* Header Info */}
      <div className="flex items-center justify-between px-2 mb-2 opacity-70 text-[11px]">
        <span>Selected</span>
        <span className="font-semibold" style={{ color: c.buttonBg }}>
          {selected.length} of {ALL_LANGUAGES.length}
        </span>
      </div>

      {/* Quick Presets */}
      <div className="grid grid-cols-2 gap-1 mb-2 px-1">
        <button
          onClick={selectAll}
          className="py-1 px-2 rounded text-[10px] font-medium transition-colors border"
          style={{
            backgroundColor: selected.length === ALL_LANGUAGES.length ? c.buttonBg : c.inputBg,
            color: selected.length === ALL_LANGUAGES.length ? c.buttonFg : c.inputFg,
            borderColor: c.inputBorder,
          }}
        >
          All Languages
        </button>
        <button
          onClick={selectWeb}
          className="py-1 px-2 rounded text-[10px] font-medium transition-colors border"
          style={{
            backgroundColor: c.inputBg,
            color: c.inputFg,
            borderColor: c.inputBorder,
          }}
        >
          Web Stack (JS/TS)
        </button>
        <button
          onClick={selectBackend}
          className="py-1 px-2 rounded text-[10px] font-medium transition-colors border"
          style={{
            backgroundColor: c.inputBg,
            color: c.inputFg,
            borderColor: c.inputBorder,
          }}
        >
          Backend Stack
        </button>
        <button
          onClick={() => updateSettings({ selectedLanguages: ['javascript'] })}
          className="py-1 px-2 rounded text-[10px] font-medium transition-colors border"
          style={{
            backgroundColor: c.inputBg,
            color: c.inputFg,
            borderColor: c.inputBorder,
          }}
        >
          JS Only
        </button>
      </div>

      {/* Search Input */}
      <div
        className="flex items-center px-2 py-1 rounded mx-1 mb-2 border"
        style={{
          backgroundColor: c.inputBg,
          borderColor: c.inputBorder,
          color: c.inputFg,
        }}
      >
        <Search size={12} className="opacity-50 mr-1.5 shrink-0" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter languages..."
          className="bg-transparent text-[11px] outline-none w-full font-mono"
          style={{ color: c.inputFg }}
        />
      </div>

      {/* Language Checkboxes */}
      <div className="space-y-0.5 max-h-[380px] overflow-y-auto custom-scrollbar px-1">
        {filteredLanguages.map((lang) => {
          const isSelected = selected.includes(lang);
          const count = snippetCounts[lang] || 0;
          return (
            <div
              key={lang}
              onClick={() => toggle(lang)}
              className="flex items-center justify-between px-2.5 py-1.5 rounded cursor-pointer transition-colors group"
              style={{
                backgroundColor: isSelected ? `${c.focusBorder}20` : 'transparent',
                color: c.sidebarFg,
              }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-3.5 h-3.5 rounded flex items-center justify-center border transition-all"
                  style={{
                    backgroundColor: isSelected ? c.buttonBg : 'transparent',
                    borderColor: isSelected ? c.buttonBg : c.inputBorder,
                  }}
                >
                  {isSelected && <Check size={10} style={{ color: c.buttonFg }} />}
                </div>
                <span className="font-medium">{LANGUAGE_DISPLAY_NAMES[lang]}</span>
              </div>

              <span className="text-[10px] opacity-40 group-hover:opacity-80">
                {count} snippets
              </span>
            </div>
          );
        })}
      </div>

      {/* Action: Next Snippet */}
      <div className="mt-3 px-1">
        <button
          onClick={loadNewSnippet}
          className="w-full flex items-center justify-center gap-2 py-2 rounded text-xs font-semibold shadow-sm transition-all hover:brightness-110 active:scale-[0.98]"
          style={{ backgroundColor: c.buttonBg, color: c.buttonFg }}
        >
          <RefreshCw size={13} />
          Load Random Snippet
        </button>
      </div>
    </div>
  );
};
