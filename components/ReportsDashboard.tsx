
import React from 'react';
import { ClassGroup, ScheduleSlot } from '../types';
import { BarChart3, TrendingUp, Users, Calendar, Download, CheckCircle, Clock } from 'lucide-react';

interface ReportsDashboardProps {
  classes: ClassGroup[];
  schedule: ScheduleSlot[];
}

export const ReportsDashboard: React.FC<ReportsDashboardProps> = ({ classes, schedule }) => {
  const totalStudents = classes.reduce((acc, curr) => acc + curr.students.length, 0);

  return (
    <div className="h-full p-4 lg:p-10 flex flex-col gap-6 lg:gap-10 overflow-y-auto custom-scrollbar pb-24 lg:pb-10">
      <div className="flex flex-col-reverse lg:flex-row lg:items-center justify-between gap-4">
        <button className="w-full lg:w-auto px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl font-bold text-[11px] lg:text-xs flex items-center justify-center gap-2 shadow-sm">
          <Download className="w-4 h-4" /> تصدير CSV
        </button>
        <div className="flex items-center gap-4 text-right self-end lg:self-auto">
           <div className="bg-blue-100 dark:bg-blue-950/40 text-blue-600 p-2 lg:p-2.5 rounded-xl shadow-sm">
             <BarChart3 className="w-5 h-5 lg:w-6 lg:h-6" />
           </div>
           <div>
             <h2 className="text-lg lg:text-2xl font-black text-slate-800 dark:text-white">التقارير والتحليلات</h2>
             <p className="text-slate-400 text-[10px] lg:text-xs font-bold uppercase tracking-wider">نظرة شاملة على الأداء</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
        <StatCard title="إجمالي الطلاب" value={totalStudents} icon={<Users className="w-5 h-5" />} color="bg-blue-600" />
        <StatCard title="نسبة الحضور" value="0%" icon={<CheckCircle className="w-5 h-5" />} color="bg-emerald-500" sub="لا توجد بيانات" />
        <StatCard title="إكمال التحضير" value="0%" icon={<Calendar className="w-5 h-5" />} color="bg-violet-500" sub="0 حصة محضرة" />
        <StatCard title="عدد الفصول" value={classes.length} icon={<TrendingUp className="w-5 h-5" />} color="bg-orange-500" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
        <div className="col-span-1 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-6 lg:p-8 rounded-[1.5rem] lg:rounded-[2rem] flex flex-col gap-6 shadow-sm">
           <div className="flex items-center justify-end gap-2 text-rose-500">
             <span className="font-bold text-xs lg:text-sm">سجل الغياب (آخر 5)</span>
             <Clock className="w-4 h-4" />
           </div>
           <div className="flex-1 flex flex-col items-center justify-center py-8 lg:py-0 opacity-30">
             <CheckCircle className="w-12 h-12 lg:w-16 lg:h-16 text-emerald-500 mb-2" />
             <p className="text-[10px] lg:text-xs font-bold">لا توجد حالات غياب مسجلة</p>
           </div>
        </div>

        <div className="col-span-1 xl:col-span-2 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-6 lg:p-8 rounded-[1.5rem] lg:rounded-[2rem] shadow-sm">
           <div className="flex items-center justify-end gap-2 text-slate-800 dark:text-slate-200 mb-6 lg:mb-8">
             <span className="font-bold text-xs lg:text-sm">تقدم الجدول الدراسي</span>
             <Clock className="w-4 h-4" />
           </div>
           <div className="space-y-4">
              <div className="flex justify-between items-center text-[10px] lg:text-[11px] font-black uppercase tracking-widest">
                 <span className="text-emerald-500">تم التحضير</span>
                 <span className="text-slate-400">0%</span>
              </div>
              <div className="h-2.5 w-full bg-slate-50 dark:bg-slate-900 rounded-full overflow-hidden border border-slate-100 dark:border-slate-800 shadow-inner">
                <div className="h-full bg-gradient-to-l from-emerald-400 to-emerald-600 w-0 transition-all duration-1000"></div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color, sub }: any) => (
  <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-5 lg:p-6 rounded-[1.5rem] lg:rounded-[2rem] flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
    <div className="text-right">
       <p className="text-slate-400 text-[9px] lg:text-[10px] font-bold mb-1 lg:mb-2 uppercase tracking-widest">{title}</p>
       <h4 className="text-2xl lg:text-3xl font-black text-slate-800 dark:text-white leading-none">{value}</h4>
       {sub && <p className="text-[9px] text-slate-400 mt-1 lg:mt-2 font-bold italic opacity-75">{sub}</p>}
    </div>
    <div className={`${color} text-white p-2.5 lg:p-3 rounded-xl lg:rounded-2xl shadow-lg transform rotate-3`}>
      {icon}
    </div>
  </div>
);
