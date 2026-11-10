
import React, { useState, useEffect, useRef } from 'react';
import { AppSettings } from '../types';
import { translations } from '../i18n';
import { AdliyaLiveSession } from '../services/geminiLiveService';

interface LiveVoiceCounselProps {
  settings: AppSettings;
  onBack: () => void;
}

const LiveVoiceCounsel: React.FC<LiveVoiceCounselProps> = ({ settings, onBack }) => {
  const [status, setStatus] = useState<'idle' | 'listening' | 'speaking'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState({ user: '', ai: '' });
  const [history, setHistory] = useState<{ user: string; ai: string }[]>([]);
  const transcriptEndRef = useRef<HTMLDivElement>(null);
  const sessionRef = useRef<AdliyaLiveSession | null>(null);
  const t = translations[settings.language];

  useEffect(() => {
    sessionRef.current = new AdliyaLiveSession(
      (s) => setStatus(s),
      (u, a, isFinal) => {
        if (isFinal) {
          setHistory(prev => [...prev, { user: u, ai: a }]);
          setTranscript({ user: '', ai: '' });
        } else {
          setTranscript({ user: u, ai: a });
        }
      },
      (e) => setError(e)
    );
    return () => sessionRef.current?.stop();
  }, []);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript, history]);

  const toggleSession = () => {
    if (status === 'idle') {
      setError(null);
      setHistory([]);
      sessionRef.current?.start();
    } else {
      sessionRef.current?.stop();
    }
  };

  return (
    <div className={`flex flex-col h-full items-center p-6 text-center ${settings.darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-gray-900'}`}>
      <div className="w-full flex justify-start mb-4">
        <button onClick={onBack} className="text-emerald-600 p-2 hover:bg-emerald-50 rounded-full transition-all">
          <i className="fa-solid fa-arrow-left text-xl"></i>
        </button>
      </div>

      <div className="w-full flex-1 flex flex-col mb-8 overflow-hidden">
        {status === 'idle' && history.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-8 animate-fade-in">
             <div className="w-48 h-48 rounded-full bg-slate-200 flex items-center justify-center">
                <i className="fa-solid fa-microphone-slash text-6xl text-slate-400"></i>
             </div>
             <div>
                <h2 className="text-2xl font-black mb-2">{t.liveVoiceTitle}</h2>
                <p className="text-sm text-gray-500 max-w-xs mx-auto leading-relaxed">{t.liveVoiceDesc}</p>
             </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-4 px-2 no-scrollbar">
            {history.map((h, i) => (
              <div key={i} className="space-y-3 animate-fade-in">
                <div className="flex justify-start">
                  <div className="bg-emerald-100 text-emerald-900 p-4 rounded-[1.5rem] rounded-tl-none text-right text-xs font-bold max-w-[85%] arabic-text shadow-sm">
                    {h.user}
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="bg-slate-800 text-white p-4 rounded-[1.5rem] rounded-tr-none text-right text-xs font-medium max-w-[85%] arabic-text shadow-md">
                    {h.ai}
                  </div>
                </div>
              </div>
            ))}
            {(transcript.user || transcript.ai) && (
              <div className="space-y-3 animate-pulse">
                {transcript.user && (
                  <div className="flex justify-start">
                    <div className="bg-emerald-50 text-emerald-700 p-4 rounded-[1.5rem] rounded-tl-none text-right text-xs font-bold max-w-[85%] arabic-text border border-emerald-100">
                      {transcript.user}
                    </div>
                  </div>
                )}
                {transcript.ai && (
                  <div className="flex justify-end">
                    <div className="bg-amber-50 text-amber-900 p-4 rounded-[1.5rem] rounded-tr-none text-right text-xs font-medium max-w-[85%] arabic-text border border-amber-100">
                      {transcript.ai}
                    </div>
                  </div>
                )}
              </div>
            )}
            <div ref={transcriptEndRef} />
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-2 rounded-xl text-xs font-bold mb-6 flex items-center gap-2 animate-bounce">
          <i className="fa-solid fa-triangle-exclamation"></i>
          {error}
        </div>
      )}

      <div className="flex flex-col items-center gap-4 w-full">
        <div className="flex items-center gap-3">
          <span className={`w-2 h-2 rounded-full ${status === 'listening' ? 'bg-green-500 animate-ping' : status === 'speaking' ? 'bg-amber-500 animate-pulse' : 'bg-gray-400'}`}></span>
          <p className={`text-xs font-black uppercase tracking-widest ${
            status === 'listening' ? 'text-emerald-600' : status === 'speaking' ? 'text-amber-600' : 'text-gray-400'
          }`}>
            {status === 'idle' ? t.voiceOffline : status === 'listening' ? t.voiceListening : t.voiceSpeaking}
          </p>
        </div>
        
        <button
          onClick={toggleSession}
          className={`w-full py-5 rounded-3xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-4 ${
            status === 'idle' 
              ? 'bg-emerald-800 text-white hover:bg-emerald-900' 
              : 'bg-red-500 text-white hover:bg-red-600'
          }`}
        >
          {status === 'idle' ? <i className="fa-solid fa-play"></i> : <i className="fa-solid fa-stop"></i>}
          {status === 'idle' ? t.voiceStart : t.voiceStop}
        </button>
        
        <p className="text-[8px] text-gray-400 uppercase font-black tracking-[0.5em] mt-2">
          {t.voiceEngineLabel}
        </p>
      </div>
    </div>
  );
};

export default LiveVoiceCounsel;
