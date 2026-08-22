import { useContext } from 'react';
import { ThemeContext } from './theme-store';

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within ThemeProviderWrapper');
  }

  return context;
};
