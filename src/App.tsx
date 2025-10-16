import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Shuffle, Download, Upload, Menu, X } from 'lucide-react';
import { Student, Settings, Group } from './types';
import { parseCSV, exportCSV, downloadCSV } from './utils/csvParser';
import { createGroups } from './utils/grouping';
import { GroupCard } from './components/GroupCard';
import { SettingsPanel } from './components/SettingsPanel';
import { ForcePairingPanel } from './components/ForcePairingPanel';
import { CustomizationPanel } from './components/CustomizationPanel';
import { ImportPanel } from './components/ImportPanel';
import { ToastContainer } from './components/Toast';
import { DEFAULT_CSV } from './defaultData';

const STORAGE_KEY = 'grade-mixer-data';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'warning' | 'error';
}

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
  const [activeTab, setActiveTab] = useState<'settings' | 'pairing' | 'customize' | 'import'>('settings');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

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
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: Math.random(), y: Math.random() - 0.2 }
      });
    }, 250);
  };

  const handleRandomize = () => {
    const result = createGroups(
      students,
      settings.numGroups,
      settings.groupNames,
      settings.forcePairings,
      settings.forceAssignments
    );

    setGroups(result.groups);

    if (result.success) {
      fireConfetti();
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
    setSidebarOpen(false);
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

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: settings.colors.background }}
    >
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      <div className="container mx-auto px-4 py-6">
        <header className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1
              className="text-4xl font-bold"
              style={{ color: settings.colors.text }}
            >
              Grade Mixer
            </h1>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => {
                setActiveTab('import');
                setSidebarOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 rounded-lg font-medium shadow-md transition-colors"
            >
              <Upload size={18} />
              Import CSV
            </button>
            <button
              onClick={handleRandomize}
              disabled={students.length === 0}
              className="flex items-center gap-2 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: settings.colors.accent }}
            >
              <Shuffle size={18} />
              {groups.length > 0 ? 'Reroll' : 'Randomize'}
            </button>
            <button
              onClick={handleExport}
              disabled={groups.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 rounded-lg font-medium shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download size={18} />
              Export CSV
            </button>
            <div className="ml-auto text-sm" style={{ color: settings.colors.text }}>
              <span className="font-medium">{students.length}</span> students loaded
            </div>
          </div>
        </header>

        <div className="flex gap-6">
          <main className="flex-1">
            {groups.length === 0 ? (
              <div
                className="text-center py-20 rounded-xl border-2 border-dashed"
                style={{
                  borderColor: settings.colors.text + '40',
                  color: settings.colors.text
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
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {groups.map((group, idx) => (
                  <GroupCard
                    key={idx}
                    groupName={group.name}
                    students={group.students}
                    index={idx}
                    onNameChange={(name) => updateGroupName(idx, name)}
                    colors={settings.colors}
                  />
                ))}
              </div>
            )}
          </main>

          <aside
            className={`
              fixed lg:static top-0 right-0 h-screen lg:h-auto w-80 bg-white shadow-xl lg:shadow-md rounded-lg p-6 overflow-y-auto z-40
              transition-transform duration-300 lg:translate-x-0
              ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}
            `}
          >
            <div className="flex lg:hidden justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Menu</h3>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-col gap-2 mb-6">
              <button
                onClick={() => setActiveTab('settings')}
                className={`px-4 py-2 rounded-lg font-medium text-left transition-colors ${
                  activeTab === 'settings'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                Settings
              </button>
              <button
                onClick={() => setActiveTab('pairing')}
                className={`px-4 py-2 rounded-lg font-medium text-left transition-colors ${
                  activeTab === 'pairing'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                Force Pairing
              </button>
              <button
                onClick={() => setActiveTab('customize')}
                className={`px-4 py-2 rounded-lg font-medium text-left transition-colors ${
                  activeTab === 'customize'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                Customization
              </button>
              <button
                onClick={() => setActiveTab('import')}
                className={`px-4 py-2 rounded-lg font-medium text-left transition-colors ${
                  activeTab === 'import'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                Import
              </button>
            </div>

            <div>
              {activeTab === 'settings' && (
                <SettingsPanel
                  settings={settings}
                  onSettingsChange={setSettings}
                  onReset={handleReset}
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
                    setSettings({ ...settings, forcePairings: pairings })
                  }
                  onForceAssignmentsChange={(assignments) =>
                    setSettings({ ...settings, forceAssignments: assignments })
                  }
                />
              )}
              {activeTab === 'customize' && (
                <CustomizationPanel
                  colors={settings.colors}
                  onColorsChange={(colors) =>
                    setSettings({ ...settings, colors })
                  }
                />
              )}
              {activeTab === 'import' && (
                <ImportPanel onImport={handleImport} />
              )}
            </div>
          </aside>
        </div>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

export default App;
