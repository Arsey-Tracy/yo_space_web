import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ThemeState {
  darkMode: boolean;
  toggle: () => void;
  setDarkMode: (value: boolean) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      darkMode: false,
      toggle: () => set({ darkMode: !get().darkMode }),
      setDarkMode: (value: boolean) => set({ darkMode: value }),
    }),
    { name: 'theme-storage' }
  )
);
