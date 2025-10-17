import { Clock, RotateCcw, Trash2 } from 'lucide-react';
import { HistoryEntry } from '../hooks/useHistory';

interface HistoryPanelProps {
  history: HistoryEntry[];
  onRestore: (entry: HistoryEntry) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

export function HistoryPanel({ history, onRestore, onDelete, onClearAll }: HistoryPanelProps) {
  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-4">
      {history.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Clock size={48} className="mx-auto mb-3 opacity-40" />
          <p className="text-sm">No shuffle history yet</p>
          <p className="text-xs mt-1">Your recent shuffles will appear here</p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-700">
              {history.length} {history.length === 1 ? 'entry' : 'entries'}
            </span>
            <button
              onClick={onClearAll}
              className="text-xs text-red-600 hover:text-red-700 font-medium"
            >
              Clear All
            </button>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {history.map((entry) => (
              <div
                key={entry.id}
                className="p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-800">
                      {entry.groups.length} Groups
                    </div>
                    <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <Clock size={12} />
                      {formatTimestamp(entry.timestamp)}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => onRestore(entry)}
                      className="p-1.5 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                      title="Restore this shuffle"
                    >
                      <RotateCcw size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(entry.id)}
                      className="p-1.5 text-red-600 hover:bg-red-100 rounded transition-colors"
                      title="Delete this entry"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="text-xs text-gray-600">
                  {entry.groups.map((g, i) => (
                    <span key={i}>
                      {g.name} ({g.students.length})
                      {i < entry.groups.length - 1 ? ' • ' : ''}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
