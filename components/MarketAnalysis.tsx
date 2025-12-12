import React from 'react';
import ReactMarkdown from 'react-markdown';
import { MarketAnalysis as MarketAnalysisType, Language } from '../types';
import { BrainCircuit, ExternalLink, AlertTriangle } from 'lucide-react';
import { getTranslation } from '../utils/translations';

interface MarketAnalysisProps {
  analysis: MarketAnalysisType | null;
  loading: boolean;
  language: Language;
}

const MarketAnalysis: React.FC<MarketAnalysisProps> = ({ analysis, loading, language }) => {
  const t = getTranslation(language);

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-lg h-full transition-colors">
        <div className="flex items-center gap-2 mb-6">
          <BrainCircuit className="w-6 h-6 text-purple-500 dark:text-purple-400 animate-pulse" />
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white">{t.marketAnalysis}</h2>
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full animate-pulse"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6 animate-pulse"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-4/6 animate-pulse"></div>
          <div className="h-32 bg-slate-100 dark:bg-slate-700/30 rounded w-full animate-pulse mt-4"></div>
        </div>
      </div>
    );
  }

  if (!analysis) return null;

  const getPredictionColor = () => {
    switch (analysis.prediction) {
      case 'UP': return 'text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-400/10 border-green-200 dark:border-green-400/20';
      case 'DOWN': return 'text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-400/10 border-red-200 dark:border-red-400/20';
      default: return 'text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-400/10 border-blue-200 dark:border-blue-400/20';
    }
  };

  const predictionTextKey = `trend_${analysis.prediction}` as keyof typeof t;
  const predictionDisplay = t[predictionTextKey];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-lg h-full flex flex-col transition-colors">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <BrainCircuit className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white">{t.marketAnalysis}</h2>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-bold border ${getPredictionColor()}`}>
          {t.forecast}: {predictionDisplay}
        </div>
      </div>

      <div className="flex-grow overflow-y-auto max-h-[400px] pe-2 custom-scrollbar">
        <div className="text-slate-700 dark:text-slate-300 leading-relaxed text-start text-sm">
          <ReactMarkdown
            components={{
              h1: ({node, ...props}) => <h3 className="text-base font-bold mb-2 mt-4 text-slate-900 dark:text-slate-100" {...props} />,
              h2: ({node, ...props}) => <h4 className="text-sm font-bold mb-2 mt-3 text-slate-900 dark:text-slate-100" {...props} />,
              p: ({node, ...props}) => <p className="mb-3" {...props} />,
              ul: ({node, ...props}) => <ul className="list-disc list-outside ms-4 mb-3 space-y-1" {...props} />,
              li: ({node, ...props}) => <li className="" {...props} />,
              strong: ({node, ...props}) => <strong className="font-bold text-slate-900 dark:text-slate-100" {...props} />,
              a: ({node, ...props}) => <a className="text-blue-600 hover:underline" {...props} />,
            }}
          >
            {analysis.summary}
          </ReactMarkdown>
        </div>
      </div>

      {analysis.sources.length > 0 && (
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700">
          <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-500 uppercase mb-3 flex items-center gap-2">
            <ExternalLink className="w-3 h-3" /> {t.sources}
          </h4>
          <div className="flex flex-wrap gap-2">
            {analysis.sources.slice(0, 5).map((source, idx) => (
              <a 
                key={idx} 
                href={source.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-700 text-purple-600 dark:text-purple-300 px-3 py-1.5 rounded-md transition-colors truncate max-w-[200px]"
              >
                {source.title}
              </a>
            ))}
          </div>
        </div>
      )}
      
      <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-500 bg-slate-50 dark:bg-slate-900/50 p-2 rounded">
        <AlertTriangle className="w-3 h-3 text-yellow-500 flex-shrink-0" />
        <span>{t.aiDisclaimer}</span>
      </div>
    </div>
  );
};

export default MarketAnalysis;