import { Student, Group, GroupingResult, Grade, MixMode } from '../types';

function shuffleWithSeed<T>(array: T[], seed: number): T[] {
  const arr = [...array];
  let currentSeed = seed;
  const random = () => {
    currentSeed = (currentSeed * 9301 + 49297) % 233280;
    return currentSeed / 233280;
  };
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function buildGroups(
  students: Student[],
  numGroups: number,
  groupNames: string[],
  mode: MixMode,
  seedValue: number
): GroupingResult {
  const groups: Group[] = [];
  for (let i = 0; i < numGroups; i++) {
    groups.push({ name: groupNames[i] || `Group ${i + 1}`, students: [] });
  }

  if (mode === 'random') {
    const shuffled = shuffleWithSeed(students, seedValue);
    shuffled.forEach((student, idx) => {
      groups[idx % numGroups].students.push(student);
    });
    return { groups, ok: true, reasons: [] };
  }

  const byGrade: Record<Grade, Student[]> = { 9: [], 10: [], 11: [], 12: [] };
  students.forEach(s => byGrade[s.grade]?.push(s));

  ([9, 10, 11, 12] as Grade[]).forEach(grade => {
    byGrade[grade] = shuffleWithSeed(byGrade[grade], seedValue + grade);
  });

  ([9, 10, 11, 12] as Grade[]).forEach(grade => {
    byGrade[grade].forEach((student, idx) => {
      groups[idx % numGroups].students.push(student);
    });
  });

  const reasons: string[] = [];
  groups.forEach(group => {
    const grades = new Set(group.students.map(s => s.grade));
    const genders = new Set(group.students.map(s => s.gender));
    if (grades.size < 4) {
      const missing = [9, 10, 11, 12].filter(g => !grades.has(g as Grade));
      reasons.push(`${group.name}: missing grades ${missing.join(', ')}`);
    }
    if (!genders.has('m')) reasons.push(`${group.name}: missing male`);
    if (!genders.has('f')) reasons.push(`${group.name}: missing female`);
  });

  groups.forEach(group => {
    group.students = shuffleWithSeed(group.students, seedValue + group.name.length);
  });

  return { groups, ok: reasons.length === 0, reasons };
}
