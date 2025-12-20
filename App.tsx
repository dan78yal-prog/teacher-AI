
import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { WeeklyPlanner } from './components/WeeklyPlanner';
import { ClassManager } from './components/ClassManager';
import { StudentTracker } from './components/StudentTracker';
import { TaskManager } from './components/TaskManager';
import { ReportsDashboard } from './components/ReportsDashboard';
import { SettingsView } from './components/SettingsView';
import { ViewMode, ScheduleSlot, ClassGroup, Student, Task, ThemeColor, AppSettings } from './types';
import { INITIAL_CLASSES, INITIAL_SCHEDULE } from './constants';
import { Moon, Sun, Bell, User as UserIcon, GraduationCap } from 'lucide-react';

function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('schedule');
  const [currentWeek, setCurrentWeek] = useState(1);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('muallim-dark-mode') === 'true';
  });
  const [settings, setSettings] = useState<AppSettings>(() => {
    const savedSettings = localStorage.getItem('muallim-settings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      if (typeof parsed.maxGrade === 'number') {
        parsed.maxGrades = {
          participation: parsed.maxGrade,
          homework: parsed.maxGrade,
          activity: parsed.maxGrade,
          quiz: parsed.maxGrade
        };
        delete parsed.maxGrade;
      }
      return parsed;
    }
    return {
      themeColor: 'emerald',
      teacherName: 'المعلم الذكي',
      schoolName: 'مدرستي المتميزة',
      voiceEnabled: true,
      maxGrades: {
        participation: 10,
        homework: 10,
        activity: 10,
        quiz: 10
      },
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
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const themeClasses: Record<ThemeColor, string> = {
    emerald: 'theme-emerald',
    blue: 'theme-blue',
    purple: 'theme-purple',
    orange: 'theme-orange',
    rose: 'theme-rose'
  };

  const handleUpdateSchedule = (updatedSlot: ScheduleSlot) => {
    setSchedule(prev => prev.map(slot => 
        (slot.day === updatedSlot.day && slot.period === updatedSlot.period) 
        ? updatedSlot 
        : slot
    ));
  };

  const handleUpdateStudent = (classId: string, updatedStudent: Student) => {
      setClasses(classes.map(c => {
          if (c.id === classId) {
              return {
                  ...c,
                  students: c.students.map(s => s.id === updatedStudent.id ? updatedStudent : s)
              };
          }
          return c;
      }));
  };

  return (
    <div className={`flex h-[100dvh] bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 overflow-hidden flex-col lg:flex-row transition-all ${themeClasses[settings.themeColor]}`}>
      
      <Sidebar currentView={currentView} setView={setCurrentView} teacherName={settings.teacherName} schoolName={settings.schoolName} />
      
      <main className="flex-1 h-full overflow-hidden relative flex flex-col">
        
        <header className="h-20 flex items-center justify-between px-8 md:px-12 shrink-0 z-30 border-b border-emerald-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 backdrop-blur-2xl">
            <div className="flex items-center gap-5">
                <div className="lg:hidden w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <GraduationCap className="text-white w-6 h-6" />
                </div>
                <div className="flex flex-col">
                    <h1 className="text-lg font-bold tracking-tight text-emerald-900 dark:text-white leading-none">{settings.schoolName}</h1>
                    <p className="text-[10px] font-bold text-emerald-600 mt-1 uppercase tracking-widest">{settings.teacherName}</p>
                </div>
            </div>

            <div className="flex items-center gap-5">
                <button 
                    onClick={() => setIsDarkMode(!isDarkMode)} 
                    className="w-11 h-11 flex items-center justify-center bg-emerald-50 dark:bg-slate-800 rounded-xl hover:bg-emerald-100 transition-all border border-emerald-100 dark:border-slate-700"
                >
                    {isDarkMode ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-emerald-700" />}
                </button>
                
                <div className="flex items-center gap-4 ps-6 border-s border-emerald-100 dark:border-slate-800">
                    <div className="hidden sm:flex flex-col text-left">
                        <p className="text-[11px] font-bold leading-none mb-1 text-emerald-900 dark:text-emerald-100">{settings.teacherName}</p>
                        <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest">متصل</p>
                    </div>
                    <div className="w-11 h-11 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-emerald-600/20">
                        <UserIcon className="w-5 h-5" />
                    </div>
                </div>
            </div>
        </header>

        <div className="flex-1 overflow-hidden relative z-10 p-4 md:p-8 animate-vibrant">
            <div className="h-full bg-white/90 dark:bg-slate-900/60 rounded-[2.5rem] border border-emerald-100 dark:border-slate-800 shadow-xl overflow-hidden backdrop-blur-3xl">
                 {currentView === 'schedule' && (
                    <WeeklyPlanner 
                        schedule={schedule} 
                        classes={classes}
                        updateSchedule={handleUpdateSchedule}
                        currentWeek={currentWeek}
                        setCurrentWeek={setCurrentWeek}
                        voiceEnabled={settings.voiceEnabled}
                        isMasterLocked={settings.isMasterScheduleLocked}
                    />
                )}
                {currentView === 'classes' && (
                    <ClassManager 
                        classes={classes}
                        addClass={(n) => {}}
                        deleteClass={(id) => {}}
                        addStudent={(cid, n) => {}}
                        importStudents={(cid, ns) => {}}
                        deleteStudent={(cid, sid) => {}}
                    />
                )}
                {currentView === 'tracker' && (
                    <StudentTracker 
                        classes={classes}
                        updateStudent={handleUpdateStudent}
                        currentWeek={currentWeek}
                        maxGrades={settings.maxGrades}
                    />
                )}
                {currentView === 'tasks' && (
                    <TaskManager 
                        tasks={tasks}
                        addTask={(t, p, d) => {}}
                        toggleTask={(id) => {}}
                        deleteTask={(id) => {}}
                    />
                )}
                {currentView === 'reports' && (
                    <ReportsDashboard 
                        classes={classes}
                        schedule={schedule}
                    />
                )}
                {currentView === 'settings' && (
                    <SettingsView 
                        settings={settings}
                        setSettings={setSettings}
                    />
                )}
            </div>
        </div>
        
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[140px] -z-10 pointer-events-none"></div>
      </main>
    </div>
  );
}

export default App;
