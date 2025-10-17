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
  colors: { card: string; text: string; accent?: string };
  density?: 'compact' | 'spacious';
}

export function GroupCard({ groupName, students, index, onNameChange, colors, density = 'spacious' }: GroupCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(groupName);

  const handleSave = () => {
    if (editName.trim()) {
      onNameChange(editName.trim());
    }
    setIsEditing(false);
  };

  const paddingClass = density === 'compact' ? 'p-3' : 'p-4';
  const headerBg = colors.accent || '#3b82f6';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="rounded-xl shadow-lg overflow-hidden"
      style={{ backgroundColor: colors.card, borderLeft: `4px solid ${headerBg}` }}
    >
      <div className={`${paddingClass} flex items-center justify-between`} style={{ backgroundColor: headerBg + '15' }}>
        {isEditing ? (
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onBlur={handleSave}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            className="text-xl font-bold flex-1 bg-transparent border-b-2 focus:outline-none"
            style={{ color: colors.text, borderColor: headerBg }}
            autoFocus
          />
        ) : (
          <h3 className="text-xl font-bold flex-1" style={{ color: colors.text }}>
            {groupName}
          </h3>
        )}
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="transition-colors"
          style={{ color: colors.text, opacity: 0.6 }}
        >
          <Edit2 size={18} />
        </button>
      </div>
      <div className={`${paddingClass} ${density === 'compact' ? 'space-y-1' : 'space-y-2'}`}>
        {students.map((student, idx) => (
          <StudentCard key={`${student.email}-${idx}`} student={student} index={idx} />
        ))}
        {students.length === 0 && (
          <div className="text-center py-8" style={{ color: colors.text, opacity: 0.4 }}>
            No students assigned
          </div>
        )}
      </div>
    </motion.div>
  );
}
