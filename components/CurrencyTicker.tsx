import React from 'react';
import { Banknote } from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../utils/translations';

interface CurrencyTickerProps {
  rate: number;
  loading: boolean;
  language: Language;
}

const CurrencyTicker: React.FC<CurrencyTickerProps> = ({ rate, loading, language }) => {
  const t = getTranslation(language);

  return (
    <div className="bg-gradient-to-r from-emerald-50 to-white dark:from-emerald-900 dark:to-slate-900 rounded-xl p-6 border border-emerald-100 dark:border-emerald-800/50 shadow-lg transition-all duration-300">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-emerald-100 dark:bg-emerald-500/10 rounded-lg transition-colors">
          <Banknote className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <h3 className="text-emerald-700 dark:text-emerald-400 text-sm font-medium uppercase tracking-wider">{t.usdEgp}</h3>
          <p className="text-xs text-emerald-600/70 dark:text-emerald-500/70">{t.exchangeRate}</p>
        </div>
      </div>
      
      <div className="mt-4">
          {loading ? (
             <div className="h-8 w-24 bg-emerald-100 dark:bg-emerald-900/50 animate-pulse rounded"></div>
          ) : (
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">
                {rate > 0 ? rate.toFixed(2) : 'N/A'}
              </span>
              <span className="text-sm text-emerald-600 dark:text-emerald-500 font-semibold">
                {language === 'ar' ? 'ج.م' : 'EGP'}
              </span>
            </div>
          )}
      </div>
    </div>
  );
};

export default CurrencyTicker;