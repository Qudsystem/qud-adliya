
import React from 'react';
import { AppSettings } from '../types';
import { translations } from '../i18n';

const ConsentOverlay: React.FC<{ settings: AppSettings, onAccept: () => void }> = ({ settings, onAccept }) => {
  const t = translations[settings.language];

  return (
    <div className="fixed inset-0 z-[100] bg-emerald-950 flex flex-col items-center justify-center p-8 text-center">
      <div className="bg-white/10 p-4 rounded-full mb-6"><i className="fa-solid fa-shield-halved text-5xl text-amber-500 animate-pulse"></i></div>
      <h2 className="text-2xl font-black text-white mb-2">{t.welcome}</h2>
      <p className="text-emerald-100 text-xs mb-10 opacity-70">{t.tagline}</p>

      <div className="w-full max-w-xs space-y-3 mb-10">
        <button onClick={onAccept} className="w-full bg-white text-emerald-950 py-4 rounded-2xl font-black flex items-center justify-center gap-3 text-xs shadow-xl active:scale-95">
          <i className="fa-brands fa-google text-red-500"></i> {t.loginGoogle}
        </button>
        <button onClick={onAccept} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-3 text-xs shadow-xl active:scale-95">
          <i className="fa-brands fa-facebook-f"></i> {t.loginFacebook}
        </button>
        <div className="flex items-center gap-4 text-white/20 py-2">
           <div className="flex-1 h-px bg-current"></div>
           <span className="text-[8px] font-black uppercase">أو</span>
           <div className="flex-1 h-px bg-current"></div>
        </div>
        <button onClick={onAccept} className="w-full bg-emerald-800 text-white py-4 rounded-2xl font-black text-xs border border-white/10">
          استخدام رقم الهاتف OTP
        </button>
      </div>
      
      <p className="text-[9px] text-emerald-400 font-bold uppercase tracking-widest">{t.gdprNote}</p>
    </div>
  );
};

export default ConsentOverlay;
