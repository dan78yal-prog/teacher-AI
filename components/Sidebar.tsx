
import React from 'react';
import { LayoutDashboard, Users, BookOpen, Settings, CheckSquare, BarChart3 } from 'lucide-react';
import { ViewMode } from '../types';

interface SidebarProps {
  currentView: ViewMode;
  setView: (view: ViewMode) => void;
  teacherName: string;
  schoolName: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, teacherName }) => {
  const menuItems = [
    { id: 'schedule', label: 'الجدول', icon: LayoutDashboard },
    { id: 'tracker', label: 'المتابعة', icon: BookOpen },
    { id: 'classes', label: 'الفصول', icon: Users },
    { id: 'tasks', label: 'المهام', icon: CheckSquare },
    { id: 'reports', label: 'التقارير', icon: BarChart3 },
  ];

  return (
    <>
      {/* Desktop Sidebar (Right) */}
      <div className="hidden lg:flex w-48 bg-[#0f172a] flex-col h-full z-50">
        <div className="p-6 flex flex-col items-center gap-2">
          <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
            <span className="text-xl font-bold">م</span>
          </div>
          <div className="text-center mt-2">
            <h2 className="text-white font-bold text-sm">معلم AI</h2>
            <p className="text-slate-500 text-[10px]">الإصدار 2.5</p>
          </div>
        </div>

        <nav className="flex-1 px-3 space-y-2 mt-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id as ViewMode)}
                className={`w-full flex items-center justify-end gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive 
                  ? 'sidebar-active text-white' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="font-bold text-xs">{item.label}</span>
                <Icon className="w-5 h-5" />
              </button>
            );
          })}
        </nav>

        <div className="p-4 mt-auto">
          <button 
            onClick={() => setView('settings')}
            className={`w-full flex items-center justify-end gap-3 px-4 py-4 rounded-xl text-slate-400 hover:text-white transition-all ${currentView === 'settings' ? 'sidebar-active text-white' : ''}`}
          >
            <span className="font-bold text-xs">الإعدادات</span>
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile Navigation (Bottom) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#0f172a]/95 backdrop-blur-lg z-[100] flex items-center justify-around px-2 border-t border-white/10 shadow-[0_-5px_20px_rgba(0,0,0,0.3)]">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id as ViewMode)}
              className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all ${
                isActive ? 'text-emerald-400 bg-white/5' : 'text-slate-500'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[9px] font-bold mt-1">{item.label}</span>
            </button>
          );
        })}
        <button
          onClick={() => setView('settings')}
          className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all ${
            currentView === 'settings' ? 'text-emerald-400 bg-white/5' : 'text-slate-500'
          }`}
        >
          <Settings className="w-5 h-5" />
          <span className="text-[9px] font-bold mt-1">الإعدادات</span>
        </button>
      </div>
    </>
  );
};
