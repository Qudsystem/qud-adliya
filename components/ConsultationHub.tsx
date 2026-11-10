
import React, { useState } from 'react';
import ChatInterface from './ChatInterface';
import LawyerDirectory from './LawyerDirectory';
import LiveVoiceCounsel from './LiveVoiceCounsel';
import { ConsultMode, AppSettings } from '../types';
import { translations } from '../i18n';
import { speak } from '../services/speechService';

interface ConsultationHubProps {
  settings: AppSettings;
  initialPrompt?: string | null;
  onClearInitialPrompt?: () => void;
  forceMode?: ConsultMode | 'live_voice';
  onBack?: () => void;
}

const ConsultationHub: React.FC<ConsultationHubProps> = ({ settings, initialPrompt, onClearInitialPrompt, forceMode, onBack }) => {
  const [mode, setMode] = useState<ConsultMode | 'live_voice'>(
    forceMode ? forceMode : (initialPrompt ? 'ai' : 'selection')
  );
  const t = translations[settings.language];

  const handleModeChange = (newMode: any, narration: string) => {
    setMode(newMode);
    if (settings.narrationEnabled) {
      speak(narration, settings.language);
    }
  };

  const handleBackToSelection = () => {
    if (forceMode && onBack) {
      onBack();
    } else {
      setMode('selection');
    }
  };

  if (mode === 'ai') return (
    <ChatInterface 
      onBack={handleBackToSelection} 
      settings={settings} 
      initialPrompt={initialPrompt} 
      onPromptHandled={onClearInitialPrompt}
    />
  );
  if (mode === 'human') return <LawyerDirectory onBack={handleBackToSelection} settings={settings} />;
  if (mode === 'live_voice') return <LiveVoiceCounsel onBack={handleBackToSelection} settings={settings} />;

  return (
    <div className={`p-6 flex flex-col h-full animate-fade-in relative transition-colors ${settings.darkMode ? 'bg-slate-950' : 'bg-slate-50'}`} dir="rtl">
      
      <div className="absolute top-6 right-6 z-50">
        <button 
          onClick={onBack}
          className={`w-10 h-10 flex items-center justify-center rounded-xl border shadow-md active:scale-90 transition-all ${
            settings.darkMode ? 'bg-slate-900 border-white/10 text-emerald-400' : 'bg-white border-gray-100 text-emerald-900'
          }`}
        >
          <i className="fa-solid fa-chevron-right"></i>
        </button>
      </div>

      <div className="flex flex-col items-center mt-12 mb-10">
        <div className="relative mb-6">
          <div className={`absolute inset-0 blur-3xl rounded-full scale-150 ${settings.darkMode ? 'bg-emerald-500/5' : 'bg-emerald-500/10'}`}></div>
          <div className={`relative w-28 h-28 rounded-full flex items-center justify-center shadow-xl border-4 transition-colors ${
            settings.darkMode ? 'bg-emerald-900 border-emerald-800' : 'bg-[#064e3b] border-white'
          }`}>
            <i className="fa-solid fa-scale-balanced text-4xl text-[#D4AF37]"></i>
          </div>
        </div>
        
        <h2 className={`text-2xl font-black mb-2 arabic-text ${settings.darkMode ? 'text-white' : 'text-emerald-950'}`}>
          {t.consult}
        </h2>
        <p className={`text-gray-400 text-[11px] font-bold arabic-text italic text-center max-w-xs leading-relaxed opacity-80`}>
          {settings.language === 'ar' ? 'استشارات قانونية ذكية في متناول يدك بأمان تام.' : 'Professional legal consultations at your fingertips with total security.'}
        </p>
      </div>

      <div className="w-full space-y-5">
        <button 
          onClick={() => handleModeChange('live_voice', t.liveVoiceTitle)}
          className={`w-full p-6 rounded-[2.5rem] text-right relative overflow-hidden shadow-xl active:scale-95 transition-all border group ${
            settings.darkMode ? 'bg-emerald-900/20 border-emerald-500/20 text-white' : 'bg-[#064e3b] border-emerald-800 text-white'
          }`}
        >
          <div className="relative z-10">
            <div className="flex justify-start mb-2">
              <span className="bg-[#D4AF37] text-emerald-950 text-[9px] font-black px-3 py-1 rounded-lg uppercase tracking-wider shadow-sm">
                {t.realtime}
              </span>
            </div>
            <h3 className="text-lg font-black flex items-center justify-end gap-3 arabic-text">
               <i className="fa-solid fa-microphone-lines text-[#D4AF37] text-sm"></i>
              {t.liveVoiceTitle}
            </h3>
            <p className={`text-[10px] mt-1 font-bold arabic-text ${settings.darkMode ? 'text-emerald-400/60' : 'text-emerald-100/60'}`}>{t.liveVoiceDesc}</p>
          </div>
          <div className={`absolute -left-4 -bottom-4 w-24 h-24 rounded-full blur-2xl group-hover:bg-white/10 transition-colors ${settings.darkMode ? 'bg-emerald-500/5' : 'bg-white/5'}`}></div>
        </button>

        <button 
          onClick={() => handleModeChange('ai', t.aiTitle)}
          className={`w-full p-6 rounded-[2.5rem] text-right relative overflow-hidden shadow-xl active:scale-95 transition-all border group ${
            settings.darkMode ? 'bg-slate-900 border-white/5 text-white' : 'bg-[#012e21] border-emerald-950 text-white'
          }`}
        >
          <div className="relative z-10">
            <h3 className="text-lg font-black flex items-center justify-end gap-3 arabic-text">
               <i className="fa-solid fa-robot text-[#D4AF37] text-sm"></i>
              {t.aiTitle}
            </h3>
            <p className={`text-[10px] mt-1 font-bold arabic-text ${settings.darkMode ? 'text-slate-500' : 'text-emerald-100/40'}`}>{t.aiDesc}</p>
          </div>
        </button>

        <button 
          onClick={() => handleModeChange('human', t.humanTitle)}
          className={`w-full p-6 rounded-[2.5rem] text-right relative overflow-hidden shadow-lg active:scale-95 transition-all border-2 group ${
            settings.darkMode ? 'bg-slate-900 border-white/10' : 'bg-white border-gray-50'
          }`}
        >
          <div className="relative z-10">
            <h3 className={`text-lg font-black flex items-center justify-end gap-3 arabic-text ${settings.darkMode ? 'text-emerald-400' : 'text-emerald-900'}`}>
              <i className="fa-solid fa-user-tie text-[#D4AF37] text-sm"></i>
              {t.humanTitle}
            </h3>
            <p className="text-gray-400 text-[10px] mt-1 font-bold arabic-text">{t.humanDesc}</p>
          </div>
        </button>

      </div>

      <div className="mt-auto pb-10 text-center opacity-20">
         <p className="text-[8px] font-black uppercase tracking-[0.4em] text-gray-400">بيئة قانونية مهنية مؤمنة</p>
      </div>
    </div>
  );
};

export default ConsultationHub;
