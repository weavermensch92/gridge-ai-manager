
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { GlitchText } from '../GlitchText';
import { Theme } from '../types';

// Specialized Text Component for Headline with Gaussian Blur & Alpha Fade
const BlurredTextLine: React.FC<{ text: string; isDark: boolean; visible: boolean }> = ({ text, isDark, visible }) => {
    return (
        <div className={`relative transition-all duration-[1200ms] ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16 blur-sm'}`}>
            <h2 
                className={`text-5xl md:text-[9.5rem] font-black text-center tracking-tighter leading-none ${isDark ? 'text-white' : 'text-black'}`}
                style={{
                    maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)'
                }}
            >
                {text}
            </h2>
            <h2 
                className={`absolute inset-0 text-5xl md:text-[9.5rem] font-black text-center tracking-tighter leading-none ${isDark ? 'text-white' : 'text-black'} blur-xl md:blur-[3rem] pointer-events-none select-none opacity-60`}
                style={{
                    maskImage: 'linear-gradient(to bottom, transparent 35%, black 80%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, transparent 35%, black 80%, transparent 100%)'
                }}
            >
                {text}
            </h2>
        </div>
    );
};

interface Point { x: number; y: number; }

// Animation Component for Connections
const AnimatedConnections: React.FC<{ 
    isStage3: boolean; 
    isDark: boolean; 
    onPulse?: () => void;
    positions: { left: Point[], mid: Point[], right: Point[] } | null;
}> = ({ isStage3, isDark, onPulse, positions }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const requestRef = useRef<number>(0);
    const particlesRef = useRef<any[]>([]);
    const phaseRef = useRef<'init' | 'incoming' | 'traveling_in' | 'waiting' | 'flashing' | 'outgoing' | 'traveling_out'>('init');
    const timerRef = useRef(0);

    // Generate paths based on positions
    const { chaosPaths, orderPathsIn, orderPathsOut } = useMemo(() => {
        if (!positions || positions.left.length === 0 || positions.mid.length === 0 || positions.right.length === 0) {
            return { chaosPaths: [], orderPathsIn: [], orderPathsOut: [] };
        }

        const { left, mid, right } = positions;
        const aiOpsNode = mid[1] || mid[0]; 

        const cPaths: any[] = [];
        // Phase 4: Chaos - Connect Left to all Mid nodes
        left.forEach(l => {
            mid.forEach(m => {
                cPaths.push({
                    start: l,
                    end: m,
                    cp1: { x: l.x + (m.x - l.x) * 0.5, y: l.y },
                    cp2: { x: l.x + (m.x - l.x) * 0.5, y: m.y }
                });
            });
        });
        
        // Phase 4: Chaos - Connect Mid to all Right nodes
        mid.forEach(m => {
            right.forEach(r => {
                cPaths.push({
                    start: m,
                    end: r,
                    cp1: { x: m.x + (r.x - m.x) * 0.5, y: m.y },
                    cp2: { x: m.x + (r.x - m.x) * 0.5, y: r.y }
                });
            });
        });

        // Phase 5: Order
        const oIn: any[] = [];
        left.forEach(l => {
            oIn.push({
                start: l,
                end: aiOpsNode,
                cp1: { x: l.x + (aiOpsNode.x - l.x) * 0.5, y: l.y },
                cp2: { x: l.x + (aiOpsNode.x - l.x) * 0.5, y: aiOpsNode.y }
            });
        });

        const oOut: any[] = [];
        right.forEach(r => {
            oOut.push({
                start: aiOpsNode,
                end: r,
                cp1: { x: aiOpsNode.x + (r.x - aiOpsNode.x) * 0.5, y: aiOpsNode.y },
                cp2: { x: aiOpsNode.x + (r.x - aiOpsNode.x) * 0.5, y: r.y }
            });
        });

        return { chaosPaths: cPaths, orderPathsIn: oIn, orderPathsOut: oOut };
    }, [positions]);

    const drawBezier = (ctx: CanvasRenderingContext2D, p: any, color: string, width: number) => {
        const w = ctx.canvas.width;
        const h = ctx.canvas.height;
        ctx.beginPath();
        ctx.moveTo(p.start.x * w, p.start.y * h);
        ctx.bezierCurveTo(p.cp1.x * w, p.cp1.y * h, p.cp2.x * w, p.cp2.y * h, p.end.x * w, p.end.y * h);
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.stroke();
    };

    const getBezierPoint = (t: number, p: any) => {
        const x = (1 - t) ** 3 * p.start.x + 3 * (1 - t) ** 2 * t * p.cp1.x + 3 * (1 - t) * t ** 2 * p.cp2.x + t ** 3 * p.end.x;
        const y = (1 - t) ** 3 * p.start.y + 3 * (1 - t) ** 2 * t * p.cp1.y + 3 * (1 - t) * t ** 2 * p.cp2.y + t ** 3 * p.end.y;
        return { x, y };
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Reset phase when stage changes
        phaseRef.current = 'init';
        particlesRef.current = [];

        const animate = (time: number) => {
            const w = canvas.width = canvas.offsetWidth;
            const h = canvas.height = canvas.offsetHeight;
            ctx.clearRect(0, 0, w, h);

            const lineColor = isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)';
            const particleColor = isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)';

            if (isStage3) {
                // Phase 4: Chaos Lines
                ctx.shadowBlur = 0;
                chaosPaths.forEach(p => drawBezier(ctx, p, lineColor, 1));
            } else {
                // Phase 5: Order Lines
                ctx.shadowBlur = 0;
                orderPathsIn.forEach(p => drawBezier(ctx, p, lineColor, 1));
                orderPathsOut.forEach(p => drawBezier(ctx, p, lineColor, 1));
            }

            // Unified Particle Update
            particlesRef.current = particlesRef.current.filter(p => {
                p.t += p.speed;
                // Death condition
                if (p.dieAt && p.t >= p.dieAt) return false;
                if (p.t >= 1) return false;

                const pos = getBezierPoint(p.t, p.path);
                ctx.beginPath();
                ctx.arc(pos.x * w, pos.y * h, p.type ? 3 : 2, 0, Math.PI * 2);
                ctx.fillStyle = particleColor;
                
                if (!isStage3) {
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = '#3b82f6'; // Blue-500
                } else {
                    ctx.shadowBlur = 0;
                }
                
                ctx.fill();
                return true;
            });

            // Spawning Logic
            if (isStage3) {
                // Phase 4: Chaos Spawning
                // Increase spawn rate to ensure roughly one dot per line on average
                if (Math.random() < 0.3 && chaosPaths.length > 0) {
                    const path = chaosPaths[Math.floor(Math.random() * chaosPaths.length)];
                    particlesRef.current.push({
                        path,
                        t: 0,
                        speed: 0.005 + Math.random() * 0.01,
                        dieAt: Math.random() > 0.7 ? 0.5 + Math.random() * 0.4 : 1
                    });
                }
            } else {
                // Phase 5: Order State Machine
                if (phaseRef.current === 'init') {
                    phaseRef.current = 'incoming';
                } else if (phaseRef.current === 'incoming') {
                    if (particlesRef.current.length === 0) {
                        orderPathsIn.forEach(path => {
                            particlesRef.current.push({ path, t: 0, speed: 0.015, type: 'in' });
                        });
                        phaseRef.current = 'traveling_in';
                    }
                } else if (phaseRef.current === 'traveling_in') {
                    if (particlesRef.current.length === 0) {
                        phaseRef.current = 'waiting';
                        timerRef.current = time;
                    }
                } else if (phaseRef.current === 'waiting') {
                    if (time - timerRef.current > 500) { // 500ms pause
                        phaseRef.current = 'flashing';
                        timerRef.current = time;
                        if (onPulse) onPulse(); // Trigger flash sequence in parent
                    }
                } else if (phaseRef.current === 'flashing') {
                    // Wait for flash sequence to finish (approx 1.2s)
                    if (time - timerRef.current > 1500) {
                        phaseRef.current = 'outgoing';
                    }
                } else if (phaseRef.current === 'outgoing') {
                    if (particlesRef.current.length === 0) {
                        orderPathsOut.forEach(path => {
                            particlesRef.current.push({ path, t: 0, speed: 0.015, type: 'out' });
                        });
                        orderPathsIn.forEach(path => {
                            particlesRef.current.push({ path, t: 0, speed: 0.015, type: 'in' });
                        });
                        phaseRef.current = 'traveling_out';
                    }
                } else if (phaseRef.current === 'traveling_out') {
                    // Wait for the 'in' particles to arrive before waiting again
                    // Since both 'in' and 'out' take the same time, when particles are empty, we arrived.
                    if (particlesRef.current.length === 0) {
                        phaseRef.current = 'waiting'; // go straight to waiting since 'in' particles just arrived
                        timerRef.current = time;
                    }
                }
            }

            requestRef.current = requestAnimationFrame(animate);
        };

        requestRef.current = requestAnimationFrame(animate);
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [isStage3, isDark, chaosPaths, orderPathsIn, orderPathsOut, onPulse]);

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />;
};

