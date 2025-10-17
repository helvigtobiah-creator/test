import { X } from 'lucide-react';
import { Settings } from '../types';
import { SettingsPanel } from './SettingsPanel';
import { ForcePairingPanel } from './ForcePairingPanel';
import { CustomizationPanel } from './CustomizationPanel';
import { ImportPanel } from './ImportPanel';
import { ThemeMode, LayoutDensity, BackgroundConfig } from '../hooks/useTheme';
import { SoundConfig } from '../hooks/useSound';
import { HistoryEntry } from '../hooks/useHistory';
import { PairFrequency } from '../hooks/useAnalytics';
import { Student } from '../types';
import { useState } from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
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
  students: Student[];
  onImport: (students: Student[]) => void;
  themeColors: { card: string; text: string; accent: string; background: string };
  effectiveTheme: 'light' | 'dark';
}

type ActiveTab = 'settings' | 'pairing' | 'customize' | 'import';

export function SettingsModal({
  isOpen,
  onClose,
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
  students,
  onImport,
  themeColors,
  effectiveTheme
}: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>('settings');

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />
      <div
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-xl shadow-2xl z-50"
        style={{ backgroundColor: themeColors.card }}
      >
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: effectiveTheme === 'dark' ? '#374151' : '#e5e7eb' }}>
          <h2 className="text-2xl font-bold" style={{ color: themeColors.text }}>Settings</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            style={{ color: themeColors.text }}
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-col gap-2 p-4 border-b" style={{ borderColor: effectiveTheme === 'dark' ? '#374151' : '#e5e7eb' }}>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'settings' ? 'text-white' : ''
              }`}
              style={activeTab === 'settings' ? { backgroundColor: themeColors.accent } : { backgroundColor: effectiveTheme === 'dark' ? '#1e293b' : '#f3f4f6', color: themeColors.text }}
            >
              Settings
            </button>
            <button
              onClick={() => setActiveTab('pairing')}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'pairing' ? 'text-white' : ''
              }`}
              style={activeTab === 'pairing' ? { backgroundColor: themeColors.accent } : { backgroundColor: effectiveTheme === 'dark' ? '#1e293b' : '#f3f4f6', color: themeColors.text }}
            >
              Force Pairing
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('customize')}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'customize' ? 'text-white' : ''
              }`}
              style={activeTab === 'customize' ? { backgroundColor: themeColors.accent } : { backgroundColor: effectiveTheme === 'dark' ? '#1e293b' : '#f3f4f6', color: themeColors.text }}
            >
              Customization
            </button>
            <button
              onClick={() => setActiveTab('import')}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'import' ? 'text-white' : ''
              }`}
              style={activeTab === 'import' ? { backgroundColor: themeColors.accent } : { backgroundColor: effectiveTheme === 'dark' ? '#1e293b' : '#f3f4f6', color: themeColors.text }}
            >
              Import
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 180px)' }}>
          {activeTab === 'settings' && (
            <SettingsPanel
              settings={settings}
              onSettingsChange={onSettingsChange}
              onReset={onReset}
              themeMode={themeMode}
              density={density}
              background={background}
              onThemeModeChange={onThemeModeChange}
              onDensityChange={onDensityChange}
              onBackgroundChange={onBackgroundChange}
              soundConfig={soundConfig}
              onSoundConfigChange={onSoundConfigChange}
              history={history}
              onHistoryRestore={onHistoryRestore}
              onHistoryDelete={onHistoryDelete}
              onHistoryClear={onHistoryClear}
              pairFrequencies={pairFrequencies}
              onAnalyticsReset={onAnalyticsReset}
              groupColors={groupColors}
              onGroupColorChange={onGroupColorChange}
              onGroupColorsRandomize={onGroupColorsRandomize}
              confettiEnabled={confettiEnabled}
              onConfettiToggle={onConfettiToggle}
            />
          )}
          {activeTab === 'pairing' && (
            <ForcePairingPanel
              students={students}
              forcePairings={settings.forcePairings}
              forceAssignments={settings.forceAssignments}
              numGroups={settings.numGroups}
              groupNames={settings.groupNames}
              onForcePairingsChange={(pairings) =>
                onSettingsChange({ ...settings, forcePairings: pairings })
              }
              onForceAssignmentsChange={(assignments) =>
                onSettingsChange({ ...settings, forceAssignments: assignments })
              }
            />
          )}
          {activeTab === 'customize' && (
            <CustomizationPanel
              colors={settings.colors}
              onColorsChange={(colors) =>
                onSettingsChange({ ...settings, colors })
              }
            />
          )}
          {activeTab === 'import' && (
            <ImportPanel onImport={onImport} />
          )}
        </div>
      </div>
    </>
  );
}
