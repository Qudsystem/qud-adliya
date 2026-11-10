
import React from 'react';

interface ModuleCardProps {
  icon: string;
  title: string;
  desc: string;
  gradient: string;
  onClick: () => void;
  isRtl?: boolean;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ icon, title, desc, gradient, onClick, isRtl = true }) => (
  <button
    onClick={onClick}
    className={`bg-gradient-to-br ${gradient} p-6 rounded-[2.5rem] flex flex-col ${isRtl ? 'items-end text-right' : 'items-start text-left'} gap-4 shadow-supreme hover:scale-[1.02] active:scale-95 transition-all relative overflow-hidden group min-h-[160px] border border-white/5`}
  >
    <div className="w-12 h-12 bg-white/20 rounded-2xl border border-white/20 group-hover:bg-[#D4AF37]/40 transition-all flex items-center justify-center shadow-inner">
      <i className={`fa-solid ${icon} text-xl text-white`}></i>
    </div>
    <div className="flex-1 w-full">
      <h4 className="text-[13px] font-black uppercase text-white tracking-tight mb-1">{title}</h4>
      <p className="text-[9px] text-white/70 font-bold leading-tight line-clamp-2">{desc}</p>
    </div>
    <i className={`fa-solid fa-scale-balanced absolute ${isRtl ? '-left-4' : '-right-4'} -bottom-4 text-6xl text-white/5`}></i>
  </button>
);

export default ModuleCard;
