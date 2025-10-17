import { Sun, Moon, Monitor, Minimize2, Maximize2 } from 'lucide-react';
import { ThemeMode, LayoutDensity, BackgroundConfig } from '../hooks/useTheme';

interface AppearancePanelProps {
  themeMode: ThemeMode;
  density: LayoutDensity;
  background: BackgroundConfig;
  onThemeModeChange: (mode: ThemeMode) => void;
  onDensityChange: (density: LayoutDensity) => void;
  onBackgroundChange: (background: BackgroundConfig) => void;
}

export function AppearancePanel({
  themeMode,
  density,
  background,
  onThemeModeChange,
  onDensityChange,
  onBackgroundChange
}: AppearancePanelProps) {
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        onBackgroundChange({ type: 'image', value: dataUrl });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Theme Mode</label>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => onThemeModeChange('light')}
            className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-colors ${
              themeMode === 'light'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <Sun size={20} />
            <span className="text-xs font-medium">Light</span>
          </button>
          <button
            onClick={() => onThemeModeChange('dark')}
            className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-colors ${
              themeMode === 'dark'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <Moon size={20} />
            <span className="text-xs font-medium">Dark</span>
          </button>
          <button
            onClick={() => onThemeModeChange('system')}
            className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-colors ${
              themeMode === 'system'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <Monitor size={20} />
            <span className="text-xs font-medium">System</span>
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Layout Density</label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onDensityChange('compact')}
            className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-colors ${
              density === 'compact'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <Minimize2 size={20} />
            <span className="text-xs font-medium">Compact</span>
          </button>
          <button
            onClick={() => onDensityChange('spacious')}
            className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-colors ${
              density === 'spacious'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <Maximize2 size={20} />
            <span className="text-xs font-medium">Spacious</span>
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Background</label>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Type</label>
            <select
              value={background.type}
              onChange={(e) =>
                onBackgroundChange({
                  ...background,
                  type: e.target.value as 'color' | 'gradient' | 'image'
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="color">Solid Color</option>
              <option value="gradient">Gradient</option>
              <option value="image">Image</option>
            </select>
          </div>

          {background.type === 'color' && (
            <div>
              <label className="block text-xs text-gray-600 mb-1">Color</label>
              <input
                type="color"
                value={background.value}
                onChange={(e) =>
                  onBackgroundChange({ ...background, value: e.target.value })
                }
                className="w-full h-10 rounded-lg cursor-pointer"
              />
            </div>
          )}

          {background.type === 'gradient' && (
            <>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Gradient Type</label>
                <select
                  value={background.gradientType || 'linear'}
                  onChange={(e) =>
                    onBackgroundChange({
                      ...background,
                      gradientType: e.target.value as 'linear' | 'radial'
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="linear">Linear</option>
                  <option value="radial">Radial</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Start Color</label>
                  <input
                    type="color"
                    value={background.gradientStart || '#f1f5f9'}
                    onChange={(e) =>
                      onBackgroundChange({
                        ...background,
                        gradientStart: e.target.value
                      })
                    }
                    className="w-full h-10 rounded-lg cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">End Color</label>
                  <input
                    type="color"
                    value={background.gradientEnd || '#e2e8f0'}
                    onChange={(e) =>
                      onBackgroundChange({
                        ...background,
                        gradientEnd: e.target.value
                      })
                    }
                    className="w-full h-10 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            </>
          )}

          {background.type === 'image' && (
            <div>
              <label className="block text-xs text-gray-600 mb-1">Upload Image</label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                onChange={handleImageUpload}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
