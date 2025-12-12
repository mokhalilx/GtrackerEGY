import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../utils/translations';

interface GoldPriceCardProps {
  karat: string;
  price: number;
  loading: boolean;
  prediction: 'UP' | 'DOWN' | 'STABLE';
  language: Language;
}

const GoldPriceCard: React.FC<GoldPriceCardProps> = ({ karat, price, loading, prediction, language }) => {
  const t = getTranslation(language);

  const getIcon = () => {
    if (prediction === 'UP') return <TrendingUp className="w-5 h-5 text-green-500 dark:text-green-400" />;
    if (prediction === 'DOWN') return <TrendingDown className="w-5 h-5 text-red-500 dark:text-red-400" />;
    return <Minus className="w-5 h-5 text-gray-400" />;
  };

  const getBorderColor = () => {
    if (loading) return "border-slate-200 dark:border-slate-700";
    if (prediction === 'UP') return "border-green-200 dark:border-green-500/30";
    if (prediction === 'DOWN') return "border-red-200 dark:border-red-500/30";
    return "border-yellow-200 dark:border-yellow-500/30";
  };

  return (
    <div className={`bg-white dark:bg-slate-800 rounded-xl p-6 border ${getBorderColor()} shadow-lg dark:shadow-xl relative overflow-hidden group transition-all duration-300`}>
      <div className="absolute top-0 end-0 p-4 opacity-5 dark:opacity-10 group-hover:opacity-10 dark:group-hover:opacity-20 transition-opacity">
        <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-600 dark:text-yellow-500 transform ltr:rotate-0 rtl:scale-x-[-1]">
           <path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z"/>
        </svg>
      </div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider">{t.gold} {karat}</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500">{t.perGram}</p>
          </div>
          <div className="bg-slate-100 dark:bg-slate-900/50 p-2 rounded-lg backdrop-blur-sm transition-colors">
            {getIcon()}
          </div>
        </div>

        <div className="mt-2">
          {loading ? (
             <div className="h-10 w-32 bg-slate-200 dark:bg-slate-700/50 animate-pulse rounded"></div>
          ) : (
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">
                {price > 0 ? price.toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US') : 'N/A'}
              </span>
              <span className="text-sm text-yellow-600 dark:text-yellow-500 font-semibold">
                {language === 'ar' ? 'ج.م' : 'EGP'}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GoldPriceCard;