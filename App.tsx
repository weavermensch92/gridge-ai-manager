import React, { useState, useEffect, useRef } from 'react';
import CosmicCanvas from './components/CosmicCanvas';
import { GlitchText } from './components/GlitchText';
import { Globe, ChevronDown, Check } from 'lucide-react';

type Language = 'en' | 'ko' | 'ja';

const App: React.FC = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [lang, setLang] = useState<Language>('ko');
  const [isLangOpen, setIsLangOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);
  
  // Transition State
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // Initialize theme based on system preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setTheme(mediaQuery.matches ? 'dark' : 'light');

    const handler = (e: MediaQueryListEvent) => setTheme(e.matches ? 'dark' : 'light');
    mediaQuery.addEventListener('change', handler);
    
    // Initialize language based on IP
    const detectLanguage = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        const country = data.country_code;
        if (country === 'KR') {
          setLang('ko');
        } else if (country === 'JP') {
          setLang('ja');
        } else {
          setLang('en');
        }
      } catch (error) {
        console.warn('Failed to detect location, defaulting to Korean', error);
        setLang('ko');
      }
    };
    detectLanguage();

    const handleClickOutside = (event: MouseEvent) => {
        if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
            setIsLangOpen(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
        mediaQuery.removeEventListener('change', handler);
        document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleTheme = () => {
    if (isTransitioning) return;

    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setIsTransitioning(true);

    // Wait for the circle to cover the screen (duration 700ms)
    setTimeout(() => {
      setTheme(nextTheme);
      // Reset transition state after the theme has switched
      setIsTransitioning(false);
    }, 700);
  };

  const isDark = theme === 'dark';

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'ko', label: '한국어' },
    { code: 'ja', label: '日本語' }
  ] as const;

  const renderTitle = () => {
    if (lang === 'ko') {
      return (
        <div className="flex flex-col md:flex-row md:items-baseline md:gap-4">
          <GlitchText text="GRIDGE AiOPS" delay={0} />
          <span className="hidden md:inline">|</span>
          <span className="text-2xl md:text-3xl font-thin tracking-widest mt-1 md:mt-0 opacity-80">
            <GlitchText text="그릿지 AiOPS" delay={200} />
          </span>
        </div>
      );
    }
    return <GlitchText text="GRIDGE AiOPS" delay={0} />;
  };

  return (
    <div className={`relative w-full h-screen overflow-hidden ${isDark ? 'bg-black text-white' : 'bg-[#e0e0e0] text-black'}`}>
      <CosmicCanvas theme={theme} lang={lang} />
      
      {/* Theme Transition Overlay */}
      <div 
        className={`
            fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
            w-[10px] h-[10px] rounded-full pointer-events-none z-[100]
            transition-all ease-in-out mix-blend-difference
            ${isTransitioning ? 'scale-[500] opacity-100 duration-700' : 'scale-0 opacity-0 duration-0'}
            bg-[#e0e0e0]
        `}
      />

      {/* Overlay UI - Title */}
      <div className="absolute top-6 left-6 pointer-events-none select-none z-[60] md:z-[90] flex flex-col landscape:flex-row landscape:items-end landscape:gap-6">
        {/* Background Blur Gradient Layer for Title */}
        <div className={`absolute -inset-10 -z-10 bg-gradient-to-b ${isDark ? 'from-black/60 to-transparent' : 'from-white/60 to-transparent'} blur-xl rounded-full opacity-80`} />
        
        <h1 
          onDoubleClick={toggleTheme}
          className={`text-3xl font-thin tracking-[0.2em] pointer-events-auto cursor-pointer ${isDark ? 'text-white/90' : 'text-black/90'}`}
          title="Double click to toggle theme"
        >
          {renderTitle()}
        </h1>
        <p className={`text-sm mt-3 md:mt-2 landscape:mt-0 font-light tracking-wider leading-relaxed ${isDark ? 'text-white/40' : 'text-black/40'} landscape:border-l landscape:border-current/20 landscape:pl-6`}>
          <span className="block md:inline">AI MSP Service</span>
          <span className="hidden md:inline"> </span>
          <span className="block md:inline">
            <GlitchText text="powered by GRIDGE AX Labs, softsquared Inc." speed={1.0} delay={400} />
          </span>
        </p>
      </div>

      {/* Language Selector - Set to top-most layer z-[120] */}
      <div ref={langMenuRef} className="absolute top-6 right-6 z-[120]">
        <button
            onClick={() => setIsLangOpen(!isLangOpen)}
            className={`
                flex items-center gap-3 px-4 py-2 rounded-full border backdrop-blur-[8px] transition-all duration-300 group
                ${isDark 
                    ? 'bg-white/4 border-white/10 text-white hover:bg-white/8 hover:border-white/20' 
                    : 'bg-black/4 border-black/10 text-black hover:bg-black/8 hover:border-black/20'}
            `}
        >
            <Globe size={14} className="opacity-70 group-hover:opacity-100 transition-opacity" />
            <span className="text-xs uppercase tracking-wider font-medium text-left pt-[1px]">
                {languages.find(l => l.code === lang)?.label}
            </span>
            <ChevronDown 
                size={12} 
                className={`opacity-50 transition-transform duration-300 ${isLangOpen ? 'rotate-180' : ''}`} 
            />
        </button>

        {/* Custom Dropdown Menu */}
        <div 
            className={`
                absolute top-full right-0 mt-2 w-36 py-2 rounded-xl border backdrop-blur-[16px] shadow-2xl overflow-hidden transition-all duration-300 origin-top-right
                ${isLangOpen ? 'opacity-100 scale-100 translate-y-0 visible' : 'opacity-0 scale-95 -translate-y-2 invisible pointer-events-none'}
                ${isDark ? 'bg-black/70 border-white/10' : 'bg-white/70 border-black/10'}
            `}
        >
            {languages.map((l) => (
                <button
                    key={l.code}
                    onClick={() => {
                        setLang(l.code);
                        setIsLangOpen(false);
                    }}
                    className={`
                        w-full flex items-center justify-between px-4 py-3 text-xs uppercase tracking-wider transition-colors
                        ${isDark 
                            ? 'text-white/70 hover:bg-white/10 hover:text-white' 
                            : 'text-black/70 hover:bg-black/10 hover:text-black'}
                        ${lang === l.code ? (isDark ? 'bg-white/10 text-white font-bold' : 'bg-black/10 text-black font-bold') : ''}
                    `}
                >
                    <span className="pt-[1px]">{l.label}</span>
                    {lang === l.code && <Check size={12} className={isDark ? "text-white" : "text-black"} />}
                </button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default App;