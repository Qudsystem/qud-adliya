
import React from 'react';

interface StatItemProps {
  label: string;
  value: any;
  icon: string;
  color: string;
  suffix?: string;
}

const StatItem: React.FC<StatItemProps> = ({ label, value, icon, color, suffix }) => (
  <div className="flex flex-col items-center gap-1">
    <div className={`flex items-center gap-1.5 font-black text-lg ${color}`}>
      <i className={`fa-solid ${icon} text-sm`}></i>
      {value}{suffix && <span className="text-[10px] ml-0.5">{suffix}</span>}
    </div>
    <span className={`text-[9px] font-black uppercase tracking-widest opacity-70 ${color}`}>{label}</span>
  </div>
);

export default StatItem;
