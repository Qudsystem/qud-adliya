
import React, { useState, useEffect } from 'react';
import { AppSettings } from '../types';
import { translations } from '../i18n';
import { fetchLatestLegalNews } from '../services/geminiService';
import { fetchLegalNewsFromAPI, NewsArticle } from '../services/newsService';

interface LegalNewsProps {
  settings: AppSettings;
  onBack: () => void;
  onDiscuss?: (prompt: string) => void;
}

const LegalNews: React.FC<LegalNewsProps> = ({ settings, onBack }) => {
  const [newsContent, setNewsContent] = useState<string>('');
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const t = translations[settings.language];

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    setIsLoading(true);
    try {
      // Try NewsAPI first
      const articles = await fetchLegalNewsFromAPI(settings.language);
      if (articles.length > 0) {
        setNewsArticles(articles);
      } else {
        // Fallback to AI-generated news
        const { text } = await fetchLatestLegalNews(settings.language);
        setNewsContent(text || 'لا توجد أخبار متاحة حالياً');
      }
    } catch (err) {
      console.error(err);
      setNewsContent('حدث خطأ أثناء جلب الأخبار');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex flex-col h-full ${settings.darkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
      <header className={`p-4 flex items-center gap-3 border-b sticky top-0 z-40 transition-all ${settings.darkMode ? 'bg-slate-900/90 border-white/5 text-white' : 'bg-white/95 border-gray-100 text-emerald-950'
        } backdrop-blur-xl`}>
        <button
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-100 shadow-md active:scale-90 transition-all text-emerald-900"
        >
          <i className="fa-solid fa-arrow-right"></i>
        </button>
        <h2 className="text-sm font-black uppercase arabic-text">{t.news}</h2>
      </header>

      <div className="p-5 flex-1 overflow-y-auto no-scrollbar pb-24">
        {isLoading ? (
          <div className="text-center py-20 animate-pulse arabic-text">جاري جلب آخر الأخبار...</div>
        ) : newsArticles.length > 0 ? (
          <div className="space-y-4">
            {newsArticles.map((article, idx) => (
              <a
                key={idx}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`block p-5 rounded-3xl border transition-all hover:scale-[1.02] ${settings.darkMode ? 'bg-slate-900 border-white/5 hover:border-emerald-500/30' : 'bg-white border-gray-100 shadow-lg hover:shadow-xl'
                  }`}
              >
                <h3 className={`font-black text-sm mb-2 arabic-text ${settings.darkMode ? 'text-white' : 'text-emerald-950'}`}>
                  {article.title}
                </h3>
                <p className={`text-xs leading-relaxed arabic-text mb-3 ${settings.darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  {article.description}
                </p>
                <div className="flex justify-between items-center text-[10px] text-slate-400">
                  <span>{article.source?.name}</span>
                  <span>{new Date(article.publishedAt).toLocaleDateString('ar-EG')}</span>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="p-6 rounded-[2.5rem] border bg-white shadow-xl arabic-text text-sm leading-relaxed whitespace-pre-wrap">
            {newsContent}
          </div>
        )}
      </div>
    </div>
  );
};

export default LegalNews;
