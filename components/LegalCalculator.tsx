
import React, { useState } from 'react';
import { AppSettings } from '../types';
import { translations } from '../i18n';
import { calculateLegalMatter } from '../services/geminiService';
import { db } from '../services/databaseService';
import SpeechButton from './SpeechButton';

const LegalCalculator: React.FC<{ settings: AppSettings, onBack: () => void, onDiscuss?: (p: string) => void }> = ({ settings, onBack }) => {
  const [selectedType, setSelectedType] = useState<'inheritance' | 'laborCalc' | 'courtFees' | null>('inheritance');
  const [inputData, setInputData] = useState('');
  const [result, setResult] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);
  const t = translations[settings.language];

  const handleCalculate = async () => {
    if (!inputData.trim()) return;
    setIsCalculating(true);
    try {
      const res = await calculateLegalMatter(selectedType || 'AUTO', inputData);
      setResult(res || 'Error');
    } catch (err) {
      setResult('Engine Error');
    } finally {
      setIsCalculating(false);
    }
  };

  const CALC_MODES = [
    { id: 'inheritance', icon: 'fa-folder-tree' },
    { id: 'laborCalc', icon: 'fa-briefcase' },
    { id: 'courtFees', icon: 'fa-building-columns' }
  ] as const;

  return (
    <div className={`flex flex-col h-full animate-fade-in transition-colors ${settings.darkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
      <header className={`p-4 flex items-center justify-between border-b sticky top-0 z-40 transition-all ${settings.darkMode ? 'bg-slate-900/90 border-white/5 text-white' : 'bg-white/95 border-gray-100 text-emerald-950'
        } backdrop-blur-xl`}>
        <button
          onClick={result ? () => setResult('') : onBack}
          className={`w-10 h-10 flex items-center justify-center rounded-xl border shadow-md active:scale-90 transition-all ${settings.darkMode ? 'bg-slate-800 border-white/10 text-emerald-400' : 'bg-white border-gray-100 text-emerald-900'
            }`}
        >
          <i className="fa-solid fa-arrow-right"></i>
        </button>
        <h2 className="text-sm font-black uppercase arabic-text">{t.calcTitle}</h2>
        <div className="w-10"></div>
      </header>

      <div className="p-5 flex-1 overflow-y-auto no-scrollbar pb-32">
        {!result ? (
          <div className="animate-slide-up space-y-8">
            <div className="grid grid-cols-3 gap-3">
              {CALC_MODES.map(mode => (
                <button
                  key={mode.id}
                  onClick={() => setSelectedType(mode.id)}
                  className={`p-4 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-2 ${selectedType === mode.id
                    ? (settings.darkMode ? 'border-amber-500 bg-amber-500/10 text-amber-400 shadow-lg' : 'border-amber-50/50 text-amber-600 shadow-lg')
                    : settings.darkMode ? 'bg-white/5 border-white/5 text-slate-600' : 'bg-white border-slate-50 text-slate-400'
                    }`}
                >
                  <i className={`fa-solid ${mode.icon} text-lg`}></i>
                  <span className="text-[9px] font-black uppercase arabic-text">{(t as any)[mode.id]}</span>
                </button>
              ))}
            </div>

            <div className="relative">
              <textarea
                autoFocus
                value={inputData}
                onChange={(e) => setInputData(e.target.value)}
                placeholder="أدخل تفاصيل الحالة هنا (مثال: توفي وترك زوجة وأبناء...)"
                className={`w-full p-8 pr-20 rounded-[2.5rem] border-2 resize-none text-sm arabic-text min-h-[250px] shadow-inner focus:outline-none focus:border-emerald-500 transition-all ${settings.darkMode
                  ? 'bg-slate-900 border-white/5 text-white placeholder:text-slate-700'
                  : 'bg-white border-slate-100 text-slate-900 placeholder:text-slate-300'
                  }`}
              />
              <div className="absolute bottom-5 right-5 z-20">
                <SpeechButton
                  onResult={(text) => setInputData(prev => prev + ' ' + text)}
                  language={settings.language}
                  darkMode={settings.darkMode}
                  size="sm"
                />
              </div>
              <div className={`absolute left-6 bottom-6 opacity-10 ${settings.darkMode ? 'text-white' : 'text-emerald-900'}`}>
                <i className="fa-solid fa-calculator text-6xl"></i>
              </div>
            </div>

            <button
              onClick={handleCalculate}
              disabled={isCalculating || !inputData.trim()}
              className={`w-full py-6 rounded-[2.5rem] font-black text-xs uppercase shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3 ${isCalculating
                ? 'bg-slate-400'
                : (settings.darkMode ? 'bg-emerald-600 text-white border-b-8 border-emerald-800' : 'bg-emerald-900 text-white border-b-8 border-emerald-950')
                }`}
            >
              {isCalculating ? (
                <i className="fa-solid fa-spinner animate-spin"></i>
              ) : (
                <i className="fa-solid fa-wand-magic-sparkles text-amber-400"></i>
              )}
              {isCalculating ? 'جاري التحليل الرقمي...' : 'بدء التحليل المالي'}
            </button>
          </div>
        ) : (
          <div className="animate-slide-up space-y-6">
            <div className={`p-8 rounded-[3rem] border shadow-supreme arabic-text text-sm leading-[2] whitespace-pre-wrap text-right transition-colors ${settings.darkMode ? 'bg-slate-900 border-white/10 text-emerald-50' : 'bg-white border-slate-50 text-slate-800'
              }`}>
              {result}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  db.saveToVault({
                    id: Date.now().toString(),
                    type: 'consultation', // Using consultation type for calculations
                    title: `حساب: ${(t as any)[selectedType || 'courtFees']}`,
                    content: result,
                    timestamp: new Date(),
                    category: 'CIVIL' as any
                  });
                  alert(settings.language === 'ar' ? 'تم الحفظ في الخزنة' : 'Saved to Vault');
                }}
                className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase shadow-lg transition-all active:scale-95 bg-emerald-600 text-white flex items-center justify-center gap-2`}
              >
                <i className="fa-solid fa-vault"></i> {t.vaultSave || 'حفظ في الخزنة'}
              </button>
              <button
                onClick={() => setResult('')}
                className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase transition-colors ${settings.darkMode ? 'bg-white/5 text-slate-400 border border-white/5' : 'bg-slate-100 text-slate-600'
                  }`}
              >
                إجراء حساب جديد
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LegalCalculator;
