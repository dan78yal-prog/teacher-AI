
import React, { useState } from 'react';
import { DayOfWeek, ScheduleSlot, LessonPlan, ClassGroup } from '../types';
import { Zap, Wand2, X, Sparkles, ChevronRight, ChevronLeft, Settings2, Plus, Info, Layout, Layers, Save, Target, CheckCircle2, Bookmark, MapPin, Star } from 'lucide-react';
import { generateLessonPlan } from '../services/geminiService';

interface WeeklyPlannerProps {
  schedule: ScheduleSlot[];
  classes: ClassGroup[];
  updateSchedule: (newSlot: ScheduleSlot) => void;
  currentWeek: number;
  setCurrentWeek: (w: number) => void;
  voiceEnabled: boolean;
  isMasterLocked?: boolean;
}

export const WeeklyPlanner: React.FC<WeeklyPlannerProps> = ({ 
  schedule, classes, updateSchedule, currentWeek, setCurrentWeek, voiceEnabled, isMasterLocked 
}) => {
  const [selectedSlot, setSelectedSlot] = useState<ScheduleSlot | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isMasterMode, setIsMasterMode] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);

  const [formData, setFormData] = useState({
    subject: '', topic: '', className: '', objectives: '', homework: '', materials: '', strategy: ''
  });

  const handleSlotClick = (slot: ScheduleSlot) => {
    const plan = slot.weekPlans?.[currentWeek];
    setSelectedSlot(slot);
    setFormData({
      subject: plan?.subject || '',
      topic: plan?.topic || '',
      className: slot.className || '',
      objectives: plan?.objectives.join('\n') || '',
      homework: plan?.homework || '',
      materials: plan?.materials || '',
      strategy: plan?.strategy || '',
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!selectedSlot) return;
    const currentPlan = selectedSlot.weekPlans?.[currentWeek];
    const updatedLesson: LessonPlan = {
      id: currentPlan?.id || Math.random().toString(),
      subject: formData.subject,
      topic: formData.topic,
      objectives: formData.objectives.split('\n').filter(Boolean),
      materials: formData.materials,
      content: currentPlan?.content || '',
      homework: formData.homework,
      strategy: formData.strategy,
      isGenerated: !!currentPlan?.isGenerated,
    };
    
    updateSchedule({
      ...selectedSlot,
      className: isMasterMode ? formData.className : selectedSlot.className,
      weekPlans: { ...(selectedSlot.weekPlans || {}), [currentWeek]: updatedLesson }
    });
    setIsEditing(false);
  };

  const handleAIGenerate = async () => {
    if (!formData.subject || !formData.topic) {
        alert("يرجى إدخال المادة وعنوان الدرس أولاً");
        return;
    }
    setLoadingAI(true);
    try {
        const plan = await generateLessonPlan(formData.subject, formData.topic, selectedSlot?.className || "غير محدد", "");
        if (plan) {
            setFormData(prev => ({
                ...prev,
                objectives: plan.objectives.join('\n'),
                materials: plan.materials,
                homework: plan.homework,
                strategy: plan.strategy || '',
            }));
        }
    } catch (error) {
        console.error("AI Generation failed:", error);
    } finally {
        setLoadingAI(false);
    }
  };

  const days = Object.values(DayOfWeek);
  const periods = [1, 2, 3, 4, 5, 6, 7];

  return (
    <div className="h-full flex flex-col overflow-hidden animate-vibrant bg-transparent">
      
      {/* Header Controls */}
      <div className="px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0 border-b border-slate-50 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 icon-container !bg-emerald-50 !text-emerald-600">
                <Zap className="w-5 h-5" />
            </div>
            <div>
                <h2 className="text-base font-bold text-slate-800 dark:text-white leading-tight">
                    {isMasterMode ? 'إعداد الجدول' : 'الخطة الأسبوعية'}
                </h2>
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-0.5 inline-block">الأسبوع {currentWeek}</span>
            </div>
        </div>

        <div className="flex items-center gap-2 bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-100 dark:border-slate-700">
            {!isMasterMode && (
                <div className="flex items-center">
                    <button onClick={() => setCurrentWeek(Math.max(1, currentWeek - 1))} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg"><ChevronRight className="w-4 h-4" /></button>
                    <span className="px-3 text-[11px] font-bold">أسبوع {currentWeek}</span>
                    <button onClick={() => setCurrentWeek(Math.min(15, currentWeek + 1))} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg"><ChevronLeft className="w-4 h-4" /></button>
                </div>
            )}
            <div className="w-px h-5 bg-slate-100 dark:bg-slate-700 mx-1"></div>
            {!isMasterLocked && (
                <button 
                    onClick={() => setIsMasterMode(!isMasterMode)}
                    className={`px-4 py-2 text-[10px] font-bold rounded-lg flex items-center gap-2 transition-all ${isMasterMode ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-800 dark:bg-slate-100 text-white dark:text-slate-900'}`}
                >
                    <Settings2 className="w-3.5 h-3.5" /> {isMasterMode ? 'حفظ الحصص' : 'تعديل الجدول'}
                </button>
            )}
        </div>
      </div>

      {/* Compact Grid */}
      <div className="flex-1 overflow-auto p-4 md:p-6 custom-scrollbar">
        <div className="grid grid-cols-6 gap-2.5 min-w-[700px]">
            <div className="w-10"></div>
            {days.map((day) => (
                <div key={day} className="p-1 text-center text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest">
                    {day}
                </div>
            ))}

            {periods.map((period) => (
            <React.Fragment key={period}>
                <div className="flex items-center justify-center font-bold text-emerald-600/30 dark:text-emerald-900/30 text-2xl">
                   {period}
                </div>
                {days.map((day) => {
                    const slot = schedule.find((s) => s.day === day && s.period === period);
                    const plan = slot?.weekPlans?.[currentWeek];
                    const isConfigured = !!slot?.className;
                    
                    return (
                        <div
                        key={`${day}-${period}`}
                        onClick={() => slot && handleSlotClick(slot)}
                        className={`
                            p-3 rounded-xl cursor-pointer transition-all duration-200 min-h-[85px] flex flex-col group border
                            ${isMasterMode 
                                ? (isConfigured 
                                    ? 'bg-emerald-50 border-emerald-100' 
                                    : 'bg-white border-dashed border-emerald-100 dark:bg-slate-800/50 hover:border-emerald-500'
                                  ) 
                                : (isConfigured 
                                    ? 'vibrant-card border-slate-100 dark:border-slate-800 hover:border-emerald-500/30' 
                                    : 'bg-slate-100/30 dark:bg-slate-900/20 border-dashed border-slate-200 dark:border-slate-800 hover:border-emerald-500/30'
                                  )
                            }
                        `}
                        >
                        {isConfigured ? (
                            <div className="flex flex-col h-full">
                                <div className="flex items-center justify-between mb-1">
                                    <div className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${isMasterMode ? 'bg-emerald-100 text-emerald-700' : 'bg-emerald-50 text-emerald-600'}`}>
                                        {slot.className}
                                    </div>
                                    <Bookmark className={`w-3 h-3 ${isMasterMode ? 'text-emerald-600' : 'text-slate-300'}`} />
                                </div>
                                <h4 className="font-bold text-[11px] leading-tight text-slate-700 dark:text-slate-200 line-clamp-2">{plan?.subject || (isMasterMode ? 'حصة مثبتة' : 'عنوان الدرس')}</h4>
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center text-emerald-600/10 opacity-0 group-hover:opacity-100 transition-all">
                                <Plus className="w-5 h-5" />
                            </div>
                        )}
                        </div>
                    );
                })}
            </React.Fragment>
            ))}
        </div>
      </div>

      {/* Modal - Refined & Emerald */}
      {isEditing && selectedSlot && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={() => setIsEditing(false)}></div>
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-sm flex flex-col overflow-hidden animate-vibrant relative z-10 border border-slate-200 dark:border-slate-800">
            <div className="p-4 flex justify-between items-center border-b border-slate-50 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 icon-container !bg-emerald-50 !text-emerald-600">
                    <Target className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-none">{isMasterMode ? 'تعديل الحصة' : 'تحضير الدرس'}</h3>
                    <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{selectedSlot.day} - {selectedSlot.period}</span>
                </div>
              </div>
              <button onClick={() => setIsEditing(false)} className="p-2 text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>

            <div className="p-5 space-y-4">
                {isMasterMode ? (
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase px-1">اختر الفصل لهذه الحصة</label>
                        <select
                            className="w-full p-3 text-[12px] font-bold border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-800 focus:border-emerald-500 outline-none"
                            value={formData.className}
                            onChange={(e) => setFormData({...formData, className: e.target.value})}
                        >
                            <option value="">-- لم يتم التحديد --</option>
                            {classes.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                        </select>
                    </div>
                ) : (
                    <>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase px-1">المادة</label>
                            <input
                                type="text"
                                className="w-full p-2.5 text-[12px] font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:border-emerald-500 outline-none"
                                value={formData.subject}
                                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                placeholder="مثلاً: لغتي"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase px-1">عنوان الدرس</label>
                            <input
                                type="text"
                                className="w-full p-2.5 text-[12px] font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:border-emerald-500 outline-none"
                                value={formData.topic}
                                onChange={(e) => setFormData({...formData, topic: e.target.value})}
                                placeholder="مثلاً: المبتدأ والخبر"
                            />
                        </div>
                        <button 
                            onClick={handleAIGenerate} 
                            disabled={loadingAI}
                            className="w-full py-3 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-xl font-bold text-[10px] flex items-center justify-center gap-2"
                        >
                            {loadingAI ? <Sparkles className="w-4 h-4 animate-pulse" /> : <Wand2 className="w-4 h-4" />} مساعد التحضير الذكي
                        </button>
                    </>
                )}
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 flex justify-end">
                <button onClick={handleSave} className="px-8 py-2.5 bg-emerald-600 text-white rounded-xl text-[12px] font-bold shadow-lg shadow-emerald-600/20">حفظ التغييرات</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
