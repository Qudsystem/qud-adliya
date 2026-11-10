
import React, { useState } from 'react';
import {
  queryLawArticle,
  summarizeLegalText,
  simplifyLegalText,
  extractLegalBrief
} from '../services/geminiService';
import { translations } from '../i18n';
import { db } from '../services/databaseService';
import { speak } from '../services/speechService';
import SpeechButton from './SpeechButton';

interface LawLibraryProps {
  settings: any;
  onBack: () => void;
  onDiscuss?: (prompt: string) => void;
}

const LawLibrary: React.FC<LawLibraryProps> = ({ settings, onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [quickResult, setQuickResult] = useState<{ type: string, content: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const t = translations[settings.language];

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsLoading(true);
    setQuickResult(null);
    try {
      const data = await queryLawArticle(searchQuery);
      setResult(data || t.noArticles);
    } catch (err) {
      setResult(t.dbError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = async (type: 'summarize' | 'simplify' | 'brief' | 'audio') => {
    if (!result) return;
    setIsProcessing(true);
    try {
      let res = "";
      if (type === 'summarize') res = await summarizeLegalText(result);
      else if (type === 'simplify') res = await simplifyLegalText(result);
      else if (type === 'brief' || type === 'audio') res = await extractLegalBrief(result);

      setQuickResult({ type, content: res });
      if (type === 'audio') speak(res, settings.language);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={`flex flex-col h-full transition-colors ${settings.darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-gray-900'}`} dir="rtl">
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
          <h2 className="text-sm font-black uppercase arabic-text">{t.library}</h2>
        </div>
        <div className="w-10"></div>
      </header>

      <div className="p-4 flex-1 overflow-y-auto no-scrollbar">
        <div className={`${settings.darkMode ? 'bg-slate-900 border-white/5' : 'bg-emerald-900'} -mx-4 -mt-4 p-8 mb-6 relative overflow-hidden transition-all shadow-lg`}>
          <div className="relative z-10 text-right">
            <h2 className="text-xl font-bold text-white mb-2 arabic-text">الموسوعة التشريعية المصرية</h2>
            <div className="mt-6 relative flex items-center gap-2">
              <form onSubmit={handleSearch} className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث برقم المادة، السنة، أو موضوع القانون..."
                  className={`w-full border rounded-2xl py-4 pl-4 pr-12 text-sm focus:outline-none transition-all arabic-text text-right ${settings.darkMode
                    ? 'bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-emerald-500'
                    : 'bg-white/10 border-white/20 text-white placeholder:text-emerald-300 focus:border-white shadow-inner'
                    }`}
                />
                <button type="submit" className="absolute right-4 top-4 text-emerald-300">
                  <i className={`fa-solid ${isLoading ? 'fa-spinner animate-spin' : 'fa-magnifying-glass'}`}></i>
                </button>
              </form>
              <SpeechButton onResult={(t) => setSearchQuery(t)} language={settings.language} darkMode={true} size="md" className="bg-white/10 border-white/20" />
            </div>
          </div>
          <i className="fa-solid fa-landmark absolute -left-6 -bottom-6 text-9xl text-white/5 rotate-12"></i>
        </div>

        {result && (
          <div className={`rounded-3xl shadow-xl border p-8 animate-fade-in transition-all ${settings.darkMode ? 'bg-slate-900 border-white/5' : 'bg-white border-gray-100'}`}>
            <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-100/10 pb-4 justify-between items-center">
              <div className="flex gap-2">
                <button onClick={() => handleQuickAction('summarize')} className="bg-emerald-500/10 text-emerald-500 px-4 py-2 rounded-xl text-[10px] font-black uppercase">تلخيص</button>
                <button onClick={() => handleQuickAction('simplify')} className="bg-amber-500/10 text-amber-500 px-4 py-2 rounded-xl text-[10px] font-black uppercase">تبسيط</button>
                <button onClick={() => handleQuickAction('brief')} className="bg-blue-500/10 text-blue-500 px-4 py-2 rounded-xl text-[10px] font-black uppercase">الأسانيد</button>
              </div>
              <button
                onClick={() => {
                  db.saveToVault({
                    id: Date.now().toString(),
                    type: 'article',
                    title: searchQuery.substring(0, 30),
                    content: quickResult ? quickResult.content : result,
                    timestamp: new Date(),
                    category: 'CIVIL' as any
                  });
                  alert(settings.language === 'ar' ? 'تم الحفظ في الخزنة' : 'Saved to Vault');
                }}
                className="bg-purple-500/10 text-purple-500 px-4 py-2 rounded-xl text-[10px] font-black uppercase flex items-center gap-2"
              >
                <i className="fa-solid fa-vault"></i> حفظ
              </button>
            </div>

            <div className="arabic-text text-sm leading-relaxed whitespace-pre-wrap text-right">
              {quickResult ? (
                <div className="animate-legal-fade p-4 rounded-2xl bg-slate-50/5 border border-white/5">
                  <span className="text-[10px] font-black text-[#D4AF37] block mb-2 uppercase tracking-widest">{quickResult.type}</span>
                  {quickResult.content}
                </div>
              ) : result}
            </div>

            {quickResult && (
              <button
                onClick={() => setQuickResult(null)}
                className="mt-6 text-[10px] font-black text-slate-400 uppercase tracking-widest w-full text-center"
              >
                إظهار النص الأصلي الكامل
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LawLibrary;
