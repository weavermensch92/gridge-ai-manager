
import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Database, Network, Shield, Code, Zap, Cpu, ArrowRight } from 'lucide-react';

export const ExpansionOverlay: React.FC<{ active: boolean; isDark: boolean; t?: any }> = ({ active, isDark, t }) => {
    const [phase, setPhase] = useState(0);
    const [focusId, setFocusId] = useState<string | null>(null);
    const [globalScale, setGlobalScale] = useState(1);
    const containerRef = useRef<HTMLDivElement>(null);

    // Animation state
    const targetState = useRef({ x: 0, y: 0, z: 0, rx: 0, ry: 0 });
    const currentState = useRef({ x: 0, y: 0, z: 0, rx: 0, ry: 0 });
    const mouseRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const handleResize = () => {
            const w = window.innerWidth;
            const h = window.innerHeight;
            const baseW = 1400; 
            const baseH = 800;
            const scale = Math.min(w / baseW, h / baseH, 1.1); 
            setGlobalScale(Math.max(scale, 0.45));
        };
        
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (active) {
            setPhase(1);
            const timer = setTimeout(() => setPhase(2), 2500);
            return () => clearTimeout(timer);
        } else {
            const t = setTimeout(() => {
                setPhase(0);
                setFocusId(null);
            }, 1000);
            return () => clearTimeout(t);
        }
    }, [active]);

    // Local mouse listener
    useEffect(() => {
        if (!active && phase === 0) return;
        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = {
                x: (e.clientX / window.innerWidth) * 2 - 1,
                y: -(e.clientY / window.innerHeight) * 2 + 1
            };
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [active, phase]);

    // 3D Animation Loop
    useEffect(() => {
        if (!active && phase === 0) return;
        let frameId: number;

        const animate = () => {
            if (!containerRef.current) return;

            if (focusId) {
                const item = widgets.find(i => i.id === focusId);
                if (item) {
                    targetState.current = {
                        x: -item.x,
                        y: -item.y,
                        z: -item.z + 550, // Zoom very close
                        rx: 0,
                        ry: 0
                    };
                }
            } else {
                // Idle floating state
                targetState.current = {
                    x: 0,
                    y: 0,
                    z: 0,
                    rx: mouseRef.current.y * 4,
                    ry: mouseRef.current.x * -4
                };
            }

            const lerpFactor = 0.08;
            const current = currentState.current;
            const target = targetState.current;

            current.x += (target.x - current.x) * lerpFactor;
            current.y += (target.y - current.y) * lerpFactor;
            current.z += (target.z - current.z) * lerpFactor;
            current.rx += (target.rx - current.rx) * lerpFactor;
            current.ry += (target.ry - current.ry) * lerpFactor;

            containerRef.current.style.transform = 
                `perspective(2500px) translate3d(${current.x}px, ${current.y}px, ${current.z}px) rotateX(${current.rx}deg) rotateY(${current.ry}deg)`;

            frameId = requestAnimationFrame(animate);
        };

        animate();
        return () => cancelAnimationFrame(frameId);
    }, [active, phase, focusId]);

    const widgets = [
        { id: 'card-trad', x: -320, y: 0, z: 0, w: 320, h: 460, type: 'main' },
        { id: 'card-ai', x: 320, y: 0, z: 0, w: 320, h: 460, type: 'main' },
        { id: 'arrow', x: 0, y: 0, z: -50, w: 100, h: 100, type: 'arrow' },
        // Background widgets
        { id: 'bg-term', x: -500, y: -250, z: -200, w: 220, h: 140, type: 'bg', icon: <Terminal size={14}/>, title: "System Logs", content: "> init_core_module\n> loading_deps...", delay: 100 },
        { id: 'bg-db', x: 500, y: 250, z: -250, w: 200, h: 120, type: 'bg', icon: <Database size={14}/>, title: "Vector DB", content: "Indexing: 99%\nSync complete.", delay: 200 },
        { id: 'bg-api', x: 550, y: -220, z: -150, w: 180, h: 110, type: 'bg', icon: <Network size={14}/>, title: "API Gateway", content: "Status: Healthy\nLatency: 14ms", delay: 300 },
        { id: 'bg-sec', x: -480, y: 280, z: -100, w: 200, h: 110, type: 'bg', icon: <Shield size={14}/>, title: "Security", content: "Scanning...\nNo threats found.", delay: 400 },
    ];

    const handleItemClick = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setFocusId(prev => prev === id ? null : id);
    };

    if (!active && phase === 0) return null;
    if (!t) return null;

    const textBase = isDark ? 'text-white' : 'text-black';
    // Glassmorphism: Low opacity background + Blur + Subtle border
    const cardBg = isDark ? 'bg-black/30 border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]' : 'bg-white/30 border-white/40 shadow-[0_8px_32px_0_rgba(31,38,135,0.1)]';
    
    // Hover styles for strong click suggestion
    const hoverStyles = isDark 
        ? 'hover:border-blue-400/60 hover:shadow-[0_0_40px_rgba(59,130,246,0.3)] hover:bg-black/40' 
        : 'hover:border-blue-500/50 hover:shadow-[0_0_40px_rgba(59,130,246,0.2)] hover:bg-white/50';

    return (
        <div 
            className={`absolute inset-0 flex items-center justify-center pointer-events-none z-[60] transition-opacity duration-1000 ${active ? 'opacity-100' : 'opacity-0'}`}
            onClick={() => setFocusId(null)}
        >
            {/* Text Phase */}
            <div className={`absolute inset-0 flex flex-col items-center justify-center text-center transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] pointer-events-none z-10 ${phase === 1 ? 'opacity-100 blur-0 scale-100' : 'opacity-0 blur-xl scale-110'}`}>
                <div className={`text-4xl md:text-5xl font-bold mb-8 tracking-widest uppercase ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                    {t.title1}
                </div>
                <h2 className={`text-6xl md:text-9xl font-black leading-tight tracking-tighter ${textBase}`}>
                    {t.title2}<br/>
                    {t.title3}
                </h2>
            </div>

            {/* 3D Widgets Container */}
            <div 
                className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 delay-300 ${phase === 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
                style={{ perspective: '2500px', pointerEvents: 'auto' }}
            >
                <div 
                    style={{
                        transform: `scale(${globalScale})`,
                        transformStyle: 'preserve-3d',
                        width: '100%',
                        height: '100%',
                        position: 'absolute',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <div 
                        ref={containerRef}
                        className="relative w-0 h-0"
                        style={{ 
                            transformStyle: 'preserve-3d',
                            willChange: 'transform'
                        }}
                    >
                        {widgets.map((w) => {
                            const styleProps = {
                                transform: `translate3d(${w.x}px, ${w.y}px, ${w.z}px)`,
                                width: `${w.w}px`,
                                height: `${w.h}px`,
                                left: `-${w.w / 2}px`,
                                top: `-${w.h / 2}px`,
                                zIndex: Math.round(w.z + 1000), // Fix for clicking back layers
                                transition: 'all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)'
                            };

                            const isFocused = focusId === w.id;
                            const blurClass = focusId && !isFocused ? 'blur-sm opacity-30 grayscale' : 'blur-0 opacity-100';

                            // Render Traditional Dev Card
                            if (w.id === 'card-trad') {
                                const c = t.cards.trad;
                                return (
                                    <div 
                                        key={w.id} 
                                        className={`absolute rounded-[3px] border p-8 flex flex-col justify-between backdrop-blur-xl cursor-pointer ${cardBg} ${blurClass} hover:scale-105 hover:-translate-y-2 transition-all duration-500 group ${!focusId ? hoverStyles : ''}`}
                                        style={styleProps}
                                        onClick={(e) => handleItemClick(e, w.id)}
                                    >
                                        <div>
                                            <div className="w-14 h-14 rounded-full bg-zinc-500/20 flex items-center justify-center mb-8 group-hover:bg-blue-500/20 group-hover:text-blue-400 transition-colors">
                                                <Code size={28} className={isDark ? "text-zinc-400" : "text-zinc-600"} />
                                            </div>
                                            <h3 className={`text-3xl font-bold mb-3 ${textBase}`}>{c.title}</h3>
                                            <p className={`opacity-50 text-sm leading-relaxed ${textBase} whitespace-pre-wrap`}>
                                                {c.sub}
                                            </p>
                                        </div>
                                        <div className="space-y-5">
                                            <div className="space-y-2">
                                                <div className={`flex justify-between text-[10px] font-bold opacity-60 uppercase ${textBase}`}>
                                                    <span>{c.outLabel}</span>
                                                    <span>{c.outVal}</span>
                                                </div>
                                                <div className="w-full h-1 bg-current/10 rounded-full text-current">
                                                    <div className="w-[40%] h-full bg-current rounded-full opacity-40 group-hover:bg-blue-500 group-hover:opacity-100 transition-all"/>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
                                                <Terminal size={14} />
                                                <span className="text-xs font-mono">{c.skill}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }

                            // Render AI Engineer Card
                            if (w.id === 'card-ai') {
                                const c = t.cards.ai;
                                return (
                                    <div 
                                        key={w.id} 
                                        className={`absolute rounded-[3px] border p-8 flex flex-col justify-between backdrop-blur-xl cursor-pointer ${blurClass} hover:scale-105 hover:-translate-y-2 transition-all duration-500 ${isDark ? 'bg-blue-900/10 border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.1)]' : 'bg-blue-50/40 border-blue-200'} shadow-lg group ${!focusId ? 'hover:shadow-[0_0_50px_rgba(59,130,246,0.4)] hover:border-blue-400' : ''}`}
                                        style={styleProps}
                                        onClick={(e) => handleItemClick(e, w.id)}
                                    >
                                        <div>
                                            <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-8 ${isDark ? 'bg-blue-500 text-white' : 'bg-blue-600 text-white'} group-hover:scale-110 transition-transform`}>
                                                <Zap size={28} fill="currentColor" />
                                            </div>
                                            <h3 className={`text-3xl font-bold mb-3 ${textBase}`}>{c.title}</h3>
                                            <p className={`opacity-60 text-sm leading-relaxed ${textBase} whitespace-pre-wrap`}>
                                                {c.sub}
                                            </p>
                                        </div>
                                        <div className="space-y-5">
                                            <div className="space-y-2">
                                                <div className={`flex justify-between text-[10px] font-bold opacity-80 uppercase ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
                                                    <span>{c.outLabel}</span>
                                                    <span>{c.outVal}</span>
                                                </div>
                                                <div className="w-full h-1 bg-blue-500/20 rounded-full">
                                                    <div className="w-[95%] h-full bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)] group-hover:shadow-[0_0_15px_rgba(59,130,246,0.8)] transition-all"/>
                                                </div>
                                            </div>
                                            <div className={`flex items-center gap-2 ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
                                                <Cpu size={14} />
                                                <span className="text-xs font-mono">{c.skill}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }

                            // Render Arrow
                            if (w.id === 'arrow') return (
                                <div 
                                    key={w.id} 
                                    className={`absolute flex flex-col items-center justify-center gap-2 ${blurClass}`}
                                    style={styleProps}
                                >
                                    <ArrowRight size={48} className={isDark ? "text-white/20" : "text-black/20"} />
                                    <span className="text-[10px] uppercase font-bold tracking-widest opacity-30">Upgrade</span>
                                </div>
                            );

                            // Render Background Widgets
                            if (w.type === 'bg') return (
                                <div 
                                    key={w.id} 
                                    className={`absolute rounded-[4px] border p-4 flex flex-col justify-between backdrop-blur-md cursor-pointer ${cardBg} ${blurClass} hover:scale-110 hover:z-50 transition-all duration-500 ${!focusId ? hoverStyles : ''}`}
                                    style={styleProps}
                                    onClick={(e) => handleItemClick(e, w.id)}
                                >
                                    <div className="flex items-center gap-2 opacity-60">
                                        {w.icon}
                                        <span className="text-[10px] font-bold uppercase tracking-wider">{w.title}</span>
                                    </div>
                                    <div className="font-mono text-[10px] opacity-40 whitespace-pre-wrap leading-relaxed">
                                        {w.content}
                                    </div>
                                </div>
                            );

                            return null;
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};
