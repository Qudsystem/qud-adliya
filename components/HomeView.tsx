
import React, { useState, useEffect } from 'react';
import { AppSettings } from '../types';
import { translations } from '../i18n';
import { db } from '../services/databaseService';
import StatItem from './StatItem';
import ModuleCard from './ModuleCard';
import LegalInsight from './LegalInsight';

interface HomeViewProps {
  onNavigate: (tab: string) => void;
  settings: AppSettings;
  onOpenWizard: () => void;
  onToggleVoice: () => void;
}

const HomeView: React.FC<HomeViewProps> = ({ onNavigate, settings, onOpenWizard }) => {
  const t = translations[settings.language];
  const [vaultCount, setVaultCount] = useState(0);

  useEffect(() => {
    setVaultCount(db.getVault().length);
  }, []);

  return (
    <div className={`p-5 space-y-6 ${settings.darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-gray-900'} overflow-y-auto no-scrollbar scroll-smooth pb-32`}>
      {/* 1. Hero Section */}
      <section className={`${settings.darkMode ? 'bg-emerald-900/40 border-emerald-500/20' : 'bg-emerald-950 border-white/5'} rounded-[2.5rem] p-7 text-white shadow-supreme relative overflow-hidden border animate-fade-in`}>
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div className="flex flex-col">
              <span className="bg-[#D4AF37] text-emerald-950 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg mb-2 w-fit">
                {t.precise}
              </span>
              <h2 className="text-3xl font-black tracking-tighter text-white">{t.welcome}</h2>
            </div>
            <button onClick={() => onNavigate('chat')} className="bg-white/5 backdrop-blur-md w-12 h-12 rounded-2xl border border-white/10 shadow-inner flex items-center justify-center animate-pulse">
              <i className="fa-solid fa-microphone text-xl text-[#D4AF37]"></i>
            </button>
          </div>
          <p className="text-emerald-50 text-sm mb-1 leading-relaxed font-bold arabic-text">{t.tagline}</p>
          <p className="text-[8px] text-emerald-300/50 font-black uppercase tracking-widest mb-6">Powered by QudMind</p>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => onNavigate('chat')} className="bg-[#D4AF37] text-emerald-950 px-5 py-4 rounded-xl text-[11px] font-black shadow-lg border-b-4 border-amber-600 active:scale-95 transition-all">
              <i className="fa-solid fa-comment-dots mr-2"></i> {t.expertConsult}
            </button>
            <button onClick={() => onNavigate('emergency')} className="bg-white/5 text-white px-5 py-4 rounded-xl text-[11px] font-black border-2 border-white/10 active:scale-95 transition-all">
              <i className="fa-solid fa-phone-flip mr-2"></i> {t.sosTitle}
            </button>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
      </section>

      {/* 1.5 Quick Resume */}
      {localStorage.getItem('adliya_last_active_tab') && (
        <button
          onClick={() => onNavigate(localStorage.getItem('adliya_last_active_tab')!)}
          className={`w-full p-4 rounded-2xl border flex items-center justify-between group active:scale-95 transition-all animate-slide-up ${settings.darkMode ? 'bg-white/5 border-white/5 text-gray-400' : 'bg-white border-slate-50 text-gray-500 shadow-sm'
            }`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${settings.darkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-700'}`}>
              <i className="fa-solid fa-clock-rotate-left text-xs"></i>
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest">{settings.language === 'ar' ? 'استكمال العمل الأخير' : 'Resume Last Action'}</span>
          </div>
          <i className="fa-solid fa-chevron-left text-[10px] opacity-30 group-hover:translate-x-1 transition-transform"></i>
        </button>
      )}

      {/* 2. Stats Grid */}
      <div className={`flex justify-around items-center p-5 rounded-[2.5rem] border shadow-sm transition-all duration-700 ${settings.darkMode ? 'bg-slate-900 border-white/5' : 'bg-white border-gray-100'}`}>
        <StatItem label={t.vault} value={vaultCount} icon="fa-vault" color={settings.darkMode ? "text-emerald-400" : "text-emerald-900"} />
        <div className="w-px h-10 bg-gray-200/20"></div>
        <StatItem label="المهام" value={db.getTasks().filter(t => !t.isCompleted).length} icon="fa-list-check" color={settings.darkMode ? "text-emerald-300" : "text-emerald-800"} />
        <div className="w-px h-10 bg-gray-200/20"></div>
        <StatItem label="المواعيد" value={db.getDeadlines().length} icon="fa-calendar-day" color="text-[#D4AF37]" />
      </div>

      {/* 3. Legal Insight */}
      <LegalInsight settings={settings} />

      {/* 3.5 Recent from Vault */}
      {db.getVault().length > 0 && (
        <section className="animate-slide-up">
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className={`text-xs font-black uppercase tracking-widest ${settings.darkMode ? 'text-emerald-400' : 'text-emerald-900'}`}>{settings.language === 'ar' ? 'أضيف مؤخراً للخزنة' : 'Recently Saved'}</h3>
            <button onClick={() => onNavigate('vault')} className="text-[10px] font-black text-emerald-500 uppercase">{t.all}</button>
          </div>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            {db.getRecentItems(3).map(item => (
              <button
                key={item.id}
                onClick={() => onNavigate('vault')}
                className={`flex-1 min-w-[140px] p-4 rounded-3xl border transition-all active:scale-95 text-right ${settings.darkMode ? 'bg-slate-900 border-white/5 text-white' : 'bg-white border-gray-100 text-gray-950'
                  }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-3 ${settings.darkMode ? 'bg-white/5' : 'bg-slate-50'}`}>
                  <i className={`fa-solid ${item.type === 'document' ? 'fa-file-signature' :
                      item.type === 'consultation' ? 'fa-comments' :
                        item.type === 'flow_chart' ? 'fa-route' :
                          'fa-file-lines'
                    } text-xs text-[#D4AF37]`}></i>
                </div>
                <h4 className="text-[10px] font-black arabic-text line-clamp-1">{item.title}</h4>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* 4. SMART PATH WIDGET */}
      <section className={`p-8 rounded-[2.5rem] border transition-all duration-700 ${settings.darkMode ? 'bg-slate-900 border-white/5' : 'bg-white border-gray-100 shadow-xl'}`}>
        <div className="flex justify-between items-center mb-10">
          <h4 className={`text-sm font-black uppercase tracking-widest ${settings.darkMode ? 'text-emerald-400' : 'text-emerald-900'}`}>{t.smartPathTitle}</h4>
          <span className={`text-[10px] font-black px-3 py-1.5 rounded-full shadow-sm ${settings.darkMode ? 'bg-amber-500/10 text-amber-500' : 'bg-amber-50 text-amber-600'}`}>١٠٪ منجز</span>
        </div>
        <div className="relative mb-12 px-4 h-20">
          <div className={`absolute h-[3px] left-8 right-8 top-[20px] z-0 ${settings.darkMode ? 'bg-white/5' : 'bg-slate-100'}`}></div>
          <div className="absolute h-[3px] bg-emerald-500 top-[20px] z-0 transition-all duration-1000" style={{ right: '32px', width: '10%' }}></div>
          <div className="flex justify-between items-start w-full relative z-10">
            {[1, 2, 3, 4].map(s => (
              <div key={s} className="flex flex-col items-center gap-3 w-12">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-[11px] font-black transition-all border-4 ${s === 1
                  ? (settings.darkMode ? 'bg-emerald-500 text-emerald-950 border-slate-900 shadow-xl scale-110' : 'bg-emerald-900 text-white border-emerald-50 shadow-xl scale-110')
                  : (settings.darkMode ? 'bg-slate-800 border-slate-900 text-slate-600' : 'bg-white border-slate-50 text-slate-300')
                  }`}>
                  {s === 1 ? <i className="fa-solid fa-check"></i> : s}
                </div>
                <span className={`text-[8px] font-black uppercase text-center leading-tight whitespace-nowrap ${s === 1 ? (settings.darkMode ? 'text-emerald-400' : 'text-emerald-900') : 'text-slate-400'}`}>
                  {s === 1 ? 'التشخيص' : s === 2 ? 'التقدير' : s === 3 ? 'الصياغة' : 'التنفيذ'}
                </span>
              </div>
            ))}
          </div>
        </div>
        <button onClick={onOpenWizard} className="w-full bg-[#D4AF37] text-emerald-950 py-5 rounded-2xl text-[12px] font-black uppercase shadow-2xl hover:brightness-105 active:scale-95 transition-all border-b-4 border-amber-600 flex items-center justify-center gap-3">
          <i className="fa-solid fa-rocket"></i>
          {t.smartPathStart}
        </button>
      </section>

      {/* 5. Modules Grid */}
      <section className="animate-slide-up">
        <div className="flex items-center justify-between mb-4 px-2">
          <h3 className={`text-xs font-black uppercase tracking-widest ${settings.darkMode ? 'text-emerald-400' : 'text-emerald-900'}`}>{t.modules}</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <ModuleCard icon="fa-list-check" title={t.workflow} desc="إدارة المهام والمواعيد القانونية" gradient={settings.darkMode ? "from-slate-900 to-slate-800" : "from-[#D4AF37] to-amber-700"} onClick={() => onNavigate('workflow')} isRtl={settings.language === 'ar'} />
          <ModuleCard icon="fa-map-location-dot" title={t.caseTracker} desc="تتبع قضاياك والخطوات القادمة" gradient={settings.darkMode ? "from-slate-900 to-slate-800" : "from-[#1e3a32] to-[#064e3b]"} onClick={() => onNavigate('tracker')} isRtl={settings.language === 'ar'} />
          <ModuleCard icon="fa-graduation-cap" title={t.academy} desc="أكاديمية الوعي وسلاسل الخبراء" gradient={settings.darkMode ? "from-slate-900 via-slate-800 to-slate-900" : "from-[#064e3b] to-[#012e21]"} onClick={() => onNavigate('academy')} isRtl={settings.language === 'ar'} />
          <ModuleCard icon="fa-calculator" title={t.calculator} desc={t.calcDesc} gradient={settings.darkMode ? "from-slate-800 to-slate-900" : "from-[#0f3d32] to-[#064e3b]"} onClick={() => onNavigate('calculator')} isRtl={settings.language === 'ar'} />
        </div>
      </section>

      {/* 6. SOS Quick Access */}
      <section onClick={() => onNavigate('emergency')} className={`rounded-[2rem] p-4 border flex items-center justify-between cursor-pointer active:scale-95 transition-all shadow-sm ${settings.darkMode ? 'bg-red-950/10 border-red-500/20' : 'bg-[#FDF6E3] border-amber-100'}`}>
        <div className="w-10 h-10 rounded-xl bg-[#6B3213] text-white flex items-center justify-center shadow-md">
          <i className="fa-solid fa-chevron-left"></i>
        </div>
        <div className="text-right flex-1 px-4">
          <h4 className={`text-[12px] font-black arabic-text ${settings.darkMode ? 'text-red-400' : 'text-[#6B3213]'}`}>{t.sosTitle}</h4>
          <p className="text-[9px] text-gray-500 font-bold arabic-text">أرقام الاستغاثة والجهات الرقابية</p>
        </div>
        <div className="w-12 h-12 rounded-full bg-[#FFA000] flex items-center justify-center shadow-lg">
          <i className="fa-solid fa-phone text-emerald-950 text-xl"></i>
        </div>
      </section>
    </div>
  );
};

export default HomeView;
