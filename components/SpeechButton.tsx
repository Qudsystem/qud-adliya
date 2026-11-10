
import React, { useState, useEffect, useRef } from 'react';
import { translations } from '../i18n';

interface SpeechButtonProps {
  onResult: (transcript: string) => void;
  language: 'ar' | 'en';
  darkMode: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const SpeechButton: React.FC<SpeechButtonProps> = ({ 
  onResult, 
  language, 
  darkMode, 
  className = "",
  size = 'md'
}) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const isManuallyStopped = useRef(true);
  const t = translations[language];

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = language === 'ar' ? 'ar-EG' : 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          onResult(finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        if (event.error !== 'no-speech') {
            setIsListening(false);
            isManuallyStopped.current = true;
        }
      };

      recognitionRef.current.onend = () => {
        if (!isManuallyStopped.current) {
          try {
            recognitionRef.current.start();
          } catch (err) {
            setIsListening(false);
          }
        } else {
          setIsListening(false);
        }
      };
    }

    return () => {
      isManuallyStopped.current = true;
      recognitionRef.current?.stop();
    };
  }, [language, onResult]);

  const toggleListening = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isListening) {
      isManuallyStopped.current = true;
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        if (navigator.vibrate) navigator.vibrate(30);
        isManuallyStopped.current = false;
        setIsListening(true);
        recognitionRef.current?.start();
      } catch (err) {
        console.error('Speech start error:', err);
        setIsListening(false);
      }
    }
  };

  const sizeClasses = {
    sm: 'w-10 h-10 text-xs p-1',
    md: 'w-14 h-14 text-sm p-2',
    lg: 'w-18 h-18 text-xl p-3'
  };

  return (
    <div className="relative">
      <button
        onClick={toggleListening}
        className={`${sizeClasses[size]} rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl active:scale-95 border-2 ${
          isListening 
            ? 'bg-red-500 text-white animate-pulse border-red-200 ring-12 ring-red-500/10' 
            : `${darkMode ? 'bg-slate-800 border-white/10 text-emerald-400' : 'bg-white border-emerald-900/10 text-emerald-800 shadow-supreme'}`
        } ${className}`}
      >
        <i className={`fa-solid ${isListening ? 'fa-microphone-lines' : 'fa-microphone'} text-xl`}></i>
      </button>
      {isListening && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest whitespace-nowrap shadow-lg arabic-text border border-white/20">
          {t.recording}
        </div>
      )}
    </div>
  );
};

export default SpeechButton;
