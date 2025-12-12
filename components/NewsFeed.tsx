import React from 'react';
import { Newspaper, ArrowUpRight } from 'lucide-react';
import { NewsItem, Language } from '../types';
import { getTranslation } from '../utils/translations';

interface NewsFeedProps {
  news: NewsItem[];
  loading: boolean;
  language: Language;
}

const NewsFeed: React.FC<NewsFeedProps> = ({ news, loading, language }) => {
  const t = getTranslation(language);

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-lg h-full transition-colors">
        <div className="flex items-center gap-2 mb-4">
           <Newspaper className="w-5 h-5 text-blue-500 animate-pulse" />
           <div className="h-5 w-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
        </div>
        <div className="space-y-4">
           {[1, 2, 3].map(i => (
             <div key={i} className="bg-slate-50 dark:bg-slate-700/30 p-4 rounded-lg animate-pulse h-20"></div>
           ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-lg h-full transition-colors flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 bg-blue-100 dark:bg-blue-500/10 rounded-md">
           <Newspaper className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        <h2 className="text-lg font-semibold text-slate-800 dark:text-white">{t.newsTitle}</h2>
      </div>

      <div className="space-y-3 flex-grow overflow-y-auto custom-scrollbar pe-1">
        {news.length === 0 ? (
          <div className="text-center text-slate-500 text-sm py-4">No news available</div>
        ) : (
          news.map((item, idx) => (
            <div key={idx} className="group bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-100 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-500/30 transition-all">
              <div className="flex justify-between items-start gap-3">
                <h3 className="text-sm font-medium text-slate-700 dark:text-slate-200 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {item.headline}
                </h3>
                {/* Visual indicator for external link (decorative mostly as URL isn't strictly provided by regex) */}
                <ArrowUpRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="mt-2 flex items-center gap-2">
                 <span className="text-[10px] uppercase tracking-wider text-slate-400 bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                   {item.source}
                 </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NewsFeed;