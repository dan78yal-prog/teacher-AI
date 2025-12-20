
import React, { useState, useRef } from 'react';
import { ClassGroup, Student } from '../types';
import { Users, UserPlus, Upload, Trash2, Plus, FileText, Search, UserCircle, LayoutGrid, List, MoreVertical, GraduationCap, ArrowLeft, Filter, X } from 'lucide-react';

interface ClassManagerProps {
  classes: ClassGroup[];
  addClass: (name: string) => void;
  deleteClass: (id: string) => void;
  addStudent: (classId: string, name: string) => void;
  importStudents: (classId: string, names: string[]) => void;
  deleteStudent: (classId: string, studentId: string) => void;
}

export const ClassManager: React.FC<ClassManagerProps> = ({ 
  classes, addClass, deleteClass, addStudent, importStudents, deleteStudent 
}) => {
  const [newClassName, setNewClassName] = useState('');
  const [selectedClassId, setSelectedClassId] = useState<string | null>(classes[0]?.id || null);
  const [newStudentName, setNewStudentName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (newClassName.trim()) {
      addClass(newClassName);
      setNewClassName('');
    }
  };

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (newStudentName.trim() && selectedClassId) {
      addStudent(selectedClassId, newStudentName);
      setNewStudentName('');
      setIsAddingStudent(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedClassId) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        const names = text.split(/\r?\n/).map(n => n.trim()).filter(n => n.length > 0);
        if (names.length > 0) {
            importStudents(selectedClassId, names);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
      };
      reader.readAsText(file);
    }
  };

  const activeClass = classes.find(c => c.id === selectedClassId);
  const filteredStudents = activeClass 
    ? activeClass.students.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  return (
    <div className="h-full flex flex-col overflow-hidden animate-vibrant">
      
      <div className="p-6 shrink-0 border-b border-emerald-50 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 icon-container !bg-emerald-50 !text-emerald-600">
                    <Users className="w-5 h-5" />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-emerald-900 dark:text-white leading-none">إدارة الفصول</h2>
                    <p className="text-[10px] font-bold text-emerald-600/70 mt-1 uppercase tracking-widest">قوائم الطلاب</p>
                </div>
            </div>

            <form onSubmit={handleAddClass} className="flex gap-2 w-full sm:w-auto bg-emerald-50/30 dark:bg-slate-900 p-1.5 rounded-xl border border-emerald-100 dark:border-slate-700 shadow-sm focus-within:border-emerald-500 transition-all">
                <input 
                    type="text" 
                    placeholder="إضافة فصل جديد..." 
                    className="flex-1 sm:w-48 bg-transparent px-3 py-1.5 text-[12px] font-bold outline-none text-emerald-900 dark:text-emerald-400 placeholder:text-slate-300" 
                    value={newClassName} 
                    onChange={(e) => setNewClassName(e.target.value)} 
                />
                <button type="submit" className="bg-emerald-600 text-white w-9 h-9 rounded-lg flex items-center justify-center hover:bg-emerald-700 shadow-md shadow-emerald-600/10">
                    <Plus className="w-5 h-5" />
                </button>
            </form>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-2">
            {classes.map(cls => (
                <button 
                    key={cls.id}
                    onClick={() => { setSelectedClassId(cls.id); setSearchQuery(''); }}
                    className={`relative min-w-[140px] px-5 py-4 rounded-xl flex flex-col items-start gap-1 transition-all border ${
                        selectedClassId === cls.id 
                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-600/20' 
                        : 'bg-white dark:bg-slate-900 border-emerald-50 dark:border-slate-800 text-emerald-800 dark:text-slate-300 hover:border-emerald-200'
                    }`}
                >
                    <span className={`font-bold text-sm truncate w-full text-right leading-none ${selectedClassId === cls.id ? 'text-white' : 'text-emerald-900'}`}>{cls.name}</span>
                    <span className={`text-[10px] font-bold ${selectedClassId === cls.id ? 'opacity-90' : 'text-emerald-600/60'}`}>{cls.students.length} طالب</span>
                </button>
            ))}
        </div>
      </div>

      <div className="flex-1 bg-transparent overflow-hidden flex flex-col">
        {activeClass ? (
            <div className="flex flex-col h-full">
                <div className="p-6 pb-2 shrink-0 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <h3 className="text-md font-bold text-emerald-900 dark:text-white">{activeClass.name}</h3>
                    <div className="relative w-full sm:w-60">
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600" />
                        <input 
                            type="text" 
                            placeholder="بحث عن طالب..." 
                            className="w-full pl-3 pr-9 py-2 bg-emerald-50/20 dark:bg-slate-800 border border-emerald-50 dark:border-slate-700 rounded-xl text-[12px] font-bold outline-none focus:border-emerald-500 text-emerald-900 dark:text-emerald-400" 
                            value={searchQuery} 
                            onChange={(e) => setSearchQuery(e.target.value)} 
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 pt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-28">
                        {filteredStudents.map((student, idx) => (
                            <div key={student.id} className="vibrant-card p-4 rounded-2xl flex items-center justify-between border border-emerald-50 hover:border-emerald-200 transition-all">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-emerald-50 dark:bg-slate-800 text-emerald-600 rounded-xl flex items-center justify-center font-bold text-sm border border-emerald-100 dark:border-slate-700">
                                        {student.name.charAt(0)}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-[13px] text-emerald-900 dark:text-emerald-100 leading-tight mb-0.5">{student.name}</span>
                                        <span className="text-[9px] font-bold text-emerald-600/40 uppercase">رقم {idx + 1}</span>
                                    </div>
                                </div>
                                <button onClick={() => deleteStudent(activeClass.id, student.id)} className="text-slate-200 hover:text-rose-500 p-2 hover:bg-rose-50 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        ) : (
            <div className="flex-1 flex flex-col items-center justify-center opacity-10">
                <GraduationCap className="w-20 h-20 mb-4 text-emerald-600" />
                <h3 className="font-bold text-lg text-emerald-900">اختر فصلاً من الأعلى</h3>
            </div>
        )}
      </div>
    </div>
  );
};
