'use client';

import { createContext, useContext, useEffect, useMemo, useSyncExternalStore, type ReactNode } from 'react';
import { getRawStorageItem, setRawStorageItem, storageKeys } from '@/utils/storage';

export type ThemeMode = 'light' | 'dark';

export interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useThemeContext = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within ThemeProviderWrapper');
  }
  return context;
};

const THEME_MODE_EVENT = 'qr-theme-mode';

function subscribeThemeMode(onChange: () => void) {
  window.addEventListener(THEME_MODE_EVENT, onChange);
  return () => window.removeEventListener(THEME_MODE_EVENT, onChange);
}

// The raw stored string is a stable snapshot.
const getThemeModeSnapshot = () => getRawStorageItem(storageKeys.themeMode);
// The server can't see localStorage, so server render and hydration always use
// 'light' (no hydration mismatch); the stored preference is applied right after.
const getThemeModeServerSnapshot = () => null;

function toggleTheme() {
  const current: ThemeMode = getThemeModeSnapshot() === 'dark' ? 'dark' : 'light';
  setRawStorageItem(storageKeys.themeMode, current === 'light' ? 'dark' : 'light');
  window.dispatchEvent(new Event(THEME_MODE_EVENT));
}

export function ThemeProviderWrapper({ children }: { children: ReactNode }) {
  const raw = useSyncExternalStore(subscribeThemeMode, getThemeModeSnapshot, getThemeModeServerSnapshot);
  const mode: ThemeMode = raw === 'dark' ? 'dark' : 'light';

  useEffect(() => {
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [mode]);

  const value = useMemo(
    () => ({
      mode,
      toggleTheme,
    }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={value}>
      <div className="flex min-h-full flex-1 flex-col">{children}</div>
    </ThemeContext.Provider>
  );
}
