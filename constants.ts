import { ClassGroup, DayOfWeek, ScheduleSlot } from './types';
import { v4 as uuidv4 } from 'uuid';

// Helper to generate IDs (simplified for demo)
const generateId = () => Math.random().toString(36).substring(2, 9);

export const INITIAL_CLASSES: ClassGroup[] = [
  {
    id: 'c1',
    name: 'الصف الأول - أ',
    students: [
      // Added missing score properties to satisfy the Student interface
      { id: 's1', name: 'أحمد محمد', notes: '', attendance: {}, participationScore: 8, homeworkScore: 8, activityScore: 8, quizScore: 8 },
      { id: 's2', name: 'خالد علي', notes: 'يحتاج متابعة في القراءة', attendance: {}, participationScore: 6, homeworkScore: 6, activityScore: 6, quizScore: 6 },
      { id: 's3', name: 'سارة عبدالله', notes: 'ممتازة', attendance: {}, participationScore: 10, homeworkScore: 10, activityScore: 10, quizScore: 10 },
    ],
  },
  {
    id: 'c2',
    name: 'الصف الثاني - ب',
    students: [
      // Added missing score properties to satisfy the Student interface
      { id: 's4', name: 'فهد عمر', notes: '', attendance: {}, participationScore: 7, homeworkScore: 7, activityScore: 7, quizScore: 7 },
      { id: 's5', name: 'نورة سعيد', notes: '', attendance: {}, participationScore: 9, homeworkScore: 9, activityScore: 9, quizScore: 9 },
    ],
  },
];

export const INITIAL_SCHEDULE: ScheduleSlot[] = [];

// Populate empty schedule (Now 7 Periods)
Object.values(DayOfWeek).forEach((day) => {
  for (let i = 1; i <= 7; i++) {
    INITIAL_SCHEDULE.push({
      id: generateId(),
      day: day as DayOfWeek,
      period: i,
      className: '',
    });
  }
});