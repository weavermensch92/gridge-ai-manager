
import React, { useRef, useState, useCallback, useEffect } from 'react';
import { ChevronUp, ChevronLeft, X } from 'lucide-react';
import { GlitchText } from './GlitchText';
import { Language } from './types';
import { TRANSLATIONS } from './constants';
import { CosmicBackground } from './CosmicBackground';
import { ContactWizard } from './ContactWizard';
import { CaseStudyWizard } from './CaseStudyWizard';

// Stages
import { GenesisOverlay } from './stages/GenesisOverlay';
import { NodeGraphModal } from './stages/NodeGraphModal';
import { AwakeningOverlay } from './stages/AwakeningOverlay';
import { ExpansionOverlay } from './stages/ExpansionOverlay';
import { SynergyOverlay } from './stages/SynergyOverlay';
import { HarmonyOverlay } from './stages/HarmonyOverlay';
import { AccessOverlay } from './stages/AccessOverlay';
import { AIChatbot } from './AIChatbot';

interface CosmicCanvasProps {
    theme: 'dark' | 'light';
    lang: Language;
}

const CosmicCanvas: React.FC<CosmicCanvasProps> = ({ theme, lang }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [stage, setStage] = useState<number>(0);
    const scrollTimeoutRef = useRef<any>(null);
    const [footerMode, setFooterMode] = useState<boolean>(false);
    const [showFooterArrow, setShowFooterArrow] = useState(false);
    const footerRef = useRef<HTMLDivElement>(null);
    const [activeModal, setActiveModal] = useState<'terms' | 'point' | 'privacy' | null>(null);
    const [isWizardOpen, setIsWizardOpen] = useState(false);
    const [isCaseStudyOpen, setIsCaseStudyOpen] = useState(false);
    const [activeLayer, setActiveLayer] = useState<'wizard' | 'chatbot' | 'casestudy'>('wizard');
    const [contactWizardInitialTypes, setContactWizardInitialTypes] = useState<string[]>([]);

    const handleOpenContactWizard = (initialTypes: string[]) => {
        setIsCaseStudyOpen(false);
        setContactWizardInitialTypes(initialTypes);
        setIsWizardOpen(true);
        setActiveLayer('wizard');
    };

    const t = TRANSLATIONS[lang] || TRANSLATIONS['en'];
    const tGenesis = t.genesis;
    const tNodeGraph = t.nodeGraph;
    const t7 = t.stage7;
    const tWiz = t.wizard;
    const tChatbot = t.chatbot;

    const isDark = theme === 'dark';
    const textPrimary = isDark ? 'text-white' : 'text-black';
    const textSecondary = isDark ? 'text-white/50' : 'text-black/50';
    const textMuted = isDark ? 'text-white/40' : 'text-black/40';
    const bgFooter = isDark ? 'backdrop-blur-[16px] bg-black/70 border-t border-white/10' : 'backdrop-blur-[16px] bg-white/70 border-t border-black/10';

    // 0-5: Genesis (6 Phases)
    // 6: Awakening
    // 7: Expansion
    // 8: Synergy
    // 9: Harmony 1 (Title) -> Auto to 10
    // 10: Harmony 2 (Pipeline Up)
    // 11: Harmony 3 (Grid AS-IS)
    // 12: Harmony 4 (Grid TO-BE)
    // 13: Access
    const LAST_STAGE = 13;

    // Auto-transition from 9 to 10 (Harmony Title to Pipeline)
    useEffect(() => {
        if (stage === 9) {
            const timer = setTimeout(() => {
                setStage(10);
            }, 2500); // 2.5s delay for reading the title
            return () => clearTimeout(timer);
        }
    }, [stage]);

    // Handle initial URL parameters (e.g., ?contact=true)
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('contact') === 'true') {
            setIsWizardOpen(true);
            setActiveLayer('wizard');
        }
    }, []);

    const getTocIndex = (s: number) => {
        if (s <= 5) return 0; // Genesis
        if (s === 6) return 1; // Awakening
        if (s === 7) return 2; // Expansion
        if (s === 8) return 3; // Synergy
        if (s >= 9 && s <= 12) return 4; // Harmony
        if (s === 13) return 5; // Access
        return 0;
    };

    const getStageFromTocIndex = (i: number) => {
        if (i === 0) return 0;
        if (i === 1) return 6;
        if (i === 2) return 7;
        if (i === 3) return 8;
        if (i === 4) return 9;
        if (i === 5) return 13;
        return 0;
    };

    const [isNavVisible, setIsNavVisible] = useState(false);
    const [demoUrl, setDemoUrl] = useState<string | null>(null);
    const [isDemoButtonVisible, setIsDemoButtonVisible] = useState(false);
    const [visitedDemoUrls, setVisitedDemoUrls] = useState<Set<string>>(new Set());

    const getDemoUrlForStage = (s: number) => {
        if (s === 6) return 'https://skirr-image-48953108.figma.site/';
        if (s === 7) return 'https://omen-cow-68074122.figma.site/';
        if (s === 8) return 'https://marine-grub-30327007.figma.site/';
        return null;
    };

    const currentDemoUrl = getDemoUrlForStage(stage);

    useEffect(() => {
        if (currentDemoUrl) {
            setIsDemoButtonVisible(false);
            const timer = setTimeout(() => {
                setIsDemoButtonVisible(true);
            }, 300);
            return () => clearTimeout(timer);
        } else {
            setIsDemoButtonVisible(false);
        }
    }, [currentDemoUrl]);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const { clientHeight } = containerRef.current;

        // Navigator Visibility Logic
        if (e.clientX < 100) {
            setIsNavVisible(true);
        } else if (e.clientX > 300) { // Hide when moved away enough
            setIsNavVisible(false);
        }

        if (!footerMode && !activeModal && !isWizardOpen && window.innerWidth > 768) {
            const threshold = 100;
            if (e.clientY > clientHeight - threshold) setShowFooterArrow(true); else setShowFooterArrow(false);
        } else setShowFooterArrow(false);
        if (footerMode && containerRef.current && window.innerWidth > 768 && !activeModal && !isWizardOpen) {
            const footerHeight = footerRef.current?.clientHeight || 400;
            if (e.clientY < window.innerHeight - footerHeight - 50) setFooterMode(false);
        }
    }, [footerMode, activeModal, isWizardOpen]);

    const handleWheel = (e: React.WheelEvent) => {
        if (activeModal || isWizardOpen || isCaseStudyOpen) return;
        if (footerMode) { if (e.deltaY < -20) setFooterMode(false); return; }
        if (stage === LAST_STAGE) {
            if (scrollTimeoutRef.current || window.innerWidth < 768) return;
            if (e.deltaY > 20) { setFooterMode(true); scrollTimeoutRef.current = setTimeout(() => { scrollTimeoutRef.current = null; }, 1000); }
            return;
        }
        if (scrollTimeoutRef.current) return;
        if (Math.abs(e.deltaY) > 20) {
            if (e.deltaY > 0) setStage(prev => Math.min(prev + 1, LAST_STAGE)); else setStage(prev => Math.max(prev - 1, 0));
            scrollTimeoutRef.current = setTimeout(() => { scrollTimeoutRef.current = null; }, 1000);
        }
    };

    const isStageAccess = stage === LAST_STAGE;

    return (
        <div ref={containerRef} className="relative w-full h-full overflow-hidden" onWheel={handleWheel} onMouseMove={handleMouseMove} onClick={() => { if (footerMode) setFooterMode(false); if (isCaseStudyOpen) setIsCaseStudyOpen(false); }} >
            <style>{`.custom-scrollbar::-webkit-scrollbar { width: 4px; } .custom-scrollbar::-webkit-scrollbar-track { background: transparent; } .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(128, 128, 128, 0.3); border-radius: 10px; } .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(128, 128, 128, 0.5); } .animate-fade-in-up { animation: fadeInUp 0.8s cubic-bezier(0.19, 1, 0.22, 1) both; } @keyframes fadeInUp { from { opacity: 0; transform: translateY(100px); } to { opacity: 1; transform: translateY(0); } } .shimmer { background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent); background-size: 200% 100%; animation: shimmer 2s infinite; } @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } } .animate-pulse-red { animation: pulseRed 2s infinite; } @keyframes pulseRed { 0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); opacity: 0.8; } 50% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); opacity: 1; } 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); opacity: 0.8; } } `}</style>

            <CosmicBackground theme={theme} stage={stage} footerMode={footerMode} />

            <GenesisOverlay stage={stage} isDark={isDark} t={t.stage1} t2={t.stage2} t2_transform={t.stage2_transform} t4={t.stage4_genesis} t5={t.stage5_genesis} t6={t.stage6_genesis} tGenesis={tGenesis} benefits={t.genesisBenefits} />
            <NodeGraphModal stage={stage} isDark={isDark} tNodeGraph={tNodeGraph} />

            {/* Feature 1: Awakening (Stage 6) */}
            <AwakeningOverlay active={stage === 6} isDark={isDark} t={t.stage3} />

            {/* Feature 2: Expansion (Stage 7) */}
            <ExpansionOverlay active={stage === 7} isDark={isDark} t={t.stage4} />

            {/* Feature 3: Synergy (Widgets) (Stage 8) */}
            <SynergyOverlay active={stage === 8} isDark={isDark} t={t.stage5} />

            {/* Feature 4: Harmony (Pipeline & Grid) (Stage 9, 10, 11, 12) */}
            <HarmonyOverlay active={stage >= 9 && stage <= 12} stage={stage} isDark={isDark} t={t.stage6} />

            {/* Navigator (TOC) */}
            <div className={`hidden md:flex flex-col gap-4 absolute left-8 top-32 z-[80] ${textPrimary} transition-all duration-700`}
                style={{
                    transform: `translate(${isNavVisible ? '0' : '-200%'}, ${footerMode ? '-150px' : '0'})`,
                    opacity: isNavVisible ? 1 : 0
                }}>
                {t.toc.map((label, i) => {
                    const activeIndex = getTocIndex(stage);
                    const isActive = activeIndex === i;

                    // Define sub-phases for Genesis (0) and Harmony (4)
                    let subPhases: number[] = [];
                    if (i === 0) subPhases = [0, 1, 2, 3, 4, 5];
                    if (i === 4) subPhases = [9, 10, 11, 12];

                    return (
                        <div key={i} className="flex flex-col items-start transition-all duration-500">
                            <button onClick={() => setStage(getStageFromTocIndex(i))} className={`text-left text-xs tracking-[0.2em] uppercase transition-all duration-300 flex items-center gap-4 group ${isActive ? 'opacity-100 font-bold' : 'opacity-40 hover:opacity-100'}`}>
                                <span className={`h-[1px] bg-current transition-all duration-300 ${isActive ? 'w-8' : 'w-2 group-hover:w-6'}`} />
                                <GlitchText text={label} delay={300 + (i * 100)} />
                            </button>

                            {/* Sub-phases */}
                            <div className={`flex flex-col gap-2 pl-12 overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${isActive && subPhases.length > 0 ? 'max-h-[200px] mt-3 opacity-100' : 'max-h-0 mt-0 opacity-0'}`}>
                                {subPhases.map((s, idx) => (
                                    <button key={s} onClick={() => setStage(s)} className={`text-left text-[10px] tracking-[0.15em] uppercase transition-all duration-300 flex items-center gap-3 group ${stage === s ? `opacity-100 font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}` : 'opacity-30 hover:opacity-80'}`}>
                                        <span className={`h-[1px] bg-current transition-all duration-300 ${stage === s ? 'w-3' : 'w-1 group-hover:w-2'}`} />
                                        <span>PHASE {String(idx + 1).padStart(2, '0')}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Hamburger Menu Icon (Visible when Navigator is hidden) */}
            <div className={`hidden md:flex flex-col gap-1.5 absolute left-8 top-32 z-[79] transition-all duration-500 pointer-events-none ${isNavVisible ? 'opacity-0' : 'opacity-100'}`}
                style={{
                    transform: `translate(${isNavVisible ? '2rem' : '0'}, ${footerMode ? '-150px' : '0'})`
                }}>
                <div className={`w-6 h-[1px] ${isDark ? 'bg-white' : 'bg-black'}`} />
                <div className={`w-6 h-[1px] ${isDark ? 'bg-white' : 'bg-black'}`} />
                <div className={`w-6 h-[1px] ${isDark ? 'bg-white' : 'bg-black'}`} />
            </div>
            <button onClick={(e) => { e.stopPropagation(); setIsCaseStudyOpen(true); setActiveLayer('casestudy'); }} className={`hidden md:flex fixed right-[-10px] bottom-[160px] z-[90] items-center justify-center w-[100px] h-[100px] backdrop-blur-md shadow-lg transition-all duration-300 hover:right-0 hover:w-[110px] border-l border-t border-b rounded-l-2xl ${isDark ? 'bg-black/40 border-white/20 text-white' : 'bg-white/40 border-black/20 text-black'} ${isCaseStudyOpen ? 'translate-x-full' : 'translate-x-0'}`} >
                <div className="flex flex-col items-center gap-2 p-2 pr-4">
                    <span className="text-[10px] font-bold tracking-widest uppercase text-center leading-tight break-keep"><GlitchText text="CASE STUDY" delay={500} /></span>
                    <ChevronLeft size={16} className={isDark ? "text-white/50" : "text-black/50"} />
                </div>
            </button>
            <button onClick={(e) => { e.stopPropagation(); setIsWizardOpen(true); setActiveLayer('wizard'); }} className={`hidden md:flex fixed right-[-10px] bottom-[40px] z-[90] items-center justify-center w-[100px] h-[100px] backdrop-blur-md shadow-lg transition-all duration-300 hover:right-0 hover:w-[110px] border-l border-t border-b rounded-l-2xl ${isDark ? 'bg-black/40 border-white/20 text-white' : 'bg-white/40 border-black/20 text-black'} ${isWizardOpen ? 'translate-x-full' : 'translate-x-0'}`} >
                <div className="flex flex-col items-center gap-2 p-2 pr-4">
                    <span className="text-xs font-bold tracking-widest uppercase text-center leading-tight break-keep"><GlitchText text={tWiz.contactBtn} delay={500} /></span>
                    <ChevronLeft size={16} className={isDark ? "text-white/50" : "text-black/50"} />
                </div>
            </button>

            {/* Demo Button */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    if (currentDemoUrl) {
                        setDemoUrl(currentDemoUrl);
                        setVisitedDemoUrls(prev => new Set(prev).add(currentDemoUrl));
                    }
                }}
                className={`hidden md:flex fixed right-[-10px] bottom-[280px] z-[90] items-center justify-center w-[100px] h-[100px] backdrop-blur-md shadow-lg transition-all duration-500 hover:right-0 hover:w-[110px] border-l border-t border-b rounded-l-2xl ${isDark ? 'bg-black/40 border-white/20 text-white' : 'bg-white/40 border-black/20 text-black'} ${isDemoButtonVisible && !demoUrl && !isCaseStudyOpen && !isWizardOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                {currentDemoUrl && !visitedDemoUrls.has(currentDemoUrl) && (
                    <div className="absolute top-4 left-4 w-3 h-3 bg-red-500 rounded-full animate-pulse-red z-[91]" />
                )}
                <div className="flex flex-col items-center gap-2 p-2 pr-4">
                    <span className="text-xs font-bold tracking-widest uppercase text-center leading-tight break-keep"><GlitchText text="데모 보기" delay={500} /></span>
                    <ChevronLeft size={16} className={isDark ? "text-white/50" : "text-black/50"} />
                </div>
            </button>

            {/* Demo Web Viewer Modal */}
            {demoUrl && (
                <div className={`fixed inset-0 z-[120] flex items-center justify-center p-6 md:p-10 bg-black/50 backdrop-blur-md transition-all animate-fade-in-up`} onClick={() => setDemoUrl(null)}>
                    <div className={`relative w-[80%] max-w-none h-[90vh] overflow-hidden flex flex-col ${isDark ? 'bg-black/95 text-white' : 'bg-white/95 text-black'} border border-current/10 rounded-2xl shadow-2xl transform`} onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between p-4 border-b border-current/10 shrink-0">
                            <div className="flex items-center gap-4">
                                <div className="flex gap-2">
                                    <div className={`w-3 h-3 rounded-full ${isDark ? 'bg-white/20' : 'bg-black/20'}`} />
                                    <div className={`w-3 h-3 rounded-full ${isDark ? 'bg-white/20' : 'bg-black/20'}`} />
                                    <div className={`w-3 h-3 rounded-full ${isDark ? 'bg-white/20' : 'bg-black/20'}`} />
                                </div>
                                <span className="text-xs font-mono opacity-50">{demoUrl}</span>
                            </div>
                            <button onClick={() => setDemoUrl(null)} className="hover:rotate-90 transition-transform p-2"><X size={24} /></button>
                        </div>
                        <div className="flex-1 w-full h-full bg-white">
                            <iframe src={demoUrl} className="w-full h-full border-none" title="Demo Viewer" />
                        </div>
                    </div>
                </div>
            )}
            <button onClick={(e) => { e.stopPropagation(); setFooterMode(true); }} className={`absolute bottom-8 left-1/2 -translate-x-1/2 z-[75] transition-all duration-500 ${isStageAccess && !footerMode && !isWizardOpen && showFooterArrow ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`} >
                <ChevronUp size={32} className={`${isDark ? 'text-white/70' : 'text-black/70'} animate-pulse`} />
            </button>
            <div ref={footerRef} onClick={e => e.stopPropagation()} className={`absolute bottom-0 left-0 w-full z-[80] ${bgFooter} transition-transform duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${footerMode ? 'translate-y-0' : 'translate-y-full'}`} >
                <div className="max-w-7xl mx-auto px-8 py-16">
                    <h3 className={`text-base font-bold mb-8 ${textPrimary}`}>{t.footer.companyName}</h3>
                    <div className={`grid grid-cols-1 md:grid-cols-4 gap-8 mb-12 text-sm font-light leading-relaxed ${textSecondary}`}>
                        <div className="space-y-1"><p>{t.footer.ceo}</p><p>{t.footer.industry}</p><p>{t.footer.regNo}</p></div>
                        <div className="space-y-1 col-span-2"><p className="font-medium mb-1 opacity-70">Address</p><p>{t.footer.addrMain}</p><p>{t.footer.addrBranch}</p></div>
                    </div>
                    <div className={`pt-8 border-t ${isDark ? 'border-white/10' : 'border-black/10'} flex justify-between items-center text-xs uppercase tracking-wider ${textMuted}`}>
                        <div className="flex gap-6">{t.footer.links.map((link, i) => <a key={i} href="#" onClick={(e) => { e.preventDefault(); if (i < 3) setActiveModal(['terms', 'point', 'privacy'][i] as any) }} className="hover:underline">{link}</a>)}</div><p>{t.footer.copyright}</p>
                    </div>
                </div>
            </div>
            {activeModal && (
                <div className={`fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-10 bg-black/50 backdrop-blur-md transition-all`} onClick={() => setActiveModal(null)}>
                    <div className={`relative w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col ${isDark ? 'bg-black/95 text-white' : 'bg-white/95 text-black'} border border-current/10 rounded-2xl shadow-2xl transform`} onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between p-8 border-b border-current/10">
                            <h2 className="text-2xl font-black uppercase tracking-widest">{activeModal === 'terms' ? '이용약관' : activeModal === 'point' ? '포인트 이용 약관' : '개인정보 처리방침'}</h2>
                            <button onClick={() => setActiveModal(null)} className="hover:rotate-90 transition-transform p-2"><X size={32} /></button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-8 md:p-16 custom-scrollbar scroll-smooth">
                            {activeModal === 'terms' ? <div className="space-y-6 text-sm md:text-base leading-relaxed"><h3 className="text-xl font-bold mb-4">제1조 (목적)</h3><p className="opacity-80 mb-8">본 약관은 (주)소프트스퀘어드(이하 "회사")가 제공하는 GRIDGE AiOPS 및 관련 제반 서비스(이하 "서비스")의 이용과 관련하여 회사와 회원 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.</p></div> : activeModal === 'point' ? <div className="space-y-6 text-sm md:text-base leading-relaxed"><h3 className="text-xl font-bold mb-4">제1조 (목적)</h3><p className="opacity-80 mb-8">본 약관은 회사가 회원에게 제공하는 포인트 서비스의 이용조건 및 절차에 관한 사항을 규정함을 목적으로 합니다.</p></div> : <div className="space-y-6 text-sm md:text-base leading-relaxed"><h3 className="text-xl font-bold mb-4">1. 개인정보의 처리 목적</h3><p className="opacity-80 mb-8">회사는 다음의 목적을 위하여 개인정보를 처리합니다.</p></div>}
                        </div>
                        <div className="p-8 border-t border-current/10 flex justify-end"><button onClick={() => setActiveModal(null)} className={`px-12 py-4 rounded-full font-bold transition-all ${isDark ? 'bg-white text-black' : 'bg-black text-white'}`}>확인</button></div>
                    </div>
                </div>
            )}
            <ContactWizard
                isOpen={isWizardOpen}
                onClose={() => setIsWizardOpen(false)}
                theme={theme}
                lang={lang}
                t={tWiz}
                zIndex={activeLayer === 'wizard' ? 110 : 100}
                onFocus={() => setActiveLayer('wizard')}
                initialRequestTypes={contactWizardInitialTypes}
            />
            <CaseStudyWizard
                isOpen={isCaseStudyOpen}
                onClose={() => setIsCaseStudyOpen(false)}
                theme={theme}
                lang={lang}
                zIndex={activeLayer === 'casestudy' ? 110 : 100}
                onFocus={() => setActiveLayer('casestudy')}
                onOpenContactWizard={handleOpenContactWizard}
            />
            <AccessOverlay
                isVisible={isStageAccess}
                onClose={() => setStage(10)}
                onOpenWizard={() => { setIsWizardOpen(true); setActiveLayer('wizard'); }}
                isWizardOpen={isWizardOpen}
                footerMode={footerMode}
                isDark={isDark}
                t6={t7}
            />
            <AIChatbot
                isDark={isDark}
                zIndex={activeLayer === 'chatbot' ? 110 : 100}
                onFocus={() => setActiveLayer('chatbot')}
                t={tChatbot}
            />
        </div>
    );
};

export default CosmicCanvas;
