import React, { useState } from 'react';
import { X, ArrowRight } from 'lucide-react';

const BenefitChip: React.FC<{ title: string; detail: string; isDark: boolean; }> = ({ title, detail, isDark }) => { 
    const [isHovered, setIsHovered] = useState(false); 
    return ( 
        <div className={`relative group rounded-xl flex flex-col items-center justify-center text-center cursor-default transition-all duration-500 border backdrop-blur-md overflow-hidden h-20 md:h-24 ${isDark ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/30' : 'bg-white/30 border-black/5 hover:bg-white/60 hover:border-black/20 hover:shadow-xl'}`} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} > 
            <div className="relative w-full px-4 h-full flex items-center justify-center"> 
                <div className={`transition-all duration-500 transform ${isHovered ? 'opacity-0 -translate-y-2 scale-95 pointer-events-none' : 'opacity-100 translate-y-0 scale-100'}`}> 
                    <h4 className={`text-xs md:text-base font-bold tracking-tight ${isDark ? 'text-white' : 'text-black'}`}>{title}</h4> 
                </div> 
                <div className={`absolute inset-0 flex items-center justify-center px-4 transition-all duration-500 transform ${isHovered ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-95 pointer-events-none'}`}> 
                    <p className={`text-[10px] md:text-xs font-medium leading-relaxed ${isDark ? 'text-white/80' : 'text-black/80'}`}>{detail}</p> 
                </div> 
            </div> 
            <div className={`absolute top-0 right-0 w-6 h-6 bg-gradient-to-bl from-blue-500/10 to-transparent transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`} /> 
        </div> 
    ); 
};

export const AccessOverlay: React.FC<{ 
    isVisible: boolean; 
    onClose: () => void;
    onOpenWizard: () => void;
    isWizardOpen: boolean;
    footerMode: boolean;
    isDark: boolean;
    t6: any;
}> = ({ isVisible, onClose, onOpenWizard, isWizardOpen, footerMode, isDark, t6 }) => {
    
    const textPrimary = isDark ? 'text-white' : 'text-black';

    return (
      <div 
          className={`fixed inset-0 z-[70] flex items-center justify-center transition-all duration-700 ease-in-out ${isVisible && !isWizardOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible pointer-events-none'} ${isWizardOpen ? '-translate-x-[150%] md:-translate-x-[150%]' : ''}`} 
          style={{ transform: isWizardOpen ? 'translateX(-150%)' : (isVisible ? `translateY(${footerMode ? '-120px' : '0px'})` : 'translateY(200px)') }} 
          onClick={e => e.stopPropagation()} 
      >
          <div className={`w-[92%] md:w-[75%] max-w-4xl h-[80vh] md:h-fit min-h-[50vh] md:min-h-[55vh] max-h-[90vh] md:max-h-none flex flex-col backdrop-blur-lg rounded-xl border items-center shadow-2xl transition-all duration-700 ${isDark ? 'bg-black/15 border-white/10' : 'bg-white/15 border-black/10'}`} onClick={e => e.stopPropagation()} >
              <button onClick={onClose} className="absolute top-6 right-6 md:top-8 md:right-8 p-3 rounded-full transition-all hover:rotate-90 hover:bg-current/10 z-[75]" ><X size={24} strokeWidth={1} /></button>
              <div className="w-full flex-1 overflow-y-auto custom-scrollbar flex flex-col items-center pt-10 px-6 pb-6 md:pt-16 md:px-12 md:pb-12 text-center space-y-8 md:space-y-12">
                  <div className="space-y-4 animate-fade-in-up"><h2 className={`text-2xl md:text-5xl font-thin tracking-tight leading-tight ${textPrimary}`}>{t6.headlinePart1}<br/><span className="font-black block mt-4 mb-4">{t6.headlinePart2}{t6.headlinePart3}</span></h2><p className={`text-sm md:text-lg font-light opacity-60 max-w-xl mx-auto whitespace-pre-wrap leading-relaxed`}>{t6.intro}</p></div>
                  <div className="w-full space-y-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}><div className="flex items-baseline justify-center gap-4"><span className={`text-[10px] font-bold uppercase tracking-[0.4em] opacity-40`}>{t6.benefitTitle}</span></div><div className="grid grid-cols-1 md:grid-cols-2 gap-4">{t6.benefits.map((b: any, i: number) => ( <BenefitChip key={i} title={b.title} detail={b.detail} isDark={isDark} /> ))}</div></div>
                  <div className="flex-1 md:hidden" />
              </div>
              <div className="w-full p-6 md:p-0 md:pb-24 mt-auto flex flex-col items-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                  <button onClick={onOpenWizard} className={`w-full md:w-auto group relative px-20 py-8 rounded-full overflow-hidden transition-all duration-500 hover:scale-105 active:scale-95 shadow-2xl ${isDark ? 'bg-white text-black' : 'bg-black text-white'}`} >
                      <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity" /><span className="relative text-lg font-black tracking-[0.12em] uppercase flex items-center justify-center gap-3">{t6.btnStart} <ArrowRight size={22} className="group-hover:translate-x-1.5 transition-transform duration-300" /></span>
                  </button>
                  {t6.btnDemo && (
                      <button onClick={onOpenWizard} className={`group text-sm font-medium tracking-wide opacity-50 hover:opacity-100 transition-all duration-300 flex items-center gap-2 ${textPrimary}`}>
                          {t6.btnDemo} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
                      </button>
                  )}
              </div>
          </div>
      </div>
    );
};
