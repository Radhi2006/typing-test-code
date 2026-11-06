import { DEFAULT_WORLD, type WorldId } from '../garden/worlds';

const THEME_TO_WORLD: Record<string, WorldId> = {
  'dark-plus': 'dusk',
  'one-dark-pro': 'tide',
  dracula: 'dusk',
  'tokyo-night': 'tide',
  'catppuccin-mocha': 'dusk',
  'github-dark-default': 'tide',
  nord: 'aurora',
  'rose-pine-moon': 'dusk',
  monokai: 'autumn',
  'night-owl': 'tide',
  'github-light-default': 'meadow',
  'solarized-light': 'meadow',
};

const DROPPED = ['theme', 'sidebarOpen', 'sidebarView', 'panelOpen', 'showMinimap'];

/** Version 1 stored VS Code themes and workbench layout. */
export function migrateSettings(persisted: unknown, version: number): Record<string, unknown> {
  if (persisted === undefined || persisted === null) return {};
  const state = { ...(persisted as Record<string, unknown>) };
  if (version >= 2) return state;
  const world = THEME_TO_WORLD[String(state.theme)] ?? DEFAULT_WORLD;
  for (const key of DROPPED) delete state[key];
  // the old default was sized for an editor; the new layout has room for more
  if (state.fontSize === 16) state.fontSize = 18;
  return { ...state, world };
}
