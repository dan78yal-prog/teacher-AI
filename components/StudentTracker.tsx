
import React, { useState } from 'react';
import { ClassGroup, Student } from '../types';
import { ClipboardList, Star, AlertCircle, CheckCircle, Clock, Save, MoreHorizontal, Trophy, Users, Search, Calendar as CalendarIcon, ChevronLeft, ChevronRight, Check, Share2, Info } from 'lucide-react';

interface StudentTrackerProps {
  classes: ClassGroup[];
  updateStudent: (classId: string, student: Student) => void;
}

export const StudentTracker: React.FC<StudentTrackerProps> = ({ classes, updateStudent }) => {
  const [selectedClassId, setSelectedClassId] = useState<string | null>(classes[0]?.id || null);
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);
  
  const activeClass = classes.find(c => c.id === selectedClassId);

  const filteredStudents = activeClass 
    ? activeClass.students.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAttendance = (student: Student, status: 'present' | 'absent' | 'late' | 'excused') => {
    if (!activeClass) return;
    const updatedStudent = {
        ...student,
        attendance: {
            ...student.attendance,
            [currentDate]: status
        }
    };
    updateStudent(activeClass.id, updatedStudent);
    // showToast(`تم رصد حالة ${student.name}`);
  };

  const markAllPresent = () => {
    if (!activeClass) return;
    activeClass.students.forEach(student => {
        handleAttendance(student, 'present');
    });
    showToast(`تم تحضير جميع طلاب ${activeClass.name}`);
  };

  const handleScore = (student: Student, delta: number) => {
      if (!activeClass) return;
      const newScore = Math.min(10, Math.max(0, student.participationScore + delta));
      const updatedStudent = { ...student, participationScore: newScore };
      updateStudent(activeClass.id, updatedStudent);
  };

  const handleNoteChange = (student: Student, note: string) => {
      if (!activeClass) return;
      updateStudent(activeClass.id, { ...student, notes: note });
  };

  const getStatusColor = (status?: string) => {
    switch(status) {
      case 'present': return 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]';
      case 'absent': return 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]';
      case 'late': return 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]';
      default: return 'bg-slate-300 dark:bg-slate-600';
    }
  };

  const handleShare = async () => {
    if (!activeClass) return;
    
    const stats = {
      present: activeClass.students.filter(s => s.attendance[currentDate] === 'present').length,
      absent: activeClass.students.filter(s => s.attendance[currentDate] === 'absent').length,
      late: activeClass.students.filter(s => s.attendance[currentDate] === 'late').length,
    };

    const text = `📊 تقرير حضور فصل: ${activeClass.name}\n📅 التاريخ: ${currentDate}\n✅ حاضر: ${stats.present}\n❌ غائب: ${stats.absent}\n⏰ متأخر: ${stats.late}\n\nتم الإرسال عبر تطبيق Muallim AI`;

    if (navigator.share) {
      try {
        await navigator.share({ title: 'تقرير الحضور اليومي', text });
      } catch (err) {
        console.error(err);
      }
    } else {
      await navigator.clipboard.writeText(text);
      showToast('تم نسخ التقرير للحافظة');
    }
  };

  const changeDate = (days: number) => {
      const date = new Date(currentDate);
      date.setDate(date.getDate() + days);
      setCurrentDate(date.toISOString().split('T')[0]);
  };

  const attendanceStats = activeClass ? {
    present: activeClass.students.filter(s => s.attendance[currentDate] === 'present').length,
    absent: activeClass.students.filter(s => s.attendance[currentDate] === 'absent').length,
    late: activeClass.students.filter(s => s.attendance[currentDate] === 'late').length,
  } : { present: 0, absent: 0, late: 0 };

  return (
    <div className="h-full flex flex-col p-4 md:p-6 overflow-y-auto pb-24 lg:pb-6 custom-scrollbar relative">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top duration-300">
           <div className={`px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 backdrop-blur-md border ${toast.type === 'success' ? 'bg-emerald-500/90 border-emerald-400 text-white' : 'bg-slate-800/90 border-slate-700 text-white'}`}>
              <CheckCircle className="w-5 h-5" />
              <span className="font-bold text-sm">{toast.message}</span>
           </div>
        </div>
      )}

      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
                <div className="bg-primary p-2.5 rounded-xl shadow-lg shadow-primary/30">
                    <Trophy className="w-6 h-6 md:w-7 md:h-7 text-white" />
                </div>
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white">المتابعة والتقييم</h2>
                    <div className="flex items-center gap-2 mt-1">
                        <button onClick={() => changeDate(-1)} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors">
                            <ChevronRight className="w-3 h-3 md:w-4 md:h-4 text-slate-500 dark:text-slate-400" />
                        </button>
                        <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm flex items-center gap-1 font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
                            <CalendarIcon className="w-3 h-3" />
                            {currentDate}
                        </p>
                         <button onClick={() => changeDate(1)} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors">
                            <ChevronLeft className="w-3 h-3 md:w-4 md:h-4 text-slate-500 dark:text-slate-400" />
                        </button>
                    </div>
                </div>
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="ابحث عن طالب..."
                        className="w-full pl-3 pr-9 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white shadow-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                  <button 
                      onClick={markAllPresent}
                      className="bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2.5 rounded-2xl text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap"
                  >
                      <Check className="w-4 h-4" /> حضّر الكل
                  </button>
                  <button 
                      onClick={handleShare}
                      className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 p-2.5 rounded-2xl transition-all"
                      title="مشاركة التقرير"
                  >
                      <Share2 className="w-5 h-5" />
                  </button>
                </div>
            </div>
        </div>
        
        {/* Attendance Summary */}
        <div className="grid grid-cols-3 gap-3">
             <div className="bg-emerald-50 dark:bg-emerald-900/10 p-3 rounded-2xl border border-emerald-100 dark:border-emerald-800/30 flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">حاضر</span>
                <span className="text-lg font-black text-emerald-700 dark:text-emerald-300">{attendanceStats.present}</span>
             </div>
             <div className="bg-amber-50 dark:bg-amber-900/10 p-3 rounded-2xl border border-amber-100 dark:border-amber-800/30 flex items-center justify-between">
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400">تأخر</span>
                <span className="text-lg font-black text-amber-700 dark:text-amber-300">{attendanceStats.late}</span>
             </div>
             <div className="bg-red-50 dark:bg-red-900/10 p-3 rounded-2xl border border-red-100 dark:border-red-800/30 flex items-center justify-between">
                <span className="text-xs font-bold text-red-600 dark:text-red-400">غائب</span>
                <span className="text-lg font-black text-red-700 dark:text-red-300">{attendanceStats.absent}</span>
             </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2">
            {classes.map(c => (
                <button
                    key={c.id}
                    onClick={() => {
                        setSelectedClassId(c.id);
                        setSearchQuery('');
                    }}
                    className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 transform whitespace-nowrap border ${
                        selectedClassId === c.id 
                        ? 'bg-slate-800 dark:bg-white text-white dark:text-slate-900 border-slate-800 dark:border-white shadow-lg scale-105' 
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                    }`}
                >
                    {c.name}
                </button>
            ))}
        </div>
      </div>

      {activeClass ? (
        <div className="bg-transparent md:bg-white/80 md:dark:bg-slate-900/80 md:backdrop-blur-sm md:rounded-3xl md:shadow-xl md:border md:border-slate-200 md:dark:border-slate-800 overflow-hidden">
            <div className="hidden md:grid grid-cols-12 gap-4 bg-slate-50/80 dark:bg-slate-800/80 p-5 border-b border-slate-100 dark:border-slate-700 font-bold text-slate-600 dark:text-slate-400 text-sm">
                <div className="col-span-3">الطالب</div>
                <div className="col-span-4 text-center">التحضير اليومي</div>
                <div className="col-span-2 text-center">المشاركة</div>
                <div className="col-span-3">ملاحظات</div>
            </div>
            
            <div className="space-y-3 md:space-y-0 md:divide-y md:divide-slate-100 dark:divide-slate-800 min-h-[300px]">
                {filteredStudents.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-48 text-slate-400 dark:text-slate-600">
                        <Search className="w-12 h-12 mb-2 opacity-50" />
                        <p className="font-bold">لا توجد نتائج مطابقة</p>
                    </div>
                ) : (
                    filteredStudents.map((student, idx) => {
                    const status = student.attendance[currentDate];
                    return (
                        <div key={student.id} className="bg-white dark:bg-slate-800 p-4 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm md:shadow-none md:border-0 md:rounded-none md:p-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-center transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50 group">
                            <div className="col-span-1 md:col-span-3 flex items-center justify-between md:justify-start gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                      <div className="w-10 h-10 md:w-9 md:h-9 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 border border-white dark:border-slate-600 shadow-sm flex items-center justify-center text-sm md:text-xs font-bold text-slate-700 dark:text-slate-200 shrink-0">
                                          {student.name.charAt(0)}
                                      </div>
                                      {/* Status Dot Indicator */}
                                      <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-800 transition-colors duration-500 ${getStatusColor(status)}`}></div>
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="font-bold text-slate-800 dark:text-slate-200 text-sm md:text-base truncate">{student.name}</span>
                                        <span className="text-[10px] text-slate-400 dark:text-slate-500">رقم المسلسل: {idx + 1}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="col-span-1 md:col-span-4 flex justify-between md:justify-center gap-2 bg-slate-50/50 dark:bg-slate-900/50 p-2 rounded-2xl md:bg-transparent md:p-0">
                                <button 
                                    onClick={() => handleAttendance(student, 'present')}
                                    className={`flex-1 md:flex-none flex items-center justify-center gap-1 p-2.5 md:p-2 rounded-xl md:rounded-full transition-all duration-300 active:scale-90 ${
                                        status === 'present' 
                                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' 
                                        : 'text-slate-400 dark:text-slate-500 hover:bg-white dark:hover:bg-slate-700 hover:text-emerald-500'
                                    }`}
                                    title="حاضر"
                                >
                                    <CheckCircle className="w-5 h-5" />
                                </button>
                                <button 
                                    onClick={() => handleAttendance(student, 'late')}
                                    className={`flex-1 md:flex-none flex items-center justify-center gap-1 p-2.5 md:p-2 rounded-xl md:rounded-full transition-all duration-300 active:scale-90 ${
                                        status === 'late' 
                                        ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30' 
                                        : 'text-slate-400 dark:text-slate-500 hover:bg-white dark:hover:bg-slate-700 hover:text-amber-500'
                                    }`}
                                    title="متأخر"
                                >
                                    <Clock className="w-5 h-5" />
                                </button>
                                <button 
                                    onClick={() => handleAttendance(student, 'absent')}
                                    className={`flex-1 md:flex-none flex items-center justify-center gap-1 p-2.5 md:p-2 rounded-xl md:rounded-full transition-all duration-300 active:scale-90 ${
                                        status === 'absent' 
                                        ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' 
                                        : 'text-slate-400 dark:text-slate-500 hover:bg-white dark:hover:bg-slate-700 hover:text-red-500'
                                    }`}
                                    title="غائب"
                                >
                                    <AlertCircle className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="hidden md:flex col-span-2 items-center justify-center gap-3">
                                <button onClick={() => handleScore(student, -1)} className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-red-100 dark:hover:bg-red-900/30 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 font-bold transition-all active:scale-90">-</button>
                                <div className={`w-11 h-11 rounded-xl border-2 flex items-center justify-center font-bold text-lg shadow-sm transition-colors duration-300 ${status === 'absent' ? 'opacity-50 grayscale' : ''}`}>
                                    {student.participationScore}
                                </div>
                                <button onClick={() => handleScore(student, 1)} className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 font-bold transition-all active:scale-90">+</button>
                            </div>

                            <div className="col-span-1 md:col-span-3">
                                <input 
                                    type="text" 
                                    className="w-full text-sm bg-slate-50/50 dark:bg-slate-900/50 md:bg-transparent rounded-xl md:rounded-none px-4 py-2.5 md:px-0 md:py-1 border border-slate-100 dark:border-slate-800 md:border-transparent md:border-b md:border-slate-200 md:dark:border-slate-700 focus:border-primary focus:ring-0 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600 text-slate-800 dark:text-slate-200"
                                    placeholder="اكتب ملاحظة..."
                                    value={student.notes}
                                    onChange={(e) => handleNoteChange(student, e.target.value)}
                                />
                            </div>
                        </div>
                    );
                }))}
            </div>
        </div>
      ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl m-4 bg-white/50 dark:bg-slate-800/20">
              <div className="bg-slate-100 dark:bg-slate-800 p-5 rounded-full mb-4">
                  <Users className="w-10 h-10 text-slate-300 dark:text-slate-600" />
              </div>
              <p className="font-bold text-lg">لم يتم اختيار فصل</p>
              <p className="text-sm">يرجى اختيار فصل من القائمة أعلاه لبدء التحضير</p>
          </div>
      )}
    </div>
  );
};
