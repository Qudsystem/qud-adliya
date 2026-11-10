
import React, { useState, useEffect } from 'react';
import { AppSettings, LegalCategory } from '../types';
import { translations } from '../i18n';
import { generateLegalConsultation, calculateLegalMatter, draftLegalDocument } from '../services/geminiService';
import { db } from '../services/databaseService';
import SpeechButton from './SpeechButton';

interface WizardModalProps {
  settings: AppSettings;
  onClose: () => void;
  onFinish: (p: string) => void;
}

type WizardStep = 'category' | 'diagnosis' | 'estimation' | 'drafting' | 'execution';

const WizardModal: React.FC<WizardModalProps> = ({ settings, onClose, onFinish }) => {
  const [step, setStep] = useState<WizardStep>('category');
  const [selectedCategory, setSelectedCategory] = useState<LegalCategory | null>(null);
  const [userInput, setUserInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // النتائج التراكمية لكل مرحلة
  const [results, setResults] = useState({
    diagnosis: '',
    estimation: '',
    drafting: '',
    execution: ''
  });

  const t = translations[settings.language];

  const stepsOrder: WizardStep[] = ['category', 'diagnosis', 'estimation', 'drafting', 'execution'];
  const currentStepIdx = stepsOrder.indexOf(step);

  const handleNext = async () => {
    setIsProcessing(true);
    try {
      if (step === 'category') {
        setStep('diagnosis');
      } else if (step === 'diagnosis') {
        // البدء بالتشخيص الحقيقي
        const res = await generateLegalConsultation(`توصيف قانوني دقيق للمشكلة التالية: ${userInput}`, selectedCategory!, false);
        setResults(prev => ({ ...prev, diagnosis: res }));
        setStep('estimation');
      } else if (step === 'estimation') {
        // حساب التكاليف والمدد
        const res = await calculateLegalMatter('تقدير التكاليف والرسوم والمدد الزمنية', userInput);
        setResults(prev => ({ ...prev, estimation: res }));
        setStep('drafting');
      } else if (step === 'drafting') {
        // وضع مسودة الإجراء
        const res = await draftLegalDocument('خارطة طريق إجرائية', userInput);
        setResults(prev => ({ ...prev, drafting: res }));
        setStep('execution');
      } else if (step === 'execution') {
        // حفظ ملف الحالة في الخزنة وإنهاء المعالج
        db.saveToVault({
          id: Date.now().toString(),
          type: 'consultation',
          title: `ملف تمكين: ${userInput.substring(0, 20)}...`,
          content: `التشخيص:\n${results.diagnosis}\n\nالتقدير:\n${results.estimation}\n\nالصياغة:\n${results.drafting}`,
          timestamp: new Date(),
          category: selectedCategory!
        });
        onFinish(userInput);
      }
    } catch (err: any) {
      console.error(err);
      alert(settings.language === 'ar' ? "خطأ في الاتصال بالذكاء الاصطناعي: تأكد من مفتاح الـ API" : "AI Connection Error: Check your API key");
    } finally {
      setIsProcessing(false);
    }
  };

  const renderProgress = () => (
    <div className="relative mb-12 px-2">
      <div className={`absolute h-[2px] left-10 right-10 top-[20px] z-0 ${settings.darkMode ? 'bg-white/5' : 'bg-slate-100'}`}></div>
      <div
        className="absolute h-[2px] bg-emerald-500 top-[20px] z-0 transition-all duration-700"
        style={{ right: '40px', width: `${(currentStepIdx / (stepsOrder.length - 1)) * 80}%` }}
      ></div>
      <div className="flex justify-between items-center relative z-10">
        {stepsOrder.slice(1).map((s, idx) => {
          const isActive = stepsOrder.indexOf(s) <= currentStepIdx;
          const isCurrent = s === step;
          return (
            <div key={s} className="flex flex-col items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-[10px] font-black border-4 transition-all ${isCurrent ? 'bg-amber-500 text-emerald-950 border-white scale-110 shadow-lg' :
                isActive ? 'bg-emerald-600 text-white border-white shadow-md' :
                  'bg-slate-100 text-slate-300 border-transparent'
                }`}>
                {isActive && !isCurrent ? <i className="fa-solid fa-check"></i> : idx + 1}
              </div>
              <span className={`text-[8px] font-black uppercase whitespace-nowrap ${isActive ? 'text-emerald-500' : 'text-slate-300'}`}>
                {s === 'diagnosis' ? 'التشخيص' : s === 'estimation' ? 'التقدير' : s === 'drafting' ? 'الصياغة' : 'التنفيذ'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in" dir="rtl">
      <div className={`w-full max-w-md rounded-[3rem] overflow-hidden flex flex-col shadow-supreme border transition-all duration-500 ${settings.darkMode ? 'bg-slate-900 border-white/10' : 'bg-white border-gray-100'
        }`}>
        {/* Header */}
        <div className="bg-[#064e3b] p-6 flex justify-between items-center text-white">
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest mb-1">مسار التمكين الذكي</span>
            <h3 className="text-sm font-black uppercase tracking-tight arabic-text">خبير عدلية الافتراضي</h3>
          </div>
          <button onClick={onClose} className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center active:scale-90 transition-all">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="flex-1 p-8 overflow-y-auto no-scrollbar max-h-[75vh]">
          {step === 'category' && (
            <div className="space-y-6 animate-slide-up">
              <h4 className="text-xl font-black text-center arabic-text">اختر تخصص القضية</h4>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { key: LegalCategory.CIVIL, icon: 'fa-scale-balanced', label: 'القانون المدني' },
                  { key: LegalCategory.CRIMINAL, icon: 'fa-handcuffs', label: 'القانون الجنائي' },
                  { key: LegalCategory.PERSONAL_STATUS, icon: 'fa-heart', label: 'الأحوال الشخصية' },
                  { key: LegalCategory.LABOR, icon: 'fa-briefcase', label: 'قانون العمل' }
                ].map(p => (
                  <button
                    key={p.key}
                    onClick={() => setSelectedCategory(p.key as LegalCategory)}
                    className={`p-5 rounded-[2.5rem] border-2 transition-all flex flex-col items-center gap-3 active:scale-95 ${selectedCategory === p.key ? 'border-amber-500 bg-amber-50 text-emerald-950' : 'border-slate-50 bg-slate-50 text-slate-400'
                      }`}
                  >
                    <i className={`fa-solid ${p.icon} text-2xl`}></i>
                    <span className="text-[10px] font-black arabic-text">{p.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step !== 'category' && renderProgress()}

          {step === 'diagnosis' && (
            <div className="space-y-6 animate-slide-up">
              <h4 className="text-xl font-black text-center arabic-text">وصف المشكلة القانونية</h4>
              <div className="relative">
                <textarea
                  autoFocus
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="يرجى كتابة تفاصيل المشكلة هنا أو استخدام الميكروفون..."
                  className={`w-full pl-7 pr-20 py-7 rounded-[2.5rem] min-h-[200px] border-2 focus:border-emerald-500 outline-none transition-all arabic-text text-sm leading-relaxed ${settings.darkMode ? 'bg-slate-800 border-white/5 text-white' : 'bg-white border-slate-100 shadow-inner'
                    }`}
                />
                <div className="absolute bottom-5 right-5">
                  <SpeechButton onResult={(t) => setUserInput(prev => prev + ' ' + t)} language={settings.language} darkMode={settings.darkMode} size="sm" />
                </div>
              </div>
            </div>
          )}

          {(step === 'estimation' || step === 'drafting' || step === 'execution') && (
            <div className="space-y-6 animate-slide-up">
              <h4 className="text-xl font-black text-center arabic-text">
                {step === 'estimation' ? 'تقدير التكاليف والزمن' : step === 'drafting' ? 'خارطة الطريق الإجرائية' : 'تقرير التمكين النهائي'}
              </h4>
              <div className={`p-8 rounded-[3rem] border shadow-inner arabic-text text-sm leading-loose whitespace-pre-wrap text-right ${settings.darkMode ? 'bg-slate-800 border-white/5 text-emerald-50' : 'bg-slate-50 border-slate-100 text-emerald-950'
                }`}>
                {isProcessing ? (
                  <div className="flex flex-col items-center justify-center py-10 gap-4">
                    <i className="fa-solid fa-wand-magic-sparkles text-amber-500 text-4xl animate-pulse"></i>
                    <span className="text-[10px] font-black uppercase text-gray-400">جاري المعالجة الذكية...</span>
                  </div>
                ) : (
                  step === 'estimation' ? results.estimation :
                    step === 'drafting' ? results.drafting :
                      results.diagnosis
                )}
              </div>

              {step === 'execution' && !isProcessing && (
                <div className="bg-emerald-500/10 p-5 rounded-3xl border border-emerald-500/20 text-emerald-600 text-[10px] font-black text-center animate-bounce">
                  ✓ تم حفظ ملف الحالة في خزنة المستندات الخاصة بك بنجاح
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className={`p-8 border-t flex gap-4 ${settings.darkMode ? 'bg-slate-900 border-white/5' : 'bg-white'}`}>
          {currentStepIdx > 1 && !isProcessing && (
            <button
              onClick={() => {
                if (step === 'estimation') setStep('diagnosis');
                else if (step === 'drafting') setStep('estimation');
                else if (step === 'execution') setStep('drafting');
              }}
              className="flex-1 py-5 rounded-2xl font-black text-[10px] uppercase text-gray-400 active:scale-95 transition-all"
            >
              السابق
            </button>
          )}
          <button
            disabled={(step === 'category' && !selectedCategory) || (step === 'diagnosis' && !userInput.trim()) || isProcessing}
            onClick={handleNext}
            className={`flex-[2] py-5 rounded-2xl font-black text-[11px] uppercase shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 ${isProcessing ? 'bg-gray-400' : 'bg-[#064e3b] text-white border-b-4 border-emerald-950'
              }`}
          >
            {isProcessing ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className={`fa-solid ${step === 'execution' ? 'fa-check-double' : 'fa-arrow-left'}`}></i>}
            {step === 'execution' ? 'إتمام وحفظ' : 'المتابعة للمرحلة القادمة'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WizardModal;
