import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, Send, Bot, User, ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import { GlitchText } from './GlitchText';
import { GoogleGenAI, Type } from '@google/genai';
import { motion, AnimatePresence } from 'framer-motion';

import { Language } from './types';
import { TRANSLATIONS } from './constants';

const WorkflowGraph: React.FC<{
    mode: 'as-is' | 'to-be',
    isDark: boolean,
    onNodeClick: (node: any) => void,
    selectedNodeId: string | null,
    lang: Language
}> = ({ mode, isDark, onNodeClick, selectedNodeId, lang }) => {
    const t = TRANSLATIONS[lang || 'ko'].caseStudy.workflowNodes;
    const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
    const containerRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);
    const lastPos = useRef({ x: 0, y: 0 });
    const [lineKey, setLineKey] = useState(0);
    const prevMode = useRef(mode);

    // Re-trigger line draw animation on mode change
    useEffect(() => {
        if (prevMode.current !== mode) {
            setLineKey(k => k + 1);
            prevMode.current = mode;
        }
    }, [mode]);

    const handleWheel = (e: React.WheelEvent) => {
        e.preventDefault();
        const scaleChange = e.deltaY * -0.001;
        let newScale = transform.scale + scaleChange;
        newScale = Math.min(Math.max(0.6, newScale), 2);

        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            const newX = mouseX - (mouseX - transform.x) * (newScale / transform.scale);
            const newY = mouseY - (mouseY - transform.y) * (newScale / transform.scale);
            setTransform({ x: newX, y: newY, scale: newScale });
        }
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        isDragging.current = true;
        lastPos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging.current) return;
        const dx = e.clientX - lastPos.current.x;
        const dy = e.clientY - lastPos.current.y;
        setTransform(prev => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
        lastPos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => { isDragging.current = false; };

    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            const preventDefaultWheel = (e: WheelEvent) => e.preventDefault();
            container.addEventListener('wheel', preventDefaultWheel, { passive: false });
            return () => container.removeEventListener('wheel', preventDefaultWheel);
        }
    }, []);

    const resetZoom = () => setTransform({ x: 0, y: 0, scale: 1 });
    const zoomIn = () => setTransform(prev => ({ ...prev, scale: Math.min(prev.scale + 0.2, 2) }));
    const zoomOut = () => setTransform(prev => ({ ...prev, scale: Math.max(prev.scale - 0.2, 0.6) }));

    // Node Data with positions for each mode
    const graphData = {
        nodes: [
            { id: 'req1', asIs: { x: 130, y: 55, label: t.req }, toBe: { x: 150, y: 85, label: t.req_api }, desc: '산발적인 요청 접수에서 일원화된 API 채널로 개선' },
            { id: 'req2', asIs: { x: 330, y: 55, label: t.req }, toBe: { x: 360, y: 85, label: t.req_api }, desc: '산발적인 요청 접수에서 일원화된 API 채널로 개선' },
            { id: 'req3', asIs: { x: 530, y: 55, label: t.req }, toBe: { x: 545, y: 85, label: t.req_api }, desc: '산발적인 요청 접수에서 일원화된 API 채널로 개선' },
            { id: 'review_integrated', asIs: { x: 130, y: 200, label: t.review_man }, toBe: { x: 150, y: 195, label: t.review_sys }, desc: '담당자의 수동 검토가 시스템 기반 통합 접수로 자동화' },
            { id: 'extract_agent', asIs: { x: 345, y: 200, label: t.extract }, toBe: { x: 155, y: 310, label: t.agent }, desc: '수동 데이터 추출 작업이 AI 에이전트의 자동 분석으로 대체' },
            { id: 'api_call', asIs: null, toBe: { x: 390, y: 310, label: t.api_call }, desc: '추출된 데이터를 바탕으로 관련 시스템 API를 자동으로 호출합니다.' },
            { id: 'update_auto', asIs: { x: 660, y: 200, label: t.update_man }, toBe: { x: 660, y: 310, label: t.update_auto }, desc: '수동 시스템 반영 작업이 승인 시 자동 업데이트로 전환' },
            { id: 'email_noti', asIs: { x: 490, y: 360, label: t.email }, toBe: { x: 660, y: 430, label: t.noti }, desc: '단순 정보 전달 이메일이 통합 알림 시스템으로 개선' },
            { id: 'wait_hitl', asIs: { x: 660, y: 360, label: t.wait }, toBe: { x: 490, y: 430, label: t.hitl }, desc: '기약 없는 대기 시간이 필요 시에만 수행되는 전문가 검토로 정교화' },
            { id: 'llm', asIs: null, toBe: { x: 105, y: 430, label: 'LLM' }, type: 'circle' },
            { id: 'rag', asIs: null, toBe: { x: 215, y: 430, label: 'RAG' }, type: 'circle' }
        ]
    };

    const handleNodeClick = (node: any, e: React.MouseEvent) => {
        e.stopPropagation();
        const state = mode === 'as-is' ? node.asIs : node.toBe;
        if (!state) return;
        onNodeClick({
            id: node.id,
            type: mode === 'as-is' ? 'AS-IS' : 'TO-BE',
            label: state.label,
            desc: node.desc
        });
    };

    // AS-IS connections: { path, delay }
    const asIsLines = [
        { d: "M 130 79 L 130 176", delay: 0 },
        { d: "M 330 79 L 330 135 L 140 135 Q 130 135 130 145 L 130 176", delay: 100 },
        { d: "M 530 79 L 530 125 L 140 125 Q 130 125 130 133 L 130 176", delay: 200 },
        { d: "M 186 200 L 289 200", delay: 400 },
        { d: "M 345 224 L 345 345 Q 345 360 365 360 L 434 360", delay: 500 },
        { d: "M 546 360 L 604 360", delay: 700 },
        { d: "M 660 336 L 660 224", delay: 900 },
    ];

    // TO-BE connections
    const toBeLines = [
        { d: "M 150 109 L 150 171", color: "rgba(56,189,248,0.5)", delay: 0 },
        { d: "M 360 109 L 360 145 L 160 145 Q 150 145 150 155 L 150 171", color: "rgba(56,189,248,0.5)", delay: 100 },
        { d: "M 545 109 L 545 135 L 160 135 Q 150 135 150 143 L 150 171", color: "rgba(56,189,248,0.5)", delay: 200 },
        { d: "M 150 219 L 155 286", color: "rgba(56,189,248,0.5)", delay: 400 },
        { d: "M 211 310 L 334 310", color: "rgba(45,212,191,0.5)", delay: 600 },
        { d: "M 446 310 L 604 310", color: "rgba(45,212,191,0.5)", delay: 700 },
        { d: "M 390 334 L 390 415 Q 390 430 410 430 L 434 430", color: "rgba(45,212,191,0.5)", delay: 800 },
        { d: "M 660 334 L 660 406", color: "rgba(45,212,191,0.5)", delay: 900 },
    ];

    const toBeDashedLines = [
        { d: "M 105 398 Q 105 355 140 340 L 155 334", delay: 1100 },
        { d: "M 215 398 Q 215 355 180 340 L 165 334", delay: 1200 },
    ];

    const lineStroke = isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.25)';

    return (
        <div
            ref={containerRef}
            className="w-full h-full relative overflow-hidden cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            <style>{`
                @keyframes drawLine {
                    from { stroke-dashoffset: 2000; }
                    to { stroke-dashoffset: 0; }
                }
                .draw-line {
                    stroke-dasharray: 2000;
                    stroke-dashoffset: 2000;
                    animation: drawLine 0.6s ease-out forwards;
                }
            `}</style>

            {/* Dot Grid Background */}
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.08]"
                style={{
                    backgroundImage: isDark ? 'radial-gradient(white 1px, transparent 1px)' : 'radial-gradient(black 1px, transparent 1px)',
                    backgroundSize: '20px 20px',
                    transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
                    transformOrigin: '0 0'
                }}
            />

            <div
                className="absolute top-1/2 left-1/2 w-0 h-0"
                style={{ transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})` }}
            >
                <div className="relative w-[820px] h-[520px] -translate-x-1/2 -translate-y-1/2">

                    {/* Background Groups */}
                    {mode === 'as-is' ? (
                        <div className="absolute inset-0 transition-opacity duration-500">
                            <div className="absolute border-2 border-red-500/40 rounded-lg bg-red-500/5" style={{ left: 55, top: 165, width: 680, height: 72 }}>
                                <div className="absolute -bottom-7 left-0 text-red-500 font-bold text-xs tracking-wide">개인 주도형 업무</div>
                            </div>
                            <div className="absolute border-2 border-yellow-500/40 rounded-lg bg-yellow-500/5" style={{ left: 418, top: 325, width: 310, height: 72 }}>
                                <div className="absolute -top-7 left-0 text-yellow-500 font-bold text-xs tracking-wide">지나친 대기 기간</div>
                            </div>
                        </div>
                    ) : (
                        <div className="absolute inset-0 transition-opacity duration-500">
                            <div className="absolute border-2 border-sky-400/40 rounded-xl bg-sky-400/[0.03]" style={{ left: 40, top: 55, width: 700, height: 430 }}>
                                <div className="absolute -top-7 right-0 text-sky-400 font-black text-xs tracking-widest">그릿지 AX 구축 구간</div>
                            </div>
                            <div className="absolute border-2 border-teal-400/40 rounded-xl bg-teal-400/[0.03]" style={{ left: 80, top: 275, width: 650, height: 195 }}>
                                <div className="absolute -top-7 right-0 text-teal-400 font-black text-xs tracking-widest">AI 자동화 구간</div>
                            </div>
                        </div>
                    )}

                    {/* Nodes - CSS transition only, no framer-motion drag issues */}
                    {graphData.nodes.map(node => {
                        const state = mode === 'as-is' ? node.asIs : node.toBe;
                        const isVisible = state !== null;
                        const x = state?.x ?? (node.toBe?.x ?? node.asIs?.x ?? 0);
                        const y = state?.y ?? (node.toBe?.y ?? node.asIs?.y ?? 0);
                        const label = state?.label ?? '';
                        const isCircle = (node.type || 'rect') === 'circle';

                        return (
                            <div
                                key={node.id}
                                onClick={(e) => handleNodeClick(node, e)}
                                className={`absolute flex items-center justify-center cursor-pointer
                                    ${isCircle ? 'w-16 h-16 rounded-full' : 'w-28 h-12 rounded-lg'}
                                    ${selectedNodeId === node.id ? 'border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] z-20' : (isDark ? 'border-white/20 hover:border-white/40' : 'border-black/20 hover:border-black/40')}
                                    ${isDark ? 'bg-[#111] text-white' : 'bg-white text-black'} border-2 z-10
                                `}
                                style={{
                                    left: x,
                                    top: y,
                                    transform: 'translate(-50%, -50%)',
                                    opacity: isVisible ? 1 : 0,
                                    pointerEvents: isVisible ? 'auto' : 'none',
                                    transition: 'left 0.7s cubic-bezier(0.4,0,0.2,1), top 0.7s cubic-bezier(0.4,0,0.2,1), opacity 0.4s ease'
                                }}
                            >
                                <div className="text-[10px] font-bold text-center px-1">
                                    {label}
                                </div>
                            </div>
                        );
                    })}

                    {/* Connection Lines - draw animation on mode change */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-0">
                        <defs>
                            <marker id="arrowhead-wf" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                                <polygon points="0 0, 8 3, 0 6" fill={isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'} />
                            </marker>
                            <marker id="arrowhead-wf-blue" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                                <polygon points="0 0, 8 3, 0 6" fill="rgba(56,189,248,0.5)" />
                            </marker>
                            <marker id="arrowhead-wf-teal" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                                <polygon points="0 0, 8 3, 0 6" fill="rgba(45,212,191,0.5)" />
                            </marker>
                        </defs>

                        {mode === 'as-is' ? (
                            <g key={`asis-${lineKey}`}>
                                {asIsLines.map((line, i) => (
                                    <path
                                        key={`asis-line-${i}-${lineKey}`}
                                        d={line.d}
                                        fill="none"
                                        stroke={lineStroke}
                                        strokeWidth="1.5"
                                        markerEnd="url(#arrowhead-wf)"
                                        className="draw-line"
                                        style={{ animationDelay: `${line.delay}ms` }}
                                    />
                                ))}
                            </g>
                        ) : (
                            <g key={`tobe-${lineKey}`}>
                                {toBeLines.map((line, i) => (
                                    <path
                                        key={`tobe-line-${i}-${lineKey}`}
                                        d={line.d}
                                        fill="none"
                                        stroke={line.color}
                                        strokeWidth="1.5"
                                        markerEnd={line.color.includes('189,248') ? "url(#arrowhead-wf-blue)" : "url(#arrowhead-wf-teal)"}
                                        className="draw-line"
                                        style={{ animationDelay: `${line.delay}ms` }}
                                    />
                                ))}
                                {/* LLM/RAG dashed connections + dots */}
                                {toBeDashedLines.map((line, i) => (
                                    <path
                                        key={`tobe-dash-${i}-${lineKey}`}
                                        d={line.d}
                                        fill="none"
                                        stroke="rgba(45,212,191,0.3)"
                                        strokeWidth="1"
                                        strokeDasharray="4 4"
                                        className="draw-line"
                                        style={{ animationDelay: `${line.delay}ms` }}
                                    />
                                ))}
                                <circle cx="125" cy="355" r="3" fill="rgba(45,212,191,0.3)" opacity="0" style={{ animation: 'drawLine 0.1s ease-out forwards', animationDelay: '1100ms' }} />
                                <circle cx="140" cy="345" r="3" fill="rgba(45,212,191,0.3)" opacity="0" style={{ animation: 'drawLine 0.1s ease-out forwards', animationDelay: '1100ms' }} />
                                <circle cx="195" cy="355" r="3" fill="rgba(45,212,191,0.3)" opacity="0" style={{ animation: 'drawLine 0.1s ease-out forwards', animationDelay: '1200ms' }} />
                                <circle cx="175" cy="345" r="3" fill="rgba(45,212,191,0.3)" opacity="0" style={{ animation: 'drawLine 0.1s ease-out forwards', animationDelay: '1200ms' }} />
                            </g>
                        )}
                    </svg>
                </div>
            </div>

            {/* Zoom Controls */}
            <div className={`absolute bottom-6 left-6 flex items-center gap-2 p-1.5 rounded-xl backdrop-blur-md border ${isDark ? 'bg-black/40 border-white/10' : 'bg-white/40 border-black/10'}`}>
                <button onClick={resetZoom} className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-white/10' : 'hover:bg-black/5'}`}>
                    <Maximize size={16} />
                </button>
                <div className={`w-px h-4 ${isDark ? 'bg-white/20' : 'bg-black/20'}`} />
                <button onClick={zoomOut} className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-white/10' : 'hover:bg-black/5'}`}>
                    <ZoomOut size={16} />
                </button>
                <button onClick={zoomIn} className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-white/10' : 'hover:bg-black/5'}`}>
                    <ZoomIn size={16} />
                </button>
            </div>
        </div>
    );
};



