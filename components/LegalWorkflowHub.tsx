
import React, { useState, useEffect } from 'react';
import { AppSettings, LegalTask, LegalDeadline, NotificationSound } from '../types';
import { translations } from '../i18n';
import { db } from '../services/databaseService';
import { downloadAsPDF } from '../services/pdfService';
import SpeechButton from './SpeechButton';

interface LegalWorkflowHubProps {
  settings: AppSettings;
  onBack: () => void;
}

const LegalWorkflowHub: React.FC<LegalWorkflowHubProps> = ({ settings, onBack }) => {
  const t = translations[settings.language];
  const [tasks, setTasks] = useState<LegalTask[]>([]);
  const [deadlines, setDeadlines] = useState<LegalDeadline[]>([]);
  const [activeTab, setActiveTab] = useState<'tasks' | 'deadlines'>('deadlines');
  
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showDeadlineForm, setShowDeadlineForm] = useState(false);
  
  const [newTask, setNewTask] = useState({ title: '', deadlineId: '', priority: 'medium' as any });
  const [newDeadline, setNewDeadline] = useState({ title: '', date: '', type: 'hearing' as any });

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setTasks(db.getTasks());
    setDeadlines(db.getDeadlines());
  };

  const playAlertSound = (sound: NotificationSound) => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    if (sound === 'gavel') oscillator.frequency.setValueAtTime(150, audioContext.currentTime);
    else if (sound === 'bell') oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
    else oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
    oscillator.type = 'sine';
    oscillator.start();
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.5);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  const handleSetReminder = (dl: LegalDeadline) => {
    playAlertSound(settings.notificationSound);
    const msg = settings.language === 'ar' 
      ? `تم تفعيل التنبيه الصوتي لموعد: ${dl.title}.`
      : `Reminder set for: ${dl.title}.`;
    alert(msg);
  };

  const toggleTask = (id: string) => {
    const updated = tasks.map(t => t.id === id ? { ...t, isCompleted: !t.isCompleted } : t);
    setTasks(updated);
    const task = updated.find(t => t.id === id);
    if (task) db.saveTask(task);
  };

  const handleDeleteTask = (id: string) => {
    db.deleteTask(id);
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const handleAddTask = () => {
    if (!newTask.title.trim()) return;
    const task: LegalTask = {
      id: Date.now().toString(),
      title: newTask.title,
      deadlineId: newTask.deadlineId || undefined,
      isCompleted: false,
      priority: newTask.priority
    };
    db.saveTask(task);
    setTasks(prev => [...prev, task]);
    setNewTask({ title: '', deadlineId: '', priority: 'medium' });
    setShowTaskForm(false);
  };

  const handleAddDeadline = () => {
    if (!newDeadline.title.trim() || !newDeadline.date) return;
    let impact = "";
    switch(newDeadline.type) {
        case 'hearing': impact = "فوات الجلسة قد يؤدي لشطب الدعوى."; break;
        case 'appeal': impact = "بعد هذا التاريخ يسقط حقك في الطعن."; break;
        case 'reconciliation': impact = "آخر فرصة لسداد مبالغ التصالح."; break;
        default: impact = "إجراء قانوني ذو ميعاد حتمي.";
    }
    const dl: LegalDeadline = {
      id: Date.now().toString(),
      title: newDeadline.title,
      date: newDeadline.date,
      type: newDeadline.type,
      impact: impact,
      urgency: 'normal'
    };
    db.saveDeadline(dl);
    setDeadlines(prev => [...prev, dl]);
    setNewDeadline({ title: '', date: '', type: 'hearing' });
    setShowDeadlineForm(false);
  };

  const handleExportReport = () => {
    const reportTitle = settings.language === 'ar' ? 'التقرير الإجرائي والعملياتي' : 'Procedural Operations Report';
    let content = `${reportTitle}\n\n`;
    content += `--- ${t.deadlines} ---\n`;
    deadlines.forEach(dl => { content += `• [${dl.date}] ${dl.title} - ${dl.impact}\n`; });
    content += `\n--- ${t.tasks} ---\n`;
    tasks.forEach(tk => { content += `• [${tk.isCompleted ? '✓' : '✗'}] ${tk.title}\n`; });
    downloadAsPDF(reportTitle, content, settings.language);
  };

  const getDaysRemaining = (dateStr: string) => {
    const diff = new Date(dateStr).getTime() - new Date().setHours(0,0,0,0);
    return Math.ceil(diff / (1000 * 3600 * 24));
  };

  const completionRate = tasks.length > 0 ? Math.round((tasks.filter(t => t.isCompleted).length / tasks.length) * 100) : 0;

  return (
    <div className={`flex flex-col h-full animate-fade-in relative ${settings.darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-gray-900'}`} dir="rtl">
      <header className={`p-4 flex items-center justify-between border-b sticky top-0 z-40 transition-all ${
        settings.darkMode ? 'bg-slate-900/90 border-white/5' : 'bg-white/95 border-gray-100'
      } backdrop-blur-xl`}>
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack} 
            className={`w-10 h-10 flex items-center justify-center rounded-xl border shadow-md active:scale-90 transition-all ${
              settings.darkMode ? 'bg-slate-800 border-white/10 text-emerald-400' : 'bg-white border-gray-100 text-emerald-900'
            }`}
          >
            <i className="fa-solid fa-arrow-right"></i>
          </button>
          <h2 className="text-sm font-black uppercase arabic-text">مركز العمليات</h2>
        </div>
      </header>

      <div className="p-5 flex-1 overflow-y-auto no-scrollbar pb-44">
        <div className={`flex gap-4 mb-8 p-1 rounded-[2.5rem] border transition-all ${
          settings.darkMode ? 'bg-white/5 border-white/5' : 'bg-white border-gray-100 shadow-inner'
        }`}>
          <button 
            onClick={() => setActiveTab('deadlines')}
            className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase transition-all ${activeTab === 'deadlines' ? (settings.darkMode ? 'bg-emerald-600 text-white shadow-lg' : 'bg-[#064e3b] text-white shadow-lg') : 'text-gray-400'}`}
          >
            المواعيد والمدد
          </button>
          <button 
            onClick={() => setActiveTab('tasks')}
            className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase transition-all ${activeTab === 'tasks' ? (settings.darkMode ? 'bg-emerald-600 text-white shadow-lg' : 'bg-[#064e3b] text-white shadow-lg') : 'text-gray-400'}`}
          >
            المهام القانونية
          </button>
        </div>

        {activeTab === 'deadlines' ? (
          <div className="space-y-6 animate-slide-up">
            <div className="flex items-center justify-between px-2">
               <h3 className="text-[10px] font-black uppercase tracking-widest opacity-40">المواعيد والمدد</h3>
               <button onClick={() => setShowDeadlineForm(true)} className="text-emerald-500 text-[10px] font-black uppercase">+ إضافة موعد</button>
            </div>

            {showDeadlineForm && (
              <div className={`p-6 rounded-[2rem] border animate-slide-up mb-6 shadow-2xl ${settings.darkMode ? 'bg-slate-900 border-white/10' : 'bg-white border-emerald-100'}`}>
                <div className="relative mb-4">
                  <input type="text" value={newDeadline.title} onChange={(e) => setNewDeadline({...newDeadline, title: e.target.value})} placeholder="عنوان الموعد" className={`w-full bg-transparent border-b-2 border-emerald-500/20 py-3 pr-10 outline-none arabic-text text-sm focus:border-emerald-500 transition-all ${settings.darkMode ? 'text-white' : 'text-slate-900'}`}/>
                  <div className="absolute right-0 top-1/2 -translate-y-1/2">
                    <SpeechButton onResult={(text) => setNewDeadline(prev => ({ ...prev, title: prev.title + ' ' + text }))} language={settings.language} darkMode={settings.darkMode} size="sm"/>
                  </div>
                </div>
                <div className="flex gap-2 mb-4">
                  <input type="date" value={newDeadline.date} onChange={(e) => setNewDeadline({...newDeadline, date: e.target.value})} className={`flex-1 rounded-xl px-3 py-2 text-xs border ${settings.darkMode ? 'bg-white/5 border-white/5 text-white' : 'bg-white border-slate-100 text-slate-900'}`}/>
                </div>
                <div className="flex gap-2 justify-end">
                   <button onClick={() => setShowDeadlineForm(false)} className="px-4 py-2 text-[10px] font-black text-gray-400 uppercase">إلغاء</button>
                   <button onClick={handleAddDeadline} className="bg-emerald-900 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase shadow-lg">حفظ</button>
                </div>
              </div>
            )}

            {deadlines.length > 0 ? deadlines.map(dl => {
              const days = getDaysRemaining(dl.date);
              const isExpired = days < 0;
              return (
                <div key={dl.id} className={`p-8 rounded-[3rem] border relative overflow-hidden transition-all shadow-supreme ${
                  settings.darkMode ? 'bg-slate-900 border-white/5' : 'bg-white border-slate-50'
                }`}>
                  <div className="flex justify-between items-start mb-4">
                    <span className={`text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-sm ${
                      isExpired ? 'bg-[#ff6b6b] text-white' : 'bg-emerald-500 text-white'
                    }`}>
                      {isExpired ? 'انتهى الميعاد' : `${days} أيام متبقية`}
                    </span>
                    <i className={`fa-solid ${dl.type === 'hearing' ? 'fa-gavel' : 'fa-scale-unbalanced'} text-2xl opacity-10 ${settings.darkMode ? 'text-emerald-400' : 'text-emerald-900'}`}></i>
                  </div>
                  <h4 className={`text-lg font-black arabic-text mb-2 ${settings.darkMode ? 'text-white' : 'text-emerald-950'}`}>{dl.title}</h4>
                  <p className={`text-[12px] arabic-text leading-relaxed mb-6 ${settings.darkMode ? 'text-slate-400' : 'text-gray-400'}`}>{dl.impact}</p>
                  <div className={`p-4 rounded-2xl border flex justify-between items-center ${
                    settings.darkMode ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-400' : 'bg-emerald-50 border-emerald-100 text-emerald-900'
                  }`}>
                    <span className="text-[11px] font-black arabic-text">الإجراء القادم: {dl.date}</span>
                    <button onClick={() => handleSetReminder(dl)} className="bg-[#d1fadf] text-[#064e3b] px-4 py-1.5 rounded-xl text-[10px] font-black uppercase transition-all active:scale-90">تذكير</button>
                  </div>
                </div>
              );
            }) : (
              <div className="py-20 text-center opacity-30 arabic-text font-bold">لا توجد مواعيد حالية.</div>
            )}
          </div>
        ) : (
          <div className="space-y-6 animate-slide-up">
            <div className="flex items-center justify-between px-2">
               <h3 className="text-[10px] font-black uppercase tracking-widest opacity-40">المهام القانونية</h3>
               <button onClick={() => setShowTaskForm(true)} className="text-emerald-500 text-[10px] font-black uppercase">+ إضافة مهمة</button>
            </div>
            {showTaskForm && (
              <div className={`p-6 rounded-[2rem] border animate-slide-up mb-6 shadow-2xl ${settings.darkMode ? 'bg-slate-900 border-white/10' : 'bg-white border-emerald-100'}`}>
                <input type="text" value={newTask.title} onChange={(e) => setNewTask({...newTask, title: e.target.value})} placeholder="مهمة جديدة..." className={`w-full bg-transparent border-b-2 border-emerald-500/20 py-3 mb-4 outline-none arabic-text text-sm focus:border-emerald-500 transition-all ${settings.darkMode ? 'text-white' : 'text-slate-900'}`}/>
                <div className="flex gap-2 justify-end">
                   <button onClick={() => setShowTaskForm(false)} className="px-4 py-2 text-[10px] font-black text-gray-400 uppercase">إلغاء</button>
                   <button onClick={handleAddTask} className="bg-emerald-900 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase shadow-lg">حفظ</button>
                </div>
              </div>
            )}
            <div className="grid gap-4">
              {tasks.length > 0 ? tasks.map(task => (
                <div key={task.id} className={`p-6 rounded-[3rem] border flex items-center justify-between group transition-all ${settings.darkMode ? 'bg-slate-900 border-white/5' : 'bg-white border-slate-100'} ${task.isCompleted ? 'opacity-50' : ''}`}>
                  <div className="flex items-center gap-5">
                    <button onClick={() => toggleTask(task.id)} className={`w-10 h-10 rounded-full border-[1px] flex items-center justify-center transition-all ${task.isCompleted ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-[#d1d5db]'}`}>
                      <i className="fa-solid fa-check text-xs"></i>
                    </button>
                    <div className="text-right">
                      <span className={`text-[13px] font-black arabic-text block ${task.isCompleted ? 'line-through text-gray-500' : (settings.darkMode ? 'text-white' : 'text-emerald-950')}`}>{task.title}</span>
                      {task.deadlineId && <span className="text-[9px] font-bold text-amber-600">مرتبطة بـ ميعاد</span>}
                    </div>
                  </div>
                  <button onClick={() => handleDeleteTask(task.id)} className="opacity-0 group-hover:opacity-100 text-red-400 p-2"><i className="fa-solid fa-trash-can text-sm"></i></button>
                </div>
              )) : (
                <div className="py-20 text-center opacity-30 arabic-text font-bold">لا توجد مهام حالية.</div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className={`p-4 border-t absolute bottom-0 left-0 right-0 z-50 transition-all ${
        settings.darkMode ? 'bg-slate-900/90 border-white/5' : 'bg-white/95 border-gray-100'
      } backdrop-blur-2xl`}>
         <div className="flex items-center justify-between gap-4 max-w-md mx-auto">
            <button onClick={handleExportReport} className="bg-[#d4a037] text-emerald-950 px-6 py-3.5 rounded-xl text-[11px] font-black uppercase shadow-xl active:scale-95 transition-all flex items-center gap-2">
              <i className="fa-solid fa-file-export"></i>
              تصدير التقرير الإجرائي
            </button>
            <div className="flex flex-col items-end flex-1">
               <span className="text-[10px] font-black text-gray-400 mb-1">إجمالي الإنجاز</span>
               <div className="flex items-center gap-3 w-full">
                  <span className="text-[11px] font-black text-emerald-500">{completionRate}%</span>
                  <div className={`flex-1 h-2 rounded-full overflow-hidden ${settings.darkMode ? 'bg-white/5' : 'bg-slate-100'}`}>
                    <div className="bg-emerald-500 h-full transition-all duration-1000" style={{ width: `${completionRate}%` }}></div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default LegalWorkflowHub;
