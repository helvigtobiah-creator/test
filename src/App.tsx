import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shuffle, Download, Upload, Settings as SettingsIcon, Undo, Redo } from 'lucide-react';
import { Student, Group, AppSettings, HistoryEntry } from './types';
import { parseCSV, exportCSV, downloadCSV } from './utils/csvParser';
import { buildGroups } from './utils/grouping';
import { DEFAULT_CSV } from './defaultData';

const DEFAULT_SETTINGS: AppSettings = {
  numGroups: 4,
  groupNames: ['Group 1', 'Group 2', 'Group 3', 'Group 4'],
  mixMode: 'balanced',
  miniAnimation: true,
  timer: { enabled: false, mode: 'stopwatch', countdownMinutes: 5, countdownSeconds: 0 },
  sound: {
    enabled: false,
    volume: 50,
    events: {
      shuffleStart: 'cardShuffle',
      shuffleLoop: 'none',
      shuffleEnd: 'softDing',
      click: 'tick',
      error: 'pop'
    }
  },
  seed: '',
  darkMode: false
};

function App() {
  const [students, setStudents] = useState<Student[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showSettings, setShowSettings] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('gradeMixerData');
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setStudents(data.students || parseCSV(DEFAULT_CSV));
        setSettings({ ...DEFAULT_SETTINGS, ...data.settings });
      } catch (e) {
        setStudents(parseCSV(DEFAULT_CSV));
      }
    } else {
      setStudents(parseCSV(DEFAULT_CSV));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('gradeMixerData', JSON.stringify({ students, settings }));
  }, [students, settings]);

  const handleReroll = () => {
    const seed = settings.seed || Date.now();
    const result = buildGroups(students, settings.numGroups, settings.groupNames, settings.mixMode, seed);

    setGroups(result.groups);
    setAnimate(settings.miniAnimation);
    setTimeout(() => setAnimate(false), 400);

    const newEntry: HistoryEntry = {
      groups: result.groups,
      seed: seed.toString(),
      timestamp: Date.now()
    };
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newEntry);
    if (newHistory.length > 5) newHistory.shift();
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setGroups(history[historyIndex - 1].groups);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setGroups(history[historyIndex + 1].groups);
    }
  };

  const handleImport = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      try {
        const parsed = parseCSV(text);
        setStudents(parsed);
        setGroups([]);
        setShowImport(false);
      } catch (err) {
        alert('Error parsing CSV');
      }
    };
    reader.readAsText(file);
  };

  const handleExport = () => {
    if (groups.length > 0) {
      const csv = exportCSV(groups);
      downloadCSV(csv, 'grade-mixer-groups.csv');
    }
  };

  return (
    <div className={`min-h-screen ${settings.darkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors`}>
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h1 className="text-2xl font-bold text-gray-900">Grade Mixer+</h1>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowImport(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 transition-colors"
              >
                <Upload size={16} />
                Import CSV
              </button>

              <button
                onClick={handleReroll}
                disabled={students.length === 0}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
              >
                <Shuffle size={16} />
                Reroll
              </button>

              <button
                onClick={handleExport}
                disabled={groups.length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 transition-colors disabled:opacity-50"
              >
                <Download size={16} />
                Export
              </button>

              <div className="flex items-center gap-1 border-l border-gray-300 pl-2">
                <button
                  onClick={handleUndo}
                  disabled={historyIndex <= 0}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-30"
                  title="Undo (Ctrl+Z)"
                >
                  <Undo size={18} />
                </button>
                <button
                  onClick={handleRedo}
                  disabled={historyIndex >= history.length - 1}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-30"
                  title="Redo (Ctrl+Y)"
                >
                  <Redo size={18} />
                </button>
              </div>

              <button
                onClick={() => setShowSettings(true)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Settings (S)"
              >
                <SettingsIcon size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {groups.length === 0 ? (
          <div className="text-center py-20">
            <Shuffle size={64} className="mx-auto mb-4 text-gray-400" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">Ready to Mix</h2>
            <p className="text-gray-500">Click Reroll to create groups</p>
            <p className="text-sm text-gray-400 mt-2">{students.length} students loaded</p>
          </div>
        ) : (
          <div className="flex gap-6 overflow-x-auto pb-4">
            {groups.map((group, groupIdx) => (
              <motion.div
                key={groupIdx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, scale: animate ? [1, 1.02, 1] : 1 }}
                transition={{ duration: animate ? 0.4 : 0.3, delay: groupIdx * 0.1 }}
                className="flex-shrink-0 w-80"
              >
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
                    <h3 className="text-xl font-bold text-white">{group.name}</h3>
                  </div>
                  <div className="p-4 space-y-3">
                    {group.students.map((student, studentIdx) => (
                      <motion.div
                        key={studentIdx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: (groupIdx * 0.1) + (studentIdx * 0.05) }}
                        className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                          {student.first[0]}{student.last[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 truncate">
                            {student.full}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {showImport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Import CSV</h2>
            <input
              type="file"
              accept=".csv"
              onChange={(e) => e.target.files?.[0] && handleImport(e.target.files[0])}
              className="w-full mb-4"
            />
            <button
              onClick={() => setShowImport(false)}
              className="w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-2xl font-bold">Settings</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Groups
                </label>
                <input
                  type="number"
                  min="2"
                  max="12"
                  value={settings.numGroups}
                  onChange={(e) => {
                    const num = parseInt(e.target.value);
                    const names = [...settings.groupNames];
                    while (names.length < num) names.push(`Group ${names.length + 1}`);
                    setSettings({ ...settings, numGroups: num, groupNames: names.slice(0, num) });
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mix Mode
                </label>
                <select
                  value={settings.mixMode}
                  onChange={(e) => setSettings({ ...settings, mixMode: e.target.value as 'balanced' | 'random' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="balanced">Balanced (by grade & gender)</option>
                  <option value="random">True Random</option>
                </select>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.miniAnimation}
                  onChange={(e) => setSettings({ ...settings, miniAnimation: e.target.checked })}
                  className="w-4 h-4"
                />
                <label className="text-sm font-medium text-gray-700">
                  Enable mini animation after shuffle
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seed (optional, for reproducible results)
                </label>
                <input
                  type="text"
                  value={settings.seed}
                  onChange={(e) => setSettings({ ...settings, seed: e.target.value })}
                  placeholder="Leave empty for random"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
