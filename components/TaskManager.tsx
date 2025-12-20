
import React, { useState } from 'react';
import { Task } from '../types';
import { CheckSquare, Plus, Trash2, Calendar as CalendarIcon, CheckCircle2, Zap } from 'lucide-react';

interface TaskManagerProps {
  tasks: Task[];
  addTask: (text: string, priority: 'high' | 'medium' | 'low', date?: string) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
}

export const TaskManager: React.FC<TaskManagerProps> = ({ tasks, addTask, toggleTask, deleteTask }) => {
  const [newTaskText, setNewTaskText] = useState('');
  const [newPriority, setNewPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [newDate, setNewDate] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskText.trim()) {
      addTask(newTaskText, newPriority, newDate);
      setNewTaskText('');
      setNewDate('');
      setNewPriority('medium');
    }
  };

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'high': return 'text-rose-600 bg-rose-50 border-rose-100 dark:bg-rose-900/20 dark:border-rose-800';
      case 'medium': return 'text-amber-600 bg-amber-50 border-amber-100 dark:bg-amber-900/20 dark:border-amber-800';
      case 'low': return 'text-emerald-600 bg-emerald-50 border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800';
      default: return 'text-slate-500';
    }
  };

  const sortedTasks = [...tasks].sort((a, b) => {
      if (a.completed === b.completed) {
          const pMap = { high: 3, medium: 2, low: 1 };
          return pMap[b.priority] - pMap[a.priority];
      }
      return a.completed ? 1 : -1;
  });

  return (
    <div className="h-full p-4 lg:p-6 flex flex-col gap-4 lg:gap-6 overflow-hidden animate-vibrant">
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-8 h-8 lg:w-10 lg:h-10 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-xl flex items-center justify-center shadow-sm">
            <CheckSquare className="w-4 h-4 lg:w-5 lg:h-5" />
        </div>
        <div>
            <h2 className="text-sm lg:text-base font-bold text-slate-800 dark:text-white leading-none">قائمة المهام</h2>
            <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest mt-1">نظم أولوياتك وتابع إنجازاتك</p>
        </div>
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 h-full overflow-hidden">
        {/* Form Section */}
        <div className="lg:col-span-1 shrink-0">
            <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl border border-white dark:border-slate-700 p-4 shadow-sm">
                <form onSubmit={handleAdd} className="space-y-3">
                    <div className="space-y-1">
                        <label className="text-[9px] font-bold text-slate-400 uppercase px-1">عنوان المهمة</label>
                        <input 
                            type="text" 
                            className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-xl outline-none text-[11px] font-bold text-slate-700 dark:text-slate-200 placeholder:text-slate-300 focus:border-emerald-500 transition-all shadow-inner"
                            placeholder="ما الذي تريد إنجازه؟"
                            value={newTaskText}
                            onChange={(e) => setNewTaskText(e.target.value)}
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                            <label className="text-[9px] font-bold text-slate-400 uppercase px-1">الأولوية</label>
                            <select 
                                className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-xl text-[10px] font-bold text-slate-700 dark:text-slate-300 outline-none focus:border-emerald-500 shadow-inner"
                                value={newPriority}
                                onChange={(e) => setNewPriority(e.target.value as any)}
                            >
                                <option value="high">عالية</option>
                                <option value="medium">متوسطة</option>
                                <option value="low">عادية</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[9px] font-bold text-slate-400 uppercase px-1">التاريخ</label>
                            <input 
                                type="date" 
                                className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-xl text-[10px] font-bold text-slate-700 dark:text-slate-300 outline-none focus:border-emerald-500 shadow-inner"
                                value={newDate}
                                onChange={(e) => setNewDate(e.target.value)}
                             />
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold text-[11px] shadow-lg shadow-emerald-600/20 active:scale-95 transition-all flex items-center justify-center gap-2 mt-2">
                        <Plus className="w-4 h-4" /> إضافة إلى القائمة
                    </button>
                </form>
            </div>
        </div>

        {/* List Section */}
        <div className="lg:col-span-2 flex-1 overflow-y-auto custom-scrollbar pb-32 lg:pb-6">
            {tasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 opacity-20">
                    <Zap className="w-12 h-12 mb-3 text-emerald-600" />
                    <p className="font-bold text-[11px]">لا توجد مهام حالية.. ابدأ بإضافة واحدة!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-2">
                {sortedTasks.map(task => (
                    <div 
                        key={task.id} 
                        className={`group flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 ${
                            task.completed 
                            ? 'bg-slate-50/50 dark:bg-slate-900/30 opacity-60 border-transparent' 
                            : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-emerald-200 shadow-sm'
                        }`}
                    >
                        <button 
                            onClick={() => toggleTask(task.id)} 
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                                task.completed 
                                ? 'bg-emerald-600 border-emerald-600 text-white' 
                                : 'border-slate-200 dark:border-slate-700 hover:border-emerald-400'
                            }`}
                        >
                            <CheckCircle2 className={`w-3.5 h-3.5 ${task.completed ? 'scale-100' : 'scale-0'} transition-transform`} />
                        </button>
                        
                        <div className="flex-1 min-w-0">
                            <h4 className={`text-[11px] lg:text-[12px] font-bold leading-tight ${task.completed ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-200'}`}>
                                {task.text}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-md border uppercase tracking-tighter ${getPriorityColor(task.priority)}`}>
                                    {task.priority === 'high' ? 'عالية' : task.priority === 'medium' ? 'متوسطة' : 'عادية'}
                                </span>
                                {task.dueDate && (
                                    <div className="flex items-center gap-1 text-[8px] font-bold text-slate-400">
                                        <CalendarIcon className="w-2.5 h-2.5" />
                                        {task.dueDate}
                                    </div>
                                )}
                            </div>
                        </div>

                        <button 
                            onClick={() => deleteTask(task.id)} 
                            className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    </div>
                ))}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
