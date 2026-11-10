
import React from 'react';
import { AppSettings, FontSize, NotificationSound } from '../types';
import { translations } from '../i18n';
import { speak } from '../services/speechService';

interface SettingsProps {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  onNavigate: (tab: string) => void;
  onBack: () => void;
}

const Settings: React.FC<SettingsProps> = ({ settings, updateSettings, onNavigate, onBack }) => {
  const t = translations[settings.language];

  const handleToggle = (key: keyof AppSettings, label: string) => {
    const newVal = !settings[key];
    updateSettings({ [key]: newVal });
    if (settings.narrationEnabled) {
      speak(`${label}: ${newVal ? 'Enabled' : 'Disabled'}`, settings.language);
    }
  };

  const handleFontSizeChange = (size: FontSize) => {
    updateSettings({ fontSize: size });
    if (settings.narrationEnabled) {
      speak(`${t.textSize}: ${t[size]}`, settings.language);
    }
  };

  const handleSoundChange = (sound: NotificationSound) => {
    updateSettings({ notificationSound: sound });
    // Simulate playing a sample of the sound here if needed
  };

  const handleClearData = () => {
    if (window.confirm(settings.language === 'ar' ? 'هل أنت متأكد من مسح كافة البيانات؟' : 'Are you sure you want to clear all data?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const handleLogout = () => {
    if (window.confirm(settings.language === 'ar' ? 'هل تريد تسجيل الخروج من حسابك؟' : 'Are you sure you want to logout from your account?')) {
      localStorage.removeItem('adliya_consent');
      window.location.reload();
    }
  };

  return (
    <div className={`flex flex-col h-full ${settings.darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-gray-900'}`} dir="rtl">
      <header className={`p-4 flex items-center justify-between border-b sticky top-0 z-40 transition-all ${settings.darkMode ? 'bg-slate-900/90 border-white/5 text-white' : 'bg-white/95 border-gray-100 text-emerald-950'
        } backdrop-blur-xl`}>
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className={`w-10 h-10 flex items-center justify-center rounded-xl border shadow-md active:scale-90 transition-all ${settings.darkMode ? 'bg-slate-800 border-white/10 text-emerald-400' : 'bg-white border-gray-100 text-emerald-900'
              }`}
          >
            <i className="fa-solid fa-arrow-right"></i>
          </button>
          <h2 className="text-sm font-black uppercase tracking-tight arabic-text">{t.settings}</h2>
        </div>
      </header>

      <div className="p-6 space-y-10 pb-40 overflow-y-auto no-scrollbar">
        <section>
          <h3 className={`text-xs font-black uppercase tracking-widest mb-6 px-2 ${settings.darkMode ? 'text-emerald-400' : 'text-emerald-900'}`}>
            تفضيلات الواجهة والتنبيهات
          </h3>

          <div className="space-y-4">
            <ToggleItem
              icon="fa-language"
              label="English / العربية"
              value={settings.language === 'en'}
              onToggle={() => updateSettings({ language: settings.language === 'ar' ? 'en' : 'ar' })}
              darkMode={settings.darkMode}
            />
            <ToggleItem
              icon="fa-moon"
              label={t.darkMode}
              value={settings.darkMode}
              onToggle={() => handleToggle('darkMode', t.darkMode)}
              darkMode={settings.darkMode}
            />
            <ToggleItem
              icon="fa-volume-high"
              label={t.narration}
              value={settings.narrationEnabled}
              onToggle={() => handleToggle('narrationEnabled', t.narration)}
              darkMode={settings.darkMode}
            />
          </div>
        </section>

        {/* Voice Settings Section */}
        <section className={`p-8 rounded-[3rem] border transition-all ${settings.darkMode ? 'bg-slate-900 border-white/5 shadow-none' : 'bg-white border-gray-100 shadow-lg'}`}>
          <h3 className={`text-xs font-black uppercase tracking-widest flex items-center gap-3 mb-8 ${settings.darkMode ? 'text-emerald-400' : 'text-emerald-900'}`}>
            <i className="fa-solid fa-microphone text-emerald-500 text-lg"></i>
            {settings.language === 'ar' ? 'إعدادات الصوت' : 'Voice Settings'}
          </h3>

          {/* Voice Gender */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <i className={`fa-solid fa-user-astronaut text-lg ${settings.darkMode ? 'text-emerald-400' : 'text-emerald-700'}`}></i>
              <span className={`text-sm font-black ${settings.darkMode ? 'text-white' : 'text-emerald-950'}`}>
                {settings.language === 'ar' ? 'نوع الصوت' : 'Voice Type'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => updateSettings({ voiceGender: 'male' })}
                className={`py-5 rounded-2xl text-sm font-black uppercase border-2 transition-all flex flex-col items-center gap-2 active:scale-95 ${settings.voiceGender === 'male'
                  ? (settings.darkMode ? 'bg-emerald-600 text-white border-emerald-500 shadow-xl' : 'bg-emerald-900 text-white border-emerald-950 shadow-xl')
                  : `${settings.darkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-slate-50 border-transparent text-gray-500'}`
                  }`}
              >
                <i className="fa-solid fa-mars text-xl"></i>
                {settings.language === 'ar' ? 'ذكر' : 'Male'}
              </button>
              <button
                onClick={() => updateSettings({ voiceGender: 'female' })}
                className={`py-5 rounded-2xl text-sm font-black uppercase border-2 transition-all flex flex-col items-center gap-2 active:scale-95 ${settings.voiceGender === 'female'
                  ? (settings.darkMode ? 'bg-pink-600 text-white border-pink-500 shadow-xl' : 'bg-pink-600 text-white border-pink-700 shadow-xl')
                  : `${settings.darkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-slate-50 border-transparent text-gray-500'}`
                  }`}
              >
                <i className="fa-solid fa-venus text-xl"></i>
                {settings.language === 'ar' ? 'أنثى' : 'Female'}
              </button>
            </div>
          </div>

          {/* Voice Personality */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <i className={`fa-solid fa-masks-theater text-lg ${settings.darkMode ? 'text-purple-400' : 'text-purple-600'}`}></i>
              <span className={`text-sm font-black ${settings.darkMode ? 'text-white' : 'text-emerald-950'}`}>
                {settings.language === 'ar' ? 'شخصية الصوت' : 'Voice Personality'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'alloy', icon: 'fa-robot', label: { ar: 'المساعد', en: 'Assistant' }, color: 'emerald' },
                { id: 'echo', icon: 'fa-wave-square', label: { ar: 'الهادئ', en: 'Calm' }, color: 'blue' },
                { id: 'fable', icon: 'fa-book-open', label: { ar: 'الراوي', en: 'Storyteller' }, color: 'amber' },
                { id: 'onyx', icon: 'fa-circle', label: { ar: 'الرسمي', en: 'Formal' }, color: 'slate' },
                { id: 'nova', icon: 'fa-star', label: { ar: 'المرح', en: 'Cheerful' }, color: 'pink' },
                { id: 'shimmer', icon: 'fa-wand-magic-sparkles', label: { ar: 'الودود', en: 'Friendly' }, color: 'cyan' },
              ].map((voice) => (
                <button
                  key={voice.id}
                  onClick={() => updateSettings({ voicePersonality: voice.id as any })}
                  className={`py-4 rounded-2xl text-xs font-black uppercase border-2 transition-all flex flex-col items-center gap-2 active:scale-95 ${settings.voicePersonality === voice.id
                    ? `bg-${voice.color}-600 text-white border-${voice.color}-500 shadow-xl`
                    : `${settings.darkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-slate-50 border-transparent text-gray-500'}`
                    }`}
                  style={settings.voicePersonality === voice.id ? {
                    backgroundColor: voice.color === 'emerald' ? '#059669' :
                      voice.color === 'blue' ? '#2563eb' :
                        voice.color === 'amber' ? '#d97706' :
                          voice.color === 'slate' ? '#475569' :
                            voice.color === 'pink' ? '#db2777' : '#06b6d4',
                    borderColor: voice.color === 'emerald' ? '#10b981' :
                      voice.color === 'blue' ? '#3b82f6' :
                        voice.color === 'amber' ? '#f59e0b' :
                          voice.color === 'slate' ? '#64748b' :
                            voice.color === 'pink' ? '#ec4899' : '#22d3ee'
                  } : {}}
                >
                  <i className={`fa-solid ${voice.icon} text-xl`}></i>
                  {voice.label[settings.language]}
                </button>
              ))}
            </div>
          </div>

          {/* Voice Speed */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <i className={`fa-solid fa-gauge-high text-lg ${settings.darkMode ? 'text-amber-400' : 'text-amber-600'}`}></i>
                <span className={`text-sm font-black ${settings.darkMode ? 'text-white' : 'text-emerald-950'}`}>
                  {settings.language === 'ar' ? 'سرعة الصوت' : 'Voice Speed'}
                </span>
              </div>
              <span className={`text-xl font-black ${settings.darkMode ? 'text-amber-400' : 'text-amber-600'}`}>
                {settings.voiceSpeed}x
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="4"
              step="0.25"
              value={settings.voiceSpeed}
              onChange={(e) => updateSettings({ voiceSpeed: parseFloat(e.target.value) })}
              className="w-full h-3 rounded-full appearance-none cursor-pointer accent-emerald-500"
              style={{
                background: settings.darkMode
                  ? `linear-gradient(to left, #10b981 0%, #10b981 ${((settings.voiceSpeed - 0.5) / 3.5) * 100}%, #1e293b ${((settings.voiceSpeed - 0.5) / 3.5) * 100}%, #1e293b 100%)`
                  : `linear-gradient(to left, #064e3b 0%, #064e3b ${((settings.voiceSpeed - 0.5) / 3.5) * 100}%, #e2e8f0 ${((settings.voiceSpeed - 0.5) / 3.5) * 100}%, #e2e8f0 100%)`
              }}
            />
            <div className={`flex justify-between text-[10px] font-black uppercase mt-2 ${settings.darkMode ? 'text-slate-500' : 'text-gray-400'}`}>
              <span>0.5x</span>
              <span className={`${settings.voiceSpeed === 1 ? (settings.darkMode ? 'text-emerald-400' : 'text-emerald-700') : ''}`}>1x</span>
              <span>2x</span>
              <span>4x</span>
            </div>
          </div>
        </section>

        {/* Notification Sound Section */}
        <section className={`p-8 rounded-[3rem] border transition-all ${settings.darkMode ? 'bg-slate-900 border-white/5 shadow-none' : 'bg-white border-gray-100 shadow-lg'}`}>
          <h3 className={`text-xs font-black uppercase tracking-widest flex items-center gap-3 mb-8 ${settings.darkMode ? 'text-amber-400' : 'text-emerald-900'}`}>
            <i className="fa-solid fa-bell text-amber-500 text-lg"></i>
            {t.notificationSound}
          </h3>

          <div className="grid grid-cols-2 gap-4">
            {(['default', 'gavel', 'alert', 'bell'] as NotificationSound[]).map(sound => (
              <button
                key={sound}
                onClick={() => handleSoundChange(sound)}
                className={`py-6 rounded-3xl text-[10px] font-black uppercase border-2 transition-all flex flex-col items-center gap-3 active:scale-95 ${settings.notificationSound === sound
                  ? (settings.darkMode ? 'bg-emerald-600 text-white border-emerald-500 shadow-xl' : 'bg-emerald-900 text-white border-emerald-950 shadow-xl')
                  : `${settings.darkMode ? 'bg-white/5 border-transparent text-gray-500' : 'bg-slate-50 border-transparent text-gray-400'}`
                  }`}
              >
                <i className={`fa-solid ${sound === 'gavel' ? 'fa-gavel' : sound === 'alert' ? 'fa-triangle-exclamation' : 'fa-bell'} text-xl`}></i>
                {sound === 'default' ? t.soundDefault : sound === 'gavel' ? t.soundGavel : sound === 'alert' ? t.soundAlert : t.soundBell}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h3 className={`text-xs font-black uppercase tracking-widest mb-6 px-2 ${settings.darkMode ? 'text-emerald-400' : 'text-emerald-900'}`}>
            {t.accessibility}
          </h3>
          <div className={`p-8 rounded-[3rem] border space-y-6 shadow-lg transition-all ${settings.darkMode ? 'bg-slate-900 border-white/5 shadow-none' : 'bg-white border-gray-100'}`}>
            <div className="flex items-center gap-4 mb-2">
              <i className="fa-solid fa-magnifying-glass-plus text-[#D4AF37] text-xl"></i>
              <span className="text-sm font-black uppercase tracking-tighter">{t.textSize}</span>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {(['small', 'medium', 'large', 'xl'] as FontSize[]).map((size) => (
                <button
                  key={size}
                  onClick={() => handleFontSizeChange(size)}
                  className={`py-4 rounded-2xl text-[10px] font-black uppercase transition-all border-2 active:scale-90 ${settings.fontSize === size
                    ? (settings.darkMode ? 'bg-emerald-600 text-white border-emerald-500 shadow-md' : 'bg-emerald-900 text-white border-emerald-950 shadow-md')
                    : `${settings.darkMode ? 'bg-white/5 text-gray-400 border-transparent' : 'bg-white text-gray-400 border-transparent'}`
                    }`}
                >
                  {t[size]}
                </button>
              ))}
            </div>
          </div>
        </section>

        <div className="space-y-4 pt-10">
          <button
            onClick={handleClearData}
            className="w-full text-red-500 text-[10px] font-black uppercase tracking-widest py-6 border border-red-100 rounded-[2.5rem] active:bg-red-50 transition-all flex items-center justify-center gap-3"
          >
            <i className="fa-solid fa-trash-can"></i>
            {t.clearData}
          </button>

          <button
            onClick={handleLogout}
            className="w-full text-white bg-red-600 hover:bg-red-700 text-[11px] font-black uppercase tracking-[0.2em] py-6 rounded-[2.5rem] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3 border-b-8 border-red-800"
          >
            <i className="fa-solid fa-right-from-bracket"></i>
            {t.logout}
          </button>
        </div>
      </div>
    </div>
  );
};

const ToggleItem: React.FC<{ icon: string; label: string; value: boolean; onToggle: () => void; darkMode: boolean }> = ({ icon, label, value, onToggle, darkMode }) => (
  <div className={`flex items-center justify-between p-5 rounded-[2rem] border transition-all ${darkMode ? 'bg-slate-900 border-white/5 shadow-none' : 'bg-white border-slate-100 shadow-sm'
    }`}>
    <div className="flex items-center gap-4">
      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${darkMode ? 'bg-white/5 text-emerald-400' : 'bg-emerald-50 text-emerald-900'}`}>
        <i className={`fa-solid ${icon} text-lg`}></i>
      </div>
      <span className={`text-[12px] font-black uppercase tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>{label}</span>
    </div>
    <button
      onClick={onToggle}
      className={`w-12 h-7 rounded-full relative transition-all duration-500 flex items-center ${value
        ? 'bg-emerald-500 justify-end'
        : (darkMode ? 'bg-slate-700 border border-slate-600 justify-start' : 'bg-slate-300 justify-start')
        }`}
    >
      <div className={`w-5 h-5 rounded-full shadow-lg transition-all duration-500 mx-0.5 ${value
        ? 'bg-white'
        : (darkMode ? 'bg-slate-400' : 'bg-white')
        }`}></div>
    </button>
  </div>
);

export default Settings;
