import { Volume2, VolumeX } from 'lucide-react';
import { SoundConfig, SoundTheme } from '../hooks/useSound';

interface SoundsPanelProps {
  config: SoundConfig;
  onConfigChange: (updates: Partial<SoundConfig>) => void;
}

const soundThemes: Array<{ value: SoundTheme; label: string; description: string }> = [
  { value: 'arcade', label: 'Arcade', description: 'Fast pops + synth ding' },
  { value: 'calm', label: 'Calm', description: 'Soft chime + swish' },
  { value: 'classroom', label: 'Classroom', description: 'Chalk swipe + bell' },
  { value: 'digital', label: 'Digital', description: 'Techy blip + tone' }
];

export function SoundsPanel({ config, onConfigChange }: SoundsPanelProps) {
  return (
    <div className="space-y-6">
      <div>
        <label className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-700">Sound Effects</span>
          <button
            onClick={() => onConfigChange({ enabled: !config.enabled })}
            className={`p-2 rounded-lg transition-colors ${
              config.enabled ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
            }`}
          >
            {config.enabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Volume
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={config.volume}
          onChange={(e) => onConfigChange({ volume: parseFloat(e.target.value) })}
          disabled={!config.enabled}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0%</span>
          <span>{Math.round(config.volume * 100)}%</span>
          <span>100%</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Sound Theme</label>
        <div className="space-y-2">
          {soundThemes.map((theme) => (
            <button
              key={theme.value}
              onClick={() => onConfigChange({ theme: theme.value })}
              disabled={!config.enabled}
              className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${
                config.theme === theme.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              } ${!config.enabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="font-medium text-sm">{theme.label}</div>
              <div className="text-xs text-gray-500 mt-1">{theme.description}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
