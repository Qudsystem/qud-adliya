
import React, { useState, useRef, useEffect } from 'react';
import { LegalMessage, LegalCategory, AppSettings, VaultItem } from '../types';
import {
  generateLegalConsultation,
  draftLegalDocument,
  summarizeLegalText,
  simplifyLegalText,
  extractLegalBrief,
  generateAudioSummaryText,
  generateProceduralFlow
} from '../services/geminiService';
import { db } from '../services/databaseService';
import { speak } from '../services/speechService';
import { translations } from '../i18n';
import { downloadAsPDF } from '../services/pdfService';
import SpeechButton from './SpeechButton';

interface ChatInterfaceProps {
  onBack?: () => void;
  settings: AppSettings;
  initialPrompt?: string | null;
  onPromptHandled?: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ settings, initialPrompt, onPromptHandled, onBack }) => {
  const [messages, setMessages] = useState<LegalMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [category, setCategory] = useState<LegalCategory>(LegalCategory.CIVIL);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const t = translations[settings.language];

  useEffect(() => {
    if (initialPrompt) {
      handleSend(initialPrompt);
      if (onPromptHandled) onPromptHandled();
    }
  }, [initialPrompt]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: LegalMessage = {
      role: 'user',
      text: text,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await generateLegalConsultation(
        text,
        category,
        settings.simplifiedExplanations
      );

      const aiMessage: LegalMessage = {
        role: 'model',
        text: response || (settings.language === 'ar' ? 'عذراً، حدث خطأ في النظام.' : 'Sorry, a system error occurred.'),
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);

      if (settings.narrationEnabled && response) {
        speak(response, settings.language);
      }
    } catch (err) {
      console.error('Consultation Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async (msgIdx: number, action: 'summarize' | 'simplify' | 'brief' | 'flow' | 'pdf' | 'vault' | 'audio') => {
    const msg = messages[msgIdx];
    if (msg.role !== 'model') return;

    if (action === 'pdf') {
      downloadAsPDF(t.aiTitle, msg.text, settings.language);
      return;
    }

    if (action === 'vault') {
      db.saveToVault({
        id: Date.now().toString(),
        type: 'consultation',
        title: `${t.aiTitle} - ${new Date().toLocaleDateString()}`,
        content: msg.text,
        timestamp: new Date(),
        category: category
      });
      alert(t.saved);
      return;
    }

    setIsProcessing(`${msgIdx}-${action}`);
    try {
      let result = '';
      if (action === 'summarize') result = await summarizeLegalText(msg.text);
      else if (action === 'simplify') result = await simplifyLegalText(msg.text);
      else if (action === 'brief') result = await extractLegalBrief(msg.text);
      else if (action === 'audio') {
        const audioText = await generateAudioSummaryText(msg.text);
        speak(audioText, settings.language);
        setIsProcessing(null);
        return;
      }
      else if (action === 'flow') {
        const flowJson = await generateProceduralFlow(msg.text);
        db.saveToVault({
          id: Date.now().toString(),
          type: 'flow_chart',
          title: `${t.proceduralMap} - ${new Date().toLocaleDateString()}`,
          content: flowJson,
          timestamp: new Date(),
          category: category
        });
        alert(t.saved);
        setIsProcessing(null);
        return;
      }

      if (result) {
        const resultMsg: LegalMessage = {
          role: 'model',
          text: `### [تحديث ذكي]\n${result}`,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, resultMsg]);
      }
    } catch (err) {
      console.error('Action Error:', err);
    } finally {
      setIsProcessing(null);
    }
  };

  const renderContent = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('###')) return <h3 key={idx} className="font-black text-emerald-900 mb-2 mt-4">{trimmed.replace(/###/g, '')}</h3>;
      if (trimmed.startsWith('-') || trimmed.startsWith('•')) return <li key={idx} className="mr-4 text-xs leading-relaxed mb-1">{trimmed.substring(1).trim()}</li>;
      if (trimmed.length === 0) return <div key={idx} className="h-2"></div>;
      return <p key={idx} className="text-xs leading-relaxed mb-1">{trimmed}</p>;
    });
  };

  return (
    <div className={`flex flex-col h-full animate-fade-in ${settings.darkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
      {/* Header with Consistent Back Button Style */}
      <div className={`p-4 border-b flex items-center justify-between sticky top-0 z-30 transition-all ${settings.darkMode ? 'bg-slate-900/90 border-white/5' : 'bg-white/95 border-gray-100'
        } backdrop-blur-xl`}>
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-100 shadow-md active:scale-90 transition-all text-emerald-900"
          >
            <i className="fa-solid fa-arrow-right"></i>
          </button>
          <h2 className="text-sm font-black tracking-tight uppercase">{t.aiTitle}</h2>
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as LegalCategory)}
          className={`text-[9px] font-black uppercase rounded-full border-none outline-none px-4 py-2 ${settings.darkMode ? 'bg-white/5 text-[#D4AF37]' : 'bg-emerald-50 text-emerald-900'
            }`}
        >
          {Object.values(LegalCategory).map(cat => (
            <option key={cat} value={cat}>{(t.categories as any)[cat]}</option>
          ))}
        </select>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col no-scrollbar pb-32">
        {messages.map((msg, idx) => (
          <div key={idx} className={msg.role === 'user' ? 'user-bubble-supreme' : 'ai-bubble-supreme'}>
            <div className="text-sm arabic-text">
              {msg.role === 'model' ? renderContent(msg.text) : msg.text}
            </div>

            {msg.role === 'model' && (
              <div className="flex flex-wrap gap-2 mt-4 opacity-70 border-t border-gray-100 pt-3">
                <ActionBtn icon="fa-bolt" onClick={() => handleAction(idx, 'summarize')} loading={isProcessing === `${idx}-summarize`} />
                <ActionBtn icon="fa-brain" onClick={() => handleAction(idx, 'simplify')} loading={isProcessing === `${idx}-simplify`} />
                <ActionBtn icon="fa-headphones" onClick={() => handleAction(idx, 'audio')} loading={isProcessing === `${idx}-audio`} />
                <ActionBtn icon="fa-file-pdf" onClick={() => handleAction(idx, 'pdf')} loading={false} />
                <ActionBtn icon="fa-vault" onClick={() => handleAction(idx, 'vault')} loading={false} />
              </div>
            )}
            <div className={`text-[8px] font-black uppercase mt-1 opacity-30 ${msg.role === 'user' ? 'text-white' : ''}`}>
              {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="ai-bubble-supreme flex justify-center py-4">
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className={`p-4 border-t transition-all z-40 sticky bottom-0 ${settings.darkMode ? 'bg-slate-900/95 border-white/5' : 'bg-white/95 border-gray-100'
        } backdrop-blur-xl`}>
        <div className="relative flex items-center gap-3 max-w-lg mx-auto">
          <div className="flex-1 relative">
            <textarea
              autoFocus
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={t.describePrompt}
              rows={1}
              className={`w-full py-4 pl-6 pr-16 rounded-3xl text-sm arabic-text focus:outline-none transition-all ${settings.darkMode
                ? 'bg-white/5 text-white border border-white/10 focus:border-emerald-500'
                : 'bg-slate-50 text-slate-900 border border-slate-100 focus:border-emerald-500 shadow-inner'
                } resize-none max-h-32`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(inputText);
                }
              }}
            />
            <div className="absolute right-2 top-1/2 -translate-y-[55%]">
              <SpeechButton
                onResult={(text) => handleSend(text)}
                language={settings.language}
                darkMode={settings.darkMode}
                size="sm"
              />
            </div>
          </div>
          <button
            disabled={!inputText.trim() || isLoading}
            onClick={() => handleSend(inputText)}
            className="w-12 h-12 bg-emerald-900 text-white rounded-2xl flex items-center justify-center shadow-xl disabled:opacity-30 active:scale-95 transition-all shrink-0"
          >
            <i className={`fa-solid ${isLoading ? 'fa-spinner animate-spin' : 'fa-paper-plane'}`}></i>
          </button>
        </div>
      </div>
    </div>
  );
};

const ActionBtn: React.FC<{ icon: string; onClick: () => void; loading: boolean }> = ({ icon, onClick, loading }) => (
  <button
    onClick={onClick}
    disabled={loading}
    className="bg-slate-100 text-slate-600 w-8 h-8 rounded-lg flex items-center justify-center hover:bg-emerald-50 hover:text-emerald-700 transition-all border border-transparent active:scale-90"
  >
    <i className={`fa-solid ${loading ? 'fa-spinner animate-spin' : icon} text-[10px]`}></i>
  </button>
);

export default ChatInterface;
