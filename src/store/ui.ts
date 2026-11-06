import { create } from 'zustand';

export type PaletteMode = 'commands' | 'files' | null;
export type Overlay = 'library' | 'forest' | 'settings' | null;

interface UIStore {
  palette: PaletteMode;
  paletteQuery: string;
  overlay: Overlay;
  focused: boolean;
  openPalette: (mode: Exclude<PaletteMode, null>, query?: string) => void;
  closePalette: () => void;
  setOverlay: (overlay: Overlay) => void;
  toggleOverlay: (overlay: Exclude<Overlay, null>) => void;
  setFocused: (f: boolean) => void;
}

export const useUI = create<UIStore>()((set) => ({
  palette: null,
  paletteQuery: '',
  overlay: null,
  focused: false,
  openPalette: (mode, query) =>
    set({ palette: mode, paletteQuery: query ?? (mode === 'commands' ? '>' : '') }),
  closePalette: () => set({ palette: null }),
  setOverlay: (overlay) => set({ overlay }),
  toggleOverlay: (overlay) => set((s) => ({ overlay: s.overlay === overlay ? null : overlay })),
  setFocused: (focused) => set({ focused }),
}));
