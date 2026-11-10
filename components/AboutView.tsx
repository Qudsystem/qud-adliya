
import React from 'react';
import { AppSettings } from '../types';
import { translations } from '../i18n';
import { speak } from '../services/speechService';

interface AboutViewProps {
  settings: AppSettings;
  onBack: () => void;
}

const AboutView: React.FC<AboutViewProps> = ({ settings, onBack }) => {
  const t = translations[settings.language];

  const handleSpeakDetails = () => {
    const fullText = `${t.aboutOrigin}: ${t.aboutOriginContent}. ${t.aboutDev}: ${t.aboutDevContent}. ${t.aboutSafety}: ${t.aboutSafetyContent}`;
    speak(fullText, settings.language);
  };

  return (
    <div className={`flex flex-col h-full animate-fade-in ${settings.darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-gray-900'}`} dir="rtl">
      <div className={`p-4 sticky top-0 z-30 flex items-center justify-between border-b transition-all ${settings.darkMode ? 'bg-slate-900/90 border-white/5' : 'bg-white/95 border-gray-100'
        } backdrop-blur-xl`}>
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className={`w-10 h-10 flex items-center justify-center rounded-xl border shadow-md active:scale-90 transition-all ${settings.darkMode ? 'bg-slate-800 border-white/10 text-emerald-400' : 'bg-white border-gray-100 text-emerald-900'
              }`}
          >
            <i className="fa-solid fa-arrow-right"></i>
          </button>
          <h2 className="text-sm font-black tracking-tight uppercase arabic-text">{t.aboutTitle}</h2>
        </div>
        <button
          onClick={handleSpeakDetails}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-amber-100 text-amber-700 shadow-sm active:scale-90 transition-all border border-amber-200"
        >
          <i className="fa-solid fa-volume-high"></i>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-10 pb-32 no-scrollbar">
        <div className="text-center space-y-4">
          <div className="w-24 h-24 bg-emerald-950 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-supreme ring-8 ring-emerald-500/5">
            <i className="fa-solid fa-scale-balanced text-4xl text-amber-400"></i>
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tighter uppercase text-emerald-950 dark:text-white">{t.appTitle}</h1>
            <div className="flex flex-col items-center gap-1 mt-1">
              <p className="text-[10px] text-emerald-600 font-black uppercase tracking-[0.4em]">الشبكة القانونية العليا</p>
              <p className="text-[7px] text-blue-500 font-black uppercase tracking-[0.2em] opacity-60">Created by QudMind</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <section className="animate-slide-up" onClick={() => speak(t.aboutOriginContent, settings.language)}>
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 px-2">{t.aboutOrigin}</h3>
            <div className={`p-6 rounded-[2.5rem] border relative overflow-hidden cursor-pointer active:scale-[0.98] transition-all text-right ${settings.darkMode ? 'bg-slate-900 border-white/5 shadow-none' : 'bg-white border-gray-100 shadow-sm'
              }`}>
              <i className="fa-solid fa-landmark absolute -left-6 -bottom-6 text-7xl opacity-5 rotate-12"></i>
              <p className={`text-sm leading-relaxed arabic-text font-bold`}>
                {t.aboutOriginContent}
              </p>
            </div>
          </section>

          <section className="animate-slide-up delay-75" onClick={() => speak(t.aboutDevContent, settings.language)}>
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 px-2">{t.aboutDev}</h3>
            <div className={`p-6 rounded-[2.5rem] border relative overflow-hidden cursor-pointer active:scale-[0.98] transition-all text-right ${settings.darkMode ? 'bg-slate-900 border-white/5 shadow-none' : 'bg-white border-gray-100 shadow-sm'
              }`}>
              <i className="fa-solid fa-code-branch absolute -left-6 -bottom-6 text-7xl opacity-5 rotate-12"></i>
              <p className={`text-sm leading-relaxed arabic-text font-bold`}>
                {t.aboutDevContent}
              </p>
            </div>
          </section>

          <section className="animate-slide-up delay-150" onClick={() => speak(t.aboutSafetyContent, settings.language)}>
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 px-2">{t.aboutSafety}</h3>
            <div className={`p-6 rounded-[2.5rem] border relative overflow-hidden cursor-pointer active:scale-[0.98] transition-all text-right ${settings.darkMode ? 'bg-slate-900 border-white/5 shadow-none' : 'bg-white border-gray-100 shadow-sm'
              }`}>
              <i className="fa-solid fa-shield-halved absolute -left-6 -bottom-6 text-7xl opacity-5 rotate-12"></i>
              <p className={`text-sm leading-relaxed arabic-text font-bold`}>
                {t.aboutSafetyContent}
              </p>
            </div>
          </section>
        </div>

        <div className="pt-10 border-t border-gray-100 text-center space-y-4">
          <div className="flex justify-center items-center gap-6 opacity-40 grayscale">
            <i className="fa-brands fa-react text-2xl"></i>
            <i className="fa-solid fa-brain text-2xl"></i>
            <i className="fa-solid fa-shield-virus text-2xl"></i>
            <i className="fa-solid fa-fingerprint text-2xl"></i>
          </div>
          <p className="text-[9px] font-black uppercase tracking-[0.5em] text-gray-400">
            الإصدار ٣.١ - النسخة البلاتينية العليا
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutView;
