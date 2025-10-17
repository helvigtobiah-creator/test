import { Keyboard } from 'lucide-react';

export function HelpPanel() {
  const shortcuts = [
    { key: 'R', description: 'Reroll shuffle' },
    { key: 'S', description: 'Open/close Settings' },
    { key: 'C', description: 'Copy current layout to clipboard' },
    { key: 'M', description: 'Mute/unmute sound' }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
        <Keyboard size={18} />
        Keyboard Shortcuts
      </div>

      <div className="space-y-2">
        {shortcuts.map((shortcut) => (
          <div
            key={shortcut.key}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <span className="text-sm text-gray-700">{shortcut.description}</span>
            <kbd className="px-3 py-1 bg-white border border-gray-300 rounded shadow-sm text-sm font-mono font-semibold">
              {shortcut.key}
            </kbd>
          </div>
        ))}
      </div>

      <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-800">
          <strong>Tip:</strong> Shortcuts are disabled while typing in input fields.
        </p>
      </div>
    </div>
  );
}
