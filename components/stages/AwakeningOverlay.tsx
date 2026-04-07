import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Check, Activity, GitBranch, ArrowRight, CheckCircle2, XCircle, ArrowDown, Layers, BarChart3, ArrowUpRight, X, Shield, AlertTriangle, TrendingUp, Zap } from 'lucide-react';

export const AwakeningOverlay: React.FC<{ 
    active: boolean; 
    isDark: boolean;
    t?: any;
}> = ({ active, isDark, t }) => {
    const [phase, setPhase] = useState(0); 
    const [focusId, setFocusId] = useState<string | null>(null);
    const [globalScale, setGlobalScale] = useState(1);
    const containerRef = useRef<HTMLDivElement>(null);
    
    const targetState = useRef({ x: 150, y: 0, z: -50, rx: 0, ry: 0 });
    const currentState = useRef({ x: 150, y: 0, z: -50, rx: 0, ry: 0 });
    const mouseRef = useRef({ x: 0, y: 0 });

    const fixedWidgets = useMemo(() => {
        if (!t) return [];
        const w = t.widgets;
        return [
            { 
                id: 'profile-card', x: 0, y: 0, z: 120, w: 300, h: 530, scale: 0.9,
                title: w.profile.name,
                desc: w.profile.desc
            }, 
            { 
                id: 'score-summary', x: -340, y: -120, z: 40, w: 320, h: 260,
                title: w.score.title,
                desc: w.score.desc,
                items: w.score.items
            }, 
            { 
                id: 'before-after', x: -360, y: 140, z: 60, w: 340, h: 240,
                title: w.change.title,
                desc: w.change.desc,
                before: w.change.before,
                after: w.change.after
            },
            { 
                id: 'work-perf', x: 360, y: 160, z: 30, w: 360, h: 320,
                title: w.perf.title,
                desc: w.perf.desc,
                s1: w.perf.s1,
                s2: w.perf.s2
            }, 
            { 
                id: 'expected-effects', x: -620, y: 0, z: -60, w: 300, h: 220,
                title: w.effect.title,
                desc: w.effect.desc,
                items: w.effect.items
            },
            { 
                id: 'project-analytics', x: 360, y: -140, z: 50, w: 320, h: 280,
                title: w.health.title,
                desc: w.health.desc,
                items: w.health.items
            },
            { 
                id: 'sfia-mapping', x: 640, y: 0, z: -60, w: 320, h: 240,
                title: w.sfia.title,
                desc: w.sfia.desc,
                items: w.sfia.items
            },
        ];
    }, [t]);

    const focusedItem = useMemo(() => focusId ? fixedWidgets.find(w => w.id === focusId) : null, [focusId, fixedWidgets]);

    // Responsive Scaling Logic
    useEffect(() => {
        const handleResize = () => {
            const w = window.innerWidth;
            const h = window.innerHeight;
            const baseW = 1600; 
            const baseH = 950;
            // Calculate scale to fit content within viewport with some padding
            const scale = Math.min(w / baseW, h / baseH, 1.1); 
            setGlobalScale(Math.max(scale, 0.45)); // Enforce minimum scale
        };
        
        window.addEventListener('resize', handleResize);
        handleResize(); // Init
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (active) {
            const t1 = setTimeout(() => setPhase(1), 100);
            const t2 = setTimeout(() => setPhase(2), 2500);
            return () => { clearTimeout(t1); clearTimeout(t2); };
        } else {
            const t = setTimeout(() => {
                setPhase(0);
                setFocusId(null);
            }, 1000); 
            return () => clearTimeout(t);
        }
    }, [active]);

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

    useEffect(() => {
        if (!active && phase === 0) return;
        let frameId: number;

        const animate = () => {
            if (!containerRef.current) return;

            if (focusId) {
                const item = fixedWidgets.find(i => i.id === focusId);
                if (item) {
                    targetState.current = {
                        x: -item.x - 130,
                        y: -item.y,
                        z: -item.z + 550,
                        rx: 0,
                        ry: 0
                    };
                }
            } else {
                targetState.current = {
                    x: 0,
                    y: 0,
                    z: -50,
                    rx: mouseRef.current.y * 6,
                    ry: mouseRef.current.x * -6
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
    }, [active, focusId, phase, fixedWidgets]);

    const handleItemClick = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setFocusId(prev => prev === id ? null : id);
    };

    const bgCardClass = isDark ? 'bg-black/80 border-white/10 text-white' : 'bg-white/80 border-black/10 text-black';
    const textBase = isDark ? 'text-white' : 'text-black';

    if (!active && phase === 0) return null;
    if (!t) return null;

    return (
        <div 
            className={`absolute inset-0 z-[60] flex items-center justify-center overflow-hidden transition-all duration-1000 ease-in-out ${active ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-32 scale-95 pointer-events-none'}`}
            onMouseDown={() => setFocusId(null)}
            style={{ pointerEvents: active ? 'none' : 'none' }} // Ensure clicks pass through unless on children
        >
            {/* Description Panel (Visible only when focused) */}
            {focusedItem && (
                <div className="absolute inset-y-0 right-[10%] md:right-[22%] flex items-center z-[100] pointer-events-none">
                    <div 
                        className={`w-[300px] md:w-[400px] p-10 md:p-14 flex flex-col items-start text-left pointer-events-auto transition-all duration-500 animate-fade-in-up
                            ${isDark ? 'bg-black/80 border-[0.25px] border-white/50 text-white' : 'bg-white/80 border border-black/10 text-black'} backdrop-blur-xl shadow-2xl rounded-xl`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button 
                            onClick={() => setFocusId(null)}
                            className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${isDark ? 'hover:bg-white/10' : 'hover:bg-black/5'}`}
                        >
                            <X size={20} strokeWidth={1.5} className="opacity-60 hover:opacity-100"/>
                        </button>
                        <span className="text-xs font-bold uppercase tracking-[0.2em] mb-6 opacity-50 text-blue-500">Feature Detail</span>
                        <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-8 leading-tight">
                            {focusedItem.title}
                        </h2>
                        <p className="text-sm md:text-base leading-relaxed opacity-80 whitespace-pre-wrap font-medium">
                            {focusedItem.desc}
                        </p>
                    </div>
                </div>
            )}

            <div 
                className={`absolute z-10 flex flex-col items-center justify-center text-center transition-all duration-[800ms] ease-out pointer-events-none
                    ${(phase >= 2 || focusId) ? 'opacity-0 blur-xl scale-110' : 'opacity-100 blur-0 scale-100'}
                `}
            >
                <div className={`text-4xl md:text-5xl font-bold mb-6 tracking-widest uppercase opacity-0 transition-opacity duration-700 delay-0 ${phase >= 1 ? 'opacity-100' : ''} ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                    {t.title1}
                </div>
                <div className={`text-6xl md:text-9xl font-black leading-tight tracking-tight opacity-0 transition-opacity duration-700 delay-300 ${phase >= 1 ? 'opacity-100' : ''} ${textBase}`}>
                    {t.title2}
                </div>
                <div className={`text-6xl md:text-9xl font-black leading-tight tracking-tight opacity-0 transition-opacity duration-700 delay-700 ${phase >= 1 ? 'opacity-100' : ''} ${textBase}`}>
                    {t.title3}
                </div>
            </div>

            <div 
                className={`absolute inset-0 z-20 flex items-center justify-center transition-opacity duration-1000 delay-300 ${phase >= 2 ? 'opacity-100' : 'opacity-0'}`}
                style={{ perspective: '2500px', pointerEvents: 'none' }}
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
                        {fixedWidgets.map((item) => {
                            const isProfile = item.id === 'profile-card';
                            const styleProps = {
                                transform: `translate3d(${item.x}px, ${item.y}px, ${item.z}px) scale(${item.scale || 1.0})`,
                                pointerEvents: 'auto' as const,
                                left: `-${item.w / 2}px`, 
                                top: `-${item.h / 2}px`,
                                width: `${item.w}px`,
                                height: `${item.h}px`,
                                zIndex: Math.round(item.z + 1000),
                                transition: 'all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)'
                            };

                            if (isProfile) {
                                const statusConfig: Record<string, { color: string; icon: React.ReactNode; bg: string }> = {
                                    excellent: { color: 'text-emerald-400', icon: <TrendingUp size={14} />, bg: isDark ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-emerald-50 border-emerald-200' },
                                    good: { color: 'text-blue-400', icon: <Zap size={14} />, bg: isDark ? 'bg-blue-500/10 border-blue-500/20' : 'bg-blue-50 border-blue-200' },
                                    warning: { color: 'text-amber-400', icon: <AlertTriangle size={14} />, bg: isDark ? 'bg-amber-500/10 border-amber-500/20' : 'bg-amber-50 border-amber-200' },
                                    risk: { color: 'text-red-400', icon: <Shield size={14} />, bg: isDark ? 'bg-red-500/10 border-red-500/20' : 'bg-red-50 border-red-200' },
                                };
                                return (
                                <div
                                    key={item.id}
                                    className={`absolute p-0 rounded-[3px] overflow-hidden cursor-pointer transition-all duration-700 shadow-2xl pointer-events-auto
                                        ${isDark ? 'bg-[#0a0a0a]/95 border border-white/10 text-white' : 'bg-white/95 border border-black/10 text-black'}
                                        ${focusId && focusId !== 'profile-card' ? 'blur-[8px] opacity-25 grayscale' : 'blur-0 opacity-100 hover:scale-[1.02]'}
                                    `}
                                    style={styleProps}
                                    onClick={(e) => handleItemClick(e, 'profile-card')}
                                    onMouseDown={(e) => e.stopPropagation()}
                                >
                                    <div className="px-5 pt-5 pb-3">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-emerald-400' : 'bg-emerald-500'} animate-pulse`} />
                                            <span className="text-[10px] font-bold uppercase tracking-[0.15em] opacity-40">Live</span>
                                        </div>
                                        <h3 className="text-lg font-black tracking-tight">{item.title}</h3>
                                        <p className="text-[10px] opacity-40 mt-1 font-medium">{item.desc}</p>
                                    </div>
                                    <div className="px-3 pb-4 space-y-1.5">
                                        {(item as any).insights?.map((row: any, i: number) => {
                                            const cfg = statusConfig[row.status] || statusConfig.good;
                                            return (
                                                <div key={i} className={`px-3.5 py-3 rounded-[3px] border ${cfg.bg} transition-all`}>
                                                    <div className="flex items-center justify-between mb-1.5">
                                                        <div className="flex items-center gap-2">
                                                            <span className={`${cfg.color}`}>{cfg.icon}</span>
                                                            <span className="text-[11px] font-bold">{row.user}</span>
                                                            <span className="text-[9px] opacity-30 font-medium">{row.team}</span>
                                                        </div>
                                                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-[2px] ${cfg.color} ${isDark ? 'bg-white/5' : 'bg-black/5'}`}>
                                                            {row.badge}
                                                        </span>
                                                    </div>
                                                    <p className="text-[10px] opacity-50 font-medium pl-[22px]">{row.detail}</p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                                );
                            }

                            const cardBaseClass = `absolute p-7 rounded-[3px] border backdrop-blur-md shadow-2xl cursor-pointer transition-all duration-700 pointer-events-auto ${bgCardClass} ${focusId && focusId !== item.id ? 'blur-[8px] opacity-25 grayscale' : 'blur-0 opacity-100 hover:scale-[1.02]'}`;

                            if (item.id === 'score-summary') return (
                                <div key={item.id} className={cardBaseClass} style={styleProps} onClick={(e) => handleItemClick(e, item.id)} onMouseDown={(e) => e.stopPropagation()}>
                                    <h3 className="text-xs font-bold mb-5 flex items-center gap-2 uppercase tracking-[0.1em] opacity-50">
                                        <Activity size={16} /> {item.title}
                                    </h3>
                                    <div className="space-y-2.5">
                                        {item.items.map((li: any, i: number) => (
                                            <div key={i} className={`flex items-center justify-between p-3 rounded-[2px] ${isDark ? 'bg-white/5' : 'bg-black/5'}`}>
                                                <span className="text-[11px] font-semibold opacity-80 whitespace-nowrap">{li.l}</span>
                                                <div className="flex items-center gap-2">
                                                    <div className="px-1.5 py-0.5 rounded-[1px] bg-green-600 text-white text-[9px] font-black">✓</div>
                                                    <span className="text-xs font-bold font-mono">{li.v}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                            if (item.id === 'before-after') return (
                                <div key={item.id} className={cardBaseClass} style={styleProps} onClick={(e) => handleItemClick(e, item.id)} onMouseDown={(e) => e.stopPropagation()}>
                                    <div className="flex items-center justify-between mb-5 border-b border-current/10 pb-3">
                                        <span className="text-xs font-bold uppercase tracking-[0.1em] opacity-50">{item.title}</span>
                                        <CheckCircle2 size={16} className="opacity-30" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className={`p-3 rounded-[2px] ${isDark ? 'bg-white/5' : 'bg-black/5'}`}>
                                            <div className="flex items-center gap-2 mb-2 opacity-40">
                                                <XCircle size={12} />
                                                <span className="text-[10px] font-black uppercase">Before</span>
                                            </div>
                                            <p className="text-[11px] leading-relaxed italic opacity-40 whitespace-nowrap">{item.before}</p>
                                        </div>
                                        <div className={`p-3 rounded-[2px] ${isDark ? 'bg-white/10' : 'bg-black/10'}`}>
                                            <div className="flex items-center gap-2 mb-2">
                                                <CheckCircle2 size={12} className="text-zinc-400" />
                                                <span className="text-[10px] font-black uppercase">After</span>
                                            </div>
                                            <div className="space-y-1">
                                                {item.after.map((txt: string, i: number) => (
                                                    <div key={i} className="text-[9px] px-2 py-0.5 rounded-[1px] bg-current/10 opacity-70 w-fit font-bold whitespace-nowrap">{txt}</div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                            if (item.id === 'work-perf') return (
                                <div key={item.id} className={cardBaseClass} style={styleProps} onClick={(e) => handleItemClick(e, item.id)} onMouseDown={(e) => e.stopPropagation()}>
                                    <div className="flex items-center gap-3 mb-5 opacity-50">
                                        <Activity size={18} />
                                        <span className="text-xs font-bold uppercase tracking-[0.1em]">{item.title}</span>
                                    </div>
                                    <p className="text-[11px] opacity-50 mb-4 font-medium">{item.desc}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {((item as any).channels || []).map((ch: string, i: number) => {
                                            const colors: Record<string, string> = {
                                                anthropic: isDark ? 'bg-orange-500/20 text-orange-300 border-orange-500/30' : 'bg-orange-50 text-orange-700 border-orange-200',
                                                openai: isDark ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-emerald-50 text-emerald-700 border-emerald-200',
                                                gemini: isDark ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' : 'bg-blue-50 text-blue-700 border-blue-200',
                                                extension: isDark ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' : 'bg-purple-50 text-purple-700 border-purple-200',
                                                crawler: isDark ? 'bg-zinc-500/20 text-zinc-300 border-zinc-500/30' : 'bg-zinc-100 text-zinc-700 border-zinc-200',
                                            };
                                            return (
                                                <span key={i} className={`px-3 py-1.5 rounded-[2px] text-[10px] font-bold border uppercase tracking-wide ${colors[ch] || colors.crawler}`}>
                                                    {ch}
                                                </span>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                            if (item.id === 'expected-effects') return (
                                <div key={item.id} className={cardBaseClass} style={styleProps} onClick={(e) => handleItemClick(e, item.id)} onMouseDown={(e) => e.stopPropagation()}>
                                    <div className="flex items-center gap-3 mb-5 opacity-50">
                                        <ArrowUpRight size={18} />
                                        <span className="text-xs font-bold uppercase tracking-[0.1em]">{item.title}</span>
                                    </div>
                                    <div className="space-y-2 mb-5">
                                        {item.items.map((txt: string, i: number) => (
                                            <div key={i} className="flex items-center gap-3">
                                                <div className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
                                                <span className="text-[11px] font-bold opacity-70 whitespace-nowrap">{txt}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="w-full h-1 bg-current/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-zinc-500 w-[85%]" />
                                    </div>
                                    <div className="flex justify-between mt-2 text-[10px] opacity-30 font-mono">
                                        <span>Team Efficiency Score</span>
                                        <span>+85% YoY</span>
                                    </div>
                                </div>
                            );
                            if (item.id === 'sfia-mapping') return (
                                <div key={item.id} className={cardBaseClass} style={styleProps} onClick={(e) => handleItemClick(e, item.id)} onMouseDown={(e) => e.stopPropagation()}>
                                    <div className="flex items-center gap-3 mb-5 opacity-50">
                                        <Layers size={18} />
                                        <span className="text-xs font-bold uppercase tracking-[0.1em]">{item.title}</span>
                                    </div>
                                    <div className="space-y-2.5">
                                        {item.items.map((row: any, i: number) => (
                                            <div key={i} className={`grid grid-cols-2 gap-4 text-[10px] p-3 rounded-[2px] ${isDark ? 'bg-white/5' : 'bg-black/5'}`}>
                                                <span className="font-bold opacity-40 whitespace-nowrap">{row.l}</span>
                                                <span className="font-bold flex items-center gap-2 justify-end opacity-80 whitespace-nowrap">
                                                    <ArrowRight size={10} /> {row.v}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                            if (item.id === 'project-analytics') return (
                                <div key={item.id} className={cardBaseClass} style={styleProps} onClick={(e) => handleItemClick(e, item.id)} onMouseDown={(e) => e.stopPropagation()}>
                                    <div className="flex items-center justify-between mb-5 pb-3 border-b border-current/10">
                                        <div className="flex items-center gap-3 opacity-50">
                                            <BarChart3 size={18} />
                                            <span className="text-xs font-bold uppercase tracking-[0.1em]">{item.title}</span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        {item.items.map((stat: any, i: number) => (
                                            <div key={i} className={`p-3.5 rounded-[2px] border border-current/5 ${isDark ? 'bg-white/5' : 'bg-black/5'}`}>
                                                <div className="text-[9px] font-bold opacity-30 mb-1 uppercase whitespace-nowrap">{stat.l}</div>
                                                <div className="text-xl font-black tracking-tight">{stat.v}</div>
                                            </div>
                                        ))}
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