import { WORLDS } from './garden/worlds';
import { pickRandom } from './snippets';
import { LANGUAGES } from './snippets/languages';
import { useSettings, type Settings } from './store/settings';
import { useTest } from './store/test';
import { useUI } from './store/ui';

export interface Command {
  id: string;
  category: string;
  label: string;
  keybinding?: string;
  /** shows a check mark in the palette */
  checked?: () => boolean;
  run: () => void;
}

const S = () => useSettings.getState();
const T = () => useTest.getState();
const U = () => useUI.getState();

export function setAndRestart(patch: Partial<Settings>) {
  S().set(patch);
  T().restart();
}

export function setFilterAndLoad(patch: Partial<Settings>) {
  S().set(patch);
  const { lang, difficulty } = S();
  T().open(pickRandom(lang, difficulty, T().snippet.id));
}

export function closeOverlay() {
  U().setOverlay(null);
  T().requestFocus();
}

export const FONT_MIN = 11;
export const FONT_MAX = 26;

export function changeFontSize(by: number) {
  S().set({ fontSize: Math.min(FONT_MAX, Math.max(FONT_MIN, S().fontSize + by)) });
}

export function getCommands(): Command[] {
  return [
    { id: 'next', category: 'Snippet', label: 'Next random snippet', keybinding: 'Ctrl+Enter', run: () => T().next() },
    { id: 'restart', category: 'Snippet', label: 'Restart', keybinding: 'Esc', run: () => T().restart() },
    {
      id: 'goto',
      category: 'Snippet',
      label: 'Find a snippet by name...',
      keybinding: 'Ctrl+P',
      run: () => U().openPalette('files'),
    },
    { id: 'library', category: 'Go to', label: 'Library', keybinding: 'Ctrl+B', run: () => U().setOverlay('library') },
    { id: 'forest', category: 'Go to', label: 'Forest', keybinding: 'Ctrl+J', run: () => U().setOverlay('forest') },
    { id: 'settings', category: 'Go to', label: 'Settings', keybinding: 'Ctrl+,', run: () => U().setOverlay('settings') },
    {
      id: 'lang-all',
      category: 'Language',
      label: 'All languages',
      checked: () => S().lang === 'all',
      run: () => setFilterAndLoad({ lang: 'all' }),
    },
    ...LANGUAGES.map<Command>((l) => ({
      id: `lang-${l.id}`,
      category: 'Language',
      label: l.name,
      checked: () => S().lang === l.id,
      run: () => setFilterAndLoad({ lang: l.id }),
    })),
    ...(['all', 'easy', 'medium', 'hard'] as const).map<Command>((d) => ({
      id: `diff-${d}`,
      category: 'Difficulty',
      label: d === 'all' ? 'Any difficulty' : d[0].toUpperCase() + d.slice(1),
      checked: () => S().difficulty === d,
      run: () => setFilterAndLoad({ difficulty: d }),
    })),
    {
      id: 'mode-snippet',
      category: 'Mode',
      label: 'Snippet (finish the code)',
      checked: () => S().mode === 'snippet',
      run: () => setAndRestart({ mode: 'snippet' }),
    },
    ...([15, 30, 60, 120] as const).map<Command>((t) => ({
      id: `mode-time-${t}`,
      category: 'Mode',
      label: `Timed ${t}s`,
      checked: () => S().mode === 'time' && S().timeLimit === t,
      run: () => setAndRestart({ mode: 'time', timeLimit: t }),
    })),
    ...WORLDS.map<Command>((w) => ({
      id: `world-${w.id}`,
      category: 'World',
      label: w.name,
      checked: () => S().world === w.id,
      run: () => S().set({ world: w.id }),
    })),
    {
      id: 'scene',
      category: 'Settings',
      label: 'Toggle calm scene',
      checked: () => S().scene === 'calm',
      run: () => S().set({ scene: S().scene === 'calm' ? 'full' : 'calm' }),
    },
    {
      id: 'autoindent',
      category: 'Settings',
      label: 'Toggle auto indent',
      checked: () => S().autoIndent,
      run: () => setAndRestart({ autoIndent: !S().autoIndent }),
    },
    {
      id: 'whitespace',
      category: 'Settings',
      label: 'Toggle visible spaces',
      checked: () => S().showWhitespace,
      run: () => S().set({ showWhitespace: !S().showWhitespace }),
    },
    {
      id: 'smooth',
      category: 'Settings',
      label: 'Toggle smooth caret',
      checked: () => S().smoothCaret,
      run: () => S().set({ smoothCaret: !S().smoothCaret }),
    },
    { id: 'zoom-in', category: 'Settings', label: 'Increase font size', keybinding: 'Ctrl+=', run: () => changeFontSize(1) },
    { id: 'zoom-out', category: 'Settings', label: 'Decrease font size', keybinding: 'Ctrl+-', run: () => changeFontSize(-1) },
    ...(['line', 'block', 'underline'] as const).map<Command>((c) => ({
      id: `caret-${c}`,
      category: 'Settings',
      label: `Caret: ${c}`,
      checked: () => S().caretStyle === c,
      run: () => S().set({ caretStyle: c }),
    })),
  ];
}
