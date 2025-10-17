import { useState, useEffect } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';
export type LayoutDensity = 'compact' | 'spacious';

export interface BackgroundConfig {
  type: 'color' | 'gradient' | 'image';
  value: string;
  gradientStart?: string;
  gradientEnd?: string;
  gradientType?: 'linear' | 'radial';
}

export interface ThemeConfig {
  mode: ThemeMode;
  density: LayoutDensity;
  background: BackgroundConfig;
}

const THEME_STORAGE_KEY = 'grade-mixer-theme';

const defaultTheme: ThemeConfig = {
  mode: 'system',
  density: 'spacious',
  background: {
    type: 'color',
    value: '#f1f5f9'
  }
};

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getEffectiveTheme(mode: ThemeMode): 'light' | 'dark' {
  if (mode === 'system') return getSystemTheme();
  return mode;
}

export function useTheme() {
  const [theme, setTheme] = useState<ThemeConfig>(() => {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return defaultTheme;
      }
    }
    return defaultTheme;
  });

  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>(() =>
    getEffectiveTheme(theme.mode)
  );

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(theme));
  }, [theme]);

  useEffect(() => {
    setEffectiveTheme(getEffectiveTheme(theme.mode));

    if (theme.mode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = (e: MediaQueryListEvent) => {
        setEffectiveTheme(e.matches ? 'dark' : 'light');
      };

      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }
  }, [theme.mode]);

  const updateTheme = (updates: Partial<ThemeConfig>) => {
    setTheme(prev => ({ ...prev, ...updates }));
  };

  const getBackgroundStyle = (): React.CSSProperties => {
    const { background } = theme;

    if (background.type === 'image') {
      return {
        backgroundImage: `url(${background.value})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      };
    }

    if (background.type === 'gradient') {
      const start = background.gradientStart || '#f1f5f9';
      const end = background.gradientEnd || '#e2e8f0';
      const type = background.gradientType || 'linear';

      if (type === 'radial') {
        return {
          background: `radial-gradient(circle at center, ${start}, ${end})`
        };
      }
      return {
        background: `linear-gradient(135deg, ${start}, ${end})`
      };
    }

    return {
      backgroundColor: background.value
    };
  };

  const getColors = () => {
    if (effectiveTheme === 'dark') {
      return {
        background: '#0f172a',
        text: '#e2e8f0',
        card: '#1e293b',
        accent: '#3b82f6',
        border: '#334155'
      };
    }
    return {
      background: '#f1f5f9',
      text: '#1f2937',
      card: '#ffffff',
      accent: '#3b82f6',
      border: '#e5e7eb'
    };
  };

  return {
    theme,
    effectiveTheme,
    updateTheme,
    getBackgroundStyle,
    getColors
  };
}