const AiOpsNodeGraph: React.FC<{ mode: 'as-is' | 'to-be', isDark: boolean, teamCount: number, teamMembers: number }> = ({ mode, isDark, teamCount, teamMembers }) => {
    const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
    const containerRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);
    const lastPos = useRef({ x: 0, y: 0 });
    const [hoveredLine, setHoveredLine] = useState<string | null>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    const handleMouseMoveLine = (e: React.MouseEvent, tooltip: string) => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
            setHoveredLine(tooltip);
        }
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        isDragging.current = true;
        lastPos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging.current) return;
        const dx = e.clientX - lastPos.current.x;
        const dy = e.clientY - lastPos.current.y;
        setTransform(prev => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
        lastPos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
        isDragging.current = false;
    };

    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            const preventDefaultWheel = (e: WheelEvent) => e.preventDefault();
            container.addEventListener('wheel', preventDefaultWheel, { passive: false });
            return () => container.removeEventListener('wheel', preventDefaultWheel);
        }
    }, []);

    const resetZoom = () => setTransform({ x: 0, y: 0, scale: 1 });
    const zoomIn = () => setTransform(prev => ({ ...prev, scale: Math.min(prev.scale + 0.2, 2) }));
    const zoomOut = () => setTransform(prev => ({ ...prev, scale: Math.max(prev.scale - 0.2, 0.6) }));

    const numRects = Math.min(teamCount < 3 ? teamMembers : teamCount, 8);

    const rects = React.useMemo(() => Array.from({ length: numRects }).map((_, i) => ({
        id: `rect-${i}`,
        label: teamCount < 3 ? `팀원 ${i + 1}` : `팀 ${i + 1}`,
        type: 'rect'
    })), [numRects, teamCount]);

    const aiNodes = React.useMemo(() => [
        { id: 'ai-1', label: 'Open AI', type: 'rounded' },
        { id: 'ai-2', label: 'Gemini', type: 'rounded' },
        { id: 'ai-3', label: 'Claude', type: 'rounded' },
        { id: 'ai-4', label: 'Figma', type: 'rounded' },
        { id: 'ai-5', label: 'Manifesto', type: 'rounded' },
    ], []);

    const accountingNode = { id: 'accounting', label: '회계팀', type: 'small-rect' };
    const gridgeNode = { id: 'gridge', label: 'AiMSP', type: 'blue-rounded' };

    const positions = React.useMemo(() => {
        const pos: Record<string, { asIs: { x: number, y: number }, toBe: { x: number, y: number } }> = {};

        const asIsRectPos = [
            { x: 150, y: 100 }, { x: 650, y: 120 }, { x: 200, y: 250 }, { x: 600, y: 280 },
            { x: 100, y: 400 }, { x: 700, y: 420 }, { x: 300, y: 150 }, { x: 500, y: 150 }
        ];

        const rectSpacing = 160;
        const startX = 400 - ((numRects - 1) * rectSpacing) / 2;

        rects.forEach((r, i) => {
            pos[r.id] = {
                asIs: asIsRectPos[i % asIsRectPos.length],
                toBe: { x: startX + i * rectSpacing, y: 100 }
            };
        });

        pos['accounting'] = {
            asIs: { x: 400, y: 180 },
            toBe: { x: 400, y: 220 }
        };

        pos['gridge'] = {
            asIs: { x: 400, y: 600 },
            toBe: { x: 400, y: 340 }
        };

        const asIsAiPos = [
            { x: 300, y: 300 }, { x: 500, y: 320 }, { x: 400, y: 420 }, { x: 250, y: 450 }, { x: 550, y: 450 }
        ];

        const aiSpacing = 140;
        const aiStartX = 400 - ((aiNodes.length - 1) * aiSpacing) / 2;

        aiNodes.forEach((ai, i) => {
            pos[ai.id] = {
                asIs: asIsAiPos[i % asIsAiPos.length],
                toBe: { x: aiStartX + i * aiSpacing, y: 480 }
            };
        });

        return pos;
    }, [numRects, rects, aiNodes]);

    const asIsConnections = React.useMemo(() => {
        const conns: { from: string, to: string }[] = [];
        rects.forEach(r => {
            conns.push({ from: r.id, to: 'accounting' });
        });
        [...rects, accountingNode].forEach(node => {
            const numAIs = Math.floor(Math.random() * 2) + 1;
            const shuffledAIs = [...aiNodes].sort(() => 0.5 - Math.random());
            for (let i = 0; i < numAIs; i++) {
                conns.push({ from: node.id, to: shuffledAIs[i].id });
            }
        });
        return conns;
    }, [rects, aiNodes]);

    const renderNode = (node: any, pos: { x: number, y: number }) => {
        let className = "absolute flex items-center justify-center transition-all duration-700 ease-in-out border-2 z-10 ";
        if (node.type === 'rect') className += `w-32 h-16 rounded-lg ${isDark ? 'bg-[#111] text-white border-white/20' : 'bg-white text-black border-black/20'}`;
        else if (node.type === 'small-rect') className += `w-24 h-12 rounded-lg ${isDark ? 'bg-[#111] text-white border-white/20' : 'bg-white text-black border-black/20'}`;
        else if (node.type === 'rounded') className += `w-28 h-14 rounded-full ${isDark ? 'bg-[#111] text-white border-white/20' : 'bg-white text-black border-black/20'}`;
        else if (node.type === 'blue-rounded') className += `w-32 h-16 rounded-full bg-blue-500 text-white border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.6)] ${mode === 'to-be' ? 'animate-pulse' : ''}`;

        const isGridge = node.id === 'gridge';
        const opacity = mode === 'as-is' && isGridge ? 0 : 1;
        const pointerEvents = mode === 'as-is' && isGridge ? 'none' : 'auto';

        return (
            <div
                key={node.id}
                className={className}
                style={{
                    left: pos.x,
                    top: pos.y,
                    transform: 'translate(-50%, -50%)',
                    opacity,
                    pointerEvents
                }}
            >
                <div className="text-xs font-bold text-center px-2">{node.label}</div>
            </div>
        );
    };

    const renderLine = (from: { x: number, y: number }, to: { x: number, y: number }, id: string, tooltip?: string, isArrowToFrom: boolean = false, drawDelay: number = 0, noPulse: boolean = false) => {
        const midY = from.y + (to.y - from.y) / 2;
        const d = mode === 'to-be'
            ? `M ${from.x} ${from.y} C ${from.x} ${midY}, ${to.x} ${midY}, ${to.x} ${to.y}`
            : `M ${from.x} ${from.y} Q ${from.x + (to.x - from.x) / 2} ${from.y + (to.y - from.y) / 2 - 50} ${to.x} ${to.y}`;

        const isToBe = mode === 'to-be';

        return (
            <g key={id}>
                <path
                    d={d}
                    fill="none"
                    stroke={isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'}
                    strokeWidth="1"
                    className={`transition-all duration-700 ease-in-out`}
                    style={isToBe ? {
                        strokeDasharray: 1000,
                        strokeDashoffset: 1000,
                        animation: `drawLine 1s ease-in-out forwards`,
                        animationDelay: `${drawDelay}ms`
                    } : {}}
                    markerEnd={!isArrowToFrom ? "url(#arrowhead)" : undefined}
                    markerStart={isArrowToFrom ? "url(#arrowhead-start)" : undefined}
                />
                {isToBe && !noPulse && (
                    <path
                        d={d}
                        fill="none"
                        stroke={isDark ? 'rgba(59,130,246,0.6)' : 'rgba(59,130,246,0.6)'}
                        strokeWidth="2"
                        strokeDasharray="4 12"
                        className="opacity-0"
                        style={{
                            animation: `flowLine 20s linear infinite, fadeIn 0.5s ease-in-out forwards`,
                            animationDelay: `0s, ${drawDelay + 1000}ms`
                        }}
                    />
                )}
                {tooltip && mode === 'to-be' && (
                    <path
                        d={d}
                        fill="none"
                        stroke="transparent"
                        strokeWidth="20"
                        className="cursor-pointer pointer-events-auto"
                        onMouseEnter={(e) => handleMouseMoveLine(e, tooltip)}
                        onMouseMove={(e) => handleMouseMoveLine(e, tooltip)}
                        onMouseLeave={() => setHoveredLine(null)}
                    />
                )}
            </g>
        );
    };

    return (
        <div
            ref={containerRef}
            className="w-full h-full relative overflow-hidden cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            <svg className="absolute w-0 h-0">
                <defs>
                    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill={isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'} />
                    </marker>
                    <marker id="arrowhead-start" markerWidth="10" markerHeight="7" refX="1" refY="3.5" orient="auto">
                        <polygon points="10 0, 0 3.5, 10 7" fill={isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'} />
                    </marker>
                </defs>
            </svg>
            <style>{`
                @keyframes drawLine {
                    to { stroke-dashoffset: 0; }
                }
                @keyframes flowLine {
                    to { stroke-dashoffset: -1000; }
                }
                @keyframes fadeIn {
                    to { opacity: 1; }
                }
            `}</style>

            <div
                className="absolute top-1/2 left-1/2 w-0 h-0"
                style={{ transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})` }}
            >
                <div className="relative w-[800px] h-[600px] -translate-x-1/2 -translate-y-1/2">
                    <svg className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-visible z-0">
                        {mode === 'as-is' ? (
                            asIsConnections.map((conn, i) => {
                                const fromPos = positions[conn.from].asIs;
                                const toPos = positions[conn.to].asIs;
                                return renderLine(fromPos, toPos, `asis-${i}`);
                            })
                        ) : (
                            <>
                                {rects.map((r, i) => renderLine(positions[r.id].toBe, positions['accounting'].toBe, `tobe-acc-${i}`, undefined, false, 700, true))}
                                {renderLine(positions['accounting'].toBe, positions['gridge'].toBe, 'tobe-gridge-acc', 'token 10% 페이백/할인.', true, 1200, true)}
                                {rects.map((r, i) => renderLine(positions[r.id].toBe, positions['gridge'].toBe, `tobe-gridge-${i}`, 'Ai 활용 보고/제안서, AI 전문가 컨설팅 제공', false, 1200))}
                                {aiNodes.map((ai, i) => renderLine(positions['gridge'].toBe, positions[ai.id].toBe, `tobe-ai-${i}`, '효율화된 프롬프트/AI 호출', false, 1700))}
                            </>
                        )}
                    </svg>

                    {[...rects, accountingNode, gridgeNode, ...aiNodes].map(node =>
                        renderNode(node, mode === 'as-is' ? positions[node.id].asIs : positions[node.id].toBe)
                    )}
                </div>
            </div>

            {hoveredLine && (
                <div
                    className="absolute z-50 px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-bold shadow-xl pointer-events-none whitespace-nowrap"
                    style={{ left: mousePos.x + 15, top: mousePos.y + 15 }}
                >
                    {hoveredLine}
                </div>
            )}

            <div className={`absolute bottom-6 left-6 flex items-center gap-2 p-1.5 rounded-xl backdrop-blur-md border ${isDark ? 'bg-black/40 border-white/10' : 'bg-white/40 border-black/10'}`}>
                <button onClick={resetZoom} className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-white/10' : 'hover:bg-black/5'}`} title="100%">
                    <Maximize size={16} />
                </button>
                <div className={`w-px h-4 ${isDark ? 'bg-white/20' : 'bg-black/20'}`} />
                <button onClick={zoomOut} className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-white/10' : 'hover:bg-black/5'}`} title="Zoom Out">
                    <ZoomOut size={16} />
                </button>
                <button onClick={zoomIn} className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-white/10' : 'hover:bg-black/5'}`} title="Zoom In">
                    <ZoomIn size={16} />
                </button>
                <div className={`px-2 text-xs font-mono opacity-50`}>
                    {Math.round(transform.scale * 100)}%
                </div>
            </div>
        </div>
    );
};

const IA_TEMPLATES = [
    {
        title: "헬스케어 - AI 검사결과 자동 해석 및 환자용 설명 생성 SaaS",
        root: {
            id: "root", label: "헬스케어 SaaS",
            children: [
                { id: "common", label: "공통", children: [{ id: "auth", label: "인증 (SSO 로그인, 병원/환자 다중 권한)" }] },
                {
                    id: "doctor", label: "의료진", children: [
                        { id: "doc_dash", label: "메인 대시보드", children: [{ id: "dash_alert", label: "고위험군 실시간 알림 (AI 사전 분류)" }, { id: "dash_list", label: "최근 검사 데이터 목록" }] },
                        { id: "doc_data", label: "데이터 센터", children: [{ id: "data_upload", label: "검사 결과 업로드 (PDF/Image OCR 처리)" }, { id: "data_emr", label: "EMR 자동 동기화 서버" }] },
                        { id: "doc_ai", label: "AI 진단 보조", children: [{ id: "ai_vision", label: "X-ray/MRI 이상 병변 추출 (Vision AI)" }, { id: "ai_nlp", label: "의학 용어 의도 추출 및 정규화 (NLP)" }, { id: "ai_predict", label: "발병 리스크 시뮬레이션" }] },
                        { id: "doc_report", label: "리포트 자동 생성", children: [{ id: "rep_gen", label: "환자용 쉬운 요약본 자동 변환 (LLM)" }, { id: "rep_custom", label: "의료진 코멘트 추가 및 승인 프로세스" }] }
                    ]
                },
                {
                    id: "patient", label: "환자", children: [
                        { id: "pat_result", label: "결과 확인", children: [{ id: "res_score", label: "종합 건강 점수 및 부위별 위험도 시각화" }, { id: "res_diff", label: "과거 이력 대비 건강 변화 추이 그래프" }] },
                        { id: "pat_qna", label: "AI 의료 비서", children: [{ id: "qna_chat", label: "내 결과 기반 24시간 질의응답 (RAG 챗봇)" }, { id: "qna_guide", label: "질환 맞춤형 식단 및 운동 액션 플랜 생선" }] }
                    ]
                }
            ]
        }
    },
    {
        title: "커머스 - AI 수요예측 기반 자동 발주(Auto-Order) 시스템",
        root: {
            id: "root", label: "커머스 발주 시스템",
            children: [
                {
                    id: "dash", label: "통합 대시보드", children: [
                        { id: "dash_predict", label: "AI 예측 요약", children: [{ id: "pred_short", label: "단기 수요 급증 예상 품목 실시간 모니터링" }, { id: "pred_risk", label: "품절 및 재고 과잉 위험 사전 경고" }] }
                    ]
                },
                {
                    id: "product", label: "스마트 재고 관리", children: [
                        { id: "prod_list", label: "SKU 모니터링", children: [{ id: "sku_ai", label: "머신러닝 기반 적정 재고량 자동 산출" }] },
                        { id: "prod_model", label: "수요 예측 모델", children: [{ id: "mod_train", label: "과거 판매 데이터 연동 및 모델 재평가" }, { id: "mod_feat", label: "외부 변수 (날씨/검색 트렌드) 가중치 분석" }] }
                    ]
                },
                {
                    id: "order", label: "자동 발주 모델링", children: [
                        { id: "order_propose", label: "AI 발주 최적화", children: [{ id: "opt_qty", label: "리드타임 고려 최적 발주량 제안 (강화학습)" }, { id: "opt_cost", label: "물류 및 보관 비용 최소화 시뮬레이터" }] },
                        { id: "order_erp", label: "발주 자동화 실행", children: [{ id: "erp_sync", label: "공급사별 발주 시스템 API 자동 전송" }, { id: "erp_track", label: "발주 진행 상태 실시간 트래킹" }] }
                    ]
                }
            ]
        }
    },
    {
        title: "제조 - AI 비전 검사 자동화 파이프라인 (MLOps)",
        root: {
            id: "root", label: "제조 품질 검사 AI",
            children: [
                { id: "dash", label: "모니터링 대시보드", children: [{ id: "dash_rt", label: "실시간 라인 중앙 통제", children: [{ id: "rt_yield", label: "실시간 수율 및 제품 불량률 감지" }, { id: "rt_alert", label: "연속 불량 패턴 발생 시 긴급 알람" }] }] },
                {
                    id: "inspect", label: "AI 품질 검사 (Edge)", children: [
                        { id: "ins_vision", label: "Vision AI 검출", children: [{ id: "vi_defect", label: "미세 크랙/스크래치 자동 마스킹" }, { id: "vi_class", label: "결함 유형별 다중 분류 모델링(Multi-class)" }] },
                        { id: "ins_view", label: "판정 결과 UI", children: [{ id: "vw_high", label: "결함 위치 하이라이트 및 신뢰도 Score 표시" }] }
                    ]
                },
                {
                    id: "model", label: "MLOps 파이프라인", children: [
                        { id: "ml_data", label: "데이터 플라이휠", children: [{ id: "dt_col", label: "불량 이미지 자동 수집 및 정제 시스템" }, { id: "dt_label", label: "AI 보조 반자동 레이블링 툴 (Active Learning)" }] },
                        { id: "ml_train", label: "지속적 모델 배포", children: [{ id: "tr_retrain", label: "정확도 하락(Drift) 감지 및 재학습 요청" }, { id: "tr_deploy", label: "Edge Device 모델 무중단 리모트 배포 (OTA)" }] }
                    ]
                }
            ]
        }
    },
    {
        title: "스마트오피스 - RAG 기반 사내 규정 탐색 및 업무 자동화 Agent",
        root: {
            id: "root", label: "사내 업무 Agent",
            children: [
                {
                    id: "chat", label: "AI 업무 비서 (Frontend)", children: [
                        { id: "chat_rag", label: "지식 검색 (RAG)", children: [{ id: "rag_doc", label: "사내 문서(Notion/Drive) 실시간 통합 검색" }, { id: "rag_ask", label: "자연어 질의를 통한 복리후생/규정 근거 답변" }] },
                        { id: "chat_action", label: "액션 에이전트", children: [{ id: "act_req", label: "단순 양식(휴가/지출결의) 자동 기입 및 상신" }, { id: "act_route", label: "질의 의도 파악 후 적합한 담당자 자동 멘션" }] }
                    ]
                },
                {
                    id: "admin", label: "지식 관리자 (Backend)", children: [
                        { id: "adm_sync", label: "사내 지식 베이스 동기화", children: [{ id: "dt_sync", label: "신규 규정 업데이트 시 Vector DB 스케줄링 처리" }] },
                        { id: "adm_stat", label: "활용 통계 모니터링", children: [{ id: "st_unsolved", label: "미해결 질의(Unanswered) 핵심 키워드 클러스터링" }, { id: "st_hall", label: "환각(Hallucination) 의심 답변 모니터링 로그" }] }
                    ]
                }
            ]
        }
    }
];

const TreeNode: React.FC<{ node: any, isDark: boolean }> = ({ node, isDark }) => {
    return (
        <div className="flex items-center">
            <div className={`px-4 py-2 rounded-lg border-2 text-xs md:text-sm font-bold whitespace-nowrap z-10 transition-all duration-500 ${isDark ? 'bg-[#0a0a0a] border-white/20 text-white' : 'bg-white border-black/20 text-black'} ${node.isNew ? 'border-blue-500 bg-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.5)]' : ''}`}>
                {node.label}
            </div>
            {node.children && node.children.length > 0 && (
                <div className="flex items-center">
                    <div className={`w-6 h-px ${isDark ? 'bg-white/20' : 'bg-black/20'}`} />
                    <div className="flex flex-col">
                        {node.children.map((child: any, idx: number) => {
                            const isFirst = idx === 0;
                            const isLast = idx === node.children.length - 1;
                            const isOnly = node.children.length === 1;

                            return (
                                <div key={child.id} className="flex items-stretch relative">
                                    <div className="w-6 relative shrink-0">
                                        {!isOnly && isFirst && (
                                            <div className={`absolute left-0 top-1/2 bottom-0 w-full border-l-2 border-t-2 rounded-tl-lg ${isDark ? 'border-white/20' : 'border-black/20'}`} />
                                        )}
                                        {!isOnly && isLast && (
                                            <div className={`absolute left-0 top-0 bottom-1/2 w-full border-l-2 border-b-2 rounded-bl-lg ${isDark ? 'border-white/20' : 'border-black/20'}`} />
                                        )}
                                        {!isOnly && !isFirst && !isLast && (
                                            <>
                                                <div className={`absolute left-0 top-0 bottom-0 border-l-2 ${isDark ? 'border-white/20' : 'border-black/20'}`} />
                                                <div className={`absolute left-0 top-1/2 w-full border-t-2 ${isDark ? 'border-white/20' : 'border-black/20'}`} />
                                            </>
                                        )}
                                        {isOnly && (
                                            <div className={`absolute left-0 top-1/2 w-full border-t-2 ${isDark ? 'border-white/20' : 'border-black/20'}`} />
                                        )}
                                    </div>
                                    <div className="py-2">
                                        <TreeNode node={child} isDark={isDark} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}

const NodeMapCanvas: React.FC<{ currentIA: any, isDark: boolean }> = ({ currentIA, isDark }) => {
    const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
    const [isDragging, setIsDragging] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setStartPos({ x: e.clientX - transform.x, y: e.clientY - transform.y });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        setTransform(prev => ({ ...prev, x: e.clientX - startPos.x, y: e.clientY - startPos.y }));
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();
            const scaleAmount = -e.deltaY * 0.001;
            setTransform(prev => {
                const newScale = Math.min(Math.max(0.6, prev.scale + scaleAmount), 2);
                return { ...prev, scale: newScale };
            });
        };

        container.addEventListener('wheel', handleWheel, { passive: false });
        return () => container.removeEventListener('wheel', handleWheel);
    }, []);

    const resetZoom = () => setTransform({ x: 0, y: 0, scale: 1 });
    const zoomIn = () => setTransform(prev => ({ ...prev, scale: Math.min(prev.scale + 0.2, 2) }));
    const zoomOut = () => setTransform(prev => ({ ...prev, scale: Math.max(prev.scale - 0.2, 0.6) }));

    return (
        <div
            ref={containerRef}
            className="w-full h-full overflow-hidden cursor-grab active:cursor-grabbing relative"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: isDark
                        ? `linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)`
                        : `linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)`,
                    backgroundSize: `${40 * transform.scale}px ${40 * transform.scale}px`,
                    backgroundPosition: `${transform.x}px ${transform.y}px`
                }}
            />
            <div
                className="absolute transition-transform duration-75 ease-linear origin-center"
                style={{ transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`, left: '50%', top: '50%' }}
            >
                <div className="p-8 min-w-max -translate-x-1/2 -translate-y-1/2">
                    <h3 className="text-2xl font-black mb-12 text-blue-400 pointer-events-none text-center">{currentIA.title}</h3>
                    <div className="flex justify-center">
                        <TreeNode node={currentIA.root} isDark={isDark} />
                    </div>
                </div>
            </div>

            {/* Zoom Controls */}
            <div className={`absolute bottom-6 left-6 flex items-center gap-2 p-1.5 rounded-xl backdrop-blur-md border ${isDark ? 'bg-black/40 border-white/10' : 'bg-white/40 border-black/10'}`}>
                <button onClick={resetZoom} className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-white/10' : 'hover:bg-black/5'}`} title="100%">
                    <Maximize size={16} />
                </button>
                <div className={`w-px h-4 ${isDark ? 'bg-white/20' : 'bg-black/20'}`} />
                <button onClick={zoomOut} className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-white/10' : 'hover:bg-black/5'}`} title="Zoom Out">
                    <ZoomOut size={16} />
                </button>
                <button onClick={zoomIn} className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-white/10' : 'hover:bg-black/5'}`} title="Zoom In">
                    <ZoomIn size={16} />
                </button>
                <div className={`px-2 text-xs font-mono opacity-50`}>
                    {Math.round(transform.scale * 100)}%
                </div>
            </div>
        </div>
    );
};

export const CaseStudyWizard: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    theme: 'dark' | 'light';
    lang: Language;
    zIndex?: number;
    onFocus?: () => void;
    onOpenContactWizard?: (initialTypes: string[]) => void;
}> = ({ isOpen, onClose, theme, lang, zIndex = 100, onFocus, onOpenContactWizard }) => {
    const isDark = theme === 'dark';
    const borderColor = isDark ? 'border-white/20' : 'border-black/10';
    const bgColor = isDark ? 'bg-black/90' : 'bg-white/90';
    const textColor = isDark ? 'text-white' : 'text-black';
    const t = TRANSLATIONS[lang || 'ko'].caseStudy;
    // const IA_TEMPLATES = t.iaTemplates;

    const [step, setStep] = useState<'initial' | 'ax_scenario' | 'ia_generation' | 'chatting' | 'workflow_view' | 'aiops_simulation' | 'diagnosis_chat' | 'ax_preparing'>('initial');
    const [selectedInitial, setSelectedInitial] = useState<number | null>(null);
    const [selectedAx, setSelectedAx] = useState<number | null>(null);
    const [activeToggle, setActiveToggle] = useState<'AX' | 'AiOPS' | null>(null);
    const [nodeMapModalText, setNodeMapModalText] = useState<string | null>(t.axNodeMapTexts[1]);
    const [chatMessages, setChatMessages] = useState<{ role: 'ai' | 'user', text: string }[]>([]);
    const [modificationCount, setModificationCount] = useState(0);
    const [currentIA, setCurrentIA] = useState<any>(null);
    const [isTyping, setIsTyping] = useState(false);
    const [chatInput, setChatInput] = useState('');
    const [animatingCards, setAnimatingCards] = useState(false);
    const [workflowMode, setWorkflowMode] = useState<'as-is' | 'to-be'>('as-is');
    const [selectedWorkflowNode, setSelectedWorkflowNode] = useState<any>(null);

    const [aiOpsStep, setAiOpsStep] = useState<'input' | 'simulation'>('input');
    const [aiOpsInputs, setAiOpsInputs] = useState({
        teamMembers: '',
        aiUsers: '',
        monthlyCost: '',
        teamCount: ''
    });

    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [chatMessages, isTyping]);

    const handleInitialSelect = async (id: number) => {
        setAnimatingCards(true);
        setSelectedInitial(id);

        await new Promise(r => setTimeout(r, 1000));

        if (id === 1) {
            setActiveToggle('AX');
            setNodeMapModalText(t.axNodeMapTexts[0]);
            await new Promise(r => setTimeout(r, 1000));
            setStep('ax_scenario');
            setAnimatingCards(false);
        } else if (id === 2) {
            setActiveToggle('AiOPS');
            setNodeMapModalText(t.axNodeMapTexts[1]);
            await new Promise(r => setTimeout(r, 1000));
            setStep('aiops_simulation');
            setAnimatingCards(false);
        } else if (id === 3) {
            setActiveToggle(null);
            setNodeMapModalText(t.axNodeMapTexts[2]);
            await new Promise(r => setTimeout(r, 1000));
            setStep('diagnosis_chat');
            setChatMessages([
                { role: 'ai', text: t.diagnosisInitMsg }
            ]);
            setAnimatingCards(false);
        }
    };

    const handleAxSelect = async (id: number) => {
        setSelectedAx(id);

        await new Promise(r => setTimeout(r, 1000)); // Wait for cards to slide out

        if (id === 1) { // AI 기반 신규 서비스
            const randomIA = IA_TEMPLATES[Math.floor(Math.random() * IA_TEMPLATES.length)];
            setCurrentIA(randomIA);
            setStep('ia_generation');

            await new Promise(r => setTimeout(r, 1000));
            setStep('chatting');

            // Start AI Chat
            setIsTyping(true);
            await new Promise(r => setTimeout(r, 1500));
            setIsTyping(false);
            setChatMessages([
                { role: 'ai', text: t.chatInitMsg1.replace('{title}', randomIA.title) },
                { role: 'ai', text: t.chatInitMsg2 }
            ]);
        } else if (id === 2) { // 내부 AI 인프라 개선
            setStep('workflow_view');
        } else if (id === 3 || id === 4) { // RAG 구축 or 업무 자동화
            setStep('ax_preparing');
        }
    };

    const handleSendMessage = async () => {
        if (!chatInput.trim()) return;

        const userMsg = chatInput;
        setChatInput('');
        setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);

        if (modificationCount >= 1) {
            setIsTyping(true);
            await new Promise(r => setTimeout(r, 1500));
            setIsTyping(false);

            setChatMessages(prev => [...prev,
            { role: 'ai', text: t.chatBusyMsg1 },
            { role: 'ai', text: t.chatBusyMsg2 }
            ]);
            setModificationCount(prev => prev + 1);
        } else {
            if (userMsg.includes('새로운') || userMsg.includes('다른') || userMsg.includes('처음부터') || userMsg.includes('새로')) {
                setIsTyping(true);
                await new Promise(r => setTimeout(r, 500));

                // Step a
                setChatMessages(prev => [...prev, { role: 'ai', text: 'a. 요구사항 서비스 분석 중...' }]);

                const aiPromise = (async () => {
                    try {
                        const response = await fetch('/api/generate', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                model: "gemini-3-flash-preview",
                                contents: `사용자의 다음 요청을 바탕으로 서비스의 Information Architecture(IA)를 구성해주세요.\n요청: ${userMsg}`,
                                config: {
                                    systemInstruction: "당신은 10년차 B2B 전문 UX/UI 기획자이자 AI 아키텍트입니다. 사용자의 요구사항을 깊이 있게 분석하고, 서비스의 모든 세부 기능과 화면 단위까지 추측하여, 매우 구체적이고 체계적인 IA(Information Architecture)를 구상합니다. 중요: 최소 3 depth 이상의 상세한 구조(예: 대분류 > 중분류 > AI 기능/데이터)를 반드시 만들어야 하며, 각 노드의 텍스트에는 AI가 어떻게 작동하는지(예: RAG, Vision AI, LLM 등 기술 요소) 명확히 드러나도록 작성해야 합니다.",
                                    responseMimeType: "application/json",
                                    responseSchema: {
                                        type: Type.OBJECT,
                                        properties: {
                                            title: { type: Type.STRING, description: "서비스의 제목" },
                                            root: {
                                                type: Type.OBJECT,
                                                description: "IA의 루트 노드",
                                                properties: {
                                                    id: { type: Type.STRING },
                                                    label: { type: Type.STRING, description: "루트 노드 이름 (예: 서비스명)" },
                                                    children: {
                                                        type: Type.ARRAY,
                                                        description: "최상위 메뉴들",
                                                        items: {
                                                            type: Type.OBJECT,
                                                            properties: {
                                                                id: { type: Type.STRING },
                                                                label: { type: Type.STRING, description: "메뉴 이름" },
                                                                children: {
                                                                    type: Type.ARRAY,
                                                                    description: "하위 메뉴들",
                                                                    items: {
                                                                        type: Type.OBJECT,
                                                                        properties: {
                                                                            id: { type: Type.STRING },
                                                                            label: { type: Type.STRING, description: "하위 메뉴 이름" },
                                                                            isNew: { type: Type.BOOLEAN, description: "항상 true로 설정" },
                                                                            children: {
                                                                                type: Type.ARRAY,
                                                                                description: "최하위 단위 (구체적인 AI 기술/기능 설명)",
                                                                                items: {
                                                                                    type: Type.OBJECT,
                                                                                    properties: {
                                                                                        id: { type: Type.STRING },
                                                                                        label: { type: Type.STRING, description: "예: 머신러닝 기반 재고량 예측" },
                                                                                        isNew: { type: Type.BOOLEAN, description: "항상 true로 설정" }
                                                                                    },
                                                                                    required: ["id", "label", "isNew"]
                                                                                }
                                                                            }
                                                                        },
                                                                        required: ["id", "label", "children"]
                                                                    }
                                                                }
                                                            },
                                                            required: ["id", "label", "children"]
                                                        }
                                                    }
                                                },
                                                required: ["id", "label", "children"]
                                            }
                                        },
                                        required: ["title", "root"]
                                    }
                                }
                            })
                        });
                        if (!response.ok) throw new Error('Failed to generate IA');
                        const data = await response.json();
                        if (data.text) return JSON.parse(data.text);
                    } catch (e) {
                        console.error(e);
                    }
                    return null;
                })();

                await new Promise(r => setTimeout(r, 1000));

                // Step b
                setChatMessages(prev => [...prev, { role: 'ai', text: 'b. 기획 내용으로부터 서비스 내용 추측 중...' }]);
                await new Promise(r => setTimeout(r, 1000));

                // Step c
                setChatMessages(prev => [...prev, { role: 'ai', text: 'c. 해당 서비스의 IA 구상 중...' }]);

                const generatedIA = await aiPromise;

                // Step d
                setChatMessages(prev => [...prev, { role: 'ai', text: 'd. 그에 따르는 IA 시각화 완료.' }]);
                await new Promise(r => setTimeout(r, 500));
                setIsTyping(false);

                if (generatedIA) {
                    setCurrentIA(generatedIA);
                    setChatMessages(prev => [...prev, { role: 'ai', text: `요청하신 내용에 맞춰 완전히 새로운 '${generatedIA.title}'의 IA를 구성해 보았습니다. 왼쪽 노드 맵을 확인해 주세요.\n\n본 AI는 체험을 위해 단순화된 모델이며, 실제 서비스에서는 전문가와 AI가 협업하여 더욱 수준 높은 서비스를 제공해 드립니다.` }]);
                } else {
                    setChatMessages(prev => [...prev, { role: 'ai', text: `죄송합니다. IA 생성 중 오류가 발생했습니다.\n\n본 AI는 체험을 위해 단순화된 모델이며, 실제 서비스에서는 전문가와 AI가 협업하여 더욱 수준 높은 서비스를 제공해 드립니다.` }]);
                }
            } else {
                setIsTyping(true);
                setChatMessages(prev => [...prev, { role: 'ai', text: '요청사항을 분석하여 기존 IA를 업데이트하는 중...' }]);

                try {
                    const response = await fetch('/api/generate', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            model: "gemini-3-flash-preview",
                            contents: `현재 IA 구조:\n${JSON.stringify(currentIA)}\n\n사용자 요청: ${userMsg}\n\n위 요청을 반영하여 기존 IA 구조를 업데이트해주세요. 새로 추가되거나 변경된 노드에는 isNew: true 속성을 추가해주세요.`,
                            config: {
                                systemInstruction: "당신은 10년차 B2B 전문 UX/UI 기획자이자 AI 아키텍트입니다. 사용자의 요구사항을 깊이 있게 분석하여 기존 IA(Information Architecture)를 매우 구체적으로 업데이트합니다. 중요: 최소 3 depth 이상의 상세한 구조(예: 대분류 > 중분류 > AI 기능/데이터)를 반드시 만들어야 하며, 각 노드의 텍스트에는 AI가 어떻게 작동하는지(예: RAG, Vision AI, LLM 등 기술 요소) 명확히 드러나도록 작성해야 합니다.",
                                responseMimeType: "application/json",
                                responseSchema: {
                                    type: Type.OBJECT,
                                    properties: {
                                        title: { type: Type.STRING },
                                        root: {
                                            type: Type.OBJECT,
                                            properties: {
                                                id: { type: Type.STRING },
                                                label: { type: Type.STRING },
                                                children: {
                                                    type: Type.ARRAY,
                                                    items: {
                                                        type: Type.OBJECT,
                                                        properties: {
                                                            id: { type: Type.STRING },
                                                            label: { type: Type.STRING },
                                                            isNew: { type: Type.BOOLEAN },
                                                            children: {
                                                                type: Type.ARRAY,
                                                                items: {
                                                                    type: Type.OBJECT,
                                                                    properties: {
                                                                        id: { type: Type.STRING },
                                                                        label: { type: Type.STRING },
                                                                        isNew: { type: Type.BOOLEAN },
                                                                        children: {
                                                                            type: Type.ARRAY,
                                                                            items: {
                                                                                type: Type.OBJECT,
                                                                                properties: {
                                                                                    id: { type: Type.STRING },
                                                                                    label: { type: Type.STRING },
                                                                                    isNew: { type: Type.BOOLEAN }
                                                                                },
                                                                                required: ["id", "label", "isNew"]
                                                                            }
                                                                        }
                                                                    },
                                                                    required: ["id", "label", "isNew", "children"]
                                                                }
                                                            }
                                                        },
                                                        required: ["id", "label", "isNew", "children"]
                                                    }
                                                }
                                            },
                                            required: ["id", "label", "children"]
                                        }
                                    },
                                    required: ["title", "root"]
                                }
                            }
                        })
                    });

                    if (!response.ok) throw new Error("Failed to update IA");
                    const data = await response.json();

                    if (data.text) {
                        const updatedIA = JSON.parse(data.text);
                        setCurrentIA(updatedIA);
                        setChatMessages(prev => [...prev, { role: 'ai', text: '요청하신 내용을 반영하여 IA를 업데이트했습니다. 왼쪽 노드 맵에 하이라이트된 신규 기능을 확인해 보세요.\n\n본 AI는 체험을 위해 단순화된 모델이며, 실제 서비스에서는 전문가와 AI가 협업하여 더욱 수준 높은 서비스를 제공해 드립니다.' }]);
                    } else {
                        throw new Error("No response text");
                    }
                } catch (e) {
                    console.error(e);
                    setChatMessages(prev => [...prev, { role: 'ai', text: 'IA 업데이트 중 오류가 발생했습니다.\n\n본 AI는 체험을 위해 단순화된 모델이며, 실제 서비스에서는 전문가와 AI가 협업하여 더욱 수준 높은 서비스를 제공해 드립니다.' }]);
                }

                setIsTyping(false);
            }
            setModificationCount(prev => prev + 1);
        }
    };

    const handleAiOpsInput = (field: string, value: string) => {
        setAiOpsInputs(prev => {
            const next = { ...prev, [field]: value };
            const users = parseInt(next.aiUsers) || 0;
            if (users > 0) {
                if (users < 10) {
                    setNodeMapModalText('현재 상태는 개인 단위 사용 단계입니다.');
                } else {
                    setNodeMapModalText('운영 정렬이 필요한 단계입니다.');
                }
            } else {
                setNodeMapModalText('지금 현재 상태를 선택해 주세요 ->');
            }
            return next;
        });
    };

    const startAiOpsSimulation = () => {
        setNodeMapModalText(null);
        setWorkflowMode('as-is');
        setAiOpsStep('simulation');
    };

    const handleDiagnosisMessage = async () => {
        if (!chatInput.trim()) return;

        const userMsg = chatInput;
        setChatInput('');
        setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setIsTyping(true);

        try {
            const contents = chatMessages.map(m => ({
                role: m.role === 'ai' ? 'model' : 'user',
                parts: [{ text: m.text }]
            }));
            contents.push({ role: 'user', parts: [{ text: userMsg }] });

            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: "gemini-3-flash-preview",
                    contents: contents,
                    config: {
                        systemInstruction: `당신은 AI 도입 상태를 진단하는 전문 컨설턴트입니다.
다음 순서대로 질문을 하나씩 던지며 사용자의 상태를 파악하세요. 한 번에 하나의 질문만 해야 합니다.

[진단 질문 목록]
1. 팀 단위 AI 사용 집계가 가능한가요?
2. 월 AI 비용을 명확하게 설명할 수 있나요?
3. AI 결과물에 대한 Human 검토 구조가 마련되어 있나요?
4. 특정 개인에 대한 AI 활용 의존도가 낮은 편인가요? (누구나 잘 활용하나요?)
5. AI 활용이 회사의 비즈니스 전략과 연결되어 있나요?

[중요 지침]
- 사용자에게 '예/아니오' 단답형을 강요하지 말고, 자연스럽게 대화를 이끌어주세요.
- 사용자가 질문의 의도를 묻거나 다른 질문을 하면, 친절하고 상세하게 설명해 준 뒤 다시 원래의 진단 질문으로 자연스럽게 돌아오세요.
- 답변이 모호하거나 추가 설명이 필요하면 상세히 답변해 주고 다시 질문을 던지세요.

사용자의 답변을 듣고 긍정적인 뉘앙스면 10점, 부정적인 뉘앙스면 0점으로 내부적으로 계산하세요.
5개의 질문이 모두 끝나면 총점을 계산하여 다음 중 하나의 결과를 알려주세요.
- 0~20점: '개인 단계 AiMSP'
- 30~40점: '확산 단계 AiMSP'
- 50점: '운영 단계 AiMSP'

결과를 알려준 후, 다음 로직에 따라 추가 질문을 진행하세요.
[개인 단계 AiMSP (0~20점)인 경우]
1차로 "혹시 팀 내 AI를 효율화 하는 것 보다 팀 전체를 AX(AI Transformation) 하는 것에 관심이 있으신가요?" 라고 묻습니다.
- 사용자가 AX에 관심이 있다고 하면: "AI 기반 신규 서비스 개발, 내부 AI 인프라 개선, RAG 구축, 업무 자동화 중 어떤 것을 원하시나요?" 라고 묻습니다.
- 사용자가 AX에 관심이 없다고 하거나, 위 네 가지 중 하나를 선택하지 않고 AiMSP를 원한다고 하면: "AI를 사용하는 사용자 수는 몇 명인지, 월 AI 사용 비용은 얼마인지, 팀 수는 몇 개인지 알려주세요." 라고 묻습니다.

[확산 단계(30~40점) 또는 운영 단계(50점)인 경우]
바로 "AI를 사용하는 사용자 수는 몇 명인지, 월 AI 사용 비용은 얼마인지, 팀 수는 몇 개인지 알려주세요." 라고 묻습니다.

사용자가 최종적으로 AX의 4가지 옵션 중 하나를 선택하거나, AiMSP를 위한 3가지 숫자(사용자 수, 비용, 팀 수) 대답하면, 제공된 도구(Function Call)를 호출하여 시스템이 화면을 이동시킬 수 있도록 하세요.`,
                        tools: [{
                            functionDeclarations: [
                                {
                                    name: "route_to_ax",
                                    description: "사용자가 AX 프로젝트(AI 기반 신규 서비스, 내부 AI 인프라 개선, RAG 구축, 업무 자동화) 중 하나를 선택했을 때 호출합니다.",
                                    parameters: {
                                        type: Type.OBJECT,
                                        properties: {
                                            projectType: {
                                                type: Type.STRING,
                                                description: "선택한 프로젝트 타입 ('new_service', 'infra', 'rag', 'automation')"
                                            }
                                        },
                                        required: ["projectType"]
                                    }
                                },
                                {
                                    name: "route_to_aiops",
                                    description: "사용자가 AiMSP 시뮬레이션을 위해 AI 사용자 수, 월 비용, 팀 수를 모두 입력했을 때 호출합니다.",
                                    parameters: {
                                        type: Type.OBJECT,
                                        properties: {
                                            users: { type: Type.NUMBER, description: "AI 사용자 수" },
                                            cost: { type: Type.NUMBER, description: "월 AI 사용 비용 (만원 단위)" },
                                            teams: { type: Type.NUMBER, description: "팀 수" }
                                        },
                                        required: ["users", "cost", "teams"]
                                    }
                                }
                            ]
                        }]
                    }
                })
            });

            if (!response.ok) throw new Error("Failed to process diagnosis chat");
            const data = await response.json();

            if (data.functionCalls && data.functionCalls.length > 0) {
                const call = data.functionCalls[0];
                if (call.name === 'route_to_ax') {
                    const pType = (call.args as any).projectType;
                    let axId = 1;
                    if (pType === 'infra') axId = 2;
                    if (pType === 'rag') axId = 3;
                    if (pType === 'automation') axId = 4;

                    setChatMessages(prev => [...prev, { role: 'ai', text: '선택하신 AX 프로젝트 화면으로 이동합니다.' }]);
                    await new Promise(r => setTimeout(r, 1000));

                    setActiveToggle('AX');
                    setStep('ax_scenario');
                    handleAxSelect(axId);
                } else if (call.name === 'route_to_aiops') {
                    const { users, cost, teams } = call.args as any;
                    setAiOpsInputs({
                        teamMembers: '',
                        aiUsers: String(users),
                        monthlyCost: String(cost),
                        teamCount: String(teams)
                    });
                    setChatMessages(prev => [...prev, { role: 'ai', text: '입력하신 정보를 바탕으로 AiMSP 시뮬레이션을 생성합니다.' }]);
                    await new Promise(r => setTimeout(r, 1000));

                    setActiveToggle('AiOPS');
                    setStep('aiops_simulation');
                    startAiOpsSimulation();
                }
            } else if (data.text) {
                setChatMessages(prev => [...prev, { role: 'ai', text: data.text }]);
            }
        } catch (e) {
            console.error(e);
            setChatMessages(prev => [...prev, { role: 'ai', text: '오류가 발생했습니다. 다시 시도해 주세요.' }]);
        }
        setIsTyping(false);
    };

    const handleConsultation = () => {
        if (onOpenContactWizard) {
            onOpenContactWizard(['project']);
        }
    };

    const handleAiOpsConsultation = () => {
        if (onOpenContactWizard) {
            onOpenContactWizard(['aiops']);
        }
    };

    return (
        <div
            className={`fixed flex flex-col transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ${bgColor} ${textColor} backdrop-blur-md border-l shadow-2xl md:top-[12%] md:bottom-[5%] md:w-[92vw] md:right-6 md:rounded md:border-t md:border-b md:border-r inset-0 md:inset-auto overflow-hidden ${isOpen ? 'translate-x-0 opacity-100 pointer-events-auto' : 'translate-x-[120%] opacity-0 pointer-events-none'} ${isDark ? 'border-white/10' : 'border-black/10'}`}
            style={{ zIndex }}
            onClick={e => { e.stopPropagation(); if (onFocus) onFocus(); }}
        >
            {/* Header */}
            <div className={`w-full h-12 border-b flex items-center px-6 gap-2 shrink-0 ${borderColor}`}>
                <div className="flex gap-2 cursor-pointer" onClick={onClose}>
                    <div className={`w-3 h-3 rounded-full ${isDark ? 'bg-zinc-600 hover:bg-red-500' : 'bg-zinc-400 hover:bg-red-500'} transition-colors`} />
                    <div className={`w-3 h-3 rounded-full ${isDark ? 'bg-zinc-600 hover:bg-yellow-500' : 'bg-zinc-400 hover:bg-yellow-500'} transition-colors`} />
                    <div className={`w-3 h-3 rounded-full ${isDark ? 'bg-zinc-600 hover:bg-green-500' : 'bg-zinc-400 hover:bg-green-500'} transition-colors`} />
                </div>
                <div className={`ml-4 text-xs font-mono opacity-40 uppercase tracking-widest ${textColor}`}>
                    CASE_STUDY_VIEWER.app
                </div>
                <div className="ml-auto flex items-center gap-4">
                    <button onClick={onClose} className="hover:rotate-90 transition-transform opacity-50 hover:opacity-100"><X size={20} /></button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                {/* Left: Node Map (65%) */}
                <div className={`w-full md:w-[65%] h-1/2 md:h-full relative overflow-hidden flex items-center justify-center`}>
                    {!currentIA && (
                        <div className="absolute inset-0"
                            style={{
                                backgroundImage: isDark
                                    ? `linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)`
                                    : `linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)`,
                                backgroundSize: '40px 40px'
                            }}
                        />
                    )}
                    <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
                        {step === 'workflow_view' && (
                            <div className="absolute top-6 left-6 z-20 flex bg-black/20 rounded-full p-1 backdrop-blur-md border border-white/10">
                                <button
                                    onClick={() => { setWorkflowMode('as-is'); setSelectedWorkflowNode(null); }}
                                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${workflowMode === 'as-is' ? 'bg-white text-black shadow-md' : 'text-white/50 hover:text-white'}`}
                                >
                                    AS-IS
                                </button>
                                <button
                                    onClick={() => { setWorkflowMode('to-be'); setSelectedWorkflowNode(null); }}
                                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${workflowMode === 'to-be' ? 'bg-blue-500 text-white shadow-md' : 'text-white/50 hover:text-white'}`}
                                >
                                    TO-BE
                                </button>
                            </div>
                        )}

                        {step === 'aiops_simulation' && aiOpsStep === 'simulation' && (
                            <div className="absolute top-6 left-6 z-20 flex bg-black/20 rounded-full p-1 backdrop-blur-md border border-white/10">
                                <button
                                    onClick={() => { setWorkflowMode('as-is'); setSelectedWorkflowNode(null); }}
                                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${workflowMode === 'as-is' ? 'bg-white text-black shadow-md' : 'text-white/50 hover:text-white'}`}
                                >
                                    AS-IS
                                </button>
                                <button
                                    onClick={() => { setWorkflowMode('to-be'); setSelectedWorkflowNode(null); }}
                                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${workflowMode === 'to-be' ? 'bg-blue-500 text-white shadow-md' : 'text-white/50 hover:text-white'}`}
                                >
                                    TO-BE
                                </button>
                            </div>
                        )}

                        {nodeMapModalText && !currentIA && step !== 'workflow_view' && step !== 'aiops_simulation' && step !== 'ax_preparing' && (
                            <div className="animate-fade-in-up px-8 py-4 rounded-2xl bg-blue-500/20 border border-blue-500/50 text-blue-400 font-bold text-lg shadow-[0_0_30px_rgba(59,130,246,0.2)] backdrop-blur-md">
                                {nodeMapModalText}
                            </div>
                        )}

                        {step === 'ax_preparing' && (
                            <div className="animate-fade-in-up px-8 py-4 rounded-2xl bg-blue-500/20 border border-blue-500/50 text-blue-400 font-bold text-lg shadow-[0_0_30px_rgba(59,130,246,0.2)] backdrop-blur-md">
                                {t.preparingDesc.split('\n')[0]}
                            </div>
                        )}

                        {nodeMapModalText && step === 'aiops_simulation' && aiOpsStep === 'input' && (
                            <div className="animate-fade-in-up px-8 py-4 rounded-2xl bg-blue-500/20 border border-blue-500/50 text-blue-400 font-bold text-lg shadow-[0_0_30px_rgba(59,130,246,0.2)] backdrop-blur-md">
                                {nodeMapModalText}
                            </div>
                        )}

                        {currentIA && step !== 'workflow_view' && step !== 'aiops_simulation' && (
                            <div className="w-full h-full animate-fade-in-up">
                                <NodeMapCanvas currentIA={currentIA} isDark={isDark} />
                            </div>
                        )}

                        {step === 'aiops_simulation' && aiOpsStep === 'simulation' && (
                            <div className="w-full h-full animate-fade-in-up">
                                <AiOpsNodeGraph
                                    mode={workflowMode}
                                    isDark={isDark}
                                    teamCount={parseInt(aiOpsInputs.teamCount) || 0}
                                    teamMembers={parseInt(aiOpsInputs.teamMembers) || 0}
                                />
                            </div>
                        )}

                        {step === 'workflow_view' && (
                            <div className="w-full h-full animate-fade-in-up">
                                <WorkflowGraph
                                    mode={workflowMode}
                                    isDark={isDark}
                                    onNodeClick={setSelectedWorkflowNode}
                                    selectedNodeId={selectedWorkflowNode?.id || null}
                                    lang={lang}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Controller Panel (35%) */}
                <div className={`w-full md:w-[35%] h-1/2 md:h-full border-t md:border-t-0 md:border-l flex flex-col ${isDark ? 'bg-black/40' : 'bg-black/5'} ${borderColor} relative`}>
                    {/* Toggles */}
                    <div className={`p-4 border-b ${borderColor} flex items-center shrink-0`}>
                        {step !== 'initial' && (
                            <button
                                onClick={() => {
                                    setStep('initial');
                                    setSelectedInitial(null);
                                    setSelectedAx(null);
                                    setActiveToggle(null);
                                    setNodeMapModalText(null);
                                    setCurrentIA(null);
                                    setChatMessages([]);
                                    setModificationCount(0);
                                    setWorkflowMode('as-is');
                                    setSelectedWorkflowNode(null);
                                }}
                                className={`mr-4 p-1 rounded-full hover:bg-current/10 transition-colors`}
                            >
                                <ChevronLeft size={20} />
                            </button>
                        )}
                        <div className="flex-1 flex justify-center">
                            <div className={`relative flex w-full max-w-[240px] p-1 rounded-full ${isDark ? 'bg-white/10' : 'bg-black/10'} cursor-pointer`} onClick={() => {
                                const nextToggle = activeToggle === 'AX' ? 'AiOPS' : 'AX';
                                setActiveToggle(nextToggle);
                                if (nextToggle === 'AX') {
                                    setStep('ax_scenario');
                                    setNodeMapModalText('AX 프로젝트가 필요하시군요');
                                    setSelectedInitial(1);
                                } else {
                                    setStep('aiops_simulation');
                                    setAiOpsStep('input');
                                    setNodeMapModalText('지금 현재 상태를 선택해 주세요 ->');
                                    setSelectedInitial(2);
                                }
                                setChatMessages([]);
                                setCurrentIA(null);
                                setWorkflowMode('as-is');
                                setSelectedWorkflowNode(null);
                            }}>
                                <div className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full bg-blue-500 shadow-md transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] ${activeToggle === 'AiOPS' ? 'translate-x-[100%]' : 'translate-x-0'}`} />
                                <div className={`flex-1 py-1.5 text-center text-xs font-bold z-10 transition-colors duration-300 ${activeToggle === 'AX' ? 'text-white' : (isDark ? 'text-white/50' : 'text-black/50')}`}>
                                    {t.axScenarioCards[1].split(' ')[1]} 프로젝트
                                </div>
                                <div className={`flex-1 py-1.5 text-center text-xs font-bold z-10 transition-colors duration-300 ${activeToggle === 'AiOPS' ? 'text-white' : (isDark ? 'text-white/50' : 'text-black/50')}`}>
                                    {t.diagnosisTitle}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={`flex-1 p-6 flex flex-col relative ${step === 'diagnosis_chat' || step === 'chatting' ? 'overflow-hidden' : 'overflow-y-auto'}`}>
                        {step === 'initial' && (
                            <div className="flex flex-col gap-4 mt-8">
                                {[
                                    { id: 1, text: t.initialCards[0] },
                                    { id: 2, text: t.initialCards[1] },
                                    { id: 3, text: t.initialCards[2] }
                                ].map((card, idx) => (
                                    <button
                                        key={card.id}
                                        onClick={() => handleInitialSelect(card.id)}
                                        className={`p-6 rounded-xl text-left font-bold transition-all duration-500
                                            ${selectedInitial === card.id ? '-translate-x-12 opacity-0 pointer-events-none' :
                                                selectedInitial !== null ? 'translate-x-12 opacity-0 pointer-events-none' :
                                                    animatingCards ? 'translate-x-12 opacity-0 pointer-events-none' :
                                                        `${isDark ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-black'} hover:scale-[1.02]`}
                                        `}
                                        style={{
                                            transitionDelay: selectedInitial !== null
                                                ? (selectedInitial === card.id ? '400ms' : `${idx * 100}ms`)
                                                : '0ms'
                                        }}
                                    >
                                        {card.text}
                                    </button>
                                ))}
                            </div>
                        )}

                        {step === 'diagnosis_chat' && (
                            <div className="flex flex-col h-full animate-fade-in-up">
                                <h3 className="text-xl font-black mb-6 pb-4 border-b border-current/10">AiMSP 진단</h3>

                                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 flex flex-col gap-4 mb-4">
                                    {chatMessages.map((msg, i) => (
                                        <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'ai' ? 'bg-blue-500 text-white' : (isDark ? 'bg-white/20' : 'bg-black/10')}`}>
                                                {msg.role === 'ai' ? <Bot size={16} /> : <User size={16} />}
                                            </div>
                                            <div className={`p-3 rounded-2xl text-sm leading-relaxed max-w-[80%] whitespace-pre-wrap ${msg.role === 'user' ? (isDark ? 'bg-white/10' : 'bg-black/5') : (isDark ? 'bg-blue-500/20 border border-blue-500/30' : 'bg-blue-50 border border-blue-200')}`}>
                                                {msg.text}
                                            </div>
                                        </div>
                                    ))}
                                    {isTyping && (
                                        <div className="flex gap-3">
                                            <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center shrink-0"><Bot size={16} /></div>
                                            <div className={`p-3 rounded-2xl flex gap-1 items-center ${isDark ? 'bg-blue-500/20 border border-blue-500/30' : 'bg-blue-50 border border-blue-200'}`}>
                                                <div className="w-1.5 h-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: '0ms' }} />
                                                <div className="w-1.5 h-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: '150ms' }} />
                                                <div className="w-1.5 h-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: '300ms' }} />
                                            </div>
                                        </div>
                                    )}
                                    <div ref={chatEndRef} />
                                </div>

                                <div className="relative shrink-0">
                                    <input
                                        type="text"
                                        value={chatInput}
                                        onChange={e => setChatInput(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && handleDiagnosisMessage()}
                                        placeholder={t.diagInputPlaceholder}
                                        className={`w-full p-4 pr-12 rounded-xl border outline-none transition-all text-sm ${isDark ? 'bg-white/5 border-white/10 focus:border-blue-500' : 'bg-white border-black/10 focus:border-blue-500'}`}
                                        disabled={isTyping}
                                    />
                                    <button
                                        onClick={handleDiagnosisMessage}
                                        disabled={!chatInput.trim() || isTyping}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-blue-500 disabled:opacity-30 transition-opacity"
                                    >
                                        <Send size={18} />
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 'ax_scenario' && (
                            <div className="flex flex-col gap-4 mt-4 animate-fade-in-right">
                                <h3 className="text-xl font-black mb-4">{t.axScenarioTitle}</h3>
                                {[
                                    { id: 1, text: t.axScenarioCards[0] },
                                    { id: 2, text: t.axScenarioCards[1] },
                                    { id: 3, text: t.axScenarioCards[2] },
                                    { id: 4, text: t.axScenarioCards[3] }
                                ].map((card, idx) => (
                                    <button
                                        key={card.id}
                                        onClick={() => handleAxSelect(card.id)}
                                        className={`p-5 rounded-xl text-left font-bold transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]
                                            ${selectedAx === card.id ? '-translate-x-12 opacity-0 pointer-events-none' :
                                                selectedAx !== null ? 'translate-x-12 opacity-0 pointer-events-none' :
                                                    `${isDark ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-black'} hover:scale-[1.02]`}
                                        `}
                                        style={{
                                            transitionDelay: selectedAx !== null
                                                ? (selectedAx === card.id ? '400ms' : `${idx * 100}ms`)
                                                : '0ms'
                                        }}
                                    >
                                        {card.text}
                                    </button>
                                ))}
                            </div>
                        )}

                        {step === 'ax_preparing' && (
                            <div className="flex flex-col h-full animate-fade-in-up">
                                <h3 className="text-xl font-black mb-6 pb-4 border-b border-current/10">
                                    {selectedAx === 3 ? t.preparingTitle_3 : t.preparingTitle_4}
                                </h3>
                                <div className="flex-1 flex flex-col items-center justify-center gap-8">
                                    <div className={`p-6 rounded-2xl ${isDark ? 'bg-white/5' : 'bg-black/5'} text-center`}>
                                        <p className="text-lg font-bold opacity-80 break-keep leading-relaxed">
                                            {t.preparingDesc.split('\n').map((line: string, i: number) => <React.Fragment key={i}>{line}<br /></React.Fragment>)}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            onClose();
                                            if (onOpenContactWizard) onOpenContactWizard(['project']);
                                        }}
                                        className="px-8 py-4 rounded-full bg-blue-500 text-white font-bold text-base hover:bg-blue-600 transition-colors shadow-lg animate-pulse"
                                    >
                                        {t.preparingBtn}
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 'chatting' && (
                            <div className="flex flex-col h-full animate-fade-in-up">
                                <h3 className="text-xl font-black mb-6 pb-4 border-b border-current/10">{t.chatTitle}</h3>

                                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 flex flex-col gap-4 mb-4">
                                    {chatMessages.map((msg, i) => (
                                        <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'ai' ? 'bg-blue-500 text-white' : (isDark ? 'bg-white/20' : 'bg-black/10')}`}>
                                                {msg.role === 'ai' ? <Bot size={16} /> : <User size={16} />}
                                            </div>
                                            <div className={`p-3 rounded-2xl text-sm leading-relaxed max-w-[80%] ${msg.role === 'user' ? (isDark ? 'bg-white/10' : 'bg-black/5') : (isDark ? 'bg-blue-500/20 border border-blue-500/30' : 'bg-blue-50 border border-blue-200')}`}>
                                                {msg.text}
                                            </div>
                                        </div>
                                    ))}
                                    {isTyping && (
                                        <div className="flex gap-3">
                                            <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center shrink-0"><Bot size={16} /></div>
                                            <div className={`p-3 rounded-2xl flex gap-1 items-center ${isDark ? 'bg-blue-500/20 border border-blue-500/30' : 'bg-blue-50 border border-blue-200'}`}>
                                                <div className="w-1.5 h-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: '0ms' }} />
                                                <div className="w-1.5 h-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: '150ms' }} />
                                                <div className="w-1.5 h-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: '300ms' }} />
                                            </div>
                                        </div>
                                    )}
                                    {modificationCount >= 2 && !isTyping && (
                                        <div className="flex justify-center mt-4">
                                            <button onClick={handleConsultation} className="px-6 py-3 rounded-full bg-blue-500 text-white font-bold text-sm hover:bg-blue-600 transition-colors shadow-lg">
                                                {t.chatConsultBtn}
                                            </button>
                                        </div>
                                    )}
                                    <div ref={chatEndRef} />
                                </div>

                                <div className="relative shrink-0">
                                    <input
                                        type="text"
                                        value={chatInput}
                                        onChange={e => setChatInput(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                                        placeholder={t.chatInputPlaceholder}
                                        className={`w-full p-4 pr-12 rounded-xl border outline-none transition-all text-sm ${isDark ? 'bg-white/5 border-white/10 focus:border-blue-500' : 'bg-white border-black/10 focus:border-blue-500'}`}
                                        disabled={modificationCount >= 2 || isTyping}
                                    />
                                    <button
                                        onClick={handleSendMessage}
                                        disabled={!chatInput.trim() || modificationCount >= 2 || isTyping}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-blue-500 disabled:opacity-30 transition-opacity"
                                    >
                                        <Send size={18} />
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 'aiops_simulation' && aiOpsStep === 'input' && (
                            <div className="flex flex-col gap-4 mt-4 animate-fade-in-right">
                                <h3 className="text-xl font-black mb-4">{t.aiopsSimTitle}</h3>
                                <div className="flex flex-col gap-3">
                                    <input type="number" placeholder={t.aiopsSimFields[0]} value={aiOpsInputs.teamMembers} onChange={e => handleAiOpsInput('teamMembers', e.target.value)} className={`w-full p-4 rounded-xl border outline-none transition-all text-sm ${isDark ? 'bg-white/5 border-white/10 focus:border-blue-500' : 'bg-white border-black/10 focus:border-blue-500'}`} />
                                    <input type="number" placeholder={t.aiopsSimFields[1]} value={aiOpsInputs.aiUsers} onChange={e => handleAiOpsInput('aiUsers', e.target.value)} className={`w-full p-4 rounded-xl border outline-none transition-all text-sm ${isDark ? 'bg-white/5 border-white/10 focus:border-blue-500' : 'bg-white border-black/10 focus:border-blue-500'}`} />
                                    <div className="relative">
                                        <input type="number" placeholder={t.aiopsSimFields[2]} value={aiOpsInputs.monthlyCost} onChange={e => handleAiOpsInput('monthlyCost', e.target.value)} className={`w-full p-4 pr-12 rounded-xl border outline-none transition-all text-sm ${isDark ? 'bg-white/5 border-white/10 focus:border-blue-500' : 'bg-white border-black/10 focus:border-blue-500'}`} />
                                        <span className={`absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold opacity-50`}>{t.aiopsSimCurrencyUnit}</span>
                                    </div>
                                    <input type="number" placeholder={t.aiopsSimFields[3]} value={aiOpsInputs.teamCount} onChange={e => handleAiOpsInput('teamCount', e.target.value)} className={`w-full p-4 rounded-xl border outline-none transition-all text-sm ${isDark ? 'bg-white/5 border-white/10 focus:border-blue-500' : 'bg-white border-black/10 focus:border-blue-500'}`} />
                                </div>
                                <button onClick={startAiOpsSimulation} className="mt-4 px-6 py-4 rounded-xl bg-blue-500 text-white font-bold text-sm hover:bg-blue-600 transition-colors shadow-lg">
                                    {t.aiopsSimBtn}
                                </button>
                            </div>
                        )}

                        {step === 'aiops_simulation' && aiOpsStep === 'simulation' && (
                            <div className="flex flex-col h-full animate-fade-in-up relative overflow-hidden">
                                <h3 className="text-xl font-black mb-6 pb-4 border-b border-current/10">{t.aiopsSimTitle}</h3>
                                <div className="relative flex-1">
                                    <div className={`absolute inset-0 flex flex-col gap-4 transition-all duration-700 ease-in-out ${workflowMode === 'as-is' ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 pointer-events-none'}`}>
                                        <div className={`p-5 rounded-xl border ${isDark ? 'bg-zinc-800/50 border-white/10' : 'bg-white border-black/10'} font-bold`}>개인 결제</div>
                                        <div className={`p-5 rounded-xl border ${isDark ? 'bg-zinc-800/50 border-white/10' : 'bg-white border-black/10'} font-bold`}>비용 분산</div>
                                        <div className={`p-5 rounded-xl border ${isDark ? 'bg-zinc-800/50 border-white/10' : 'bg-white border-black/10'} font-bold`}>AI 활용 없음</div>
                                        <div className={`p-5 rounded-xl border ${isDark ? 'bg-zinc-800/50 border-white/10' : 'bg-white border-black/10'} font-bold`}>Human Driven</div>

                                        <div className="mt-auto pt-4 flex justify-center">
                                            <button
                                                onClick={() => { setWorkflowMode('to-be'); setSelectedWorkflowNode(null); }}
                                                className="px-8 py-3 rounded-full bg-blue-500 text-white font-bold text-sm hover:bg-blue-600 transition-colors shadow-lg animate-pulse"
                                            >
                                                TO-BE
                                            </button>
                                        </div>
                                    </div>
                                    <div className={`absolute inset-0 flex flex-col gap-4 transition-all duration-700 ease-in-out ${workflowMode === 'to-be' ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'}`}>
                                        <div className={`p-5 rounded-xl border ${isDark ? 'bg-blue-900/30 border-blue-500/30' : 'bg-blue-50 border-blue-200'} font-bold text-blue-500`}>팀 단위 집계 및 효율화</div>
                                        <div className={`p-5 rounded-xl border ${isDark ? 'bg-blue-900/30 border-blue-500/30' : 'bg-blue-50 border-blue-200'} font-bold text-blue-500`}>월 리포트</div>
                                        <div className={`p-5 rounded-xl border ${isDark ? 'bg-blue-900/30 border-blue-500/30' : 'bg-blue-50 border-blue-200'} font-bold text-blue-500`}>Human-in-the-loop</div>
                                        <div className={`p-5 rounded-xl border ${isDark ? 'bg-blue-900/30 border-blue-500/30' : 'bg-blue-50 border-blue-200'} font-bold text-blue-500`}>AI 총 비용 10% 할인 적용</div>

                                        {aiOpsInputs.monthlyCost && (
                                            <div className={`p-5 rounded-xl border ${isDark ? 'bg-green-900/30 border-green-500/30' : 'bg-green-50 border-green-200'} font-black text-green-500 text-lg text-center animate-fade-in-up`} style={{ animationDelay: '500ms' }}>
                                                {t.aiopsSimSavings.replace('{amount}', Math.round(parseInt(aiOpsInputs.monthlyCost) * 0.1).toLocaleString())}
                                            </div>
                                        )}

                                        <div className="mt-auto pt-4 flex justify-center">
                                            <button
                                                onClick={() => onOpenContactWizard && onOpenContactWizard(['aiops'])}
                                                className="px-8 py-3 rounded-full bg-blue-500 text-white font-bold text-sm hover:bg-blue-600 transition-colors shadow-lg"
                                            >
                                                {t.aiopsInquiryBtn}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 'workflow_view' && (
                            <div className="flex flex-col h-full animate-fade-in-up">
                                <h3 className="text-xl font-black mb-6 pb-4 border-b border-current/10">{t.workflowTitle}</h3>

                                {selectedWorkflowNode ? (
                                    <div className="flex flex-col gap-4 animate-fade-in-up">
                                        <div className={`p-4 rounded-xl ${isDark ? 'bg-white/5' : 'bg-black/5'}`}>
                                            <div className="text-sm font-bold text-blue-500 mb-1">{selectedWorkflowNode.type.toUpperCase()}</div>
                                            <div className="text-lg font-black mb-2">{selectedWorkflowNode.label}</div>
                                            <div className="text-sm opacity-80 leading-relaxed">{selectedWorkflowNode.desc}</div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex-1 flex items-center justify-center opacity-50 text-sm">
                                        {t.workflowViewHint}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
