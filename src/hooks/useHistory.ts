import { useState, useEffect } from 'react';
import { Group } from '../types';

export interface HistoryEntry {
  id: string;
  timestamp: number;
  groups: Group[];
  seed: string;
}

const HISTORY_STORAGE_KEY = 'grade-mixer-history';
const MAX_HISTORY_ENTRIES = 10;

export function useHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>(() => {
    const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  const addEntry = (groups: Group[]) => {
    const entry: HistoryEntry = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      groups: JSON.parse(JSON.stringify(groups)),
      seed: Math.random().toString(36).substring(7)
    };

    setHistory(prev => {
      const updated = [entry, ...prev];
      return updated.slice(0, MAX_HISTORY_ENTRIES);
    });
  };

  const removeEntry = (id: string) => {
    setHistory(prev => prev.filter(entry => entry.id !== id));
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return {
    history,
    addEntry,
    removeEntry,
    clearHistory
  };
}
