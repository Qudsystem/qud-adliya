
import React, { useState } from 'react';
import { MOCK_CONSULTANTS } from '../constants';
import { HumanConsultant, AppSettings } from '../types';
import { translations } from '../i18n';

const LawyerDirectory: React.FC<{ onBack: () => void, settings: AppSettings }> = ({ onBack, settings }) => {
  const t = translations[settings.language];
  const [selectedLawyer, setSelectedLawyer] = useState<HumanConsultant | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const handleBook = (lawyer: HumanConsultant) => {
    setSelectedLawyer(lawyer);
    setShowBookingModal(true);
    if (navigator.vibrate) navigator.vibrate(20);
  };

  const handleChat = (lawyer: HumanConsultant) => {
    alert(settings.language === 'ar'
      ? `سيتم فتح محادثة مع ${lawyer.name} قريباً`
      : `Chat with ${lawyer.name} coming soon`);
  };

  return (
    <div className={`min-h-full pb-32 transition-colors ${settings.darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-gray-900'}`} dir="rtl">
      {/* Header */}
      <div className={`p-4 sticky top-0 border-b flex items-center gap-3 z-20 backdrop-blur-xl transition-colors ${settings.darkMode ? 'bg-slate-900/90 border-white/5' : 'bg-white/95 border-gray-100'
        }`}>
        <button
          onClick={onBack}
          className={`w-10 h-10 flex items-center justify-center rounded-xl border shadow-md active:scale-90 transition-all ${settings.darkMode ? 'bg-slate-800 border-white/10 text-emerald-400' : 'bg-white border-gray-100 text-emerald-900'
            }`}
        >
          <i className="fa-solid fa-arrow-right"></i>
        </button>
        <h2 className={`text-sm font-black uppercase tracking-widest ${settings.darkMode ? 'text-white' : 'text-emerald-950'}`}>
          {t.marketplace}
        </h2>
      </div>

      <div className="p-4 space-y-4">
        {/* Lawyer Cards */}
        {MOCK_CONSULTANTS.map((lawyer) => (
          <div
            key={lawyer.id}
            className={`rounded-3xl p-5 shadow-lg border transition-all hover:scale-[1.02] ${settings.darkMode
                ? 'bg-slate-900 border-white/5 hover:border-emerald-500/30'
                : 'bg-white border-gray-100 hover:shadow-xl'
              }`}
          >
            <div className="flex gap-4">
              {/* Avatar */}
              <div className="relative shrink-0">
                <img
                  src={lawyer.imageUrl}
                  alt={lawyer.name}
                  className={`w-16 h-16 rounded-2xl object-cover border-2 ${settings.darkMode ? 'border-slate-700' : 'border-gray-100'
                    }`}
                />
                {lawyer.isOnline && (
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 rounded-full ${settings.darkMode ? 'border-slate-900' : 'border-white'
                    }`}></div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className={`text-sm font-black arabic-text ${settings.darkMode ? 'text-white' : 'text-emerald-950'}`}>
                      {lawyer.name}
                    </h3>
                    <p className={`text-[10px] font-black uppercase ${settings.darkMode ? 'text-emerald-400' : 'text-emerald-800'}`}>
                      {lawyer.title}
                    </p>
                  </div>
                  <div className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-black ${settings.darkMode ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-50 text-amber-700'
                    }`}>
                    <i className="fa-solid fa-star"></i> {lawyer.rating}
                  </div>
                </div>

                <p className={`text-[10px] mt-1 mb-3 ${settings.darkMode ? 'text-slate-500' : 'text-gray-500'}`}>
                  {lawyer.location} • {lawyer.experienceYears} {settings.language === 'ar' ? 'سنة خبرة' : 'yr exp'}
                </p>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleBook(lawyer)}
                    className={`flex-1 text-[10px] font-black py-3 rounded-xl active:scale-95 shadow-md transition-all ${settings.darkMode
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        : 'bg-emerald-900 hover:bg-emerald-800 text-white'
                      }`}
                  >
                    {t.bookConsult} {lawyer.consultationFee} {t.egp}
                  </button>
                  <button
                    onClick={() => handleChat(lawyer)}
                    className={`px-4 py-3 rounded-xl border transition-all active:scale-95 ${settings.darkMode
                        ? 'bg-slate-800 border-white/10 text-emerald-400 hover:bg-slate-700'
                        : 'bg-slate-100 border-gray-200 text-emerald-900 hover:bg-slate-200'
                      }`}
                  >
                    <i className="fa-solid fa-comments text-xs"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Payment Options */}
        <div className={`p-6 rounded-[2.5rem] space-y-4 transition-colors ${settings.darkMode ? 'bg-slate-900 border border-white/5' : 'bg-slate-900'
          } text-white`}>
          <h4 className="text-xs font-black uppercase text-amber-500 tracking-widest arabic-text">
            {settings.language === 'ar' ? 'خيارات الدفع المدعومة' : 'Supported Payment Options'}
          </h4>
          <div className="flex justify-around items-center opacity-80">
            <div className="flex flex-col items-center gap-2">
              <i className="fa-solid fa-mobile-screen-button text-2xl text-emerald-400" title="Vodafone Cash"></i>
              <span className="text-[8px] font-bold">فودافون كاش</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <i className="fa-solid fa-credit-card text-2xl text-blue-400" title="Credit Card"></i>
              <span className="text-[8px] font-bold">بطاقة ائتمان</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <i className="fa-solid fa-wallet text-2xl text-amber-400" title="Fawry"></i>
              <span className="text-[8px] font-bold">فوري</span>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedLawyer && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex items-end justify-center p-4 animate-fade-in">
          <div className={`w-full max-w-md rounded-t-[3rem] p-8 animate-slide-up ${settings.darkMode ? 'bg-slate-900' : 'bg-white'
            }`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className={`text-lg font-black arabic-text ${settings.darkMode ? 'text-white' : 'text-emerald-950'}`}>
                {settings.language === 'ar' ? 'حجز استشارة' : 'Book Consultation'}
              </h3>
              <button
                onClick={() => setShowBookingModal(false)}
                className={`w-10 h-10 rounded-full flex items-center justify-center ${settings.darkMode ? 'bg-white/5 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className={`p-4 rounded-2xl mb-6 ${settings.darkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
              <div className="flex items-center gap-3">
                <img src={selectedLawyer.imageUrl} alt={selectedLawyer.name} className="w-12 h-12 rounded-xl object-cover" />
                <div>
                  <h4 className={`font-black text-sm ${settings.darkMode ? 'text-white' : 'text-emerald-950'}`}>{selectedLawyer.name}</h4>
                  <p className={`text-[10px] ${settings.darkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>{selectedLawyer.title}</p>
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-2xl mb-6 border-2 border-dashed ${settings.darkMode ? 'border-amber-500/30 bg-amber-500/5' : 'border-amber-200 bg-amber-50'
              }`}>
              <div className="flex justify-between items-center">
                <span className={`text-sm font-black ${settings.darkMode ? 'text-amber-400' : 'text-amber-700'}`}>
                  {settings.language === 'ar' ? 'رسوم الاستشارة' : 'Consultation Fee'}
                </span>
                <span className={`text-xl font-black ${settings.darkMode ? 'text-white' : 'text-emerald-950'}`}>
                  {selectedLawyer.consultationFee} {t.egp}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                alert(settings.language === 'ar' ? 'سيتم توجيهك لصفحة الدفع قريباً!' : 'Payment page coming soon!');
                setShowBookingModal(false);
              }}
              className="w-full py-5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm uppercase shadow-xl active:scale-95 transition-all"
            >
              <i className="fa-solid fa-lock mr-2"></i>
              {settings.language === 'ar' ? 'تأكيد والدفع الآمن' : 'Confirm & Secure Pay'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LawyerDirectory;
