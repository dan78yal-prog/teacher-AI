
import React from 'react';
import { AppSettings, ThemeColor } from '../types';
import { Settings, Palette, User, School, Check } from 'lucide-react';

interface SettingsViewProps {
  settings: AppSettings;
  setSettings: (s: AppSettings) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ settings, setSettings }) => {
  const colors: { id: ThemeColor; bg: string; label: string }[] = [
    { id: 'emerald', bg: 'bg-emerald-500', label: 'أخضر زمردي' },
    { id: 'blue', bg: 'bg-blue-500', label: 'أزرق ملكي' },
    { id: 'purple', bg: 'bg-purple-500', label: 'أرجواني' },
    { id: 'orange', bg: 'bg-orange-500', label: 'برتقالي' },
    { id: 'rose', bg: 'bg-rose-500', label: 'وردي' },
  ];

  return (
    <div className="h-full p-4 md:p-6 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-xl">
            <Settings className="w-8 h-8 text-slate-600 dark:text-slate-400" />
        </div>
        <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">الإعدادات</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">تخصيص تجربة التطبيق والبيانات الشخصية</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Appearance Section */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                  <Palette className="w-5 h-5 text-primary" /> مظهر التطبيق
              </h3>
              
              <div className="space-y-6">
                  <div>
                      <label className="block text-sm font-medium text-slate-500 mb-3">اللون الأساسي</label>
                      <div className="grid grid-cols-5 gap-3">
                          {colors.map(color => (
                              <button
                                  key={color.id}
                                  onClick={() => setSettings({ ...settings, themeColor: color.id })}
                                  className={`aspect-square rounded-xl flex items-center justify-center transition-all ${color.bg} ${settings.themeColor === color.id ? 'ring-4 ring-slate-200 dark:ring-slate-700 scale-110 shadow-lg' : 'hover:scale-105'}`}
                                  title={color.label}
                              >
                                  {settings.themeColor === color.id && <Check className="w-6 h-6 text-white" />}
                              </button>
                          ))}
                      </div>
                  </div>
              </div>
          </div>

          {/* Profile Section */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" /> البيانات التعريفية
              </h3>
              
              <div className="space-y-4">
                  <div>
                      <label className="block text-sm font-medium text-slate-500 mb-1.5 flex items-center gap-2">
                          <User className="w-4 h-4" /> اسم المعلم
                      </label>
                      <input 
                        type="text" 
                        className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-primary text-sm"
                        value={settings.teacherName}
                        onChange={(e) => setSettings({ ...settings, teacherName: e.target.value })}
                      />
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-slate-500 mb-1.5 flex items-center gap-2">
                          <School className="w-4 h-4" /> اسم المدرسة
                      </label>
                      <input 
                        type="text" 
                        className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-primary text-sm"
                        value={settings.schoolName}
                        onChange={(e) => setSettings({ ...settings, schoolName: e.target.value })}
                      />
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};
