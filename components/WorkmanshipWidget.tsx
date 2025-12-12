import React from 'react';
import { Hammer } from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../utils/translations';

interface WorkmanshipWidgetProps {
  min: number;
  max: number;
  loading: boolean;
  language: Language;
}

const WorkmanshipWidget: React.FC<WorkmanshipWidgetProps> = ({ min, max, loading, language }) => {
  const t = getTranslation(language);
  const avg = Math.round((min + max) / 2);

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-lg h-full transition-colors flex flex-col justify-center">
        <div className="flex items-center gap-3 mb-4">
           <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg animate-pulse h-10 w-10"></div>
           <div className="space-y-2">
             <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
             <div className="h-3 w-20 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
           </div>
        </div>
        <div className="h-12 w-full bg-slate-100 dark:bg-slate-700/50 rounded-lg animate-pulse mt-2"></div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-orange-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-xl p-6 border border-orange-100 dark:border-orange-900/30 shadow-lg h-full transition-all duration-300">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-orange-100 dark:bg-orange-500/10 rounded-lg transition-colors">
          <Hammer className="w-6 h-6 text-orange-600 dark:text-orange-500" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white">{t.workmanshipTitle}</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">{t.workmanshipDesc}</p>
        </div>
      </div>

      <div className="flex items-end justify-between px-2 mb-2 text-sm">
         <span className="text-slate-500 dark:text-slate-400 font-medium">{t.min}</span>
         <span className="text-orange-600 dark:text-orange-400 font-bold">{avg} {language === 'ar' ? 'ج.م' : 'EGP'} <span className="text-[10px] text-slate-400 font-normal">({t.avg})</span></span>
         <span className="text-slate-500 dark:text-slate-400 font-medium">{t.max}</span>
      </div>

      <div className="relative h-4 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div className="absolute inset-y-0 start-0 bg-gradient-to-r from-orange-300 to-orange-600 dark:from-orange-400 dark:to-orange-700 opacity-80 rounded-full w-full"></div>
      </div>

      <div className="flex justify-between mt-2 text-lg font-bold text-slate-700 dark:text-slate-200">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
};

export default WorkmanshipWidget;