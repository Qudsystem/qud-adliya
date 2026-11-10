
import React, { useState, useEffect } from 'react';
import { VaultItem, AppSettings } from '../types';
import { db } from '../services/databaseService';
import { translations } from '../i18n';
import { downloadAsPDF } from '../services/pdfService';

interface VaultProps {
  settings: AppSettings;
  onBack: () => void;
}

const Vault: React.FC<VaultProps> = ({ settings, onBack }) => {
  const [items, setItems] = useState<VaultItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<VaultItem | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const t = translations[settings.language];

  useEffect(() => {
    refreshVault();
  }, []);

  const refreshVault = () => {
    setItems(db.getVault());
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm(settings.language === 'ar' ? 'هل أنت متأكد من حذف هذا العنصر؟' : 'Are you sure you want to delete this item?')) {
      db.removeFromVault(id);
      refreshVault();
      if (selectedItem?.id === id) setSelectedItem(null);
    }
  };

  const handleExport = (item: VaultItem) => {
    downloadAsPDF(item.title, item.content, settings.language);
  };

  const filteredItems = filter === 'all' ? items : items.filter(i => i.type === filter);

  return (
    <div className={`flex flex-col h-full animate-fade-in ${settings.darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-gray-900'}`}>
      <header className={`p-4 flex items-center justify-between border-b sticky top-0 z-40 transition-all ${settings.darkMode ? 'bg-slate-900/90 border-white/5 text-white' : 'bg-white/95 border-gray-100 text-emerald-950'
        } backdrop-blur-xl`}>
        <div className="flex items-center gap-3">
          <button
            onClick={selectedItem ? () => setSelectedItem(null) : onBack}
            className={`w-10 h-10 flex items-center justify-center rounded-xl border shadow-md active:scale-90 transition-all ${settings.darkMode ? 'bg-slate-800 border-white/10 text-emerald-400' : 'bg-white border-gray-100 text-emerald-900'
              }`}
          >
            <i className="fa-solid fa-arrow-right"></i>
          </button>
          <h2 className="text-sm font-black uppercase arabic-text">{t.vault}</h2>
        </div>
        <div className="w-10"></div>
      </header>

      <div className="p-6 flex-1 overflow-y-auto no-scrollbar">
        {!selectedItem ? (
          <>
            <div className="flex gap-2 overflow-x-auto no-scrollbar mb-8">
              {['all', 'document', 'consultation', 'flow_chart', 'news', 'article'].map(type => (
                <button key={type} onClick={() => setFilter(type)} className={`px-5 py-3 rounded-2xl text-[9px] font-black uppercase border-2 transition-all whitespace-nowrap ${filter === type
                  ? (settings.darkMode ? 'bg-emerald-600 text-white border-emerald-500 shadow-md' : 'bg-emerald-900 text-white border-emerald-800 shadow-md')
                  : (settings.darkMode ? 'bg-white/5 border-white/5 text-gray-400' : 'bg-white border-gray-100 text-gray-400')
                  }`}>
                  {(t as any)[type] || type}
                </button>
              ))}
            </div>
            <div className="grid gap-4">
              {filteredItems.map(item => (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={`p-5 rounded-[2.5rem] border flex items-center gap-5 shadow-sm active:scale-98 transition-all cursor-pointer group ${settings.darkMode ? 'bg-slate-900 border-white/5' : 'bg-white border-gray-100'
                    }`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0 ${settings.darkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-800'
                    }`}>
                    <i className={`fa-solid ${item.type === 'document' ? 'fa-file-signature' :
                        item.type === 'consultation' ? 'fa-comments' :
                          item.type === 'flow_chart' ? 'fa-route' :
                            item.type === 'article' ? 'fa-book-open' :
                              'fa-file-lines'
                      }`}></i>
                  </div>
                  <div className="flex-1 text-right overflow-hidden">
                    <div className="flex items-center gap-2 justify-end mb-1">
                      <span className={`text-[7px] font-black uppercase px-2 py-0.5 rounded-full ${settings.darkMode ? 'bg-white/5 text-gray-500' : 'bg-gray-100 text-gray-400'
                        }`}>
                        {(t as any)[item.type] || item.type}
                      </span>
                      <h4 className={`font-black text-xs uppercase truncate arabic-text ${settings.darkMode ? 'text-white' : 'text-emerald-950'}`}>{item.title}</h4>
                    </div>
                    <p className="text-[8px] opacity-40 uppercase">{new Date(item.timestamp).toLocaleDateString()}</p>
                  </div>
                  <button onClick={(e) => handleDelete(e, item.id)} className="opacity-0 group-hover:opacity-100 p-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-all">
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
                </div>
              ))}
              {filteredItems.length === 0 && (
                <div className="py-20 text-center opacity-30 arabic-text font-bold">{t.vaultEmpty}</div>
              )}
            </div>
          </>
        ) : (
          <div className="p-2 space-y-6 animate-slide-up">
            <div className="flex justify-between items-start gap-4">
              <h2 className="text-xl font-black arabic-text leading-tight flex-1">{selectedItem.title}</h2>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => handleExport(selectedItem)} className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center shadow-lg active:scale-90 transition-all">
                  <i className="fa-solid fa-file-pdf"></i>
                </button>
                <button onClick={(e) => handleDelete(e, selectedItem.id)} className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shadow-lg active:scale-90 transition-all">
                  <i className="fa-solid fa-trash-can"></i>
                </button>
              </div>
            </div>
            <div className={`whitespace-pre-wrap arabic-text leading-[1.8] text-sm text-right p-6 rounded-[2rem] border ${settings.darkMode ? 'bg-slate-900 border-white/5 text-slate-300' : 'bg-white border-slate-50 text-slate-700'
              }`}>
              {selectedItem.content}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Vault;
