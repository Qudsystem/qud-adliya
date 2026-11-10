
import React from 'react';
import { AppSettings } from '../types';
import { translations } from '../i18n';
import { MOCK_CASES } from '../constants';

interface CaseTrackerProps {
  settings: AppSettings;
  onBack: () => void;
}

const CaseTracker: React.FC<CaseTrackerProps> = ({ settings, onBack }) => {
  const t = translations[settings.language];

  return (
    <div className={`flex flex-col h-full animate-fade-in transition-colors duration-500 ${settings.darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-gray-900'}`}>
      {/* Header with Consistent Back Button Style */}
      <div className={`p-4 flex items-center justify-between border-b sticky top-0 z-30 transition-all ${
        settings.darkMode ? 'bg-slate-900/90 border-white/5' : 'bg-white/95 border-gray-100'
      } backdrop-blur-xl`}>
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack} 
            className={`w-10 h-10 flex items-center justify-center rounded-xl border shadow-md active:scale-90 transition-all ${
              settings.darkMode ? 'bg-slate-800 border-white/10 text-emerald-400' : 'bg-white border-gray-100 text-emerald-900'
            }`}
          >
            <i className="fa-solid fa-arrow-right"></i>
          </button>
          <div>
            <h2 className={`text-sm font-black uppercase arabic-text ${settings.darkMode ? 'text-white' : 'text-emerald-950'}`}>{t.caseTracker}</h2>
            <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest block">{t.trackerVersion}</span>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-8 overflow-y-auto no-scrollbar pb-32">
        {MOCK_CASES.map(legalCase => (
          <div key={legalCase.id} className="space-y-6">
            
            {/* 1. Case Header & Progress Card */}
            <div className={`${settings.darkMode ? 'bg-emerald-900/40 border-emerald-500/20 shadow-none' : 'bg-emerald-950 border-white/5 shadow-supreme'} rounded-[2.5rem] p-7 text-white relative overflow-hidden border`}>
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="bg-[#D4AF37] text-emerald-950 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg mb-2 w-fit inline-block">
                      {(t.categories as any)[legalCase.category]}
                    </span>
                    <h3 className="text-2xl font-black arabic-text leading-tight">{legalCase.title}</h3>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`text-[20px] font-black ${settings.darkMode ? 'text-emerald-400' : 'text-amber-400'}`}>{legalCase.progress}%</span>
                    <span className="text-[8px] font-bold uppercase opacity-50">إنجاز الإجراءات</span>
                  </div>
                </div>
                
                <div className={`w-full h-3 rounded-full overflow-hidden border ${settings.darkMode ? 'bg-white/5 border-white/5' : 'bg-white/10 border-white/5'}`}>
                  <div 
                    className={`${settings.darkMode ? 'bg-emerald-500' : 'bg-[#D4AF37]'} h-full shadow-[0_0_15px_rgba(212,175,55,0.5)] transition-all duration-1000 ease-out`} 
                    style={{ width: `${legalCase.progress}%` }}
                  ></div>
                </div>
              </div>
              <i className="fa-solid fa-gavel absolute -right-6 -bottom-6 text-8xl text-white/5 -rotate-12"></i>
            </div>

            {/* 2. Technical Details Grid */}
            <div className={`grid grid-cols-2 gap-3 p-5 rounded-[2rem] border transition-colors ${settings.darkMode ? 'bg-slate-900 border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
              <DetailBox settings={settings} icon="fa-fingerprint" label="رقم القضية" value={legalCase.caseNumber} />
              <DetailBox settings={settings} icon="fa-landmark" label="المحكمة" value={legalCase.court} />
              <DetailBox settings={settings} icon="fa-layer-group" label="الدائرة" value={legalCase.circuit} />
              <DetailBox settings={settings} icon="fa-calendar-day" label={t.nextHearing} value={legalCase.nextHearing || 'لم تحدد'} highlight />
            </div>

            {/* 3. Professional Steps Timeline */}
            <section className={`p-8 rounded-[3rem] border transition-colors ${settings.darkMode ? 'bg-slate-900/50 border-white/5' : 'bg-white border-gray-100 shadow-xl'}`}>
              <div className="flex items-center justify-end mb-12 gap-2">
                 <h4 className={`text-[11px] font-black uppercase tracking-widest arabic-text ${settings.darkMode ? 'text-emerald-400' : 'text-emerald-900'}`}>{t.steps}</h4>
                 <i className="fa-solid fa-route text-amber-500"></i>
              </div>
              
              <div className="relative">
                {/* الخط الرأسي الأساسي (المسار الكامل) */}
                <div className={`absolute right-[17px] top-5 bottom-5 w-1.5 rounded-full z-0 ${settings.darkMode ? 'bg-white/5' : 'bg-slate-50'}`}></div>
                
                {/* خط التقدم الأخضر */}
                <div 
                  className="absolute right-[17px] top-5 bg-emerald-500 w-1.5 rounded-full z-0 transition-all duration-1000 shadow-[0_0_12px_rgba(16,185,129,0.2)]"
                  style={{ height: `${legalCase.progress}%` }}
                ></div>

                <div className="space-y-16">
                  {legalCase.steps.map((step, idx) => (
                    <div key={step.id} className="relative flex items-center gap-6">
                      
                      {/* 1. الدائرة المرقمة */}
                      <div className={`relative shrink-0 w-10 h-10 rounded-full border-[3px] flex items-center justify-center text-[15px] font-black z-10 transition-all duration-500 ${
                        step.status === 'completed' ? 'bg-emerald-600 border-white text-white shadow-lg' : 
                        step.status === 'current' ? (settings.darkMode ? 'bg-amber-500 border-slate-900 text-emerald-950 shadow-[0_0_20px_rgba(251,191,36,0.3)] scale-110' : 'bg-amber-400 border-white text-emerald-950 shadow-[0_0_20px_rgba(251,191,36,0.4)] scale-110') : 
                        (settings.darkMode ? 'bg-slate-800 border-slate-900 text-slate-600 shadow-sm' : 'bg-white border-slate-100 text-slate-200 shadow-sm')
                      }`}>
                        {idx + 1}
                      </div>

                      {/* 2. المحتوى النصي */}
                      <div className="flex-1 text-right">
                        <h5 className={`text-[15px] font-black arabic-text leading-none mb-1 ${
                          step.status === 'upcoming' ? (settings.darkMode ? 'text-slate-700' : 'text-slate-300') : (settings.darkMode ? 'text-white' : 'text-emerald-950')
                        }`}>
                          {step.title}
                        </h5>
                        <p className={`text-[10px] font-bold arabic-text leading-relaxed ${
                          step.status === 'upcoming' ? (settings.darkMode ? 'text-slate-800' : 'text-slate-200') : (settings.darkMode ? 'text-slate-400' : 'text-slate-400')
                        }`}>
                          {step.description || 'جاري انتظار تحديثات الإجراء.'}
                        </p>
                      </div>

                      {/* 3. التاريخ */}
                      <div className="w-24 shrink-0">
                         {step.date && (
                           <div className={`px-3 py-2 rounded-xl text-center shadow-sm border ${settings.darkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                             <span className={`text-[10px] font-black arabic-text whitespace-nowrap ${settings.darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                               {step.date}
                             </span>
                           </div>
                         )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 4. Required Documents Checklist */}
            {legalCase.requiredDocs && (
              <section className={`p-6 rounded-[2.5rem] border transition-colors ${settings.darkMode ? 'bg-slate-900/50 border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
                <h4 className={`text-[10px] font-black uppercase tracking-widest mb-4 arabic-text ${settings.darkMode ? 'text-emerald-400' : 'text-emerald-900'}`}>ملف المستندات الإجرائية</h4>
                <div className="space-y-3">
                  {legalCase.requiredDocs.map((doc, idx) => (
                    <div key={idx} className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                      settings.darkMode ? 'bg-white/5 border-white/5 hover:bg-emerald-500/10' : 'bg-slate-50 border-slate-100 hover:bg-emerald-50'
                    }`}>
                      <div className="flex items-center gap-3">
                        <i className={`fa-solid ${doc.status === 'ready' ? 'fa-circle-check text-emerald-500' : 'fa-circle-dot text-amber-400'} text-sm`}></i>
                        <span className={`text-[11px] font-bold arabic-text ${settings.darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{doc.name}</span>
                      </div>
                      <button className={`text-[10px] font-black uppercase px-3 py-1 rounded-lg transition-colors ${
                        settings.darkMode ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30' : 'bg-emerald-100/50 text-emerald-800 hover:bg-emerald-100'
                      }`}>تحميل</button>
                    </div>
                  ))}
                </div>
              </section>
            )}

          </div>
        ))}

        <div className="py-10 text-center opacity-20">
           <p className="text-[7px] font-black uppercase tracking-[0.4em] text-gray-400">{t.legalEnvironment}</p>
        </div>
      </div>
    </div>
  );
};

const DetailBox: React.FC<{ settings: AppSettings, icon: string; label: string; value: string; highlight?: boolean }> = ({ settings, icon, label, value, highlight }) => (
  <div className={`p-4 rounded-2xl flex flex-col gap-1 transition-colors ${
    highlight 
      ? (settings.darkMode ? 'bg-amber-500/10' : 'bg-amber-50/50') 
      : (settings.darkMode ? 'bg-white/5' : 'bg-slate-50')
  }`}>
    <div className="flex items-center gap-2 mb-1">
      <i className={`fa-solid ${icon} text-[10px] ${highlight ? 'text-amber-600' : 'text-emerald-800'}`}></i>
      <span className="text-[8px] font-black uppercase text-gray-400">{label}</span>
    </div>
    <span className={`text-[10px] font-black arabic-text truncate ${
      highlight ? (settings.darkMode ? 'text-amber-400' : 'text-amber-800') : (settings.darkMode ? 'text-slate-300' : 'text-emerald-950')
    }`}>{value}</span>
  </div>
);

export default CaseTracker;
