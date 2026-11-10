
import React, { useState } from 'react';
import { AppSettings, Achievement } from '../types';
import { translations } from '../i18n';

interface UserProfileProps {
  settings: AppSettings;
  onBack: () => void;
}

const MOCK_ACHIEVEMENTS: Achievement[] = [
  { id: 'a1', title: 'صديق الدستور', icon: 'fa-book-open', color: 'bg-purple-500', stars: 3, isUnlocked: true },
  { id: 'a2', title: 'خبير العقود', icon: 'fa-file-signature', color: 'bg-red-500', stars: 2, isUnlocked: true },
  { id: 'a3', title: 'حارس العدالة', icon: 'fa-shield-halved', color: 'bg-blue-600', stars: 1, isUnlocked: true },
  { id: 'a4', title: 'بطل المواريث', icon: 'fa-calculator', color: 'bg-amber-500', stars: 3, isUnlocked: true },
  { id: 'a5', title: 'المستشار الذكي', icon: 'fa-robot', color: 'bg-emerald-500', stars: 1, isUnlocked: true },
  { id: 'a6', title: 'صياد الثغرات', icon: 'fa-magnifying-glass', color: 'bg-pink-500', stars: 0, isUnlocked: false },
  { id: 'a7', title: 'محامي العمل', icon: 'fa-briefcase', color: 'bg-indigo-500', stars: 0, isUnlocked: false },
  { id: 'a8', title: 'درع الشركات', icon: 'fa-building-columns', color: 'bg-slate-700', stars: 0, isUnlocked: false },
];

