import { useState, useEffect } from 'react';
import { Student } from '../types';

export interface PairFrequency {
  student1: string;
  student2: string;
  count: number;
}

const ANALYTICS_STORAGE_KEY = 'grade-mixer-analytics';

interface AnalyticsData {
  pairCounts: Record<string, number>;
}

function getStudentKey(student: Student): string {
  return `${student.first}_${student.last}_${student.email}`;
}

function getPairKey(student1: Student, student2: Student): string {
  const key1 = getStudentKey(student1);
  const key2 = getStudentKey(student2);
  return key1 < key2 ? `${key1}|||${key2}` : `${key2}|||${key1}`;
}

export function useAnalytics() {
  const [data, setData] = useState<AnalyticsData>(() => {
    const stored = localStorage.getItem(ANALYTICS_STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return { pairCounts: {} };
      }
    }
    return { pairCounts: {} };
  });

  useEffect(() => {
    localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const trackGrouping = (groups: Array<{ students: Student[] }>) => {
    const newCounts = { ...data.pairCounts };

    groups.forEach(group => {
      const students = group.students;
      for (let i = 0; i < students.length; i++) {
        for (let j = i + 1; j < students.length; j++) {
          const pairKey = getPairKey(students[i], students[j]);
          newCounts[pairKey] = (newCounts[pairKey] || 0) + 1;
        }
      }
    });

    setData({ pairCounts: newCounts });
  };

  const getPairFrequencies = (): PairFrequency[] => {
    const frequencies: PairFrequency[] = [];

    Object.entries(data.pairCounts).forEach(([key, count]) => {
      const [key1, key2] = key.split('|||');
      const [first1, last1] = key1.split('_');
      const [first2, last2] = key2.split('_');

      frequencies.push({
        student1: `${first1} ${last1}`,
        student2: `${first2} ${last2}`,
        count
      });
    });

    return frequencies.sort((a, b) => b.count - a.count);
  };

  const resetAnalytics = () => {
    setData({ pairCounts: {} });
  };

  return {
    trackGrouping,
    getPairFrequencies,
    resetAnalytics
  };
}
