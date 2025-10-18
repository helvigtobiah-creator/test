import { motion } from 'framer-motion';
import { Student } from '../types';
import { User } from 'lucide-react';

interface StudentCardProps {
  student: Student;
  index: number;
  animationSpeed?: number;
}

const gradeColors: Record<number, string> = {
  9: 'bg-blue-500',
  10: 'bg-green-500',
  11: 'bg-orange-500',
  12: 'bg-purple-500'
};

export function StudentCard({ student, index, animationSpeed = 0.05 }: StudentCardProps) {
  const initials = `${student.first[0]}${student.last[0]}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * animationSpeed }}
      className="bg-white rounded-lg p-2 shadow-sm border border-gray-200"
    >
      <div className="font-medium text-gray-900 text-sm">
        {student.first} {student.last}
      </div>
      <div className="text-xs text-gray-500 flex items-center gap-2 mt-1">
        <span className={`${gradeColors[student.grade]} text-white px-2 py-0.5 rounded-full font-medium`}>
          Grade {student.grade}
        </span>
        <span className="text-gray-400">
          {student.gender === 'm' ? '♂' : '♀'}
        </span>
      </div>
    </motion.div>
  );
}
