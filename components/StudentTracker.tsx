
import React, { useState } from 'react';
import { ClassGroup, Student, AppSettings } from '../types';
import { ClipboardList, Star, Search, Plus, Minus, BookOpen, PenTool, Lightbulb, X, SlidersHorizontal, Award, Zap, Save } from 'lucide-react';

interface StudentTrackerProps {
  classes: ClassGroup[];
  updateStudent: (classId: string, student: Student) => void;
  currentWeek: number;
  maxGrades: AppSettings['maxGrades'];
}

export const StudentTracker: React.FC<StudentTrackerProps> = ({ classes, updateStudent, currentWeek, maxGrades }) => {
  const [selectedClassId, setSelectedClassId] = useState<string | null>(classes[0]?.id || null);
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  
  const activeClass = classes.find(c => c.id === selectedClassId);
  const filteredStudents = activeClass 
    ? activeClass.students.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const handleAttendance = (student: Student, status: 'present' | 'absent' | 'late' | 'excused') => {
    if (!activeClass) return;
    updateStudent(activeClass.id, {
        ...student,
        attendance: { ...student.attendance, [currentDate]: status }
    });
  };

  const updateScore = (student: Student, category: keyof Student, delta: number) => {
      if (!activeClass) return;
      
      const categoryToMaxMap: Record<string, keyof AppSettings['maxGrades']> = {
        participationScore: 'participation',
        homeworkScore: 'homework',
        activityScore: 'activity',
        quizScore: 'quiz'
      };

      const maxVal = maxGrades[categoryToMaxMap[category as string]] || 10;
      const currentVal = (student[category] as number) || 0;
      const newVal = Math.min(maxVal, Math.max(0, currentVal + delta));
      
      const updatedStudent = { ...student, [category]: newVal };
      updateStudent(activeClass.id, updatedStudent);
      if (editingStudent?.id === student.id) setEditingStudent(updatedStudent);
  };

  const getStatusColor = (status?: string, currentType?: string) => {
    if (status === currentType) {
        switch(status) {
            case 'present': return 'bg-emerald-600 text-white border-emerald-600';
            case 'absent': return 'bg-rose-500 text-white border-rose-500';
            case 'late': return 'bg-amber-500 text-white border-amber-500';
        }
    }
    return 'bg-white dark:bg-slate-800 text-slate-400 border-slate-100 dark:border-slate-700 hover:border-emerald-600/30';
  };

  return (
    <div className="h-full flex flex-col overflow-hidden animate-vibrant">
      
      {/* Header Bar - Compact & Green Icons */}
      <div className="px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 shrink-0 border-b border-slate-50 dark:border-slate-800 bg-white/30 dark:bg-slate-900/30 backdrop-blur-sm">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 icon-container !bg-emerald-50 !text-emerald-600">
                <Award className="w-5 h-5" />
            </div>
            <div>
                <h2 className="text-base font-bold text-slate-800 dark:text-white leading-tight">متابعة الطلاب</h2>
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-0.5 inline-block">الأسبوع {currentWeek}</span>
            </div>
        </div>
        
        <div className="relative w-full md:w-60">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600" />
            <input 
              type="text" 
              placeholder="ابحث عن طالب..." 
              className="w-full pl-3 pr-9 py-2 rounded-xl text-[12px] font-medium outline-none border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 focus:border-emerald-500 transition-all text-slate-800 dark:text-white" 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
            />
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 py-3 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0 border-b border-slate-50 dark:border-slate-800">
          {classes.map(c => (
              <button
                  key={c.id}
                  onClick={() => setSelectedClassId(c.id)}
                  className={`px-4 py-1.5 rounded-lg text-[11px] font-bold transition-all border ${
                      selectedClassId === c.id 
                      ? 'bg-emerald-600 border-emerald-600 text-white' 
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 hover:text-emerald-600'
                  }`}
              >
                  {c.name}
              </button>
          ))}
      </div>

      {/* Student List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
          {activeClass ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-28">
                {filteredStudents.map((student) => {
                    const status = student.attendance[currentDate];
                    return (
                        <div key={student.id} className="vibrant-card p-4 rounded-xl flex flex-col border border-slate-100 hover:border-emerald-600/20">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 rounded-lg flex items-center justify-center font-bold text-sm border border-emerald-100 dark:border-emerald-900/20">
                                        {student.name.charAt(0)}
                                    </div>
                                    <div className="flex flex-col truncate">
                                        <h4 className="font-bold text-[13px] text-slate-800 dark:text-white truncate">{student.name}</h4>
                                        <span className="text-[9px] font-bold text-slate-400 uppercase">#طالب_{student.id.slice(0,2)}</span>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setEditingStudent(student)}
                                    className="p-2 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-all"
                                >
                                    <SlidersHorizontal className="w-4 h-4" />
                                </button>
                            </div>
                            
                            <div className="flex gap-1.5">
                                {['present', 'absent', 'late'].map((type) => (
                                    <button 
                                        key={type}
                                        onClick={() => handleAttendance(student, type as any)} 
                                        className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${getStatusColor(status, type)}`}
                                    >
                                        {type === 'present' ? 'حاضر' : type === 'absent' ? 'غائب' : 'متأخر'}
                                    </button>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full opacity-20">
                <ClipboardList className="w-16 h-16 mb-4 text-emerald-600" />
                <h3 className="font-bold text-lg">اختر صفاً للمتابعة</h3>
            </div>
          )}
      </div>

      {/* Grading Modal */}
      {editingStudent && activeClass && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={() => setEditingStudent(null)}></div>
              <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-2xl relative z-10 overflow-hidden animate-vibrant border border-slate-200 dark:border-slate-800">
                  <div className="p-5 flex justify-between items-center border-b border-slate-50 dark:border-slate-800">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center font-bold text-lg border border-emerald-100">{editingStudent.name.charAt(0)}</div>
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-none">{editingStudent.name}</h3>
                      </div>
                      <button onClick={() => setEditingStudent(null)} className="p-2 text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
                  </div>

                  <div className="p-5 space-y-6">
                      <GradeControl label="المشاركة" value={editingStudent.participationScore} icon={<Star className="w-4 h-4" />} max={maxGrades.participation} onDelta={(d) => updateScore(editingStudent, 'participationScore', d)} />
                      <GradeControl label="الواجبات" value={editingStudent.homeworkScore} icon={<PenTool className="w-4 h-4" />} max={maxGrades.homework} onDelta={(d) => updateScore(editingStudent, 'homeworkScore', d)} />
                      <GradeControl label="الأنشطة" value={editingStudent.activityScore} icon={<Lightbulb className="w-4 h-4" />} max={maxGrades.activity} onDelta={(d) => updateScore(editingStudent, 'activityScore', d)} />
                      <GradeControl label="الاختبارات" value={editingStudent.quizScore} icon={<BookOpen className="w-4 h-4" />} max={maxGrades.quiz} onDelta={(d) => updateScore(editingStudent, 'quizScore', d)} />
                  </div>

                  <div className="p-5 bg-slate-50 dark:bg-slate-800/50 flex justify-end">
                      <button onClick={() => setEditingStudent(null)} className="px-8 py-2.5 bg-emerald-600 text-white rounded-xl text-[12px] font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/20">
                        <Save className="w-4 h-4" /> حفظ البيانات
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

const GradeControl = ({ label, value, icon, onDelta, max }: any) => (
    <div className="space-y-2">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-600">
                {icon}
                <span className="text-[12px] font-bold text-slate-700 dark:text-slate-300">{label}</span>
            </div>
            <span className="grade-badge-prominent !bg-emerald-600 text-[10px]">{value} / {max}</span>
        </div>
        <div className="flex items-center gap-3">
            <button onClick={() => onDelta(-1)} className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-emerald-600"><Minus className="w-3.5 h-3.5" /></button>
            <div className="flex-1 h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${(value / max) * 100}%` }}></div>
            </div>
            <button onClick={() => onDelta(1)} className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-emerald-600"><Plus className="w-3.5 h-3.5" /></button>
        </div>
    </div>
);
