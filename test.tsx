
import { LegalCategory, LegalCase, AwarenessContent, LegalFlashcard, HumanConsultant } from './types';

export const MOCK_ACADEMY: AwarenessContent[] = [
  {
    id: 's1',
    title: 'شرح قانون العقوبات المصري (القسم العام)',
    speaker: 'المستشار د. بهاء أبو شقة',
    description: 'تحليل دقيق لأركان الجريمة والمسؤولية الجنائية وفقاً لأحدث التعديلات التشريعية.',
    duration: '١٢ حلقة',
    thumbnail: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=400',
    category: LegalCategory.CRIMINAL,
    youtubeId: 'criminal_playlist_id',
    isSeries: true
  },
  {
    id: 's2',
    title: 'موسوعة القانون المدني - الالتزامات والعقود',
    speaker: 'أ.د. جابر جاد نصار',
    description: 'سلسلة تعليمية تشرح نظرية العقد والالتزام في القانون المدني المصري وتطبيقاته العملية.',
    duration: '١٥ حلقة',
    thumbnail: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&q=80&w=400',
    category: LegalCategory.CIVIL,
    youtubeId: 'civil_playlist_id',
    isSeries: true
  }
];

export const MOCK_FLASHCARDS: LegalFlashcard[] = [
  { id: 'f1', term: 'العقد شريعة المتعاقدين', definition: 'مبدأ قانوني يعني التزام الطرفين بما ورد في العقد طالما لم يخالف النظام العام.', lawArticle: 'المادة ١٤٧ مدني' },
  { id: 'f2', term: 'دعوى صحة التوقيع', definition: 'دعوى تحفظية الغرض منها إثبات أن التوقيع الوارد على الورقة العرفية هو توقيع الخصم.', lawArticle: 'المادة ٤٥ إثبات' }
];

export const MOCK_GAMES = [
  { id: 'g1', title: 'تحدي المادة ٤٥', type: 'flashcards', difficulty: 'سهل', points: 10, icon: 'fa-book' },
  { id: 'g2', title: 'متاهة العقود', type: 'quiz', difficulty: 'متوسط', points: 25, icon: 'fa-file-contract' },
  { id: 'g3', title: 'لغز الميراث', type: 'calculator', difficulty: 'صعب', points: 50, icon: 'fa-calculator' },
  { id: 'g4', title: 'محاكاة المحكمة', type: 'rpg', difficulty: 'خبير', points: 100, icon: 'fa-gavel' },
  { id: 'g5', title: 'كنز القوانين', type: 'treasure', difficulty: 'متوسط', points: 30, icon: 'fa-coins' }
];

export const TEMPLATE_CATEGORIES = [
  { id: 'civil', name: { ar: 'مدني', en: 'Civil' }, icon: 'fa-scale-balanced' }
];

export const LEGAL_TEMPLATES = [
  { id: 'contract_1', category: 'civil', name: 'عقد بيع ابتدائي', icon: 'fa-file-signature', desc: 'نموذج عقد بيع عقار أو منقول ابتدائي.' }
];

export const MOCK_CONSULTANTS: HumanConsultant[] = [
  { id: 'l1', name: 'أ. أحمد علي', title: 'محامي نقض جنائي', imageUrl: 'https://images.unsplash.com/photo-1556157382-97dee2dcb706?auto=format&fit=crop&q=80&w=150', rating: 4.9, experienceYears: 15, location: 'القاهرة، مصر', consultationFee: 500, isOnline: true }
];

export const MOCK_CASES: LegalCase[] = [
  { 
    id: 'c1', 
    title: 'دعوى صحة توقيع - شقة الرحاب', 
    caseNumber: '١٢٤٥ لسنة ٢٠٢٤ مدني كلي',
    court: 'محكمة القاهرة الجديدة الابتدائية',
    circuit: 'الدائرة (٧) مدني',
    category: LegalCategory.CIVIL, 
    progress: 65, 
    nextHearing: '٢٥ أكتوبر ٢٠٢٤', 
    steps: [
      { id: 'step1', title: 'إيداع صحيفة الدعوى', status: 'completed', date: '١ سبتمبر', description: 'تم قيد الدعوى وسداد الرسوم القضائية.' },
      { id: 'step2', title: 'إعلان الخصوم', status: 'completed', date: '١٠ سبتمبر', description: 'تم استلام أصل الصحيفة من المحضرين.' },
      { id: 'step3', title: 'جلسة المرافعة الأولى', status: 'current', date: '٢٥ أكتوبر', description: 'تقديم المستندات والطلبات الختامية.' },
      { id: 'step4', title: 'صدور الحكم واستلامه', status: 'upcoming', description: 'المرحلة النهائية للحصول على الصيغة التنفيذية.' }
    ],
    requiredDocs: [
      { name: 'أصل عقد البيع', status: 'ready' },
      { name: 'صورة بطاقة الرقم القومي', status: 'ready' },
      { name: 'عريضة الدعوى الموقعة', status: 'pending' }
    ]
  }
];
