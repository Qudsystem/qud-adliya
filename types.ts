
export enum LegalCategory {
  CIVIL = 'CIVIL',
  CRIMINAL = 'CRIMINAL',
  PERSONAL_STATUS = 'PERSONAL_STATUS',
  LABOR = 'LABOR',
  CORPORATE = 'CORPORATE',
  ADMINISTRATIVE = 'ADMINISTRATIVE',
  INHERITANCE = 'INHERITANCE'
}

export type FontSize = 'small' | 'medium' | 'large' | 'xl';
export type VoiceGender = 'male' | 'female';
export type VoicePersonality = 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';
export type NotificationSound = 'default' | 'gavel' | 'alert' | 'bell';

export interface AppSettings {
  language: 'ar' | 'en';
  narrationEnabled: boolean;
  darkMode: boolean;
  simplifiedExplanations: boolean;
  fontSize: FontSize;
  eyeProtection: boolean;
  voiceGender: VoiceGender;
  voicePersonality: VoicePersonality;
  voiceSpeed: number;
  notificationSound: NotificationSound;
}

// Fixed Achievement interface to match visual ranking requirements in UserProfile
export interface Achievement {
  id: string;
  title: string;
  icon: string;
  color: string;
  // Made optional as they are not used in the current profile ranking system
  progress?: number;
  total?: number;
  // Added stars to satisfy the rating visualization
  stars: number;
  isUnlocked: boolean;
}

export interface AwarenessContent {
  id: string;
  title: string;
  speaker: string;
  description: string;
  duration: string;
  thumbnail: string;
  category: LegalCategory;
  youtubeId: string;
  isSeries: boolean;
}

export interface LegalFlashcard {
  id: string;
  term: string;
  definition: string;
  lawArticle: string;
}

export interface VaultItem {
  id: string;
  type: 'document' | 'consultation' | 'case' | 'news' | 'article' | 'calculation' | 'flow_chart';
  title: string;
  content: string;
  timestamp: Date;
  category: LegalCategory | string;
}

export interface UsageStats {
  topFeatures: { name: string; count: number }[];
  categoryDistribution: { name: string; count: number }[];
  sessionDepth: number;
  totalInteractions: number;
}

export interface LegalMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface LegalCaseStep {
  id: string;
  title: string;
  status: 'completed' | 'current' | 'upcoming';
  date?: string;
  description?: string;
}

export interface LegalCase {
  id: string;
  title: string;
  caseNumber: string;
  court: string;
  circuit: string;
  category: LegalCategory;
  progress: number;
  nextHearing?: string;
  steps: LegalCaseStep[];
  requiredDocs?: { name: string; status: 'ready' | 'pending' }[];
}

export interface LegalTask {
  id: string;
  title: string;
  deadlineId?: string;
  isCompleted: boolean;
  priority: 'low' | 'medium' | 'high';
  notes?: string;
}

export interface LegalDeadline {
  id: string;
  title: string;
  date: string;
  type: 'hearing' | 'appeal' | 'reconciliation' | 'expiry';
  caseId?: string;
  impact: string;
  urgency: 'normal' | 'urgent' | 'critical';
}

export interface HumanConsultant {
  id: string;
  name: string;
  title: string;
  imageUrl: string;
  rating: number;
  experienceYears: number;
  location: string;
  consultationFee: number;
  isOnline: boolean;
}

export type ConsultMode = 'selection' | 'ai' | 'human';

export interface AnalyticsEvent {
  id: string;
  timestamp: number;
  type: string;
  feature: string;
  category?: string;
}
