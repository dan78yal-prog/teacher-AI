
import React from 'react';
import { AppSettings, ThemeColor } from '../types';
import { Settings, Palette, User, School, Check, Volume2, VolumeX, Database, Award, Lock, Unlock, Star, PenTool, Lightbulb, BookOpen } from 'lucide-react';

interface SettingsViewProps {
  settings: AppSettings;
  setSettings: (s: AppSettings) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ settings, setSettings }) => {
  const colors: { id: ThemeColor; bg: string; label: string }[] = [
    { id: 'emerald', bg: 'bg-emerald-500', label: 'أخضر' },
    { id: 'blue', bg: 'bg-blue-500', label: 'أزرق' },
    { id: 'purple', bg: 'bg-purple-500', label: 'بنفسجي' },
    { id: 'orange', bg: 'bg-orange-500', label: 'برتقالي' },
    { id: 'rose', bg: 'bg-rose-500', label: 'وردي' },
  ];

  const updateMaxGrade = (key: keyof AppSettings['maxGrades'], value: number) => {
    setSettings({
      ...settings,
      maxGrades: {
        ...settings.maxGrades,
        [key]: value
      }
    });
  };

  return (
    <div className="h-full p-6 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 icon-container !bg-emerald-50 !text-emerald-600">
          <Settings className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-none">الإعدادات</h2>
          <p className="text-slate-400 text-[9px] uppercase tracking-widest mt-1">تخصيص لوحة المعلم</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="vibrant-card p-6 rounded-2xl space-y-6">
              <h3 className="font-bold text-sm flex items-center gap-2 text-slate-700 dark:text-slate-200"><Palette className="w-4 h-4 text-emerald-600" /> مظهر التطبيق</h3>
              <div className="grid grid-cols-5 gap-3">
                  {colors.map(color => (
                      <button
                          key={color.id}
                          onClick={() => setSettings({ ...settings, themeColor: color.id })}
                          className={`aspect-square rounded-xl flex items-center justify-center transition-all ${color.bg} ${settings.themeColor === color.id ? 'ring-4 ring-emerald-600/20 scale-105' : 'opacity-40 hover:opacity-100'}`}
                      >
                          {settings.themeColor === color.id && <Check className="w-4 h-4 text-white" />}
                      </button>
                  ))}
              </div>

              <div className="pt-4 border-t border-slate-50 dark:border-slate-800">
                  <h3 className="font-bold text-[11px] mb-3 text-slate-500 uppercase tracking-widest">المساعد الصوتي</h3>
                  <button 
                    onClick={() => setSettings({ ...settings, voiceEnabled: !settings.voiceEnabled })}
                    className={`w-full p-3.5 rounded-xl flex items-center justify-between border ${settings.voiceEnabled ? 'bg-emerald-50 border-emerald-600/30 text-emerald-600' : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400'}`}
                  >
                    <span className="text-[11px] font-bold uppercase">{settings.voiceEnabled ? 'مفعل' : 'معطل'}</span>
                    {settings.voiceEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                  </button>
              </div>
          </div>

          <div className="vibrant-card p-6 rounded-2xl space-y-6">
              <h3 className="font-bold text-sm flex items-center gap-2 text-slate-700 dark:text-slate-200"><Database className="w-4 h-4 text-emerald-600" /> الدرجات القصوى</h3>
              
              <div className="space-y-5 bg-slate-50 dark:bg-slate-900/40 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
                <GradeSettingRow label="المشاركة" value={settings.maxGrades.participation} icon={<Star className="w-3.5 h-3.5" />} onChange={(v) => updateMaxGrade('participation', v)} />
                <GradeSettingRow label="الواجبات" value={settings.maxGrades.homework} icon={<PenTool className="w-3.5 h-3.5" />} onChange={(v) => updateMaxGrade('homework', v)} />
                <GradeSettingRow label="الأنشطة" value={settings.maxGrades.activity} icon={<Lightbulb className="w-3.5 h-3.5" />} onChange={(v) => updateMaxGrade('activity', v)} />
                <GradeSettingRow label="الاختبارات" value={settings.maxGrades.quiz} icon={<BookOpen className="w-3.5 h-3.5" />} onChange={(v) => updateMaxGrade('quiz', v)} />
              </div>
          </div>
      </div>
    </div>
  );
};

const GradeSettingRow = ({ label, value, icon, onChange }: { label: string, value: number, icon: React.ReactNode, onChange: (v: number) => void }) => (
  <div className="space-y-2.5">
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2 text-emerald-600">
        <span className="opacity-80">{icon}</span>
        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">{label}</span>
      </div>
      <span className="grade-badge-prominent !bg-emerald-600 text-[10px]">{value} د</span>
    </div>
    <input 
      type="range" 
      min="5" 
      max="100" 
      step="5"
      className="w-full accent-emerald-600 h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer"
      value={value}
      onChange={(e) => onChange(parseInt(e.target.value))}
    />
  </div>
);
