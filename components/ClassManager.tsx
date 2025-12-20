
import React, { useState } from 'react';
import { ClassGroup } from '../types';
import { Users, Trash2, Plus, Search, ChevronLeft, ArrowRight } from 'lucide-react';

interface ClassManagerProps {
  classes: ClassGroup[];
  addClass: (name: string) => void;
  deleteClass: (id: string) => void;
  addStudent: (classId: string, name: string) => void;
  importStudents: (classId: string, names: string[]) => void;
  deleteStudent: (classId: string, studentId: string) => void;
}

export const ClassManager: React.FC<ClassManagerProps> = ({ 
  classes, addClass, deleteClass, addStudent 
}) => {
  const [newClassName, setNewClassName] = useState('');
  const [selectedClassId, setSelectedClassId] = useState<string | null>(classes[0]?.id || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newStudentName, setNewStudentName] = useState('');
  const [mobileView, setMobileView] = useState<'list' | 'details'>('list');

  const activeClass = classes.find(c => c.id === selectedClassId);
  const filteredStudents = activeClass 
    ? activeClass.students.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const handleSelectClass = (id: string) => {
    setSelectedClassId(id);
    if (window.innerWidth < 1024) setMobileView('details');
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="p-4 lg:p-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          {mobileView === 'details' && (
            <button onClick={() => setMobileView('list')} className="lg:hidden p-2 -mr-2">
              <ArrowRight className="w-5 h-5 text-emerald-500" />
            </button>
          )}
          <Users className="w-5 h-5 lg:w-6 lg:h-6 text-emerald-500" />
          <h2 className="text-lg lg:text-xl font-bold text-slate-800 dark:text-white">إدارة الفصول والطلاب</h2>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden relative">
        {/* Right Panel: Class List */}
        <div className={`
          absolute inset-0 lg:relative lg:inset-auto lg:w-72 border-l border-slate-100 dark:border-slate-800 p-4 lg:p-6 flex flex-col gap-4 overflow-y-auto bg-white/90 dark:bg-slate-900/90 lg:bg-transparent
          transition-transform duration-300 z-10
          ${mobileView === 'list' ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
        `}>
          <h3 className="font-bold text-xs lg:text-sm text-slate-500 text-right uppercase tracking-wider">الفصول الدراسية</h3>
          
          <div className="space-y-2">
            {classes.map(cls => (
              <div 
                key={cls.id}
                onClick={() => handleSelectClass(cls.id)}
                className={`p-3 lg:p-4 rounded-xl lg:rounded-2xl cursor-pointer flex items-center justify-between transition-all ${
                  selectedClassId === cls.id 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                  : 'bg-white hover:bg-slate-50 border-slate-50 text-slate-600'
                } border shadow-sm`}
              >
                <button onClick={(e) => { e.stopPropagation(); deleteClass(cls.id); }} className="text-rose-400 hover:text-rose-600"><Trash2 className="w-4 h-4" /></button>
                <div className="text-right">
                  <p className="font-bold text-xs lg:text-sm">{cls.name}</p>
                  <p className="text-[9px] lg:text-[10px] opacity-60 font-bold">{cls.students.length} طالب</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-auto pt-4 flex gap-2">
            <button onClick={() => { if(newClassName) { addClass(newClassName); setNewClassName(''); } }} className="bg-emerald-500 text-white p-2 lg:p-2.5 rounded-xl"><Plus className="w-5 h-5" /></button>
            <input 
              type="text" 
              placeholder="فصل جديد..." 
              className="flex-1 bg-white border border-slate-100 rounded-xl px-3 text-[11px] lg:text-xs text-right outline-none focus:border-emerald-500"
              value={newClassName}
              onChange={(e) => setNewClassName(e.target.value)}
            />
          </div>
        </div>

        {/* Left Panel: Students */}
        <div className={`
          flex-1 p-4 lg:p-8 overflow-y-auto custom-scrollbar transition-transform duration-300
          ${mobileView === 'details' ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          {activeClass ? (
            <div className="flex flex-col gap-4 lg:gap-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="text-right">
                  <h3 className="text-xl lg:text-2xl font-black text-slate-800 dark:text-white">{activeClass.name}</h3>
                  <p className="text-slate-400 text-[10px] lg:text-xs font-bold">قائمة الطلاب ({activeClass.students.length})</p>
                </div>
                <div className="relative w-full lg:w-64 order-first lg:order-last">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="بحث..." 
                    className="w-full pl-3 pr-9 py-2 bg-white border border-slate-100 rounded-full text-xs text-right shadow-sm focus:border-emerald-500 outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                {filteredStudents.map((student, idx) => (
                  <div key={student.id} className="bg-white dark:bg-slate-800 border border-slate-50 dark:border-slate-700 p-3 lg:p-4 rounded-xl lg:rounded-2xl flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 lg:w-8 lg:h-8 bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600 rounded-full flex items-center justify-center text-[10px] lg:text-xs font-bold">{idx + 1}</div>
                      <span className="font-bold text-[12px] lg:text-sm text-slate-700 dark:text-slate-200">{student.name}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 lg:mt-8 border-t border-slate-100 dark:border-slate-800 pt-6 lg:pt-8 mb-20 lg:mb-0">
                <p className="text-right text-[10px] lg:text-xs font-bold text-slate-500 mb-3 lg:mb-4 uppercase tracking-wider">إضافة طالب جديد</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input 
                    type="text" 
                    placeholder="اكتب اسم الطالب الكامل..." 
                    className="flex-1 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl lg:rounded-2xl px-4 py-3 text-xs lg:text-sm text-right outline-none focus:border-emerald-500 shadow-sm"
                    value={newStudentName}
                    onChange={(e) => setNewStudentName(e.target.value)}
                  />
                  <button onClick={() => { if(newStudentName) { addStudent(activeClass.id, newStudentName); setNewStudentName(''); } }} className="bg-emerald-600 text-white px-6 py-3 rounded-xl lg:rounded-2xl font-bold text-xs lg:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 active:scale-95 transition-transform">
                    <Plus className="w-4 h-4 lg:w-5 lg:h-5" /> إضافة سريع
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center opacity-20">
              <Users className="w-24 h-24 lg:w-32 lg:h-32 text-slate-300" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
