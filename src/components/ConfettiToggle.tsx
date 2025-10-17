import { Sparkles } from 'lucide-react';

interface ConfettiToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export function ConfettiToggle({ enabled, onToggle }: ConfettiToggleProps) {
  const prefersReducedMotion = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  return (
    <div className="space-y-3">
      <label className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-gray-700" />
          <span className="text-sm font-medium text-gray-700">Confetti on Shuffle</span>
        </div>
        <button
          onClick={() => onToggle(!enabled)}
          disabled={prefersReducedMotion}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            enabled ? 'bg-blue-600' : 'bg-gray-300'
          } ${prefersReducedMotion ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              enabled ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </label>

      {prefersReducedMotion && (
        <p className="text-xs text-gray-500">
          Confetti disabled due to system motion preferences
        </p>
      )}
    </div>
  );
}
