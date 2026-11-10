
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { AppSettings } from '../types';
import { translations } from '../i18n';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  settings: AppSettings;
}

const TABS = [
  { id: 'library', icon: 'fa-landmark', label: 'الموسوعة', x: -105 },
  { id: 'news', icon: 'fa-newspaper', label: 'الأخبار', x: -52 },
  { id: 'home', icon: 'fa-scale-balanced', label: 'الرئيسية', x: 0 },
  { id: 'calculator', icon: 'fa-calculator', label: 'المحاسب', x: 52 },
  { id: 'vault', icon: 'fa-vault', label: 'الخزنة', x: 105 }
];

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, settings }) => {
  const t = translations[settings.language];
  const isRtl = settings.language === 'ar';
  const mainRef = useRef<HTMLElement>(null);

  const [isMini, setIsMini] = useState(activeTab !== 'home');
  const [dragY, setDragY] = useState(0);
  const [swipeX, setSwipeX] = useState(0);
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsMini(activeTab !== 'home');
    if (mainRef.current) mainRef.current.scrollTop = 0;
  }, [activeTab]);

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    if (activeTab !== 'home') return;
    const scrollTop = e.currentTarget.scrollTop;
    if (scrollTop > 45 && !isMini) {
      setIsMini(true);
    } else if (scrollTop < 8 && isMini) {
      setIsMini(false);
    }
  };

  const portalX = useMemo(() => {
    const tab = TABS.find(t => t.id === activeTab);
    return tab ? tab.x : 0;
  }, [activeTab]);

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  const onTouchMove = (e: React.TouchEvent) => {
    const deltaX = e.touches[0].clientX - touchStart.x;
    const deltaY = e.touches[0].clientY - touchStart.y;

    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      if (isMini && deltaY < -5) setDragY(deltaY);
      if (!isMini && deltaY > 5) setDragY(deltaY);
    } else {
      setSwipeX(deltaX);
    }
  };

  const onTouchEnd = () => {
    if (isMini && dragY < -30) setIsMini(false);
    else if (!isMini && dragY > 30) setIsMini(true);

    if (Math.abs(swipeX) > 40) {
      const currentIndex = TABS.findIndex(t => t.id === activeTab);
      let nextIndex = currentIndex;
      if (swipeX > 0) nextIndex = Math.min(TABS.length - 1, currentIndex + 1);
      else nextIndex = Math.max(0, currentIndex - 1);

      const targetId = TABS[nextIndex].id;
      if (targetId !== activeTab) {
        setActiveTab(targetId);
        if (navigator.vibrate) navigator.vibrate(12);
      }
    }
    setDragY(0);
    setSwipeX(0);
  };

  const handlePortalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveTab('chat');
    if (navigator.vibrate) navigator.vibrate([12, 6, 12]);
  };

  const showNavBar = ['home', 'news', 'vault', 'calculator', 'library', 'chat'].includes(activeTab);

  return (
    <div
      className={`flex flex-col h-screen max-w-md mx-auto relative overflow-hidden transition-colors duration-500 ${settings.darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-gray-900'
        }`}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Header */}
      {(activeTab === 'home' || activeTab === 'profile') && (
        <header className={`p-3.5 flex justify-between items-center z-30 border-b ${settings.darkMode ? 'bg-slate-900/90 border-white/5' : 'bg-white/95 border-gray-100'
          } backdrop-blur-xl sticky top-0 transition-all`}>
          <button onClick={() => setActiveTab('settings')} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-emerald-400 active:scale-90 transition-all">
            <i className="fa-solid fa-gear text-lg"></i>
          </button>
          <h1 className="text-[11px] font-black tracking-widest uppercase">{t.appTitle}</h1>
          <button onClick={() => setActiveTab('profile')} className="w-10 h-10 rounded-xl bg-emerald-950 border border-white/10 flex items-center justify-center active:scale-90 transition-all">
            <i className="fa-solid fa-user-tie text-emerald-500 text-lg"></i>
          </button>
        </header>
      )}

      {/* Main Content */}
      <main
        ref={mainRef}
        onScroll={handleScroll}
        className="flex-1 relative overflow-y-auto no-scrollbar scroll-smooth"
      >
        {children}
      </main>

      {/* المحول الميكانيكي الهجين */}
      {showNavBar && (activeTab !== 'chat') && (
        <div
          className="absolute bottom-0 left-0 right-0 z-[800] flex flex-col items-center safe-pb transition-all duration-800"
          style={{
            paddingBottom: isMini ? '0' : '0',
            transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* الأيقونة الذهبية - تأثير "الغمر العميق" */}
          <div
            onClick={handlePortalClick}
            className={`semicircle-handle portal-active ${isMini ? 'handle-submerged' : 'handle-home-submerged'
              }`}
            style={{
              transform: `translateY(${isMini ? 22 + dragY : 40 + dragY}px) translateX(${portalX + swipeX}px)`,
              transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}
          >
            <i className={`fa-solid ${TABS.find(t => t.id === activeTab)?.icon || 'fa-scale-balanced'} text-2xl text-emerald-950 transition-all duration-300`}></i>
          </div>

          {/* جسم الشريط (الكبسولة العائمة أو الشريط العريض) */}
          <nav
            className={`transition-all duration-700 relative flex items-center justify-center ${isMini ? 'bar-bird-mini' : 'bar-bird-full'
              }`}
            style={{
              transform: `translateY(${isMini ? 0 : dragY}px)`,
              transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}
          >
            <div className={`w-full flex justify-between items-center px-7 transition-all h-full`}>

              <div className="flex flex-1 justify-around items-center h-full">
                <NavIconBtn tab={TABS[0]} active={activeTab === TABS[0].id} mini={isMini} onClick={() => setActiveTab(TABS[0].id)} />
                <NavIconBtn tab={TABS[1]} active={activeTab === TABS[1].id} mini={isMini} onClick={() => setActiveTab(TABS[1].id)} />
              </div>

              {/* الفراغ المركزي */}
              <div className="w-16 shrink-0 h-full"></div>

              <div className="flex flex-1 justify-around items-center h-full">
                <NavIconBtn tab={TABS[3]} active={activeTab === TABS[3].id} mini={isMini} onClick={() => setActiveTab(TABS[3].id)} />
                <NavIconBtn tab={TABS[4]} active={activeTab === TABS[4].id} mini={isMini} onClick={() => setActiveTab(TABS[4].id)} />
              </div>

            </div>
          </nav>
        </div>
      )}
    </div>
  );
};

const NavIconBtn: React.FC<{ tab: any; active: boolean; mini: boolean; onClick: () => void }> = ({ tab, active, mini, onClick }) => (
  <div
    onClick={(e) => { e.stopPropagation(); onClick(); }}
    className={`nav-icon-btn flex flex-col items-center justify-center transition-all duration-500 ${mini
        ? `opacity-40 ${active ? 'opacity-100' : ''}`
        : (active ? 'opacity-0 scale-0' : 'opacity-25')
      }`}
  >
    <i className={`fa-solid ${tab.icon} text-[18px] text-white`}></i>
    {!mini && active && <div className="w-1 h-1 bg-[#D4AF37] rounded-full mt-1.5 animate-pulse"></div>}
  </div>
);

export default Layout;