const UserProfile: React.FC<UserProfileProps> = ({ settings, onBack }) => {
  const [view, setView] = useState<'profile' | 'achievements'>('profile');
  const t = translations[settings.language];
  const isRtl = settings.language === 'ar';

  // Shield Badge Component
  const ShieldBadge: React.FC<{ ach: Achievement }> = ({ ach }) => (
    <div className={`flex flex-col items-center gap-2 group transition-all duration-300 ${!ach.isUnlocked ? 'opacity-30 grayscale' : 'hover:scale-110'}`}>
      <div className="relative w-20 h-24 flex items-center justify-center">
        <svg className="absolute inset-0 w-full h-full drop-shadow-lg" viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 0L5 20V50C5 80 50 120 50 120C50 120 95 80 95 50V20L50 0Z" className={`${ach.isUnlocked ? ach.color : 'fill-slate-300'}`} fillOpacity={settings.darkMode ? "0.8" : "1"} />
          <path d="M50 5L10 23V50C10 75 50 110 50 110" stroke="white" strokeWidth="2" strokeOpacity="0.3" fill="none" />
          <path d="M90 23L50 5" stroke="white" strokeWidth="2" strokeOpacity="0.1" fill="none" />
        </svg>
        <i className={`fa-solid ${ach.icon} text-3xl text-white relative z-10 drop-shadow-md`}></i>
      </div>

      <div className="flex gap-1">
        {[1, 2, 3].map(starIdx => (
          <i
            key={starIdx}
            className={`fa-solid fa-star text-[11px] transition-all duration-500 ${starIdx <= ach.stars
              ? 'text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]'
              : (settings.darkMode ? 'text-slate-800' : 'text-slate-200')
              }`}
          ></i>
        ))}
      </div>

      <span className={`text-[9px] font-black arabic-text text-center leading-tight max-w-[70px] ${settings.darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
        {ach.title}
      </span>
    </div>
  );

  if (view === 'achievements') {
    return (
      <div className={`flex flex-col h-full animate-legal-fade ${settings.darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-gray-900'}`} dir={isRtl ? 'rtl' : 'ltr'}>
        <div className={`p-6 border-b flex items-center justify-between sticky top-0 z-50 transition-all ${settings.darkMode ? 'bg-slate-900/90 border-white/5' : 'bg-white/95 border-gray-100 shadow-sm'} backdrop-blur-xl`}>
          <div className="flex items-center gap-3">
            <button onClick={() => setView('profile')} className={`w-10 h-10 flex items-center justify-center rounded-xl border shadow-md active:scale-90 transition-all ${settings.darkMode ? 'bg-slate-800 border-white/10 text-emerald-400' : 'bg-white border-gray-100 text-emerald-900'}`}>
              <i className={`fa-solid ${isRtl ? 'fa-arrow-right' : 'fa-arrow-left'}`}></i>
            </button>
            <h2 className="text-sm font-black uppercase tracking-widest arabic-text">الأوسمة القانونية</h2>
          </div>
          <div className="flex items-center gap-2 bg-amber-500/10 px-4 py-2 rounded-full border border-amber-500/20">
            <i className="fa-solid fa-trophy text-amber-500 text-xs"></i>
            <span className="text-[10px] font-black text-amber-600">٤ مكتملة</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar p-8">
          <div className="grid grid-cols-3 gap-y-12 gap-x-6 animate-slide-up">
            {MOCK_ACHIEVEMENTS.map(ach => (
              <ShieldBadge key={ach.id} ach={ach} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full animate-fade-in ${settings.darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-gray-900'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header Profile Info with Dynamic Status Ring */}
      <div className="p-10 pt-12 flex flex-col items-center overflow-hidden">
        <div className="relative mb-10">
          {/* Animated Circular Professional Ring */}
          <div className="absolute inset-[-30px] z-0 animate-[spin_12s_linear_infinite] opacity-60 pointer-events-none">
            <svg viewBox="0 0 200 200" className="w-full h-full">
              <path id="curve" fill="transparent" d="M 100, 100 m -75, 0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0" />
              <text className={`text-[10px] font-black uppercase tracking-[0.3em] ${settings.darkMode ? 'fill-emerald-400' : 'fill-emerald-900'}`}>
                <textPath xlinkHref="#curve" startOffset="0%">
                  Founder @QudSystem | SaaS Innovator | CyberSec Dev | ThinkSpeak Trainer |
                </textPath>
              </text>
            </svg>
          </div>

          <div className={`w-32 h-32 rounded-full border-4 p-1.5 relative z-10 ${settings.darkMode ? 'border-emerald-500/20 bg-slate-900' : 'border-emerald-900/10 bg-white shadow-2xl'}`}>
            <img
              src="/profile.jpg"
              className="w-full h-full rounded-full object-cover z-10 relative"
              alt="Hossam Galal"
            />
          </div>
          <button className="absolute -bottom-2 -right-2 w-11 h-11 bg-[#D4AF37] text-emerald-950 rounded-full border-4 border-slate-50 dark:border-slate-950 flex items-center justify-center shadow-xl active:scale-90 transition-all z-20">
            <i className="fa-solid fa-pen text-xs"></i>
          </button>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-black arabic-text tracking-tighter">حسام جلال</h2>
          <div className="flex flex-col items-center justify-center gap-2 mt-2">
            <div className="flex items-center justify-center gap-2">
              <span className={`text-[8px] font-black uppercase px-2 py-1 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20`}>Founder @QudSystem</span>
              <span className={`text-[8px] font-black uppercase px-2 py-1 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20`}>Level 7 Expert</span>
            </div>
            <span className={`text-[7px] font-black uppercase px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 border border-blue-500/10 opacity-70`}>Created by QudMind</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="px-6 mb-10">
        <div className="grid grid-cols-2 gap-4">
          <StatBox icon="fa-fire" label="سلسلة أيام" value="٤٢" color="text-orange-500" bgColor={settings.darkMode ? "bg-orange-500/10" : "bg-orange-50"} darkMode={settings.darkMode} />
          <StatBox icon="fa-bolt" label="نقاط الوعي" value="٣,٨٥٠" color="text-amber-500" bgColor={settings.darkMode ? "bg-amber-500/10" : "bg-amber-50"} darkMode={settings.darkMode} />
        </div>
      </div>

      {/* Achievements Summary Section */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-6 pb-24">
        <div className="flex items-center justify-between mb-8 border-b border-gray-100 dark:border-white/5 pb-3">
          <h3 className="text-[11px] font-black uppercase tracking-widest text-emerald-900 dark:text-emerald-400">الأوسمة القانونية</h3>
          <button onClick={() => setView('achievements')} className="text-[10px] font-black text-blue-500 uppercase flex items-center gap-1 active:scale-90 transition-all">
            عرض الكل <i className="fa-solid fa-chevron-left text-[8px]"></i>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-y-12 gap-x-4">
          {MOCK_ACHIEVEMENTS.slice(0, 3).map(ach => (
            <ShieldBadge key={ach.id} ach={ach} />
          ))}
          <div
            onClick={() => setView('achievements')}
            className={`flex flex-col items-center justify-center gap-2 cursor-pointer group ${settings.darkMode ? 'text-slate-700' : 'text-slate-300'}`}
          >
            <div className={`w-20 h-24 rounded-[2rem] border-4 border-dashed flex items-center justify-center transition-all group-hover:border-emerald-500 group-hover:text-emerald-500 ${settings.darkMode ? 'border-white/5 bg-white/5' : 'border-slate-100 bg-slate-50'}`}>
              <i className="fa-solid fa-ellipsis text-2xl"></i>
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest">المزيد</span>
          </div>
        </div>
      </div>

      {/* Footer Action */}
      <div className="p-8 pt-4">
        <button
          onClick={onBack}
          className={`w-full py-6 rounded-[2.5rem] font-black text-[12px] uppercase shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-4 ${settings.darkMode ? 'bg-emerald-600 text-white border-b-8 border-emerald-800' : 'bg-emerald-950 text-white border-b-8 border-emerald-900'
            }`}
        >
          <i className="fa-solid fa-house-chimney text-[12px]"></i>
          العودة للرئيسية
        </button>
      </div>
    </div>
  );
};

const StatBox: React.FC<{ icon: string, label: string, value: string, color: string, bgColor: string, darkMode: boolean }> = ({ icon, label, value, color, bgColor, darkMode }) => (
  <div className={`p-6 rounded-[2.5rem] border flex flex-col items-center gap-2 transition-all flex-1 ${darkMode ? 'bg-slate-900 border-white/5 shadow-none' : 'bg-white border-gray-100 shadow-sm'
    }`}>
    <div className={`flex items-center gap-2 ${color}`}>
      <i className={`fa-solid ${icon} text-2xl`}></i>
      <span className="text-2xl font-black tracking-tighter">{value}</span>
    </div>
    <div className="text-[9px] font-black uppercase text-gray-400 tracking-[0.2em]">{label}</div>
  </div>
);

export default UserProfile;
