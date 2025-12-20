
import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { WeeklyPlanner } from './components/WeeklyPlanner';
import { ClassManager } from './components/ClassManager';
import { StudentTracker } from './components/StudentTracker';
import { TaskManager } from './components/TaskManager';
import { ReportsDashboard } from './components/ReportsDashboard';
import { SettingsView } from './components/SettingsView';
import { ViewMode, ScheduleSlot, ClassGroup, Student, Task, AppSettings } from './types';
import { INITIAL_CLASSES, INITIAL_SCHEDULE } from './constants';
import { Moon, Sun } from 'lucide-react';

function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('schedule');
  const [currentWeek, setCurrentWeek] = useState(1);
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('muallim-dark-mode') === 'true');
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('muallim-settings');
    return saved ? JSON.parse(saved) : {
      themeColor: 'emerald',
      teacherName: 'المعلم الذكي',
      schoolName: 'مدرستي المتميزة',
      voiceEnabled: true,
      maxGrades: { participation: 10, homework: 10, activity: 10, quiz: 10 },
      isMasterScheduleLocked: false
    };
  });
  
  const [schedule, setSchedule] = useState<ScheduleSlot[]>(() => {
    const saved = localStorage.getItem('muallim-schedule');
    return saved ? JSON.parse(saved) : INITIAL_SCHEDULE;
  });
  
  const [classes, setClasses] = useState<ClassGroup[]>(() => {
    const saved = localStorage.getItem('muallim-classes');
    return saved ? JSON.parse(saved) : INITIAL_CLASSES;
  });
  
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('muallim-tasks');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('muallim-dark-mode', isDarkMode.toString());
    localStorage.setItem('muallim-settings', JSON.stringify(settings));
    localStorage.setItem('muallim-schedule', JSON.stringify(schedule));
    localStorage.setItem('muallim-classes', JSON.stringify(classes));
    localStorage.setItem('muallim-tasks', JSON.stringify(tasks));
  }, [isDarkMode, settings, schedule, classes, tasks]);

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  const handleUpdateSchedule = (updatedSlot: ScheduleSlot) => setSchedule(prev => prev.map(slot => (slot.day === updatedSlot.day && slot.period === updatedSlot.period) ? updatedSlot : slot));
  const handleUpdateStudent = (classId: string, updatedStudent: Student) => setClasses(classes.map(c => c.id === classId ? { ...c, students: c.students.map(s => s.id === updatedStudent.id ? updatedStudent : s) } : c));
  const handleAddTask = (text: string, priority: 'high' | 'medium' | 'low', dueDate?: string) => setTasks([{ id: Math.random().toString(36).substring(7), text, priority, dueDate, completed: false }, ...tasks]);
  const handleToggleTask = (id: string) => setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  const handleDeleteTask = (id: string) => setTasks(tasks.filter(t => t.id !== id));

  const updateMaxGrades = (key: keyof AppSettings['maxGrades'], value: number) => {
    setSettings(prev => ({
      ...prev,
      maxGrades: { ...prev.maxGrades, [key]: value }
    }));
  };

  return (
    <div className="flex h-[100dvh] w-screen overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors flex-col lg:flex-row">
      <Sidebar currentView={currentView} setView={setCurrentView} teacherName={settings.teacherName} schoolName={settings.schoolName} />
      
      <main className="flex-1 relative flex flex-col h-full overflow-hidden">
        <div className="app-bg-overlay !h-[250px] lg:!h-[350px]"></div>
        <div className="app-bg-blur !h-[300px] lg:!h-[400px]"></div>

        <header className="h-32 lg:h-48 flex flex-col items-center justify-center relative shrink-0 px-4">
          <div className="absolute top-4 right-4 lg:top-6 lg:left-8">
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)} 
              className="flex items-center gap-2 px-3 py-1.5 bg-white/90 dark:bg-slate-800/90 rounded-full shadow-lg text-[10px] lg:text-xs font-bold transition-all hover:scale-105 active:scale-95"
            >
              {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-500" /> : <Moon className="w-3.5 h-3.5 text-slate-700" />}
              <span className="hidden sm:inline">الوضع الليلي</span>
            </button>
          </div>

          <div className="text-center mt-4">
            <h1 className="text-2xl lg:text-4xl font-black text-slate-800 dark:text-white drop-shadow-md tracking-tight">{settings.schoolName}</h1>
            <div className="flex items-center justify-center gap-2 mt-1">
              <span className="h-[2px] w-6 lg:w-8 bg-emerald-500 rounded-full"></span>
              <p className="text-slate-600 dark:text-slate-300 font-bold text-xs lg:text-base">{settings.teacherName}</p>
              <span className="h-[2px] w-6 lg:w-8 bg-emerald-500 rounded-full"></span>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-hidden px-3 lg:px-10 pb-20 lg:pb-10">
          <div className="h-full glass-card rounded-[1.5rem] lg:rounded-[2.5rem] flex flex-col shadow-2xl overflow-hidden animate-fade border border-white/40 dark:border-slate-800/50">
            <div className="flex-1 overflow-hidden relative">
              {currentView === 'schedule' && <WeeklyPlanner schedule={schedule} classes={classes} updateSchedule={handleUpdateSchedule} currentWeek={currentWeek} setCurrentWeek={setCurrentWeek} voiceEnabled={settings.voiceEnabled} />}
              {currentView === 'classes' && (
                <ClassManager 
                  classes={classes} 
                  addClass={(n: string) => setClasses([...classes, {id: Math.random().toString(), name: n, students: []}])} 
                  deleteClass={(id: string) => setClasses(classes.filter(c => c.id !== id))} 
                  addStudent={(cid: string, n: string) => {
                    setClasses(classes.map(c => c.id === cid ? { ...c, students: [...c.students, { id: Math.random().toString(), name: n, notes: '', attendance: {}, participationScore: 0, homeworkScore: 0, activityScore: 0, quizScore: 0 }] } : c));
                  }} 
                  importStudents={() => {}} 
                  deleteStudent={() => {}} 
                />
              )}
              {currentView === 'tracker' && <StudentTracker classes={classes} updateStudent={handleUpdateStudent} currentWeek={currentWeek} maxGrades={settings.maxGrades} updateMaxGrades={updateMaxGrades} />}
              {currentView === 'tasks' && <TaskManager tasks={tasks} addTask={handleAddTask} toggleTask={handleToggleTask} deleteTask={handleDeleteTask} />}
              {currentView === 'reports' && <ReportsDashboard classes={classes} schedule={schedule} />}
              {currentView === 'settings' && <SettingsView settings={settings} setSettings={setSettings} />}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
