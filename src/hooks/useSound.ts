import { useState, useEffect, useRef } from 'react';

export type SoundTheme = 'arcade' | 'calm' | 'classroom' | 'digital';

export interface SoundConfig {
  enabled: boolean;
  volume: number;
  theme: SoundTheme;
}

const SOUND_STORAGE_KEY = 'grade-mixer-sound';

const defaultConfig: SoundConfig = {
  enabled: true,
  volume: 0.5,
  theme: 'calm'
};

const soundThemes: Record<SoundTheme, { shuffle: number[]; complete: number[] }> = {
  arcade: {
    shuffle: [440, 554, 659, 880],
    complete: [880, 1047, 1319]
  },
  calm: {
    shuffle: [261, 329, 392, 523],
    complete: [523, 659, 784]
  },
  classroom: {
    shuffle: [349, 415, 493],
    complete: [587, 698, 830]
  },
  digital: {
    shuffle: [800, 1000, 1200],
    complete: [1200, 1400, 1600]
  }
};

export function useSound() {
  const [config, setConfig] = useState<SoundConfig>(() => {
    const stored = localStorage.getItem(SOUND_STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return defaultConfig;
      }
    }
    return defaultConfig;
  });

  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    localStorage.setItem(SOUND_STORAGE_KEY, JSON.stringify(config));
  }, [config]);

  const getAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  };

  const playTone = (frequency: number, duration: number, delay: number = 0) => {
    if (!config.enabled) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0, ctx.currentTime + delay);
    gainNode.gain.linearRampToValueAtTime(config.volume * 0.3, ctx.currentTime + delay + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + duration);

    oscillator.start(ctx.currentTime + delay);
    oscillator.stop(ctx.currentTime + delay + duration);
  };

  const playShuffleSound = () => {
    const frequencies = soundThemes[config.theme].shuffle;
    frequencies.forEach((freq, index) => {
      playTone(freq, 0.1, index * 0.05);
    });
  };

  const playCompleteSound = () => {
    const frequencies = soundThemes[config.theme].complete;
    frequencies.forEach((freq, index) => {
      playTone(freq, 0.15, index * 0.1);
    });
  };

  const updateConfig = (updates: Partial<SoundConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const toggleMute = () => {
    setConfig(prev => ({ ...prev, enabled: !prev.enabled }));
  };

  return {
    config,
    updateConfig,
    toggleMute,
    playShuffleSound,
    playCompleteSound
  };
}
