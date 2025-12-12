import React, { useState, useEffect, useCallback } from 'react';
import { AppState } from './types';
import { fetchGoldMarketData } from './services/geminiService';
import { getTranslation } from './utils/translations';
import GoldPriceCard from './components/GoldPriceCard';
import MarketAnalysisComponent from './components/MarketAnalysis';
import CurrencyTicker from './components/CurrencyTicker';
import UpdateTimer from './components/UpdateTimer';
import WorkmanshipWidget from './components/WorkmanshipWidget';
import NewsFeed from './components/NewsFeed';
import { TrendingUp, Globe, Moon, Sun } from 'lucide-react';

const REFRESH_INTERVAL_MS = 30 * 60 * 1000; // 30 minutes

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    theme: 'dark',
    language: 'en',
    isLoading: true,
    error: null,
    data: null,
    analysis: null,
    nextUpdate: Date.now() + REFRESH_INTERVAL_MS,
  });

  const t = getTranslation(state.language);

  // Apply theme to HTML element
  useEffect(() => {
    if (state.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.theme]);

  // Update document direction based on language
  useEffect(() => {
    document.body.dir = state.language === 'ar' ? 'rtl' : 'ltr';
  }, [state.language]);

  const toggleLanguage = () => {
    setState(prev => ({
      ...prev,
      language: prev.language === 'en' ? 'ar' : 'en',
      data: null, // Clear data to trigger re-fetch with new language for text analysis
      analysis: null,
      isLoading: true
    }));
  };

  const toggleTheme = () => {
    setState(prev => ({
      ...prev,
      theme: prev.theme === 'dark' ? 'light' : 'dark'
    }));
  };

  const loadData = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const { data, analysis } = await fetchGoldMarketData(state.language);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: null,
        data,
        analysis,
        nextUpdate: Date.now() + REFRESH_INTERVAL_MS,
      }));
    } catch (err: any) {
      console.error("Failed to load data", err);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: t.error,
      }));
    }
  }, [state.language, t.error]);

  // Fetch data when language changes or on mount
  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.language]); 

  // Timer for auto-refresh
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      if (now >= state.nextUpdate && !state.isLoading) {
        loadData();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [state.nextUpdate, state.isLoading, loadData]);

  const prediction = state.analysis?.prediction || 'STABLE';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 pb-12 transition-all duration-300">
      {/* Navbar */}
      <nav className="border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 backdrop-blur-md sticky top-0 z-50 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="bg-yellow-500/10 p-2 rounded-lg">
                <TrendingUp className="w-6 h-6 text-yellow-600 dark:text-yellow-500" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                  {t.title}<span className="text-yellow-600 dark:text-yellow-500">EG</span>
                </h1>
                <p className="text-[10px] text-slate-500 dark:text-slate-500 uppercase tracking-widest hidden sm:block">
                  {t.subtitle}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 transition-colors"
                title="Toggle Theme"
              >
                {state.theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              <button 
                onClick={toggleLanguage}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors border border-slate-200 dark:border-slate-700"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{state.language === 'en' ? 'العربية' : 'English'}</span>
              </button>
              
              <UpdateTimer 
                nextUpdate={state.nextUpdate} 
                onRefresh={loadData} 
                isLoading={state.isLoading} 
                language={state.language}
              />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {state.error && (
          <div className="mb-8 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg p-4 text-red-600 dark:text-red-400 text-sm text-center">
            {state.error}
            <button 
              onClick={loadData}
              className="ms-4 underline hover:text-red-500 dark:hover:text-red-300"
            >
              {t.retry}
            </button>
          </div>
        )}

        {/* Top Tickers Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <GoldPriceCard 
            karat="24" 
            price={state.data?.price24k || 0} 
            loading={state.isLoading} 
            prediction={prediction}
            language={state.language}
          />
          <GoldPriceCard 
            karat="21" 
            price={state.data?.price21k || 0} 
            loading={state.isLoading} 
            prediction={prediction}
            language={state.language}
          />
          <GoldPriceCard 
            karat="18" 
            price={state.data?.price18k || 0} 
            loading={state.isLoading} 
            prediction={prediction}
            language={state.language}
          />
          <CurrencyTicker 
            rate={state.data?.usdRate || 0}
            loading={state.isLoading}
            language={state.language}
          />
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Info Column */}
          <div className="lg:col-span-2 space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <WorkmanshipWidget 
                  min={state.data?.workmanshipMin || 60} 
                  max={state.data?.workmanshipMax || 150} 
                  loading={state.isLoading}
                  language={state.language}
                />
                <NewsFeed 
                  news={state.analysis?.news || []} 
                  loading={state.isLoading} 
                  language={state.language} 
                />
             </div>
             
             <div className="h-[400px]">
               <MarketAnalysisComponent 
                  analysis={state.analysis} 
                  loading={state.isLoading} 
                  language={state.language}
               />
             </div>
          </div>

          {/* Side Panel: Quick Info / Metadata */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none transition-colors">
               <h3 className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-4">{t.aboutData}</h3>
               <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-500">
                 <li className="flex justify-between">
                   <span>{t.region}</span>
                   <span className="text-slate-900 dark:text-slate-300 font-medium">{t.regionValue}</span>
                 </li>
                 <li className="flex justify-between">
                   <span>{t.lastChecked}</span>
                   <span className="text-slate-900 dark:text-slate-300 font-medium">{state.data?.lastUpdated || '-'}</span>
                 </li>
                 <li className="flex justify-between">
                   <span>{t.source}</span>
                   <span className="text-slate-900 dark:text-slate-300 font-medium">{t.sourceValue}</span>
                 </li>
                 <li className="flex justify-between">
                   <span>{t.currency}</span>
                   <span className="text-slate-900 dark:text-slate-300 font-medium">{t.currencyValue}</span>
                 </li>
               </ul>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-900/50 dark:to-slate-900 rounded-xl p-6 border border-indigo-200 dark:border-indigo-500/20 shadow-sm dark:shadow-none transition-colors">
               <h3 className="text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">{t.proTipTitle}</h3>
               <p className="text-sm text-indigo-900/70 dark:text-indigo-200/80 leading-relaxed">
                 {t.proTipContent}
               </p>
            </div>
            
            <div className="bg-slate-100 dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 dark:opacity-60 transition-colors">
              <h3 className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">{t.disclaimerTitle}</h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-500">
                {t.disclaimerContent}
              </p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;