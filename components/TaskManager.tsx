
import React, { useState } from 'react';
import { Task } from '../types';
import { CheckSquare, Plus, Trash2, Calendar as CalendarIcon, Flag, Circle, CheckCircle2, Save } from 'lucide-react';

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
      case 'high': return 'text-red-600 bg-red-50 border-red-100 dark:bg-red-900/20 dark:border-red-800';
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
    <div className="h-full p-6 flex flex-col gap-6 overflow-hidden animate-vibrant">
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-10 h-10 icon-container !bg-emerald-50 !text-emerald-600">
            <CheckSquare className="w-5 h-5" />
        </div>
        <div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-white leading-none">قائمة المهام</h2>
            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-1">إدارة المواعيد والمسؤوليات</p>
        </div>
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 h-full overflow-hidden">
        {/* Form Section */}
        <div className="lg:col-span-1 shrink-0">
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-emerald-100 dark:border-slate-700 p-5 shadow-sm">
                <form onSubmit={handleAdd} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase px-1">عنوان المهمة</label>
                        <input 
                            type="text" 
                            className="w-full p-3 bg-emerald-50/30 dark:bg-slate-900 border border-emerald-100 dark:border-slate-700 rounded-xl outline-none text-[13px] font-bold text-emerald-900 dark:text-emerald-400 placeholder:text-slate-300 focus:border-emerald-500 transition-all"
                            placeholder="ما الذي تود إنجازه؟"
                            value={newTaskText}
                            onChange={(e) => setNewTaskText(e.target.value)}
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase px-1">الأولوية</label>
                            <select 
                                className="w-full p-3 bg-emerald-50/30 dark:bg-slate-900 border border-emerald-100 dark:border-slate-700 rounded-xl text-[11px] font-bold text-emerald-800 dark:text-emerald-400 outline-none focus:border-emerald-500"
                                value={newPriority}
                                onChange={(e) => setNewPriority(e.target.value as any)}
                            >
                                <option value="high">عالية جداً</option>
                                <option value="medium">متوسطة</option>
                                <option value="low">عادية</option>
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase px-1">التاريخ</label>
                            <input 
                                type="date" 
                                className="w-full p-3 bg-emerald-50/30 dark:bg-slate-900 border border-emerald-100 dark:border-slate-700 rounded-xl text-[11px] font-bold text-emerald-800 dark:text-emerald-400 outline-none focus:border-emerald-500"
                                value={newDate}
                                onChange={(e) => setNewDate(e.target.value)}
                             />
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-emerald-600 text-white py-3.5 rounded-xl font-bold text-[12px] shadow-lg shadow-emerald-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                        <Plus className="w-4 h-4" /> إضافة المهمة
                    </button>
                </form>
            </div>
        </div>

        {/* List Section */}
        <div className="lg:col-span-2 flex-1 overflow-y-auto custom-scrollbar pb-32 lg:pb-6">
            {tasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 opacity-20">
                    <CheckSquare className="w-16 h-16 mb-4 text-emerald-600" />
                    <p className="font-bold text-sm">لا توجد مهام حالية</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-2.5">
                {sortedTasks.map(task => (
                    <div 
                        key={task.id} 
                        className={`group flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200 ${
                            task.completed 
                            ? 'bg-slate-50 dark:bg-slate-900/50 opacity-60 border-transparent' 
                            : 'bg-white dark:bg-slate-800 border-emerald-50 dark:border-slate-700 hover:border-emerald-200 shadow-sm'
                        }`}
                    >
                        <button 
                            onClick={() => toggleTask(task.id)} 
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                                task.completed 
                                ? 'bg-emerald-600 border-emerald-600 text-white' 
                                : 'border-emerald-100 hover:border-emerald-400'
                            }`}
                        >
                            <CheckCircle2 className={`w-4 h-4 ${task.completed ? 'scale-100' : 'scale-0'} transition-transform`} />
                        </button>
                        
                        <div className="flex-1 min-w-0">
                            <h4 className={`text-[13px] font-bold leading-tight ${task.completed ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-200'}`}>
                                {task.text}
                            </h4>
                            <div className="flex items-center gap-3 mt-1.5">
                                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md border ${getPriorityColor(task.priority)}`}>
                                    {task.priority === 'high' ? 'عالية' : task.priority === 'medium' ? 'متوسطة' : 'عادية'}
                                </span>
                                {task.dueDate && (
                                    <div className="flex items-center gap-1 text-[9px] font-bold text-slate-400">
                                        <CalendarIcon className="w-3 h-3" />
                                        {task.dueDate}
                                    </div>
                                )}
                            </div>
                        </div>

                        <button 
                            onClick={() => deleteTask(task.id)} 
                            className="p-2 text-slate-200 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-all"
                        >
                            <Trash2 className="w-4 h-4" />
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
