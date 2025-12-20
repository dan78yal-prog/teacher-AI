
import React from 'react';
import { LayoutDashboard, Users, BookOpen, Settings, CheckSquare, BarChart3, GraduationCap } from 'lucide-react';
import { ViewMode } from '../types';

interface SidebarProps {
  currentView: ViewMode;
  setView: (view: ViewMode) => void;
  teacherName: string;
  schoolName: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, teacherName, schoolName }) => {
  const menuItems = [
    { id: 'schedule', label: 'الجدول', icon: LayoutDashboard },
    { id: 'tracker', label: 'المتابعة', icon: BookOpen },
    { id: 'classes', label: 'الفصول', icon: Users },
    { id: 'tasks', label: 'المهام', icon: CheckSquare },
    { id: 'reports', label: 'التقارير', icon: BarChart3 },
  ];

  return (
    <>
    {/* Desktop Sidebar */}
    <div className="hidden lg:flex w-64 bg-white dark:bg-slate-900 flex-col z-20 h-full border-e border-slate-100 dark:border-slate-800">
      <div className="h-20 flex items-center px-6 shrink-0">
        <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-emerald-600 rounded-lg flex items-center justify-center text-white shadow-sm">
                 <GraduationCap className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
                <span className="font-bold text-base tracking-tight leading-none text-slate-800 dark:text-white mb-1">معلم الذكاء</span>
                <span className="text-[9px] font-bold text-emerald-600/70 uppercase tracking-widest">Muallim Suite</span>
            </div>
        </div>
      </div>

      <nav className="flex-1 py-4 space-y-1 px-3 overflow-y-auto no-scrollbar">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id as ViewMode)}
              className={`w-full flex items-center px-4 py-2.5 rounded-xl transition-all duration-200 ${isActive ? 'bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600' : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-emerald-600'}`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'stroke-[2.5px]' : 'stroke-[1.8px] text-emerald-600/60'}`} />
              <span className="ms-3 font-semibold text-[13px]">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-50 dark:border-slate-800">
        <button 
            onClick={() => setView('settings')}
            className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition-all ${currentView === 'settings' ? 'bg-slate-50 dark:bg-slate-800' : 'hover:bg-slate-50 dark:hover:bg-slate-800'}`}
        >
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
                <Settings className={`w-4 h-4 ${currentView === 'settings' ? 'text-emerald-600' : 'text-emerald-600/60'}`} />
            </div>
            <div className="flex flex-col text-right">
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200 truncate max-w-[120px]">{teacherName}</span>
                <span className="text-[9px] font-medium text-slate-400">الإعدادات</span>
            </div>
        </button>
      </div>
    </div>

    {/* Mobile Nav - Prominent Icons */}
    <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] h-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl z-50 flex items-center justify-around border border-slate-200 dark:border-slate-800 rounded-[24px] shadow-[0_12px_40px_rgba(0,0,0,0.12)] px-2">
        {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
                <button
                key={item.id}
                onClick={() => setView(item.id as ViewMode)}
                className={`relative flex flex-col items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 ${isActive ? 'bg-emerald-600 text-white scale-110 shadow-lg shadow-emerald-600/30' : 'text-slate-400'}`}
                >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'text-emerald-600/80 stroke-[2px]'}`} />
                {isActive && <div className="absolute -bottom-1.5 w-1 h-1 bg-white rounded-full"></div>}
                </button>
            );
        })}
        <button
            onClick={() => setView('settings')}
            className={`flex flex-col items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 ${currentView === 'settings' ? 'bg-emerald-600 text-white scale-110 shadow-lg shadow-emerald-600/30' : 'text-slate-400'}`}
        >
            <Settings className={`w-5 h-5 ${currentView === 'settings' ? 'text-white' : 'text-emerald-600/80 stroke-[2px]'}`} />
        </button>
    </div>
    </>
  );
};
