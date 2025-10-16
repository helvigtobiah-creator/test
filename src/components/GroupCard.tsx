import { motion } from 'framer-motion';
import { StudentCard } from './StudentCard';
import { Student } from '../types';
import { Edit2 } from 'lucide-react';
import { useState } from 'react';

interface GroupCardProps {
  groupName: string;
  students: Student[];
  index: number;
  onNameChange: (newName: string) => void;
  colors: { card: string; text: string };
}

export function GroupCard({ groupName, students, index, onNameChange, colors }: GroupCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(groupName);

  const handleSave = () => {
    if (editName.trim()) {
      onNameChange(editName.trim());
    }
    setIsEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="rounded-xl shadow-lg border border-gray-200 overflow-hidden"
      style={{ backgroundColor: colors.card }}
    >
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        {isEditing ? (
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onBlur={handleSave}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            className="text-xl font-bold flex-1 bg-transparent border-b-2 border-blue-500 focus:outline-none"
            style={{ color: colors.text }}
            autoFocus
          />
        ) : (
          <h3 className="text-xl font-bold flex-1" style={{ color: colors.text }}>
            {groupName}
          </h3>
        )}
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          <Edit2 size={18} />
        </button>
      </div>
      <div className="p-4 space-y-2">
        {students.map((student, idx) => (
          <StudentCard key={`${student.email}-${idx}`} student={student} index={idx} />
        ))}
        {students.length === 0 && (
          <div className="text-gray-400 text-center py-8">No students assigned</div>
        )}
      </div>
    </motion.div>
  );
}
