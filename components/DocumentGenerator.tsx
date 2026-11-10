
import React, { useState } from 'react';
import { LEGAL_TEMPLATES, TEMPLATE_CATEGORIES } from '../constants';
import { draftLegalDocument } from '../services/geminiService';
import { db } from '../services/databaseService';
import { translations } from '../i18n';
import SpeechButton from './SpeechButton';

const DocumentGenerator: React.FC<{ settings: any, onBack: () => void }> = ({ settings, onBack }) => {
  const [activeCategory, setActiveCategory] = useState('civil');
  const [selectedType, setSelectedType] = useState('');
  const [details, setDetails] = useState('');
  const [draft, setDraft] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const t = translations[settings.language];

  const handleGenerate = async () => {
    if (!selectedType || !details) return;
    setIsGenerating(true);
    try {
      const template = LEGAL_TEMPLATES.find(t => t.id === selectedType);
      const result = await draftLegalDocument(template?.name || selectedType, details);
      setDraft(result || '');
    } catch (err) {
      alert('Generation failed.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className={`flex flex-col h-full ${settings.darkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
      <header className={`p-4 flex items-center gap-3 border-b sticky top-0 z-40 transition-all ${settings.darkMode ? 'bg-slate-900/90 border-white/5 text-white' : 'bg-white/95 border-gray-100 text-emerald-950'
        } backdrop-blur-xl`}>
        <button
          onClick={draft ? () => setDraft('') : onBack}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-100 shadow-md active:scale-90 transition-all text-emerald-900"
        >
          <i className="fa-solid fa-arrow-right"></i>
        </button>
        <h2 className="text-sm font-black uppercase arabic-text">{t.draft}</h2>
      </header>

      <div className="p-5 flex-1 overflow-y-auto no-scrollbar pb-24">
        {draft ? (
          <div className="animate-slide-up space-y-6">
            <div className={`p-8 rounded-[2.5rem] border shadow-2xl overflow-y-auto whitespace-pre-wrap arabic-text text-sm leading-relaxed text-right ${settings.darkMode ? 'bg-slate-900 border-white/5' : 'bg-white border-gray-100'}`}>
              {draft}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  const template = LEGAL_TEMPLATES.find(t => t.id === selectedType);
                  db.saveToVault({
                    id: Date.now().toString(),
                    type: 'document',
                    title: `مسودة: ${template?.name || selectedType}`,
                    content: draft,
                    timestamp: new Date(),
                    category: 'CIVIL' as any
                  });
                  alert(settings.language === 'ar' ? 'تم الحفظ في الخزنة' : 'Saved to Vault');
                }}
                className="flex-1 bg-emerald-600 text-white py-5 rounded-[2.5rem] font-black text-xs uppercase shadow-xl flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-vault"></i> حفظ في الخزنة
              </button>
              <button
                onClick={() => setDraft('')}
                className={`flex-1 py-5 rounded-[2.5rem] font-black text-xs uppercase transition-all ${settings.darkMode ? 'bg-white/5 text-gray-400' : 'bg-slate-100 text-gray-600'}`}
              >
                صياغة جديدة
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex gap-3 mb-6 overflow-x-auto no-scrollbar pb-2">
              {TEMPLATE_CATEGORIES.map(cat => (
                <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase whitespace-nowrap transition-all border-2 ${activeCategory === cat.id ? 'bg-emerald-800 text-white' : 'bg-white'}`}>
                  {settings.language === 'ar' ? cat.name.ar : cat.name.en}
                </button>
              ))}
            </div>

            <div className="relative mb-6">
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="أدخل التفاصيل..."
                className={`w-full p-6 pr-14 rounded-[2.5rem] border-2 min-h-[180px] arabic-text text-sm transition-all focus:border-emerald-500 outline-none ${settings.darkMode ? 'bg-slate-900 border-white/5 text-white' : 'bg-white border-slate-100'
                  }`}
              />
              <div className="absolute top-4 right-4">
                <SpeechButton
                  onResult={(text) => setDetails(prev => prev + ' ' + text)}
                  language={settings.language}
                  darkMode={settings.darkMode}
                  size="sm"
                />
              </div>
            </div>

            <button onClick={handleGenerate} disabled={!details || isGenerating} className="w-full bg-emerald-800 text-white py-5 rounded-[2.5rem] font-black text-xs uppercase shadow-2xl">
              {isGenerating ? 'جاري الصياغة...' : 'صياغة المستند'}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default DocumentGenerator;
