import React, { createContext, useContext, useState, useCallback } from 'react';
import { EditorTheme } from '../types/theme';
import { themes, getThemeById } from '../data/themes';

interface ThemeContextValue {
  theme: EditorTheme;
  setThemeById: (id: string) => void;
  availableThemes: EditorTheme[];
}

const ThemeContext = createContext<ThemeContextValue>(null!);

export const useThemeContext = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<EditorTheme>(() => {
    try {
      const savedId = localStorage.getItem('codetype_theme');
      if (savedId) return getThemeById(savedId);
    } catch { /* ignore */ }
    return themes[0];
  });

  const setThemeById = useCallback((id: string) => {
    const newTheme = getThemeById(id);
    setTheme(newTheme);
    try {
      localStorage.setItem('codetype_theme', id);
    } catch { /* ignore */ }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setThemeById, availableThemes: themes }}>
      {children}
    </ThemeContext.Provider>
  );
};

