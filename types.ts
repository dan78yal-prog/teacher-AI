
export enum DayOfWeek {
  SUNDAY = 'الأحد',
  MONDAY = 'الاثنين',
  TUESDAY = 'الثلاثاء',
  WEDNESDAY = 'الأربعاء',
  THURSDAY = 'الخميس',
}

export interface Student {
  id: string;
  name: string;
  notes: string;
  attendance: Record<string, 'present' | 'absent' | 'late' | 'excused'>;
  participationScore: number;
  homeworkScore: number;
  activityScore: number;
  quizScore: number;
  weeklyScores?: Record<number, number>;
}

export interface ClassGroup {
  id: string;
  name: string;
  students: Student[];
}

export interface LessonPlan {
  id: string;
  subject: string;
  topic: string;
  objectives: string[];
  materials: string;
  content: string;
  homework: string;
  strategy?: string;
  isGenerated: boolean;
}

export interface ScheduleSlot {
  id: string;
  day: DayOfWeek;
  period: number;
  className: string;
  weekPlans?: Record<number, LessonPlan>;
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  dueDate?: string;
}

export type ViewMode = 'schedule' | 'classes' | 'tracker' | 'tasks' | 'reports' | 'settings';

export type ThemeColor = 'emerald' | 'blue' | 'purple' | 'orange' | 'rose';

export interface AppSettings {
  themeColor: ThemeColor;
  teacherName: string;
  schoolName: string;
  voiceEnabled: boolean;
  maxGrades: {
    participation: number;
    homework: number;
    activity: number;
    quiz: number;
  };
  isMasterScheduleLocked: boolean;
}
