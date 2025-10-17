import { Student, Grade, Group } from '../types';

export function parseCSV(csvText: string): Student[] {
  const lines = csvText.trim().split('\n');
  const students: Student[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const parts = line.split(',');
    if (parts.length >= 5) {
      const first = parts[2].trim();
      const last = parts[3].trim();
      students.push({
        grade: parseInt(parts[0]) as Grade,
        gender: parts[1].toLowerCase().trim() as 'm' | 'f',
        first,
        last,
        email: parts[4].trim(),
        full: `${first} ${last}`
      });
    }
  }

  return students;
}

export function exportCSV(groups: Group[]): string {
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
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}
