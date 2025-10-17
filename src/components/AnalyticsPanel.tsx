import { BarChart3, Trash2 } from 'lucide-react';
import { PairFrequency } from '../hooks/useAnalytics';

interface AnalyticsPanelProps {
  frequencies: PairFrequency[];
  onReset: () => void;
}

export function AnalyticsPanel({ frequencies, onReset }: AnalyticsPanelProps) {
  const maxCount = frequencies.length > 0 ? frequencies[0].count : 1;
  const topPairs = frequencies.slice(0, 15);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <BarChart3 size={18} />
          Pair Frequency Chart
        </div>
        {frequencies.length > 0 && (
          <button
            onClick={onReset}
            className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
          >
            <Trash2 size={12} />
            Reset Data
          </button>
        )}
      </div>

      {frequencies.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <BarChart3 size={48} className="mx-auto mb-3 opacity-40" />
          <p className="text-sm">No pairing data yet</p>
          <p className="text-xs mt-1">Pair frequencies will appear after shuffling</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {topPairs.map((pair, index) => {
            const percentage = (pair.count / maxCount) * 100;

            return (
              <div key={index} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-gray-700 truncate flex-1">
                    {pair.student1} & {pair.student2}
                  </span>
                  <span className="text-gray-500 ml-2 flex-shrink-0">
                    {pair.count} {pair.count === 1 ? 'time' : 'times'}
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}

          {frequencies.length > 15 && (
            <div className="text-center text-xs text-gray-500 pt-2">
              Showing top 15 of {frequencies.length} pairs
            </div>
          )}
        </div>
      )}
    </div>
  );
}
