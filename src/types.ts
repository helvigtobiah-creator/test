export type Gender = 'm' | 'f';
export type Grade = 9 | 10 | 11 | 12;
export type MixMode = 'balanced' | 'random';
export type TimerMode = 'stopwatch' | 'countdown';
export type SoundEvent = 'shuffleStart' | 'shuffleLoop' | 'shuffleEnd' | 'click' | 'error';
export type SoundType = 'cardShuffle' | 'swish' | 'tick' | 'softDing' | 'chime' | 'pop' | 'none';

export interface Student {
  grade: Grade;
  gender: Gender;
  first: string;
  last: string;
  email: string;
  full: string;
}

export interface Group {
  name: string;
  students: Student[];
}

export interface SoundSettings {
  enabled: boolean;
  volume: number;
  events: Record<SoundEvent, SoundType>;
}

export interface TimerSettings {
  enabled: boolean;
  mode: TimerMode;
  countdownMinutes: number;
  countdownSeconds: number;
}

export interface AppSettings {
  numGroups: number;
  groupNames: string[];
  mixMode: MixMode;
  miniAnimation: boolean;
  timer: TimerSettings;
  sound: SoundSettings;
  seed: string;
  darkMode: boolean;
}

export interface GroupingResult {
  groups: Group[];
  ok: boolean;
  reasons: string[];
}

export interface HistoryEntry {
  groups: Group[];
  seed: string;
  timestamp: number;
}
