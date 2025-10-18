import { Settings as SettingsIcon, Plus, Minus, RotateCcw, Palette, Volume2, Clock, BarChart3, Keyboard } from 'lucide-react';
import { Settings } from '../types';
import { useState } from 'react';
import { AppearancePanel } from './AppearancePanel';
import { SoundsPanel } from './SoundsPanel';
import { HistoryPanel } from './HistoryPanel';
import { AnalyticsPanel } from './AnalyticsPanel';
import { HelpPanel } from './HelpPanel';
import { GroupColorsPanel } from './GroupColorsPanel';
import { ConfettiToggle } from './ConfettiToggle';
import { ThemeMode, LayoutDensity, BackgroundConfig } from '../hooks/useTheme';
import { SoundConfig } from '../hooks/useSound';
import { HistoryEntry } from '../hooks/useHistory';
import { PairFrequency } from '../hooks/useAnalytics';

type SettingsTab = 'general' | 'appearance' | 'colors' | 'sounds' | 'history' | 'analytics' | 'help';

interface SettingsPanelProps {
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
  onReset: () => void;
  themeMode: ThemeMode;
  density: LayoutDensity;
  background: BackgroundConfig;
  onThemeModeChange: (mode: ThemeMode) => void;
  onDensityChange: (density: LayoutDensity) => void;
  onBackgroundChange: (background: BackgroundConfig) => void;
  soundConfig: SoundConfig;
  onSoundConfigChange: (updates: Partial<SoundConfig>) => void;
  history: HistoryEntry[];
  onHistoryRestore: (entry: HistoryEntry) => void;
  onHistoryDelete: (id: string) => void;
  onHistoryClear: () => void;
  pairFrequencies: PairFrequency[];
  onAnalyticsReset: () => void;
  groupColors: Record<number, string>;
  onGroupColorChange: (groupIndex: number, color: string) => void;
  onGroupColorsRandomize: () => void;
  confettiEnabled: boolean;
  onConfettiToggle: (enabled: boolean) => void;
  animationSpeed: number;
  onAnimationSpeedChange: (speed: number) => void;
}

export function SettingsPanel({
  settings,
  onSettingsChange,
  onReset,
  themeMode,
  density,
  background,
  onThemeModeChange,
  onDensityChange,
  onBackgroundChange,
  soundConfig,
  onSoundConfigChange,
  history,
  onHistoryRestore,
  onHistoryDelete,
  onHistoryClear,
  pairFrequencies,
  onAnalyticsReset,
  groupColors,
  onGroupColorChange,
  onGroupColorsRandomize,
  confettiEnabled,
  onConfettiToggle,
  animationSpeed,
  onAnimationSpeedChange
}: SettingsPanelProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');

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

  const tabs: Array<{ id: SettingsTab; label: string; icon: any }> = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'colors', label: 'Colors', icon: Palette },
    { id: 'sounds', label: 'Sounds', icon: Volume2 },
    { id: 'history', label: 'History', icon: Clock },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'help', label: 'Help', icon: Keyboard }
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-1 p-1 bg-gray-100 rounded-lg">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-2 py-1.5 rounded text-xs font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="pt-2">
        {activeTab === 'general' && (
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

            <ConfettiToggle enabled={confettiEnabled} onToggle={onConfettiToggle} />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Animation Speed: {animationSpeed.toFixed(3)}s
              </label>
              <input
                type="range"
                min="0"
                max="0.2"
                step="0.01"
                value={animationSpeed}
                onChange={(e) => onAnimationSpeedChange(parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Instant</span>
                <span>Slow</span>
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
        )}

        {activeTab === 'appearance' && (
          <AppearancePanel
            themeMode={themeMode}
            density={density}
            background={background}
            onThemeModeChange={onThemeModeChange}
            onDensityChange={onDensityChange}
            onBackgroundChange={onBackgroundChange}
          />
        )}

        {activeTab === 'colors' && (
          <GroupColorsPanel
            groupNames={settings.groupNames}
            groupColors={groupColors}
            onColorChange={onGroupColorChange}
            onRandomize={onGroupColorsRandomize}
          />
        )}

        {activeTab === 'sounds' && (
          <SoundsPanel config={soundConfig} onConfigChange={onSoundConfigChange} />
        )}

        {activeTab === 'history' && (
          <HistoryPanel
            history={history}
            onRestore={onHistoryRestore}
            onDelete={onHistoryDelete}
            onClearAll={onHistoryClear}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsPanel frequencies={pairFrequencies} onReset={onAnalyticsReset} />
        )}

        {activeTab === 'help' && <HelpPanel />}
      </div>
    </div>
  );
}
