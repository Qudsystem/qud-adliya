
import React from 'react';
import { AppSettings } from '../types';
import { translations } from '../i18n';
import { speak } from '../services/speechService';

interface EmergencyViewProps {
  settings: AppSettings;
  onBack: () => void;
}

const EMERGENCY_CONTACTS = [
  { name: 'النجدة', number: '122', icon: 'fa-shield-halved', color: 'bg-red-600' },
  { name: 'الإسعاف', number: '123', icon: 'fa-truck-medical', color: 'bg-blue-600' },
  { name: 'المطافئ', number: '180', icon: 'fa-fire-extinguisher', color: 'bg-orange-600' },
  { name: 'النيابة العامة', number: '16276', icon: 'fa-gavel', color: 'bg-emerald-900' },
  { name: 'الرقابة الإدارية', number: '16100', icon: 'fa-eye', color: 'bg-slate-900' },
  { name: 'نجدة الطفل', number: '16000', icon: 'fa-child', color: 'bg-pink-600' },
  { name: 'شكاوى رئاسة الوزراء', number: '16528', icon: 'fa-landmark', color: 'bg-indigo-900' },
  { name: 'مكافحة جرائم الإنترنت', number: '108', icon: 'fa-user-secret', color: 'bg-black' }
];

const EmergencyView: React.FC<EmergencyViewProps> = ({ settings, onBack }) => {
  const t = translations[settings.language];

  const handleCall = (num: string) => {
    window.open(`tel:${num}`, '_self');
  };

  return (
    <div className={`flex flex-col h-full animate-fade-in transition-colors ${settings.darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-gray-900'}`}>
      {/* هيدر الطوارئ */}
      <div className={`p-4 flex items-center justify-between sticky top-0 z-40 backdrop-blur-xl border-b transition-colors ${
        settings.darkMode ? 'bg-slate-900/90 border-white/5' : 'bg-white/90 border-gray-100'
      }`}>
        <button 
          onClick={onBack} 
          className={`w-10 h-10 flex items-center justify-center rounded-xl shadow-lg active:scale-90 transition-all ${
            settings.darkMode ? 'bg-red-900 text-white' : 'bg-[#6B3213] text-white'
          }`}
        >
          <i className="fa-solid fa-chevron-right"></i>
        </button>
        <div className="text-right flex-1 px-4">
           <h2 className={`text-sm font-black arabic-text ${settings.darkMode ? 'text-red-400' : 'text-[#6B3213]'}`}>{t.sosTitle}</h2>
           <p className="text-[8px] text-gray-500 font-bold arabic-text">أرقام الاستغاثة والجهات الرقابية</p>
        </div>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-xl ${
          settings.darkMode ? 'bg-amber-500 text-slate-950' : 'bg-[#FFA000] text-emerald-950'
        }`}>
           <i className="fa-solid fa-phone text-xl"></i>
        </div>
      </div>

      <div className="p-6 flex-1 overflow-y-auto no-scrollbar space-y-6">
        <div className={`rounded-[2.5rem] p-6 border mb-6 transition-colors ${
          settings.darkMode ? 'bg-red-950/10 border-red-500/10' : 'bg-amber-50 border-amber-100'
        }`}>
           <p className={`text-xs font-bold arabic-text leading-relaxed text-center ${settings.darkMode ? 'text-red-300' : 'text-amber-900'}`}>
             هذه الأرقام مخصصة للحالات العاجلة والطارئة فقط. يرجى استخدامها بمسؤولية عند الضرورة القانونية القصوى.
           </p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {EMERGENCY_CONTACTS.map((contact, idx) => (
            <button 
              key={idx}
              onClick={() => handleCall(contact.number)}
              className={`p-5 rounded-[2rem] border-2 flex items-center justify-between group active:scale-95 transition-all shadow-sm ${
                settings.darkMode ? 'bg-slate-900 border-white/5' : 'bg-white border-slate-50'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl ${contact.color} text-white flex items-center justify-center shadow-lg`}>
                  <i className={`fa-solid ${contact.icon} text-xl`}></i>
                </div>
                <div className="text-right">
                  <h4 className={`text-xs font-black arabic-text ${settings.darkMode ? 'text-white' : 'text-slate-900'}`}>{contact.name}</h4>
                  <p className={`text-[12px] font-black tracking-[0.2em] ${settings.darkMode ? 'text-slate-500' : 'text-gray-400'}`}>{contact.number}</p>
                </div>
              </div>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all ${
                settings.darkMode ? 'bg-white/5 text-emerald-400' : 'bg-emerald-50 text-emerald-900'
              }`}>
                <i className="fa-solid fa-phone-flip text-xs"></i>
              </div>
            </button>
          ))}
        </div>

        <div className="pt-10 pb-20 text-center opacity-30">
           <i className={`fa-solid fa-scale-balanced text-4xl mb-4 ${settings.darkMode ? 'text-white' : 'text-slate-900'}`}></i>
           <p className="text-[8px] font-black uppercase tracking-[0.3em]">Adliya Supreme Emergency Response</p>
        </div>
      </div>
    </div>
  );
};

export default EmergencyView;