export const GenesisOverlay: React.FC<{ stage: number, isDark: boolean, t: any, t2: any, t2_transform: any, t4?: any, t5?: any, t6?: any, tGenesis?: any, benefits?: any[] }> = ({ stage, isDark, t, t2, t2_transform, t4, t5, t6, tGenesis, benefits }) => {
    const [entryStarted, setEntryStarted] = useState(false);
    const [line2Visible, setLine2Visible] = useState(false);
    const [cardsVisible, setCardsVisible] = useState(false);
    const [diagramVisible, setDiagramVisible] = useState(false);
    const [promptFlash, setPromptFlash] = useState(false);
    const [contextFlash, setContextFlash] = useState(false);
    
    // Fixed relative positions for precise alignment
    const [nodePositions, setNodePositions] = useState<{left: Point[], mid: Point[], right: Point[]} | null>(null);

    useEffect(() => {
        // Delayed start to sync with the "Big Bang" intro of CosmicBackground
        const timer1 = setTimeout(() => setEntryStarted(true), 2000); 
        const timer2 = setTimeout(() => setLine2Visible(true), 3200);
        return () => { clearTimeout(timer1); clearTimeout(timer2); };
    }, []);

    const isStage0 = stage === 0;
    const isStage1 = stage === 1;
    const isStage2 = stage === 2;
    const isStage3 = stage === 3;
    const isStage4 = stage === 4;
    const isStage5 = stage === 5;
    const isStage6 = stage === 6;

    // Text Content Logic
    let currentText1 = t?.text1 || "";
    let currentText2 = t?.text2 || "";

    if (isStage1) {
        currentText1 = t2?.text1 || "";
        currentText2 = t2?.text2 || "";
    } else if (isStage2) {
        currentText1 = t2_transform?.text1 || "";
        currentText2 = t2_transform?.text2 || "";
    } else if (isStage3) {
        currentText1 = t4?.text1 || "";
        currentText2 = t4?.text2 || "";
    } else if (isStage4) {
        currentText1 = t5?.text1 || "";
        currentText2 = t5?.text2 || "";
    } else if (isStage5) {
        currentText1 = t6?.text1 || "";
        currentText2 = t6?.text2 || "";
    }

    // Visibility Logic
    useEffect(() => {
        if (stage === 3) {
            setCardsVisible(false);
            // Delay to allow NodeGraphModal (Stage 2) to disappear downwards
            const timer = setTimeout(() => setDiagramVisible(true), 600);
            return () => clearTimeout(timer);
        } else if (stage === 4) {
            setCardsVisible(false);
            setDiagramVisible(true);
        } else if (stage === 5) {
             setDiagramVisible(false);
             const timer = setTimeout(() => setCardsVisible(true), 500);
             return () => clearTimeout(timer);
        } else {
            setDiagramVisible(false);
            setCardsVisible(false);
        }
    }, [stage]);

    // Hardcode positions for perfect alignment
    useEffect(() => {
        if (!diagramVisible) return;
        
        // Use fixed percentage positions to ensure lines hit exactly the center of the nodes
        const leftX = 0.15;
        const midX = 0.50;
        const rightX = 0.85;

        // 5 nodes on left/right
        const yPositions5 = [0.15, 0.325, 0.50, 0.675, 0.85];
        
        // 3 nodes in middle
        const yPositions3 = [0.25, 0.50, 0.75];

        setNodePositions({
            left: yPositions5.map(y => ({ x: leftX, y })),
            mid: yPositions3.map(y => ({ x: midX, y })),
            right: yPositions5.map(y => ({ x: rightX, y }))
        });
    }, [diagramVisible, isStage3]);

    // Animation Classes
    const headlineContainerClass = isStage0 
        ? "opacity-100 scale-100 translate-y-0 blur-0" 
        : (isStage1 || isStage2 || isStage3 || isStage4 || isStage5 ? "opacity-0 scale-90 -translate-y-12 blur-xl pointer-events-none" : "opacity-0 scale-75 -translate-y-24 blur-2xl hidden");

    let narrativeClass = "opacity-0 scale-90 translate-y-12 blur-lg pointer-events-none";
    if (isStage1) {
        narrativeClass = "opacity-100 scale-100 translate-y-0 blur-0";
    } else if (isStage2 || isStage3 || isStage4 || isStage5) {
        narrativeClass = "opacity-100 scale-100 -translate-y-48 blur-0";
    } else if (stage > 5) {
        narrativeClass = "opacity-0 scale-[0.88] blur-xl -translate-y-48 pointer-events-none";
    } else if (stage === 0) {
        narrativeClass = "opacity-0 translate-y-12 scale-100 pointer-events-none";
    }

    // Diagram Data
    const leftNodes = tGenesis?.leftNodes || ["Dev A", "Dev B", "Dev C", "Designer A", "Planner A"];
    const rightNodes = tGenesis?.rightNodes || ["Google", "Claude Code", "Claude", "BKIT", "Manifesto"];
    const midComplex = tGenesis?.midComplex || ["Individual Payment", "Finance Request", "Team Budget"];
    const midSimple = tGenesis?.midSimple || ["Prompt Improvement", "GRIDGE AiOPS", "Context Storage"];

    const handlePulse = useCallback(() => {
        setPromptFlash(true);
        setContextFlash(true);
        // Flash twice
        setTimeout(() => { setPromptFlash(false); setContextFlash(false); }, 300);
        setTimeout(() => { setPromptFlash(true); setContextFlash(true); }, 600);
        setTimeout(() => { setPromptFlash(false); setContextFlash(false); }, 900);
    }, []);

    return (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-[50]">
            <div className={`absolute inset-0 flex flex-col items-center justify-center gap-0 md:gap-2 transition-all duration-[1200ms] ease-[cubic-bezier(0.25,1,0.5,1)] ${headlineContainerClass}`}>
                <BlurredTextLine text={t.line1} isDark={isDark} visible={entryStarted} />
                <BlurredTextLine text={t.line2} isDark={isDark} visible={line2Visible} />
            </div>

            <div className={`absolute w-full max-w-8xl px-12 md:px-24 flex flex-col gap-10 text-center transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] ${narrativeClass}`}>
                 <p className={`text-2xl md:text-5xl font-light tracking-tight ${isDark ? 'text-white' : 'text-black'}`}>
                    <GlitchText text={currentText1} delay={500} speed={2} />
                 </p>
                 <p className={`text-3xl md:text-6xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-black'}`}>
                    <span className="inline-block">
                        <GlitchText text={currentText2} delay={isStage2 ? 0 : 1200} speed={2} />
                    </span>
                 </p>
            </div>

            {/* Diagram for Stage 3, 4 & 5 */}
            {(isStage3 || isStage4 || isStage5) && (
                <div 
                    className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-[95%] md:w-[80%] h-[50vh] z-[60] transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] pointer-events-auto ${diagramVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}
                >
                    <div className={`w-full h-full border-t border-l border-r rounded-t-2xl overflow-hidden shadow-2xl flex flex-col ${isDark ? 'bg-[#000000] border-white/10' : 'bg-[#e0e0e0] border-black/10'}`}>
                        {/* Header */}
                        <div className={`w-full h-10 border-b flex items-center px-4 gap-2 shrink-0 ${isDark ? 'border-white/10' : 'border-black/10'} z-20 bg-inherit`}>
                            <div className={`w-3 h-3 rounded-full ${isDark ? 'bg-zinc-600' : 'bg-zinc-400'}`} />
                            <div className={`w-3 h-3 rounded-full ${isDark ? 'bg-zinc-600' : 'bg-zinc-400'}`} />
                            <div className={`w-3 h-3 rounded-full ${isDark ? 'bg-zinc-600' : 'bg-zinc-400'}`} />
                            <div className={`ml-4 text-[10px] font-mono opacity-40 uppercase tracking-widest ${isDark ? 'text-white' : 'text-black'}`}>GRIDGE_WORKFLOW_EDITOR.app</div>
                        </div>

                        {/* Diagram Content */}
                        <div className="flex-1 relative overflow-hidden">
                             {/* Background Pattern */}
                             <div className="absolute inset-0 z-0"
                                 style={{
                                    backgroundImage: isDark 
                                        ? `linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)` 
                                        : `linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)`,
                                    backgroundSize: '40px 40px'
                                 }}
                             />
                            
                            {/* Animated Canvas Layer - Z-index 0 (behind nodes) */}
                            <AnimatedConnections isStage3={isStage3} isDark={isDark} onPulse={handlePulse} positions={nodePositions} />

                            {/* Nodes Layer - Z-index 10 (above lines) */}
                            {nodePositions && (
                                <div className="absolute inset-0 z-10 pointer-events-none">
                                    {/* Left Nodes */}
                                    {leftNodes.map((node: string, i: number) => (
                                        <div 
                                            key={`left-${i}`}
                                            className="absolute -translate-x-1/2 -translate-y-1/2"
                                            style={{ left: `${nodePositions.left[i].x * 100}%`, top: `${nodePositions.left[i].y * 100}%` }}
                                        >
                                            <div className={`w-28 md:w-36 p-3 md:p-4 rounded-xl border text-center font-bold text-xs md:text-sm ${isDark ? 'bg-[#111] border-white/20 text-white' : 'bg-white border-black/10 text-black'} shadow-sm pointer-events-auto`}>
                                                {node}
                                            </div>
                                        </div>
                                    ))}

                                    {/* Middle Nodes */}
                                    {isStage3 ? (
                                        midComplex.map((node: string, i: number) => (
                                            <div 
                                                key={`mid-${i}`}
                                                className="absolute -translate-x-1/2 -translate-y-1/2"
                                                style={{ left: `${nodePositions.mid[i].x * 100}%`, top: `${nodePositions.mid[i].y * 100}%` }}
                                            >
                                                <div className={`w-40 md:w-48 p-3 md:p-4 rounded-xl border text-center font-bold text-xs md:text-sm ${isDark ? 'bg-[#111] border-white/20 text-white' : 'bg-white border-black/10 text-black'} shadow-sm pointer-events-auto animate-fade-in-up`}>
                                                    {node}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <>
                                            {/* Prompt Improvement (Top) */}
                                            <div 
                                                className="absolute -translate-x-1/2 -translate-y-1/2"
                                                style={{ left: `${nodePositions.mid[0].x * 100}%`, top: `${nodePositions.mid[0].y * 100}%` }}
                                            >
                                                <div className={`w-36 md:w-44 p-2 md:p-3 rounded-lg border text-center font-bold text-xs transition-all duration-200 ${promptFlash ? 'bg-blue-500 text-white scale-110 shadow-[0_0_20px_rgba(59,130,246,0.8)]' : (isDark ? 'bg-[#111] border-white/20 text-white' : 'bg-white border-black/10 text-black')} shadow-sm pointer-events-auto animate-fade-in-up`}>
                                                    {midSimple[0]}
                                                </div>
                                            </div>

                                            {/* GRIDGE AiOPS (Center) */}
                                            <div 
                                                className="absolute -translate-x-1/2 -translate-y-1/2"
                                                style={{ left: `${nodePositions.mid[1].x * 100}%`, top: `${nodePositions.mid[1].y * 100}%` }}
                                            >
                                                <div className={`w-44 md:w-56 p-4 md:p-6 rounded-xl border text-center font-black text-base md:text-lg ${isDark ? 'bg-white text-black border-white' : 'bg-black text-white border-black'} shadow-xl scale-110 pointer-events-auto animate-fade-in-up`}>
                                                    {midSimple[1]}
                                                </div>
                                            </div>

                                            {/* Context Storage (Bottom) */}
                                            <div 
                                                className="absolute -translate-x-1/2 -translate-y-1/2"
                                                style={{ left: `${nodePositions.mid[2].x * 100}%`, top: `${nodePositions.mid[2].y * 100}%` }}
                                            >
                                                <div className={`w-36 md:w-44 p-3 md:p-4 rounded-full border text-center font-bold text-xs md:text-sm transition-all duration-200 ${contextFlash ? 'bg-blue-500 text-white scale-110 shadow-[0_0_20px_rgba(59,130,246,0.8)]' : (isDark ? 'bg-[#111] border-white/20 text-white' : 'bg-white border-black/10 text-black')} shadow-sm flex items-center justify-center gap-2 pointer-events-auto animate-fade-in-up`}>
                                                    <div className="w-2 h-2 rounded-full bg-current animate-pulse"></div>
                                                    {midSimple[2]}
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {/* Right Nodes */}
                                    {rightNodes.map((node: string, i: number) => (
                                        <div 
                                            key={`right-${i}`}
                                            className="absolute -translate-x-1/2 -translate-y-1/2"
                                            style={{ left: `${nodePositions.right[i].x * 100}%`, top: `${nodePositions.right[i].y * 100}%` }}
                                        >
                                            <div className={`w-28 md:w-36 p-3 md:p-4 rounded-xl border text-center font-bold text-xs md:text-sm ${isDark ? 'bg-[#111] border-white/20 text-white' : 'bg-white border-black/10 text-black'} shadow-sm pointer-events-auto`}>
                                                {node}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

             {/* Feature Cards for Stage 6 */}
             {isStage5 && benefits && (
                 <div className={`absolute inset-0 flex items-center justify-center pointer-events-none top-64`}>
                     <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl w-full px-8 transition-all duration-1000 ease-out pointer-events-auto ${cardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
                        {benefits.map((b: any, i: number) => (
                            <div key={i} className={`
                                h-32 md:h-40 rounded-2xl flex flex-col items-center justify-center text-center p-6
                                ${isDark ? 'bg-white/10 text-white border-white/10' : 'bg-[#f0f0f0] text-black border-black/5'}
                                backdrop-blur-md shadow-lg border hover:scale-[1.02] transition-transform duration-500
                            `}>
                                <h3 className="text-xl md:text-2xl font-bold mb-2">{b.title}</h3>
                                <p className="text-sm opacity-70">{b.detail}</p>
                            </div>
                        ))}
                     </div>
                 </div>
             )}
        </div>
    );
};
