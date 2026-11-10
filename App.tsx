
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import HomeView from './components/HomeView';
import ConsultationHub from './components/ConsultationHub';
import DocumentGenerator from './components/DocumentGenerator';
import LawLibrary from './components/LawLibrary';
import Settings from './components/Settings';
import AboutView from './components/AboutView';
import CaseTracker from './components/CaseTracker';
import LegalAcademy from './components/LegalAcademy';
import ConsentOverlay from './components/ConsentOverlay';
import Vault from './components/Vault';
import LegalCalculator from './components/LegalCalculator';
import LegalNews from './components/LegalNews';
import UsageStatsView from './components/UsageStats';
import EmergencyView from './components/EmergencyView';
import WizardModal from './components/WizardModal';
import UserProfile from './components/UserProfile';
import LegalWorkflowHub from './components/LegalWorkflowHub';
import { AppSettings } from './types';
import { translations } from './i18n';
import { speak } from './services/speechService';
import { db } from './services/databaseService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [initialChatPrompt, setInitialChatPrompt] = useState<string | null>(null);
  const [isConsented, setIsConsented] = useState(() => localStorage.getItem('adliya_consent') === 'true');
  const [showWizard, setShowWizard] = useState(false);
  const [showVoiceControls, setShowVoiceControls] = useState(false);

  const [settings, setSettings] = useState<AppSettings>(() => {
    return db.getSettings({
      language: 'ar',
      narrationEnabled: true,
      darkMode: false,
      simplifiedExplanations: true,
      fontSize: 'medium',
      eyeProtection: false,
      voiceGender: 'male',
      voicePersonality: 'alloy',
      voiceSpeed: 1.0,
      notificationSound: 'default'
    });
  });

  const t = translations[settings.language];

  useEffect(() => {
    db.saveSettings(settings);
    document.documentElement.classList.toggle('dark', settings.darkMode);
  }, [settings]);

  const handleAcceptConsent = () => {
    setIsConsented(true);
    localStorage.setItem('adliya_consent', 'true');
    if (settings.narrationEnabled) {
      speak(t.welcome, settings.language);
    }
  };

  const updateSettings = (updates: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const handleNavigate = (tab: string) => {
    setActiveTab(tab);
    if (tab !== 'home') {
      localStorage.setItem('adliya_last_active_tab', tab);
    }
  };

  const handleBackToHome = () => {
    setActiveTab('home');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <HomeView onNavigate={handleNavigate} settings={settings} onOpenWizard={() => setShowWizard(true)} onToggleVoice={() => setShowVoiceControls(!showVoiceControls)} />;
      case 'profile': return <UserProfile settings={settings} onBack={handleBackToHome} />;
      case 'chat': return <ConsultationHub settings={settings} initialPrompt={initialChatPrompt} onClearInitialPrompt={() => setInitialChatPrompt(null)} onBack={handleBackToHome} />;
      case 'tracker': return <CaseTracker settings={settings} onBack={handleBackToHome} />;
      case 'academy': return <LegalAcademy settings={settings} onBack={handleBackToHome} />;
      case 'news': return <LegalNews settings={settings} onBack={handleBackToHome} onDiscuss={(p) => { setInitialChatPrompt(p); setActiveTab('chat'); }} />;
      case 'library': return <LawLibrary settings={settings} onBack={handleBackToHome} onDiscuss={(p) => { setInitialChatPrompt(p); setActiveTab('chat'); }} />;
      case 'draft': return <DocumentGenerator settings={settings} onBack={handleBackToHome} />;
      case 'vault': return <Vault settings={settings} onBack={handleBackToHome} />;
      case 'calculator': return <LegalCalculator settings={settings} onBack={handleBackToHome} onDiscuss={(p) => { setInitialChatPrompt(p); setActiveTab('chat'); }} />;
      case 'workflow': return <LegalWorkflowHub settings={settings} onBack={handleBackToHome} />;
      case 'settings': return <Settings settings={settings} updateSettings={updateSettings} onBack={handleBackToHome} onNavigate={(t) => handleNavigate(t)} />;
      case 'about': return <AboutView settings={settings} onBack={() => setActiveTab('settings')} />;
      case 'stats': return <UsageStatsView settings={settings} onBack={handleBackToHome} />;
      case 'emergency': return <EmergencyView settings={settings} onBack={handleBackToHome} />;
      default: return <HomeView onNavigate={handleNavigate} settings={settings} onOpenWizard={() => setShowWizard(true)} onToggleVoice={() => setShowVoiceControls(!showVoiceControls)} />;
    }
  };

  if (!isConsented) return <ConsentOverlay settings={settings} onAccept={handleAcceptConsent} />;

  return (
    <div className={`font-size-${settings.fontSize}`}>
      <Layout activeTab={activeTab} setActiveTab={setActiveTab} settings={settings}>
        {renderContent()}
        {showWizard && <WizardModal settings={settings} onClose={() => setShowWizard(false)} onFinish={(p) => { setInitialChatPrompt(p); handleNavigate('chat'); speak(t.aiTitle, 'ar'); }} />}
      </Layout>
    </div>
  );
};

export default App;
