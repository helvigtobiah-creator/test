import { Student } from '../types';

export function parseCSV(csvText: string): Student[] {
  const lines = csvText.trim().split('\n');
  const students: Student[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const parts = line.split(',');
    if (parts.length >= 5) {
      students.push({
        grade: parseInt(parts[0]),
        gender: parts[1].toLowerCase() as 'm' | 'f',
        first: parts[2],
        last: parts[3],
        email: parts[4]
      });
    }
  }

  return students;
}

export function exportCSV(groups: Array<{ name: string; students: Student[] }>): string {
  let csv = 'groupName,grade,gender,first,last,email\n';

  groups.forEach(group => {
    group.students.forEach(student => {
      csv += `${group.name},${student.grade},${student.gender},${student.first},${student.last},${student.email}\n`;
    });
  });

  return csv;
}

export function downloadCSV(csvContent: string, filename: string) {
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
}
