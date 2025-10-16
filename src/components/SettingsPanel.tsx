import { Settings as SettingsIcon, Plus, Minus, RotateCcw } from 'lucide-react';
import { Settings } from '../types';

interface SettingsPanelProps {
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
  onReset: () => void;
}

export function SettingsPanel({ settings, onSettingsChange, onReset }: SettingsPanelProps) {
  const updateNumGroups = (delta: number) => {
    const newNum = Math.max(1, Math.min(12, settings.numGroups + delta));
    const newNames = [...settings.groupNames];

    while (newNames.length < newNum) {
      newNames.push(`Group ${newNames.length + 1}`);
    }

    onSettingsChange({
      ...settings,
      numGroups: newNum,
      groupNames: newNames.slice(0, newNum)
    });
  };

  const updateGroupName = (index: number, name: string) => {
    const newNames = [...settings.groupNames];
    newNames[index] = name;
    onSettingsChange({ ...settings, groupNames: newNames });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
        <SettingsIcon size={20} />
        Settings
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Groups
          </label>
          <div className="flex items-center gap-3">
            <button
              onClick={() => updateNumGroups(-1)}
              className="p-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
            >
              <Minus size={16} />
            </button>
            <span className="text-2xl font-bold text-gray-800 w-12 text-center">
              {settings.numGroups}
            </span>
            <button
              onClick={() => updateNumGroups(1)}
              className="p-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Group Names
          </label>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {settings.groupNames.map((name, idx) => (
              <input
                key={idx}
                type="text"
                value={name}
                onChange={(e) => updateGroupName(idx, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={`Group ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        <button
          onClick={onReset}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
        >
          <RotateCcw size={18} />
          Reset All Settings
        </button>
      </div>
    </div>
  );
}
