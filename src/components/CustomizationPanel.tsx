import { Palette } from 'lucide-react';
import { CustomColors } from '../types';

interface CustomizationPanelProps {
  colors: CustomColors;
  onColorsChange: (colors: CustomColors) => void;
}

export function CustomizationPanel({ colors, onColorsChange }: CustomizationPanelProps) {
  const updateColor = (key: keyof CustomColors, value: string) => {
    onColorsChange({ ...colors, [key]: value });
  };

  const resetColors = () => {
    onColorsChange({
      background: '#f1f5f9',
      text: '#1f2937',
      card: '#ffffff',
      accent: '#3b82f6'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
        <Palette size={20} />
        Customization
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Background Color
          </label>
          <div className="flex gap-2">
            <input
              type="color"
              value={colors.background}
              onChange={(e) => updateColor('background', e.target.value)}
              className="w-12 h-12 rounded border border-gray-300 cursor-pointer"
            />
            <input
              type="text"
              value={colors.background}
              onChange={(e) => updateColor('background', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Text Color
          </label>
          <div className="flex gap-2">
            <input
              type="color"
              value={colors.text}
              onChange={(e) => updateColor('text', e.target.value)}
              className="w-12 h-12 rounded border border-gray-300 cursor-pointer"
            />
            <input
              type="text"
              value={colors.text}
              onChange={(e) => updateColor('text', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card Background Color
          </label>
          <div className="flex gap-2">
            <input
              type="color"
              value={colors.card}
              onChange={(e) => updateColor('card', e.target.value)}
              className="w-12 h-12 rounded border border-gray-300 cursor-pointer"
            />
            <input
              type="text"
              value={colors.card}
              onChange={(e) => updateColor('card', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Accent Color
          </label>
          <div className="flex gap-2">
            <input
              type="color"
              value={colors.accent}
              onChange={(e) => updateColor('accent', e.target.value)}
              className="w-12 h-12 rounded border border-gray-300 cursor-pointer"
            />
            <input
              type="text"
              value={colors.accent}
              onChange={(e) => updateColor('accent', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          onClick={resetColors}
          className="w-full px-4 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
        >
          Reset to Default Colors
        </button>
      </div>
    </div>
  );
}
