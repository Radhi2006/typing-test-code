import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { DEFAULT_WORLD, type WorldId } from '../garden/worlds';
import type { DifficultyFilter, LangFilter } from '../snippets';
import { migrateSettings } from './migrate';

export type Mode = 'snippet' | 'time';
export type CaretStyle = 'line' | 'block' | 'underline';
export type SceneLevel = 'full' | 'calm';

export interface Settings {
  world: WorldId;
  scene: SceneLevel;
  lang: LangFilter;
  difficulty: DifficultyFilter;
  mode: Mode;
  timeLimit: 15 | 30 | 60 | 120;
  autoIndent: boolean;
  caretStyle: CaretStyle;
  smoothCaret: boolean;
  fontSize: number;
  showWhitespace: boolean;
}

interface SettingsStore extends Settings {
  set: (patch: Partial<Settings>) => void;
}

export const DEFAULT_SETTINGS: Settings = {
  world: DEFAULT_WORLD,
  scene: 'full',
  lang: 'all',
  difficulty: 'all',
  mode: 'snippet',
  timeLimit: 60,
  autoIndent: true,
  caretStyle: 'line',
  smoothCaret: true,
  fontSize: 18,
  showWhitespace: false,
};

function safeStorage() {
  try {
    const k = '__codetype_probe__';
    localStorage.setItem(k, '1');
    localStorage.removeItem(k);
    return localStorage;
  } catch {
    const mem = new Map<string, string>();
    return {
      getItem: (k: string) => mem.get(k) ?? null,
      setItem: (k: string, v: string) => void mem.set(k, v),
      removeItem: (k: string) => void mem.delete(k),
    };
  }
}

export const storage = createJSONStorage(() => safeStorage());

export const useSettings = create<SettingsStore>()(
  persist(
    (set) => ({
      ...DEFAULT_SETTINGS,
      set: (patch) => set(patch),
    }),
    {
      name: 'codetype-settings',
      storage,
      version: 2,
      migrate: (persisted, version) => migrateSettings(persisted, version) as unknown as SettingsStore,
    },
  ),
);
