
import React, { useState } from 'react';
import { AppSettings, LegalCategory } from '../types';
import { translations } from '../i18n';
import { MOCK_ACADEMY, MOCK_FLASHCARDS, MOCK_GAMES } from '../constants';

interface LegalAcademyProps {
  settings: AppSettings;
  onBack: () => void;
}

const LegalAcademy: React.FC<LegalAcademyProps> = ({ settings, onBack }) => {
  const [activeTab, setActiveTab] = useState<'series' | 'games'>('games');
  const [activeCategory, setActiveCategory] = useState<LegalCategory | 'ALL'>('ALL');
  const [gameState, setGameState] = useState<'selection' | 'flashcards' | 'quiz'>('selection');
  const [currentCardIdx, setCurrentCardIdx] = useState(0);
  const [cardFlipped, setCardFlipped] = useState(false);
  
  const t = translations[settings.language];
  const isRtl = settings.language === 'ar';

  const filteredSeries = activeCategory === 'ALL' 
    ? MOCK_ACADEMY 
    : MOCK_ACADEMY.filter(s => s.category === activeCategory);

  const renderSeries = () => (
    <div className="space-y-8 animate-legal-fade pb-32" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="flex gap-2 overflow-x-auto no-scrollbar py-2 px-1">
        <button 
          onClick={() => setActiveCategory('ALL')}
          className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase transition-all border-2 whitespace-nowrap ${
            activeCategory === 'ALL' 
              ? (settings.darkMode ? 'bg-emerald-500 border-emerald-400 text-slate-950 shadow-lg' : 'bg-emerald-900 border-emerald-950 text-white shadow-lg') 
              : (settings.darkMode ? 'bg-slate-900 border-white/5 text-slate-500' : 'bg-white border-slate-100 text-slate-400')
          }`}
        >
          {t.all}
        </button>
        {Object.values(LegalCategory).map(cat => (
          <button 
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase whitespace-nowrap transition-all border-2 ${
              activeCategory === cat 
                ? (settings.darkMode ? 'bg-emerald-500 border-emerald-400 text-slate-950 shadow-lg' : 'bg-emerald-900 border-emerald-950 text-white shadow-lg') 
                : (settings.darkMode ? 'bg-slate-900 border-white/5 text-slate-500' : 'bg-white border-slate-100 text-slate-400')
            }`}
          >
            {(t.categories as any)[cat]}
          </button>
        ))}
      </div>

      <div className="grid gap-8">
        {filteredSeries.map(series => (
          <div 
            key={series.id} 
            className={`rounded-[3rem] overflow-hidden shadow-supreme border transition-all duration-500 group ${
              settings.darkMode ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-100'
            }`}
          >
            <div className="relative aspect-[16/9] overflow-hidden">
              <img src={series.thumbnail} alt={series.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
              <button className="absolute inset-0 m-auto w-16 h-16 bg-red-600 text-white rounded-full flex items-center justify-center shadow-2xl active:scale-90 transition-all border-4 border-white/20 group-hover:scale-125 z-20">
                <i className={`fa-solid fa-play ${isRtl ? 'mr-1' : 'ml-1'} text-xl`}></i>
              </button>
              <div className={`absolute top-4 ${isRtl ? 'left-4' : 'right-4'} z-20`}>
                <span className="bg-amber-500 text-emerald-950 text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                  {series.duration}
                </span>
              </div>
              <div className={`absolute bottom-6 ${isRtl ? 'right-6' : 'left-6'} z-10`}>
                <h4 className="text-xl font-black text-white arabic-text leading-tight">{series.title}</h4>
              </div>
            </div>
            <div className={`p-8 ${isRtl ? 'text-right' : 'text-left'}`}>
              <h5 className={`text-[12px] font-black uppercase mb-2 ${settings.darkMode ? 'text-emerald-400' : 'text-emerald-900'}`}>{series.speaker}</h5>
              <p className="text-[11px] font-bold leading-relaxed text-slate-500">{series.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderGames = () => {
    if (gameState === 'flashcards') return renderFlashcards();

    return (
      <div className="flex flex-col items-center py-6 animate-legal-fade pb-40" dir={isRtl ? 'rtl' : 'ltr'}>
         {/* لوحة التحكم بالإحصائيات العلوي */}
         <div className={`w-full p-8 rounded-[3rem] text-white relative overflow-hidden shadow-2xl mb-16 border-b-8 ${
           settings.darkMode ? 'bg-slate-900 border-emerald-500/20' : 'bg-[#064e3b] border-emerald-900'
         }`}>
            <div className="relative z-10 text-center">
               <h3 className="text-2xl font-black mb-2 arabic-text">مختبر عدلية للتعلم</h3>
               <p className="text-[10px] text-emerald-200 uppercase font-black tracking-widest opacity-80 mb-6">{t.levelLabel} ١ - المتدرب القانوني</p>
               <div className="flex justify-center gap-6">
                  <div className={`flex flex-col items-center p-4 rounded-2xl border ${settings.darkMode ? 'bg-white/5 border-white/5' : 'bg-white/10 border-white/10'}`}>
                    <span className="text-xl font-black text-[#D4AF37]">٢٨٠</span>
                    <span className="text-[7px] uppercase font-black opacity-50">{t.pointsLabel}</span>
                  </div>
                  <div className={`flex flex-col items-center p-4 rounded-2xl border ${settings.darkMode ? 'bg-white/5 border-white/5' : 'bg-white/10 border-white/10'}`}>
                    <span className="text-xl font-black text-emerald-400">٢/٥</span>
                    <span className="text-[7px] uppercase font-black opacity-50">تحديات</span>
                  </div>
               </div>
            </div>
            <i className="fa-solid fa-brain absolute -left-6 -bottom-6 text-9xl text-white/5 rotate-12"></i>
         </div>

         {/* المسار الفعلي للألعاب */}
         <div className="relative w-full max-w-xs flex flex-col items-center space-y-20 pt-10">
            {/* الخلفية الرابطة للمسار (SVG Line) */}
            <svg className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20" style={{ zIndex: 0 }}>
               <path 
                d="M 50% 40 Q 80% 120 50% 200 T 50% 360 T 50% 520 T 50% 680" 
                fill="none" 
                stroke={settings.darkMode ? "#10b981" : "#064e3b"} 
                strokeWidth="4" 
                strokeDasharray="8 12"
               />
            </svg>

            {MOCK_GAMES.map((game, idx) => {
              // توزيع زجزاج (يمين، يسار، يمين...)
              const xPos = idx % 2 === 0 ? '40px' : '-40px';
              const isActive = idx < 2; // أول لعبتين مفتوحتين
              
              return (
                <div key={game.id} className="relative flex flex-col items-center z-10" style={{ transform: `translateX(${xPos})` }}>
                  {/* الدائرة الرئيسية */}
                  <button 
                    onClick={() => isActive ? (setGameState('flashcards'), setCurrentCardIdx(0)) : null}
                    className={`w-20 h-20 rounded-full flex items-center justify-center relative transition-all duration-500 shadow-supreme border-b-8 active:scale-90 active:border-b-0 active:translate-y-2 ${
                      isActive 
                        ? 'bg-[#D4AF37] text-emerald-950 border-amber-600' 
                        : (settings.darkMode ? 'bg-slate-800 text-slate-600 border-slate-900 opacity-60' : 'bg-slate-200 text-slate-400 border-slate-300 opacity-60')
                    }`}
                  >
                    <i className={`fa-solid ${game.icon} text-2xl`}></i>
                    {!isActive && <i className="fa-solid fa-lock absolute text-[8px] -top-1 -right-1 bg-slate-900 text-white p-2 rounded-full border border-white/20"></i>}
                    {isActive && idx === 1 && <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-[8px] font-black rounded-full flex items-center justify-center animate-bounce border-2 border-white">!</div>}
                  </button>

                  {/* النص التوضيحي تحت الدائرة */}
                  <div className="mt-4 text-center w-32">
                    <h5 className={`text-[10px] font-black uppercase mb-1 leading-tight ${settings.darkMode ? 'text-white' : 'text-emerald-950'}`}>
                      {game.title}
                    </h5>
                    <div className={`flex items-center justify-center gap-1 px-2 py-0.5 rounded-full inline-block ${
                      settings.darkMode ? 'bg-white/5' : 'bg-slate-100'
                    }`}>
                      <span className="text-[7px] font-black text-gray-400 uppercase">{game.difficulty}</span>
                    </div>
                  </div>
                </div>
              );
            })}
         </div>

         {/* تذييل المسار */}
         <div className="mt-20 opacity-20 text-center">
            <i className="fa-solid fa-flag-checkered text-4xl mb-4"></i>
            <p className="text-[8px] font-black uppercase tracking-[0.4em]">المرحلة النهائية</p>
         </div>
      </div>
    );
  };

  const renderFlashcards = () => {
    const card = MOCK_FLASHCARDS[currentCardIdx];
    return (
      <div className="flex flex-col h-full items-center justify-between animate-legal-fade py-10" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="w-full flex justify-between items-center px-4">
           <button onClick={() => setGameState('selection')} className={`w-10 h-10 flex items-center justify-center rounded-xl border transition-all ${settings.darkMode ? 'bg-slate-900 border-white/10 text-slate-500' : 'bg-white border-slate-100 text-slate-400'}`}>
             <i className="fa-solid fa-xmark text-lg"></i>
           </button>
           <div className="flex-1 mx-8 h-3 bg-slate-100 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: `${((currentCardIdx + 1) / MOCK_FLASHCARDS.length) * 100}%` }}></div>
           </div>
           <div className={`text-[10px] font-black px-4 py-2 rounded-full border ${settings.darkMode ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-emerald-50 border-emerald-100 text-emerald-800'}`}>{currentCardIdx + 1} / {MOCK_FLASHCARDS.length}</div>
        </div>

        <div onClick={() => setCardFlipped(!cardFlipped)} className={`relative w-full max-w-sm aspect-[3/4] cursor-pointer perspective-1000 transition-all duration-700 ${cardFlipped ? 'rotate-y-180' : ''}`} style={{ transformStyle: 'preserve-3d' }}>
          <div className="absolute inset-0 backface-hidden bg-emerald-900 rounded-[3rem] shadow-2xl flex flex-col items-center justify-center p-10 text-center text-white border-4 border-emerald-800">
             <i className="fa-solid fa-gavel text-amber-500 text-4xl mb-6 opacity-20"></i>
             <h2 className="text-2xl font-black arabic-text leading-snug">{card.term}</h2>
             <span className="mt-10 text-[10px] font-black uppercase tracking-widest text-emerald-400 animate-pulse">اضغط للعرض</span>
          </div>
          <div className={`absolute inset-0 backface-hidden rounded-[3rem] shadow-2xl flex flex-col items-center justify-center p-10 text-center border-4 rotate-y-180 ${settings.darkMode ? 'bg-slate-900 text-white border-emerald-500/20' : 'bg-white text-slate-800 border-emerald-50'}`}>
             <span className="text-[9px] font-black uppercase text-amber-600 mb-4 bg-amber-50 px-3 py-1 rounded-full">{card.lawArticle}</span>
             <p className="text-lg font-bold arabic-text leading-relaxed">{card.definition}</p>
             <i className="fa-solid fa-circle-check text-emerald-500 text-3xl mt-8"></i>
          </div>
        </div>

        <div className="w-full px-6 flex items-center gap-4">
           <button 
            disabled={currentCardIdx === 0}
            onClick={() => { setCardFlipped(false); setCurrentCardIdx(prev => prev - 1); }}
            className={`w-16 h-16 rounded-2xl border-2 flex items-center justify-center active:scale-95 transition-all disabled:opacity-30 ${settings.darkMode ? 'bg-slate-900 border-white/5 text-slate-500' : 'bg-white border-slate-200 text-slate-400'}`}
           >
             <i className={`fa-solid ${isRtl ? 'fa-arrow-right-long' : 'fa-arrow-left-long'} text-xl`}></i>
           </button>
           <button onClick={() => { if (currentCardIdx < MOCK_FLASHCARDS.length - 1) { setCardFlipped(false); setCurrentCardIdx(prev => prev + 1); } else { setGameState('selection'); } }} className="flex-1 bg-emerald-600 text-white py-6 rounded-[2rem] font-black text-sm uppercase shadow-xl border-b-8 border-emerald-800 active:border-b-0 active:translate-y-2 transition-all flex items-center justify-center gap-3">
             {currentCardIdx < MOCK_FLASHCARDS.length - 1 ? 'المتابعة' : 'إتمام المراجعة'}
             <i className="fa-solid fa-bolt"></i>
           </button>
        </div>
      </div>
    );
  };

  return (
    <div className={`flex flex-col h-full transition-colors duration-500 ${settings.darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-gray-900'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      <div className={`p-5 flex items-center justify-between border-b sticky top-0 z-50 transition-all ${settings.darkMode ? 'bg-slate-900/90 border-white/5' : 'bg-white/95 border-gray-100 shadow-sm'} backdrop-blur-xl`}>
        <div className="flex items-center gap-4">
          <button onClick={onBack} className={`w-10 h-10 flex items-center justify-center rounded-xl border shadow-md active:scale-90 transition-all ${settings.darkMode ? 'bg-slate-800 border-white/10 text-emerald-400' : 'bg-white border-gray-100 text-emerald-900'}`}>
            <i className={`fa-solid ${isRtl ? 'fa-arrow-right' : 'fa-arrow-left'}`}></i>
          </button>
          <div>
            <h2 className="text-sm font-black uppercase tracking-tight arabic-text">{t.academy}</h2>
            <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest block">مختبر التعلم العصبي</span>
          </div>
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${settings.darkMode ? 'bg-white/5 border-white/5 text-[#D4AF37]' : 'bg-emerald-50 border-emerald-100 text-emerald-900'}`}>
          <i className="fa-solid fa-graduation-cap"></i>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar scroll-smooth">
         <div className="p-5">
           <div className={`flex gap-4 mb-10 p-2 rounded-[2.5rem] shadow-sm border sticky top-4 z-40 transition-all ${settings.darkMode ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-100'}`}>
              <button onClick={() => setActiveTab('games')} className={`flex-1 py-4 rounded-3xl text-[10px] font-black uppercase transition-all flex items-center justify-center gap-2 ${activeTab === 'games' ? (settings.darkMode ? 'bg-emerald-500 text-slate-950 shadow-lg' : 'bg-emerald-900 text-white shadow-lg') : (settings.darkMode ? 'text-slate-600' : 'text-slate-400')}`}>
                <i className="fa-solid fa-gamepad"></i> {t.academyGameLab}
              </button>
              <button onClick={() => setActiveTab('series')} className={`flex-1 py-4 rounded-3xl text-[10px] font-black uppercase transition-all flex items-center justify-center gap-2 ${activeTab === 'series' ? (settings.darkMode ? 'bg-emerald-500 text-slate-950 shadow-lg' : 'bg-emerald-900 text-white shadow-lg') : (settings.darkMode ? 'text-slate-600' : 'text-slate-400')}`}>
                <i className="fa-solid fa-clapperboard"></i> {t.academyExpertSeries}
              </button>
           </div>
           {activeTab === 'series' ? renderSeries() : renderGames()}
         </div>
      </div>
    </div>
  );
};

export default LegalAcademy;
