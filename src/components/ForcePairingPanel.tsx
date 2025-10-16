import { Student, ForcePairing, ForceAssignment } from '../types';
import { Users, X, Plus, UserCheck } from 'lucide-react';
import { useState } from 'react';

interface ForcePairingPanelProps {
  students: Student[];
  forcePairings: ForcePairing[];
  forceAssignments: ForceAssignment[];
  numGroups: number;
  groupNames: string[];
  onForcePairingsChange: (pairings: ForcePairing[]) => void;
  onForceAssignmentsChange: (assignments: ForceAssignment[]) => void;
}

export function ForcePairingPanel({
  students,
  forcePairings,
  forceAssignments,
  numGroups,
  groupNames,
  onForcePairingsChange,
  onForceAssignmentsChange
}: ForcePairingPanelProps) {
  const [selectedForPairing, setSelectedForPairing] = useState<Student[]>([]);
  const [selectedForAssignment, setSelectedForAssignment] = useState<Student | null>(null);

  const toggleStudentForPairing = (student: Student) => {
    if (selectedForPairing.find(s => s.email === student.email)) {
      setSelectedForPairing(selectedForPairing.filter(s => s.email !== student.email));
    } else {
      setSelectedForPairing([...selectedForPairing, student]);
    }
  };

  const createPairing = () => {
    if (selectedForPairing.length >= 2) {
      const newPairing: ForcePairing = {
        id: Date.now().toString(),
        students: selectedForPairing
      };
      onForcePairingsChange([...forcePairings, newPairing]);
      setSelectedForPairing([]);
    }
  };

  const removePairing = (id: string) => {
    onForcePairingsChange(forcePairings.filter(p => p.id !== id));
  };

  const createAssignment = (groupIndex: number) => {
    if (selectedForAssignment) {
      const newAssignment: ForceAssignment = {
        id: Date.now().toString(),
        student: selectedForAssignment,
        groupIndex
      };
      onForceAssignmentsChange([...forceAssignments, newAssignment]);
      setSelectedForAssignment(null);
    }
  };

  const removeAssignment = (id: string) => {
    onForceAssignmentsChange(forceAssignments.filter(a => a.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
        <Users size={20} />
        Force Pairing & Assignment
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-gray-700 mb-2">Create Pairing</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-2">
            {students.map(student => {
              const isSelected = selectedForPairing.find(s => s.email === student.email);
              return (
                <button
                  key={student.email}
                  onClick={() => toggleStudentForPairing(student)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    isSelected ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {student.first} {student.last} (Grade {student.grade})
                </button>
              );
            })}
          </div>
          <button
            onClick={createPairing}
            disabled={selectedForPairing.length < 2}
            className="mt-2 w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={16} />
            Create Pairing ({selectedForPairing.length} selected)
          </button>
        </div>

        {forcePairings.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Active Pairings</h4>
            <div className="space-y-2">
              {forcePairings.map(pairing => (
                <div key={pairing.id} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-start justify-between">
                    <div className="text-sm">
                      {pairing.students.map(s => `${s.first} ${s.last}`).join(' + ')}
                    </div>
                    <button
                      onClick={() => removePairing(pairing.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="border-t border-gray-200 pt-4">
          <h4 className="font-medium text-gray-700 mb-2">Assign to Specific Group</h4>
          <select
            value={selectedForAssignment?.email || ''}
            onChange={(e) => {
              const student = students.find(s => s.email === e.target.value);
              setSelectedForAssignment(student || null);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select student...</option>
            {students.map(student => (
              <option key={student.email} value={student.email}>
                {student.first} {student.last} (Grade {student.grade})
              </option>
            ))}
          </select>

          {selectedForAssignment && (
            <div className="mt-2 space-y-2">
              <p className="text-sm text-gray-600">Assign to group:</p>
              <div className="grid grid-cols-2 gap-2">
                {Array.from({ length: numGroups }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => createAssignment(idx)}
                    className="px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    {groupNames[idx] || `Group ${idx + 1}`}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {forceAssignments.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Active Assignments</h4>
            <div className="space-y-2">
              {forceAssignments.map(assignment => (
                <div key={assignment.id} className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-start justify-between">
                    <div className="text-sm">
                      <span className="font-medium">
                        {assignment.student.first} {assignment.student.last}
                      </span>
                      <span className="text-gray-600"> → {groupNames[assignment.groupIndex] || `Group ${assignment.groupIndex + 1}`}</span>
                    </div>
                    <button
                      onClick={() => removeAssignment(assignment.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
