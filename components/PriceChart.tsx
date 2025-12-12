import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Calendar, RefreshCcw } from 'lucide-react';
import { HistoricalDataPoint, Language, Theme } from '../types';
import { getTranslation } from '../utils/translations';

interface PriceChartProps {
  data: HistoricalDataPoint[];
  loading: boolean;
  timeRange: '1W' | '1M' | '3M';
  onTimeRangeChange: (range: '1W' | '1M' | '3M') => void;
  language: Language;
  theme: Theme;
}

const CustomTooltip = ({ active, payload, label, language }: any) => {
  if (active && payload && payload.length) {
    const t = getTranslation(language);
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4 rounded-lg shadow-xl text-start">
        <p className="text-slate-500 dark:text-slate-400 text-xs mb-2">{label}</p>
        <div className="space-y-1">
          <p className="text-yellow-600 dark:text-yellow-500 font-bold text-sm">
            {t.gold21k}: {payload[0].value.toLocaleString()} {language === 'ar' ? 'ج.م' : 'EGP'}
          </p>
          {payload[1] && (
            <p className="text-emerald-600 dark:text-emerald-500 font-bold text-sm">
              {t.usd}: {payload[1].value} {language === 'ar' ? 'ج.م' : 'EGP'}
            </p>
          )}
        </div>
      </div>
    );
  }
  return null;
};

const PriceChart: React.FC<PriceChartProps> = ({ data, loading, timeRange, onTimeRangeChange, language, theme }) => {
  const t = getTranslation(language);
  const ranges: Array<'1W' | '1M' | '3M'> = ['1W', '1M', '3M'];

  // Colors based on theme
  const gridColor = theme === 'dark' ? '#334155' : '#e2e8f0'; // slate-700 : slate-200
  const axisColor = theme === 'dark' ? '#64748b' : '#94a3b8'; // slate-500 : slate-400
  const goldColor = theme === 'dark' ? '#eab308' : '#ca8a04'; // yellow-500 : yellow-600
  const usdColor = theme === 'dark' ? '#10b981' : '#059669'; // emerald-500 : emerald-600

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-lg h-[400px] flex flex-col transition-colors">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-100 dark:bg-indigo-500/10 p-2 rounded-lg transition-colors">
            <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white">{t.marketTrends}</h2>
            <p className="text-xs text-slate-500 dark:text-slate-500">{t.historicalPrice}</p>
          </div>
        </div>
        
        <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-lg transition-colors">
          {ranges.map((range) => (
            <button
              key={range}
              onClick={() => onTimeRangeChange(range)}
              className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${
                timeRange === range
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-grow w-full min-h-0 relative" dir="ltr">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm z-10 transition-colors">
            <div className="flex flex-col items-center gap-2">
               <RefreshCcw className="w-8 h-8 text-indigo-500 animate-spin" />
               <span className="text-xs text-indigo-500 dark:text-indigo-300">{t.loading}</span>
            </div>
          </div>
        ) : null}

        {data.length === 0 && !loading ? (
          <div className="absolute inset-0 flex items-center justify-center text-slate-400 dark:text-slate-500 text-sm">
            {t.noHistory}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis 
                dataKey="date" 
                stroke={axisColor} 
                fontSize={12} 
                tickLine={false} 
                axisLine={false}
                padding={{ left: 10, right: 10 }}
              />
              <YAxis 
                yAxisId="left" 
                stroke={goldColor} 
                fontSize={12} 
                tickLine={false} 
                axisLine={false}
                domain={['auto', 'auto']}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                stroke={usdColor} 
                fontSize={12} 
                tickLine={false} 
                axisLine={false}
                domain={['auto', 'auto']}
              />
              <Tooltip content={(props) => <CustomTooltip {...props} language={language} />} />
              <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ paddingBottom: '10px', color: axisColor }} />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="price21k" 
                name={t.gold21k} 
                stroke={goldColor} 
                strokeWidth={3}
                dot={{ r: 4, fill: goldColor, strokeWidth: 0 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="usdRate" 
                name={t.usd} 
                stroke={usdColor} 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default PriceChart;