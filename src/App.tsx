import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Shuffle, Download, Settings as SettingsIcon } from 'lucide-react';
import { Student, Settings, Group } from './types';
import { parseCSV, exportCSV, downloadCSV } from './utils/csvParser';
import { createGroups } from './utils/grouping';
import { GroupCard } from './components/GroupCard';
import { SettingsModal } from './components/SettingsModal';
import { ToastContainer } from './components/Toast';
import { DEFAULT_CSV } from './defaultData';
import { useTheme } from './hooks/useTheme';
import { useSound } from './hooks/useSound';
import { useHistory } from './hooks/useHistory';
import { useAnalytics } from './hooks/useAnalytics';
import { useKeyboard } from './hooks/useKeyboard';

const STORAGE_KEY = 'grade-mixer-data';
const CONFETTI_KEY = 'grade-mixer-confetti';
const GROUP_COLORS_KEY = 'grade-mixer-group-colors';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'warning' | 'error';
}

const colorPalette = [
  '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
  '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1'
];

function App() {
  const [students, setStudents] = useState<Student[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [settings, setSettings] = useState<Settings>({
    numGroups: 4,
    groupNames: ['Group 1', 'Group 2', 'Group 3', 'Group 4'],
    forcePairings: [],
    forceAssignments: [],
    colors: {
      background: '#f1f5f9',
      text: '#1f2937',
      card: '#ffffff',
      accent: '#3b82f6'
    }
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [confettiEnabled, setConfettiEnabled] = useState(() => {
    const stored = localStorage.getItem(CONFETTI_KEY);
    return stored ? JSON.parse(stored) : true;
  });
  const [groupColors, setGroupColors] = useState<Record<number, string>>(() => {
    const stored = localStorage.getItem(GROUP_COLORS_KEY);
    return stored ? JSON.parse(stored) : {};
  });

  const { theme, effectiveTheme, updateTheme, getBackgroundStyle, getColors } = useTheme();
  const { config: soundConfig, updateConfig: updateSoundConfig, toggleMute, playShuffleSound, playCompleteSound } = useSound();
  const { history, addEntry, removeEntry, clearHistory } = useHistory();
  const { trackGrouping, getPairFrequencies, resetAnalytics } = useAnalytics();

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setStudents(data.students || []);
        setSettings(data.settings || settings);
      } catch (error) {
        console.error('Error loading stored data:', error);
      }
    }

    if (!stored || !JSON.parse(stored).students?.length) {
      const defaultStudents = parseCSV(DEFAULT_CSV);
      setStudents(defaultStudents);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ students, settings }));
  }, [students, settings]);

  useEffect(() => {
    localStorage.setItem(CONFETTI_KEY, JSON.stringify(confettiEnabled));
  }, [confettiEnabled]);

  useEffect(() => {
    localStorage.setItem(GROUP_COLORS_KEY, JSON.stringify(groupColors));
  }, [groupColors]);

  const addToast = (message: string, type: Toast['type']) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const fireConfetti = () => {
    if (!confettiEnabled) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const duration = 2000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 25, spread: 360, ticks: 50, zIndex: 0 };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      const particleCount = 30 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: Math.random(), y: Math.random() - 0.2 }
      });
    }, 200);
  };

  const handleRandomize = () => {
    playShuffleSound();

    const result = createGroups(
      students,
      settings.numGroups,
      settings.groupNames,
      settings.forcePairings,
      settings.forceAssignments
    );

    setGroups(result.groups);
    addEntry(result.groups);
    trackGrouping(result.groups);

    if (result.success) {
      setTimeout(() => {
        fireConfetti();
        playCompleteSound();
      }, 300);
      addToast('Groups created successfully!', 'success');
    } else {
      result.warnings.forEach(warning => {
        addToast(warning, 'warning');
      });
    }
  };

  const handleExport = () => {
    const csvContent = exportCSV(groups);
    downloadCSV(csvContent, 'grade-mixer-groups.csv');
    addToast('Groups exported successfully!', 'success');
  };

  const handleImport = (newStudents: Student[]) => {
    setStudents(newStudents);
    setGroups([]);
    addToast('Students imported successfully!', 'success');
    setModalOpen(false);
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all settings? This cannot be undone.')) {
      setSettings({
        numGroups: 4,
        groupNames: ['Group 1', 'Group 2', 'Group 3', 'Group 4'],
        forcePairings: [],
        forceAssignments: [],
        colors: {
          background: '#f1f5f9',
          text: '#1f2937',
          card: '#ffffff',
          accent: '#3b82f6'
        }
      });
      setGroups([]);
      addToast('Settings reset successfully!', 'success');
    }
  };

  const updateGroupName = (index: number, newName: string) => {
    const newGroups = [...groups];
    newGroups[index] = { ...newGroups[index], name: newName };
    setGroups(newGroups);

    const newSettings = { ...settings };
    newSettings.groupNames[index] = newName;
    setSettings(newSettings);
  };

  const handleHistoryRestore = (entry: any) => {
    setGroups(entry.groups);
    addToast('Shuffle restored from history!', 'success');
  };

  const handleCopyLayout = () => {
    if (groups.length === 0) {
      addToast('No groups to copy!', 'warning');
      return;
    }

    let text = 'Grade Mixer Groups\n\n';
    groups.forEach(group => {
      text += `${group.name}:\n`;
      group.students.forEach(s => {
        text += `  - ${s.first} ${s.last}\n`;
      });
      text += '\n';
    });

    navigator.clipboard.writeText(text).then(() => {
      addToast('Layout copied to clipboard!', 'success');
    });
  };

  const handleGroupColorChange = (groupIndex: number, color: string) => {
    setGroupColors(prev => ({ ...prev, [groupIndex]: color }));
  };

  const handleGroupColorsRandomize = () => {
    const newColors: Record<number, string> = {};
    for (let i = 0; i < settings.numGroups; i++) {
      newColors[i] = colorPalette[Math.floor(Math.random() * colorPalette.length)];
    }
    setGroupColors(newColors);
    addToast('Group colors randomized!', 'success');
  };

  useKeyboard({
    onReroll: handleRandomize,
    onSettings: () => {
      setModalOpen(!modalOpen);
    },
    onCopy: handleCopyLayout,
    onMute: toggleMute
  }, true);

  const themeColors = getColors();

  return (
    <div
      className="min-h-screen transition-all duration-500"
      style={theme.background.type !== 'color' ? getBackgroundStyle() : { backgroundColor: themeColors.background }}
    >
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      <div className="container mx-auto px-4 py-6">
        <header className="mb-8">
          <h1
            className="text-4xl font-bold transition-colors duration-300 mb-6"
            style={{ color: themeColors.text }}
          >
            Grade Mixer+ Visual Edition
          </h1>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleRandomize}
              disabled={students.length === 0}
              className="flex items-center gap-2 px-6 py-2 text-white rounded-lg font-medium shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: themeColors.accent }}
            >
              <Shuffle size={18} />
              {groups.length > 0 ? 'Reroll' : 'Randomize'}
            </button>
            <button
              onClick={handleExport}
              disabled={groups.length === 0}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: themeColors.card,
                color: themeColors.text
              }}
            >
              <Download size={18} />
              Export CSV
            </button>
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium shadow-md transition-colors"
              style={{
                backgroundColor: themeColors.card,
                color: themeColors.text
              }}
            >
              <SettingsIcon size={18} />
              Settings
            </button>
            <div className="ml-auto text-sm transition-colors duration-300" style={{ color: themeColors.text }}>
              <span className="font-medium">{students.length}</span> students loaded
            </div>
          </div>
        </header>

        {groups.length === 0 ? (
          <div
            className="text-center py-20 rounded-xl border-2 border-dashed transition-colors duration-300"
            style={{
              borderColor: themeColors.text + '40',
              color: themeColors.text
            }}
          >
            <Shuffle size={64} className="mx-auto mb-4 opacity-40" />
            <h2 className="text-2xl font-semibold mb-2">
              Ready to Create Groups
            </h2>
            <p className="text-lg opacity-70">
              Click "Randomize" to get started
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-6" style={{ minWidth: 'min-content' }}>
              {groups.map((group, idx) => (
                <div key={idx} className="flex-shrink-0" style={{ width: '320px' }}>
                  <GroupCard
                    groupName={group.name}
                    students={group.students}
                    index={idx}
                    onNameChange={(name) => updateGroupName(idx, name)}
                    colors={{
                      card: themeColors.card,
                      text: themeColors.text,
                      accent: groupColors[idx] || colorPalette[idx % colorPalette.length]
                    }}
                    density={theme.density}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <SettingsModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        settings={settings}
        onSettingsChange={setSettings}
        onReset={handleReset}
        themeMode={theme.mode}
        density={theme.density}
        background={theme.background}
        onThemeModeChange={(mode) => updateTheme({ mode })}
        onDensityChange={(density) => updateTheme({ density })}
        onBackgroundChange={(background) => updateTheme({ background })}
        soundConfig={soundConfig}
        onSoundConfigChange={updateSoundConfig}
        history={history}
        onHistoryRestore={handleHistoryRestore}
        onHistoryDelete={removeEntry}
        onHistoryClear={clearHistory}
        pairFrequencies={getPairFrequencies()}
        onAnalyticsReset={resetAnalytics}
        groupColors={groupColors}
        onGroupColorChange={handleGroupColorChange}
        onGroupColorsRandomize={handleGroupColorsRandomize}
        confettiEnabled={confettiEnabled}
        onConfettiToggle={setConfettiEnabled}
        students={students}
        onImport={handleImport}
        themeColors={themeColors}
        effectiveTheme={effectiveTheme}
      />
    </div>
  );
}

export default App;
