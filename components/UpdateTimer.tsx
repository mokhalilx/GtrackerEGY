import React, { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../utils/translations';

interface UpdateTimerProps {
  nextUpdate: number;
  onRefresh: () => void;
  isLoading: boolean;
  language: Language;
}

const UpdateTimer: React.FC<UpdateTimerProps> = ({ nextUpdate, onRefresh, isLoading, language }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const t = getTranslation(language);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const diff = Math.max(0, Math.ceil((nextUpdate - now) / 1000));
      setTimeLeft(diff);
    }, 1000);
    return () => clearInterval(interval);
  }, [nextUpdate]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="flex items-center gap-4">
      <div className="text-end hidden sm:block">
        <p className="text-xs text-slate-500 dark:text-slate-400">{t.nextUpdate}</p>
        <p className="text-sm font-mono text-slate-700 dark:text-slate-200">
          {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
        </p>
      </div>
      <button 
        onClick={onRefresh}
        disabled={isLoading}
        className={`p-2 rounded-full bg-indigo-600 hover:bg-indigo-500 transition-all ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:rotate-180'}`}
        title={t.refresh}
      >
        <RefreshCw className={`w-5 h-5 text-white ${isLoading ? 'animate-spin' : ''}`} />
      </button>
    </div>
  );
};

export default UpdateTimer;