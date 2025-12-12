import React from 'react';
import { X, Bell, BellOff, Clock } from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../utils/translations';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  notificationsEnabled: boolean;
  onToggleNotifications: () => void;
  refreshInterval: number;
  onSetInterval: (ms: number) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, 
  onClose, 
  language, 
  notificationsEnabled, 
  onToggleNotifications,
  refreshInterval,
  onSetInterval
}) => {
  const t = getTranslation(language);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transform transition-all"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">{t.settings}</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Notification Toggle - Made the whole row clickable for better UX */}
          <div 
            className="flex items-center justify-between cursor-pointer group" 
            onClick={onToggleNotifications}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg transition-colors ${notificationsEnabled ? 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-slate-700'}`}>
                {notificationsEnabled ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
              </div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {notificationsEnabled ? t.notificationsEnabled : t.notificationsDisabled}
              </span>
            </div>
            
            <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notificationsEnabled ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'}`}>
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notificationsEnabled ? 'translate-x-6 ltr:translate-x-6 rtl:-translate-x-6' : 'translate-x-1 ltr:translate-x-1 rtl:-translate-x-1'}`} />
            </div>
          </div>

          {/* Refresh Interval Selector */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-slate-500" />
              <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{t.updateFrequency}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onSetInterval(30 * 60 * 1000)}
                className={`px-4 py-2 text-sm rounded-lg border transition-all ${
                  refreshInterval === 30 * 60 * 1000
                    ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-500/50 text-indigo-700 dark:text-indigo-300 font-medium'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {t.every30min}
              </button>
              <button
                onClick={() => onSetInterval(60 * 60 * 1000)}
                className={`px-4 py-2 text-sm rounded-lg border transition-all ${
                  refreshInterval === 60 * 60 * 1000
                    ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-500/50 text-indigo-700 dark:text-indigo-300 font-medium'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {t.every1hour}
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;