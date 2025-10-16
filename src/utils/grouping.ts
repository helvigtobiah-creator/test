import { Student, ForcePairing, ForceAssignment } from '../types';

interface GroupingResult {
  success: boolean;
  groups: Array<{ name: string; students: Student[] }>;
  warnings: string[];
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function createGroups(
  students: Student[],
  numGroups: number,
  groupNames: string[],
  forcePairings: ForcePairing[],
  forceAssignments: ForceAssignment[]
): GroupingResult {
  const warnings: string[] = [];
  const groups: Array<{ name: string; students: Student[] }> = [];

  for (let i = 0; i < numGroups; i++) {
    groups.push({
      name: groupNames[i] || `Group ${i + 1}`,
      students: []
    });
  }

  const availableStudents = new Set(students);
  const usedStudents = new Set<Student>();

  forceAssignments.forEach(assignment => {
    if (assignment.groupIndex < numGroups && availableStudents.has(assignment.student)) {
      groups[assignment.groupIndex].students.push(assignment.student);
      availableStudents.delete(assignment.student);
      usedStudents.add(assignment.student);
    }
  });

  const pairingGroups = forcePairings.map(pairing => {
    const validStudents = pairing.students.filter(s => availableStudents.has(s));
    validStudents.forEach(s => {
      availableStudents.delete(s);
      usedStudents.add(s);
    });
    return validStudents;
  });

  const byGrade: Record<number, Student[]> = { 9: [], 10: [], 11: [], 12: [] };
  availableStudents.forEach(student => {
    if (byGrade[student.grade]) {
      byGrade[student.grade].push(student);
    }
  });

  Object.keys(byGrade).forEach(grade => {
    byGrade[parseInt(grade)] = shuffleArray(byGrade[parseInt(grade)]);
  });

  pairingGroups.forEach(pairingGroup => {
    if (pairingGroup.length === 0) return;

    let bestGroupIdx = 0;
    let minSize = groups[0].students.length;

    for (let i = 1; i < groups.length; i++) {
      if (groups[i].students.length < minSize) {
        minSize = groups[i].students.length;
        bestGroupIdx = i;
      }
    }

    groups[bestGroupIdx].students.push(...pairingGroup);
  });

  for (let grade of [9, 10, 11, 12]) {
    const gradeStudents = byGrade[grade];

    for (let i = 0; i < gradeStudents.length; i++) {
      const groupIdx = i % numGroups;
      groups[groupIdx].students.push(gradeStudents[i]);
    }
  }

  groups.forEach((group, idx) => {
    const grades = new Set(group.students.map(s => s.grade));
    const genders = new Set(group.students.map(s => s.gender));

    if (grades.size < 4) {
      const missing = [9, 10, 11, 12].filter(g => !grades.has(g));
      warnings.push(`${group.name}: Missing grades ${missing.join(', ')}`);
    }

    if (genders.size < 2) {
      warnings.push(`${group.name}: Missing ${genders.has('m') ? 'female' : 'male'} students`);
    }
  });

  return {
    success: warnings.length === 0,
    groups,
    warnings
  };
}
