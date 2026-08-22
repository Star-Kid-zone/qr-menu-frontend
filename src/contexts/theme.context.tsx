'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { ThemeContext, type ThemeMode } from './theme-store';
import { getRawStorageItem, setRawStorageItem, storageKeys } from '@/utils/storage.utils';

export function ThemeProviderWrapper({ children }: { children: ReactNode }) {
  // Always starts as 'light', matching what the server renders — reading localStorage
  // during the initial client render (before/instead of this effect) would make that
  // very first client render disagree with the server-rendered HTML and trigger a
  // React hydration mismatch. The real stored preference is applied right after mount
  // instead, via the effect below.
  const [mode, setMode] = useState<ThemeMode>('light');

  useEffect(() => {
    if (getRawStorageItem(storageKeys.themeMode) === 'dark') {
      setMode('dark');
    }
  }, []);

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    setRawStorageItem(storageKeys.themeMode, mode);
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
