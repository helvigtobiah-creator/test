import { useEffect } from 'react';

export interface KeyboardShortcuts {
  onReroll?: () => void;
  onSettings?: () => void;
  onCopy?: () => void;
  onMute?: () => void;
}

export function useKeyboard(shortcuts: KeyboardShortcuts, enabled: boolean = true) {
  useEffect(() => {
    if (!enabled) return;

    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement ||
          e.target instanceof HTMLSelectElement) {
        return;
      }

      if (e.ctrlKey || e.metaKey || e.altKey) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case 'r':
          e.preventDefault();
          shortcuts.onReroll?.();
          break;
        case 's':
          e.preventDefault();
          shortcuts.onSettings?.();
          break;
        case 'c':
          e.preventDefault();
          shortcuts.onCopy?.();
          break;
        case 'm':
          e.preventDefault();
          shortcuts.onMute?.();
          break;
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [shortcuts, enabled]);
}
