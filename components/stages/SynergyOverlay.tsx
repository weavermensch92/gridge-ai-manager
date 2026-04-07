
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Layers, Target, FileBarChart, Activity, AlertTriangle, Users, BarChart3, Share2, Search, Zap, X, TrendingUp, ShieldAlert, ArrowRight, User, Lightbulb } from 'lucide-react';

export const SynergyOverlay: React.FC<{ active: boolean; isDark: boolean; t?: any }> = ({ active, isDark, t }) => {
    const [phase, setPhase] = useState(0);
    const [focusId, setFocusId] = useState<string | null>(null);
    const [hoveredId, setHoveredId] = useState<string | null>(null);
    const [globalScale, setGlobalScale] = useState(1);
    const containerRef = useRef<HTMLDivElement>(null);

    // Animation state
    const targetState = useRef({ x: 0, y: 0, z: 0, rx: 0, ry: 0 });
    const currentState = useRef({ x: 0, y: 0, z: 0, rx: 0, ry: 0 });
    const mouseRef = useRef({ x: 0, y: 0 });

    const widgets = useMemo(() => {
        if (!t || !t.widgets) return [];
        const w = t.widgets;
        return [
            // Row 1
            { id: 'w1-lifecycle', x: -510, y: -130, z: 0, w: 320, h: 240, expW: 600, expH: 500, title: w.lifecycle.title, icon: <Layers size={16}/>, data: w.lifecycle },
            { id: 'w2-intent', x: -170, y: -130, z: 30, w: 320, h: 240, expW: 550, expH: 520, title: w.intent.title, icon: <Target size={16}/>, data: w.intent },
            { id: 'w3-artifact', x: 170, y: -130, z: 0, w: 320, h: 240, expW: 550, expH: 480, title: w.artifact.title, icon: <FileBarChart size={16}/>, data: w.artifact },
            { id: 'w4-strategy', x: 510, y: -130, z: 30, w: 320, h: 240, expW: 600, expH: 520, title: w.strategy.title, icon: <Activity size={16}/>, data: w.strategy },
            
            // Row 2
            { id: 'w5-defects', x: -510, y: 130, z: 30, w: 320, h: 240, expW: 600, expH: 550, title: w.defects.title, icon: <AlertTriangle size={16}/>, data: w.defects },
            { id: 'w6-collab', x: -170, y: 130, z: 0, w: 320, h: 240, expW: 700, expH: 550, title: w.collab.title, icon: <Users size={16}/>, data: w.collab },
            { id: 'w7-bias', x: 170, y: 130, z: 30, w: 320, h: 240, expW: 750, expH: 520, title: w.bias.title, icon: <BarChart3 size={16}/>, data: w.bias },
            { id: 'w8-standard', x: 510, y: 130, z: 0, w: 320, h: 240, expW: 650, expH: 480, title: w.standard.title, icon: <Share2 size={16}/>, data: w.standard },
        ];
    }, [t]);

    useEffect(() => {
        const handleResize = () => {
            const w = window.innerWidth;
            const h = window.innerHeight;
            const baseW = 1500; 
            const baseH = 900;
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
                setHoveredId(null);
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
                const item = widgets.find(i => i.id === focusId);
                if (item) {
                    targetState.current = {
                        x: -item.x,
                        y: -item.y,
                        z: -item.z + 380, 
                        rx: 0,
                        ry: 0
                    };
                }
            } else {
                targetState.current = {
                    x: 0,
                    y: 0,
                    z: 0,
                    rx: mouseRef.current.y * 3,
                    ry: mouseRef.current.x * -3
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
    }, [active, phase, focusId, widgets]);

    const handleItemClick = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setFocusId(prev => prev === id ? null : id);
        setHoveredId(null);
    };

    // Glassmorphism Styles
    const cardBg = isDark ? 'bg-black/30' : 'bg-white/30';
    // Use white border in light mode for the glass edge effect
    const cardBorder = isDark ? 'border-white/10' : 'border-white/40';
    const gridColor = isDark ? 'border-white/10' : 'border-black/10';

    // Enhanced Hover Styles
    const hoverStyles = isDark 
        ? 'hover:border-blue-400/60 hover:shadow-[0_0_35px_rgba(59,130,246,0.25)] hover:bg-white/5' 
        : 'hover:border-blue-500/50 hover:shadow-[0_0_35px_rgba(59,130,246,0.2)] hover:bg-black/5';

    const renderWidgetContent = (id: string, isFocused: boolean) => {
        const widget = widgets.find(w => w.id === id);
        const title = widget?.title || "";
        const icon = widget?.icon;
        const wData = widget?.data;

        const Header = () => (
            <div className={`flex items-center justify-between mb-4 pb-3 border-b ${gridColor}`}>
                <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-[2px] backdrop-blur-md ${isDark ? 'bg-white/10' : 'bg-black/5'}`}>
                        {icon}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">{title}</span>
                </div>
                {isFocused && <div className="text-[9px] font-mono opacity-40">EXPANDED_VIEW</div>}
            </div>
        );

        // 3.1 SW Lifecycle
        if (id === 'w1-lifecycle') {
            if (!isFocused) return (
                <div className="flex flex-col h-full">
                    <Header />
                    <div className="flex-1 flex flex-col items-center justify-center relative">
                        <div className="relative w-32 h-32">
                             <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                                <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="12" strokeOpacity="0.1" />
                                <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="12" strokeDasharray="175.9 251.3" strokeDashoffset="0" className="opacity-90" />
                                <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="12" strokeDasharray="37.7 251.3" strokeDashoffset="-175.9" className="opacity-60" />
                                <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="12" strokeDasharray="20.1 251.3" strokeDashoffset="-213.6" className="opacity-40" />
                                <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="12" strokeDasharray="12.6 251.3" strokeDashoffset="-233.7" className="opacity-20" />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-2xl font-black tracking-tighter">{wData.data[0].v}%</span>
                                <span className="text-[8px] font-bold opacity-60 uppercase">{wData.data[0].l.substring(0,3)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            );
            return (
                <div className="flex flex-col h-full p-8 animate-fade-in-up">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <span className="opacity-40 text-[10px] font-bold uppercase tracking-widest mb-1 block">3.1 SW Lifecycle</span>
                            <h3 className="text-2xl font-black tracking-tight">{title}</h3>
                        </div>
                    </div>
                    <div className="flex-1 flex flex-col gap-6">
                        {wData.data.map((d: any, i: number) => (
                            <div key={i} className="flex items-center gap-4 group">
                                <div className="w-24 text-right text-xs font-bold opacity-60 group-hover:opacity-100 transition-opacity break-keep">{d.l}</div>
                                <div className="flex-1 h-8 bg-current/5 rounded-sm overflow-hidden relative">
                                    <div className={`h-full rounded-sm transition-all duration-1000 bg-blue-500`} style={{ width: `${d.v}%` }} />
                                </div>
                                <div className="w-8 text-right text-xs font-mono font-bold opacity-80">{d.v}%</div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-8 grid grid-cols-2 gap-4">
                        <div className={`p-4 rounded-lg border border-current/10 ${isDark ? 'bg-white/5' : 'bg-black/5'}`}>
                            <div className="text-[10px] font-bold opacity-50 uppercase mb-2 tracking-wider">{wData.interp.title}</div>
                            <p className="text-sm font-medium leading-relaxed">{wData.interp.text}</p>
                        </div>
                        <div className={`p-4 rounded-lg bg-blue-600 text-white`}>
                            <div className="text-[10px] font-bold opacity-80 uppercase mb-2 tracking-wider">{wData.implic.title}</div>
                            <p className="text-sm font-bold leading-relaxed">{wData.implic.text}</p>
                        </div>
                    </div>
                </div>
            );
        }

        // 3.2 Task Intent
        if (id === 'w2-intent') {
            if (!isFocused) return (
                <div className="flex flex-col h-full">
                    <Header />
                    <div className="flex-1 flex items-center justify-center relative">
                         <div className="relative w-32 h-32">
                            <div className="w-full h-full rounded-full" style={{ background: `conic-gradient(#2563eb 0% 60%, #3b82f6 60% 80%, #60a5fa 80% 95%, #93c5fd 95% 100%)` }} />
                            <div className={`absolute inset-4 rounded-full ${isDark ? 'bg-black/50' : 'bg-white/50'} backdrop-blur-sm`} />
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-xs font-bold uppercase tracking-widest opacity-80">EXEC</span>
                                <span className="text-[10px] font-mono opacity-50">{wData.data[0].v}%</span>
                            </div>
                         </div>
                    </div>
                </div>
            );
            return (
                <div className="flex flex-col h-full p-8 animate-fade-in-up">
                    <div className="mb-8">
                        <span className="opacity-40 text-[10px] font-bold uppercase tracking-widest mb-1 block">3.2 Task Intent</span>
                        <h3 className="text-2xl font-black tracking-tight">{title}</h3>
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center gap-8">
                        <div className="relative w-64 h-64">
                             <div className="w-full h-full rounded-full transition-all duration-1000" style={{ background: `conic-gradient(#2563eb 0% 60%, #3b82f6 60% 80%, #60a5fa 80% 95%, #93c5fd 95% 100%)` }} />
                             <div className={`absolute inset-8 rounded-full ${isDark ? 'bg-black/60' : 'bg-white/60'} backdrop-blur-md`} />
                        </div>
                        <div className="flex flex-wrap justify-center gap-4">
                            {wData.data.map((d: any, i: number) => (
                                <div key={i} className="flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full ${d.c}`} />
                                    <span className="text-xs font-bold opacity-80">{d.l}</span>
                                </div>
                            ))}
                        </div>
                        <div className={`w-full p-4 rounded-xl flex items-start gap-3 ${isDark ? 'bg-green-900/20 text-green-100' : 'bg-green-50 text-green-900'}`}>
                            <Lightbulb size={20} className="shrink-0 mt-0.5" />
                            <p className="text-sm font-medium leading-relaxed">{wData.insight}</p>
                        </div>
                    </div>
                </div>
            );
        }

        // 2.3 Artifacts
        if (id === 'w3-artifact') {
             if (!isFocused) return (
                <div className="flex flex-col h-full">
                    <Header />
                    <div className="flex-1 flex flex-col justify-center gap-4 px-2">
                        <div className="space-y-2">
                             <div className="flex justify-between text-[9px] font-bold opacity-60">
                                 <span>{wData.data[0].l.toUpperCase()}</span>
                                 <span>{wData.data[0].v}%</span>
                             </div>
                             <div className="h-1.5 w-full bg-current/10 rounded-full overflow-hidden">
                                 <div className="h-full bg-current" style={{width: `${wData.data[0].v}%`}} />
                             </div>
                        </div>
                    </div>
                </div>
            );
            return (
                 <div className="flex flex-col h-full p-8 animate-fade-in-up">
                    <div className="mb-8">
                        <span className="opacity-40 text-[10px] font-bold uppercase tracking-widest mb-1 block">2.3 Artifacts</span>
                        <h3 className="text-2xl font-black tracking-tight">{title}</h3>
                    </div>
                    <div className="flex-1 space-y-8">
                        {wData.data.map((d: any, i: number) => (
                            <div key={i} className="space-y-2 group">
                                <div className="flex justify-between text-sm font-bold uppercase tracking-wide opacity-80 group-hover:opacity-100 transition-opacity">
                                    <span>{d.l}</span>
                                    <span>{d.v}%</span>
                                </div>
                                <div className="w-full h-3 bg-current/5 rounded-sm overflow-hidden border border-current/10">
                                    <div className={`h-full rounded-sm bg-blue-500 transition-all duration-1000 opacity-90`} style={{ width: `${d.v}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-8 pt-4 border-t border-current/10 text-xs opacity-50 leading-relaxed">
                        {wData.note}
                    </div>
                </div>
            );
        }

        // 2.4 Strategy POS
        if (id === 'w4-strategy') {
            if (!isFocused) return (
                <div className="flex flex-col h-full">
                    <Header />
                    <div className="flex-1 flex flex-col items-center justify-center p-2 text-center">
                         <div className="text-[10px] font-bold opacity-60 uppercase mb-2">Current</div>
                         <div className="text-sm font-black leading-tight mb-4">{wData.current.title}</div>
                         <div className="w-full h-px bg-current/10 mb-4" />
                         <div className="text-[10px] font-bold opacity-60 uppercase mb-2">Next</div>
                         <div className="text-sm font-black leading-tight">{wData.next.title}</div>
                    </div>
                </div>
            );
            return (
                 <div className="flex flex-col h-full p-8 animate-fade-in-up">
                    <div className="mb-6">
                        <span className="opacity-40 text-[10px] font-bold uppercase tracking-widest mb-1 block">2.4 Strategy</span>
                        <h3 className="text-2xl font-black tracking-tight">{title}</h3>
                    </div>
                    <div className="flex-1 flex flex-col gap-8 flex-1 justify-center">
                        <div className="pl-6 border-l-4 border-blue-500">
                            <div className="text-xs font-bold uppercase tracking-widest opacity-60 mb-2">{wData.current.title}</div>
                            <p className="text-base font-medium leading-relaxed">{wData.current.text}</p>
                        </div>
                        <div className="flex justify-center opacity-30"><ArrowRight size={24} className="rotate-90" /></div>
                        <div className={`p-6 rounded-xl ${isDark ? 'bg-white/5' : 'bg-black/5'}`}>
                            <div className="text-xs font-bold uppercase tracking-widest text-blue-500 mb-2 flex items-center gap-2">
                                <TrendingUp size={16} /> {wData.next.title}
                            </div>
                            <p className="text-base font-medium leading-relaxed">{wData.next.text}</p>
                        </div>
                    </div>
                </div>
            );
        }

        // 2.5 SDLC Defects
        if (id === 'w5-defects') {
            if (!isFocused) return (
                <div className="flex flex-col h-full">
                    <Header />
                    <div className="flex-1 flex flex-col justify-center items-center gap-2">
                        <ShieldAlert size={36} className={`mb-2 opacity-100 ${isDark ? 'text-white' : 'text-black'}`} />
                        <span className="text-4xl font-black tracking-tighter">{wData.stats[2].v}</span>
                        <span className="text-[8px] font-bold opacity-50 text-center px-4 leading-tight">{wData.stats[2].l}</span>
                    </div>
                </div>
            );
            return (
                <div className="flex flex-col h-full p-8 animate-fade-in-up">
                    <div className="mb-8">
                        <span className="opacity-40 text-[10px] font-bold uppercase tracking-widest mb-1 block">2.5 Risk Analysis</span>
                        <h3 className="text-2xl font-black tracking-tight">{title}</h3>
                    </div>
                    <div className="space-y-4 mb-8">
                        {wData.stats.map((d: any, i: number) => (
                            <div key={i} className={`flex items-center justify-between p-5 rounded-xl border backdrop-blur-md transition-all ${i===2 ? 'bg-red-500/10 border-red-500/30' : (isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/5')}`}>
                                <div className={`text-base font-bold ${i===2 ? 'text-red-400' : 'opacity-80'}`}>{d.l}</div>
                                <div className={`text-3xl font-black tracking-tight ${i===2 ? 'text-red-500' : ''}`}>{d.v}</div>
                            </div>
                        ))}
                    </div>
                    <div className={`p-5 rounded-xl ${isDark ? 'bg-red-900/10' : 'bg-red-50'}`}>
                        <div className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-2 bg-red-500/10 px-2 py-1 rounded w-fit">{wData.risk.title}</div>
                        <p className="text-sm leading-relaxed opacity-80">{wData.risk.text}</p>
                    </div>
                </div>
            );
        }

        // 3.1 Team Collab
        if (id === 'w6-collab') {
             if (!isFocused) return (
                <div className="flex flex-col h-full">
                    <Header />
                    <div className="flex-1 flex flex-col justify-center gap-3 px-4">
                        {[85, 65, 40].map((s, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <span className="text-[10px] w-6 opacity-50 font-mono">T{i+1}</span>
                                <div className="flex-1 h-1.5 bg-current/10 rounded-sm overflow-hidden">
                                    <div className="h-full bg-current opacity-80" style={{ width: `${s}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            );
            return (
                 <div className="flex flex-col h-full p-8 animate-fade-in-up">
                    <div className="mb-6 border-b border-current/10 pb-4">
                        <span className="opacity-40 text-[10px] font-bold uppercase tracking-widest mb-1 block">3.1 Team Collaboration</span>
                        <h3 className="text-2xl font-black tracking-tight">{title}</h3>
                    </div>
                    <div className="flex-1 overflow-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-[10px] font-bold opacity-40 uppercase tracking-wider border-b border-current/10">
                                    {wData.headers.map((h: string, i: number) => (
                                        <th key={i} className="pb-3 px-2">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {wData.rows.map((row: any, i: number) => (
                                    <tr key={i} className={`border-b border-current/5 hover:bg-current/5 transition-colors`}>
                                        <td className="py-3 px-2 font-bold">{row.t}</td>
                                        <td className="py-3 px-2">
                                            <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${row.p === 'Type 1' ? 'bg-green-500/20 text-green-500' : row.p === 'Type 2' ? 'bg-red-500/10 text-red-500' : 'bg-current/10 opacity-60'}`}>{row.p}</span>
                                        </td>
                                        <td className="py-3 px-2 font-mono font-bold flex items-center gap-2">
                                            <span>{row.s}</span>
                                            <div className="w-16 h-1 bg-current/10 rounded-full overflow-hidden">
                                                <div className="h-full bg-blue-500" style={{width: `${row.s}%`}}/>
                                            </div>
                                        </td>
                                        <td className="py-3 px-2 text-blue-500 font-bold">{row.v}</td>
                                        <td className="py-3 px-2 opacity-50 text-xs">{row.u}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            );
        }

        // 3.2 SDLC Bias
        if (id === 'w7-bias') {
             if (!isFocused) return (
                <div className="flex flex-col h-full">
                    <Header />
                    <div className="flex-1 flex flex-col items-center justify-center relative">
                        <div className="relative w-32 h-32">
                             <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                                <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="12" strokeOpacity="0.1" />
                                <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="12" strokeDasharray="31.7 251.3" strokeDashoffset="-219.6" className="opacity-100" />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-2xl font-black tracking-tighter">C3</span>
                            </div>
                        </div>
                    </div>
                </div>
            );
            return (
                 <div className="flex flex-col h-full p-8 animate-fade-in-up">
                    <div className="mb-6">
                        <span className="opacity-40 text-[10px] font-bold uppercase tracking-widest mb-1 block">3.2 SDLC Bias</span>
                        <h3 className="text-2xl font-black tracking-tight">{title}</h3>
                    </div>
                    <div className="flex-1 flex flex-col justify-end gap-6 mb-4">
                        <div className="flex justify-end gap-4 text-[10px] font-bold uppercase tracking-wider mb-4">
                            <div className="flex items-center gap-1"><div className="w-2 h-2 bg-blue-700"/> Design</div>
                            <div className="flex items-center gap-1"><div className="w-2 h-2 bg-blue-500"/> Test</div>
                            <div className="flex items-center gap-1"><div className="w-2 h-2 bg-blue-300"/> Imp</div>
                        </div>
                        <div className="flex justify-between items-end h-40 gap-4">
                            {wData.chart.map((c: any, i: number) => (
                                <div key={i} className="flex flex-col items-center gap-2 flex-1 h-full justify-end group">
                                    <div className="w-full h-full flex flex-col-reverse rounded-md overflow-hidden relative">
                                        <div className="w-full bg-blue-300 transition-all duration-1000" style={{height: `${c.i}%`}} />
                                        <div className="w-full bg-blue-500 transition-all duration-1000 delay-100" style={{height: `${c.te}%`}} />
                                        <div className="w-full bg-blue-700 transition-all duration-1000 delay-200" style={{height: `${c.d}%`}} />
                                    </div>
                                    <span className="text-xs font-bold opacity-60 group-hover:opacity-100">{c.t}</span>
                                </div>
                            ))}
                        </div>
                        <div className={`p-4 rounded-lg mt-4 flex gap-3 items-start ${isDark ? 'bg-white/5' : 'bg-black/5'}`}>
                            <Zap size={16} className="text-amber-500 shrink-0 mt-0.5" />
                            <p className="text-xs leading-relaxed opacity-80 font-medium">{wData.insight}</p>
                        </div>
                    </div>
                </div>
            );
        }

        // 3.4 Standardization
        if (id === 'w8-standard') {
            if (!isFocused) return (
                <div className="flex flex-col h-full">
                    <Header />
                    <div className="flex-1 flex flex-col items-center justify-center">
                        <span className="text-4xl font-black opacity-100">{wData.mainStat}</span>
                        <span className="text-[9px] uppercase tracking-wider opacity-60 mt-1 font-bold text-center px-2">Reuse Absence</span>
                        <div className="mt-4 w-12 h-1 bg-current/10 overflow-hidden"><div className="w-[86.8%] h-full bg-current"/></div>
                    </div>
                </div>
            );
            return (
                 <div className="flex flex-col h-full p-8 animate-fade-in-up">
                    <div className="mb-6">
                        <span className="opacity-40 text-[10px] font-bold uppercase tracking-widest mb-1 block">3.4 Standardization</span>
                        <h3 className="text-2xl font-black tracking-tight">{title}</h3>
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                        <div className="mb-8">
                            <div className="text-6xl font-black mb-2">{wData.mainStat}</div>
                            <div className="text-sm font-bold opacity-60 uppercase tracking-widest mb-6">Reuse Absence Rate</div>
                            
                            <div className={`p-4 rounded-xl border border-current/10 ${isDark ? 'bg-white/5' : 'bg-white shadow-sm'}`}>
                                <div className="text-[10px] font-bold opacity-40 uppercase mb-3">Critical Segments</div>
                                {wData.segments.map((s: any, i: number) => (
                                    <div key={i} className="flex justify-between items-center mb-2 last:mb-0">
                                        <span className="font-bold">{s.l}</span>
                                        <span className="font-black text-red-500">{s.v}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="p-4 border border-blue-500/30 rounded-xl bg-blue-500/10 flex gap-4 items-start">
                            <div className="bg-blue-600 p-2 rounded-lg text-white shrink-0"><Search size={16}/></div>
                            <div>
                                <div className="text-xs font-bold text-blue-500 uppercase mb-1">{wData.rca.title}</div>
                                <p className="text-sm leading-relaxed opacity-90">{wData.rca.text}</p>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return null;
    };

    if (!active && phase === 0) return null;
    if (!t) return null;

    const textBase = isDark ? 'text-white' : 'text-black';

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
                            const isFocused = focusId === w.id;
                            const currentW = isFocused ? w.expW : w.w;
                            const currentH = isFocused ? w.expH : w.h;

                            const styleProps = {
                                transform: `translate3d(${w.x}px, ${w.y}px, ${w.z}px)`,
                                width: `${currentW}px`,
                                height: `${currentH}px`,
                                left: `-${currentW / 2}px`,
                                top: `-${currentH / 2}px`,
                                zIndex: Math.round(w.z + 1000), // Fix for clicking back layers
                                transition: 'all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)' 
                            };

                            const blurClass = focusId && !isFocused ? 'blur-sm opacity-30 scale-95 grayscale' : 'blur-0 opacity-100';
                            const focusedClass = isFocused ? 'scale-100 z-50 ring-1 ring-white/20' : 'hover:scale-105 hover:z-40';
                            // Enhanced Hover Logic
                            const containerClasses = `absolute flex flex-col p-6 rounded-sm backdrop-blur-xl shadow-2xl transition-all duration-700 cursor-pointer overflow-hidden ${cardBg} ${cardBorder} border ${blurClass} ${focusedClass} ${!isFocused ? hoverStyles : ''}`;

                            return (
                                <div 
                                    key={w.id} 
                                    className={containerClasses}
                                    style={styleProps}
                                    onClick={(e) => handleItemClick(e, w.id)}
                                    onMouseEnter={() => setHoveredId(w.id)}
                                    onMouseLeave={() => setHoveredId(null)}
                                >
                                    {isFocused && (
                                        <button 
                                            className="absolute top-6 right-6 z-50 group"
                                            onClick={(e) => { e.stopPropagation(); setFocusId(null); setHoveredId(null); }}
                                        >
                                            <X size={20} className="opacity-50 hover:opacity-100 transition-opacity" />
                                        </button>
                                    )}
                                    <div className={isDark ? 'text-white' : 'text-black'}>
                                        {renderWidgetContent(w.id, isFocused)}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};
