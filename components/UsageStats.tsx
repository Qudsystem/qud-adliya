
import React from 'react';
import { getUsageStats } from '../services/analyticsService';
import { AppSettings } from '../types';
import { translations } from '../i18n';

const UsageStatsView: React.FC<{ settings: AppSettings, onBack: () => void }> = ({ settings, onBack }) => {
  const stats = getUsageStats();
  const t = translations[settings.language];

  return (
    <div className={`flex flex-col h-full ${settings.darkMode ? 'text-white' : 'text-gray-900'}`}>
      <header className="p-4 flex items-center gap-3 bg-white border-b sticky top-0 z-40">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-full bg-emerald-50 text-emerald-800">
          <i className="fa-solid fa-arrow-right"></i>
        </button>
        <h2 className="text-sm font-black uppercase arabic-text">{t.statsTitle}</h2>
      </header>

      <div className="p-6 space-y-8 flex-1 overflow-y-auto no-scrollbar">
        <div className="grid grid-cols-2 gap-4">
          <div className={`p-5 rounded-3xl border ${settings.darkMode ? 'bg-slate-900 border-white/5' : 'bg-white border-gray-100'}`}>
            <p className="text-[9px] font-black text-gray-400 uppercase mb-2">{t.statsInteractions}</p>
            <div className="text-2xl font-black text-emerald-600">{stats.totalInteractions}</div>
          </div>
          <div className={`p-5 rounded-3xl border ${settings.darkMode ? 'bg-slate-900 border-white/5' : 'bg-white border-gray-100'}`}>
            <p className="text-[9px] font-black text-gray-400 uppercase mb-2">{t.statsDepth}</p>
            <div className="text-2xl font-black text-amber-500">{stats.sessionDepth}x</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsageStatsView;
