
import React, { useState, useEffect } from 'react';
import { AppSettings } from '../types';
import { speak } from '../services/speechService';

const LEGAL_INSIGHTS = [
  { ar: "العدل أساس الملك، وسيادة القانون هي الضمانة الأولى للحريات.", en: "Justice is the foundation of the state, and the rule of law is the first guarantee of freedoms." },
  { ar: "العقد شريعة المتعاقدين، فلا يجوز نقضه ولا تعديله إلا باتفاق الطرفين.", en: "A contract is the law of the contracting parties; it may not be revoked or amended except by their mutual agreement." },
  { ar: "الأصل في الإنسان البراءة، والشك يفسر دائماً لصالح المتهم.", en: "The presumption of innocence is the standard; doubt is always interpreted in favor of the accused." },
  { ar: "لا يُنسب لمساكت قول، ولكن السكوت في معرض الحاجة إلى البيان بيان.", en: "Silence is not a statement, but silence in the face of a need for clarification is clarification." }
];

interface LegalInsightProps {
  settings: AppSettings;
}

const LegalInsight: React.FC<LegalInsightProps> = ({ settings }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % LEGAL_INSIGHTS.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const insight = LEGAL_INSIGHTS[index];

  const handleListen = () => {
    const textToSpeak = settings.language === 'ar' 
      ? `عزيزي المستفيد، إليك هذه البصيرة القانونية: ${insight.ar}` 
      : `Legal insight: ${insight.en}`;
    speak(textToSpeak, settings.language);
  };

  return (
    <button 
      onClick={handleListen}
      className={`w-full p-6 rounded-[2.5rem] relative overflow-hidden transition-all duration-300 border group text-right active:scale-[0.98] hover:brightness-105 shadow-sm ${
        settings.darkMode ? 'bg-emerald-900/40 border-emerald-500/30 shadow-none' : 'bg-emerald-50 border-emerald-100'
      }`}
    >
      {/* أيقونة الأذن في الركن العلوي الأيسر */}
      <div className={`absolute top-4 left-4 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all group-hover:animate-pulse ${
        settings.darkMode ? 'bg-white/10 text-[#D4AF37]' : 'bg-emerald-900/10 text-[#D4AF37]'
      }`}>
        <i className="fa-solid fa-ear-listen text-xs"></i>
      </div>

      <div className="flex items-start gap-4 relative z-10 pointer-events-none">
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
          settings.darkMode ? 'bg-emerald-700 text-amber-400' : 'bg-emerald-900 text-amber-400'
        }`}>
          <i className="fa-solid fa-quote-right"></i>
        </div>
        <div className="text-right flex-1">
          <div className="flex justify-between items-center mb-2">
            <h4 className={`text-[10px] font-black uppercase tracking-widest ${
              settings.darkMode ? 'text-emerald-300' : 'text-emerald-900 opacity-60'
            }`}>
              {settings.language === 'ar' ? 'بصيرة قانونية' : 'Legal Insight'}
            </h4>
          </div>
          <p className={`text-[13px] font-bold arabic-text leading-relaxed animate-fade-in ${
            settings.darkMode ? 'text-white' : 'text-emerald-950'
          }`} key={index}>
            {settings.language === 'ar' ? insight.ar : insight.en}
          </p>
        </div>
      </div>
      
      {/* خلفية جمالية */}
      <i className={`fa-solid fa-scale-balanced absolute -right-4 -bottom-4 text-6xl opacity-5 rotate-12 ${
        settings.darkMode ? 'text-white' : 'text-emerald-900'
      }`}></i>
    </button>
  );
};

export default LegalInsight;
