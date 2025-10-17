export interface Student {
  grade: number;
  gender: 'm' | 'f';
  first: string;
  last: string;
  email: string;
}

export interface GroupedStudent extends Student {
  groupName: string;
}

export interface Group {
  name: string;
  students: Student[];
}

export interface ForcePairing {
  id: string;
  students: Student[];
}

export interface ForceAssignment {
  id: string;
  student: Student;
  groupIndex: number;
}

export interface CustomColors {
  background: string;
  text: string;
  card: string;
  accent: string;
}

export interface Settings {
  numGroups: number;
  groupNames: string[];
  forcePairings: ForcePairing[];
  forceAssignments: ForceAssignment[];
  colors: CustomColors;
}
