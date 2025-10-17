import { Palette, RefreshCw } from 'lucide-react';

interface GroupColorsPanelProps {
  groupNames: string[];
  groupColors: Record<number, string>;
  onColorChange: (groupIndex: number, color: string) => void;
  onRandomize: () => void;
}

const colorPalette = [
  '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
  '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1'
];

export function GroupColorsPanel({
  groupNames,
  groupColors,
  onColorChange,
  onRandomize
}: GroupColorsPanelProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <Palette size={18} />
          Group Colors
        </div>
        <button
          onClick={onRandomize}
          className="flex items-center gap-1 px-3 py-1.5 text-xs bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-lg transition-colors"
        >
          <RefreshCw size={14} />
          Randomize
        </button>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {groupNames.map((name, index) => (
          <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
            <input
              type="color"
              value={groupColors[index] || colorPalette[index % colorPalette.length]}
              onChange={(e) => onColorChange(index, e.target.value)}
              className="w-10 h-10 rounded cursor-pointer flex-shrink-0"
            />
            <span className="text-sm text-gray-700 flex-1 truncate">{name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
