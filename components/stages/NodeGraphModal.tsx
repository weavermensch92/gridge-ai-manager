
import React, { useState, useEffect } from 'react';
import { Zap, Bot, Network, Globe, Database, Trash2, FileText, Settings, Search, User, LayoutTemplate, Send, FileJson, AlertCircle, MessageSquare, PenTool, Activity } from 'lucide-react';

type NodeType = 'webhook' | 'agent' | 'router' | 'action' | 'config' | 'start' | 'process' | 'end';
interface NodeData {
    id: string;
    type: NodeType;
    label: string;
    subLabel?: string;
    icon: React.ReactNode;
    x: number;
    y: number;
    w?: number;
    h?: number;
    highlight?: boolean;
    badge?: string;
}
interface EdgeData {
    from: string;
    to: string;
    type: 'solid' | 'dotted';
    fromPort: 'right' | 'bottom' | 'top' | 'left';
    toPort: 'left' | 'top' | 'bottom' | 'right' | 'bottom-1' | 'bottom-2' | 'bottom-3';
}

const WORKFLOW_DEV: { nodes: NodeData[], edges: EdgeData[] } = {
    nodes: [
        { id: 'web', type: 'webhook', label: 'Webhook', icon: <Zap size={20} />, x: 50, y: 200, w: 90, h: 90 },
        { id: 'agent', type: 'agent', label: 'AI Agent', subLabel: 'Tools Agent', icon: <Bot size={28} />, x: 300, y: 180, w: 160, h: 100, highlight: true },
        { id: 'sw', type: 'router', label: 'Switch', icon: <Network size={20} />, x: 550, y: 200, w: 100, h: 70 },
        { id: 'get', type: 'action', label: 'Get Prop', icon: <Globe size={16} />, x: 750, y: 50, w: 140, h: 70 },
        { id: 'post', type: 'action', label: 'Post URL', icon: <Database size={16} />, x: 750, y: 200, w: 140, h: 70 },
        { id: 'del', type: 'action', label: 'Delete', icon: <Trash2 size={16} />, x: 750, y: 350, w: 140, h: 70 },
        { id: 'conf1', type: 'config', label: 'Docs', icon: <FileText size={16} />, x: 250, y: 400, w: 50, h: 50, badge: 'RAG' },
        { id: 'conf2', type: 'config', label: 'Settings', icon: <Settings size={16} />, x: 350, y: 430, w: 50, h: 50 },
        { id: 'conf3', type: 'config', label: 'Web', icon: <Globe size={16} />, x: 450, y: 400, w: 50, h: 50, badge: 'Search' }
    ],
    edges: [
        { from: 'web', to: 'agent', type: 'solid', fromPort: 'right', toPort: 'left' },
        { from: 'agent', to: 'sw', type: 'solid', fromPort: 'right', toPort: 'left' },
        { from: 'sw', to: 'get', type: 'solid', fromPort: 'right', toPort: 'left' },
        { from: 'sw', to: 'post', type: 'solid', fromPort: 'right', toPort: 'left' },
        { from: 'sw', to: 'del', type: 'solid', fromPort: 'right', toPort: 'left' },
        { from: 'conf1', to: 'agent', type: 'dotted', fromPort: 'top', toPort: 'bottom-1' },
        { from: 'conf2', to: 'agent', type: 'dotted', fromPort: 'top', toPort: 'bottom-2' },
        { from: 'conf3', to: 'agent', type: 'dotted', fromPort: 'top', toPort: 'bottom-3' },
    ]
};

const WORKFLOW_MKT: { nodes: NodeData[], edges: EdgeData[] } = {
    nodes: [
        { id: 'rss', type: 'start', label: 'Trend Watch', icon: <Search size={20} />, x: 50, y: 200, w: 100, h: 90 },
        { id: 'gen', type: 'agent', label: 'Content Gen', subLabel: 'GPT-4o', icon: <PenTool size={28} />, x: 300, y: 180, w: 160, h: 100, highlight: true },
        { id: 'rev', type: 'process', label: 'Review', icon: <User size={20} />, x: 550, y: 200, w: 100, h: 70, badge: 'Human' },
        { id: 'blog', type: 'action', label: 'WordPress', icon: <LayoutTemplate size={16} />, x: 750, y: 100, w: 140, h: 70 },
        { id: 'social', type: 'action', label: 'LinkedIn', icon: <Send size={16} />, x: 750, y: 300, w: 140, h: 70 },
        { id: 'brand', type: 'config', label: 'Brand Kit', icon: <FileJson size={16} />, x: 350, y: 400, w: 50, h: 50 }
    ],
    edges: [
        { from: 'rss', to: 'gen', type: 'solid', fromPort: 'right', toPort: 'left' },
        { from: 'gen', to: 'rev', type: 'solid', fromPort: 'right', toPort: 'left' },
        { from: 'rev', to: 'blog', type: 'solid', fromPort: 'right', toPort: 'left' },
        { from: 'rev', to: 'social', type: 'solid', fromPort: 'right', toPort: 'left' },
        { from: 'brand', to: 'gen', type: 'dotted', fromPort: 'top', toPort: 'bottom' },
    ]
};

const WORKFLOW_SUP: { nodes: NodeData[], edges: EdgeData[] } = {
    nodes: [
        { id: 'tic', type: 'start', label: 'Ticket In', icon: <AlertCircle size={20} />, x: 50, y: 200, w: 100, h: 90 },
        { id: 'class', type: 'agent', label: 'Classifier', subLabel: 'Fine-tuned', icon: <Network size={28} />, x: 300, y: 180, w: 160, h: 100 },
        { id: 'kb', type: 'process', label: 'KB Search', icon: <Search size={20} />, x: 550, y: 200, w: 100, h: 70 },
        { id: 'reply', type: 'action', label: 'Auto Reply', icon: <MessageSquare size={16} />, x: 750, y: 100, w: 140, h: 70 },
        { id: 'esc', type: 'action', label: 'Escalate', icon: <User size={16} />, x: 750, y: 300, w: 140, h: 70 },
        { id: 'db', type: 'config', label: 'History', icon: <Database size={16} />, x: 350, y: 400, w: 50, h: 50 }
    ],
    edges: [
        { from: 'tic', to: 'class', type: 'solid', fromPort: 'right', toPort: 'left' },
        { from: 'class', to: 'kb', type: 'solid', fromPort: 'right', toPort: 'left' },
        { from: 'kb', to: 'reply', type: 'solid', fromPort: 'right', toPort: 'left' },
        { from: 'kb', to: 'esc', type: 'solid', fromPort: 'right', toPort: 'left' },
        { from: 'db', to: 'class', type: 'dotted', fromPort: 'top', toPort: 'bottom' },
    ]
};

const NODE_PROFILES: Record<string, { name: string; role: string; efficiency: number; reliability: number; type: 'ai' | 'human'; avatarStyle?: number }> = {
    'web': { name: 'System Hook', role: 'Event Trigger', efficiency: 98, reliability: 99, type: 'ai' },
    'agent': { name: 'Model_Orchestrator', role: 'AI Core', efficiency: 95, reliability: 92, type: 'ai' },
    'sw': { name: 'Mike Ross', role: 'Product Owner', efficiency: 100, reliability: 100, type: 'human', avatarStyle: 1 },
    'get': { name: 'Data Fetcher', role: 'I/O Operation', efficiency: 88, reliability: 95, type: 'ai' },
    'post': { name: 'System Writer', role: 'I/O Operation', efficiency: 90, reliability: 94, type: 'ai' },
    'del': { name: 'Garbage Collector', role: 'Cleanup', efficiency: 92, reliability: 99, type: 'ai' },
    'rss': { name: 'Trend_Watcher_V1', role: 'Data Ingestion', efficiency: 85, reliability: 90, type: 'ai' },
    'gen': { name: 'Creator_LLM', role: 'Generative Core', efficiency: 94, reliability: 88, type: 'ai' },
    'rev': { name: 'Sarah Lee', role: 'Content Lead', efficiency: 75, reliability: 99, type: 'human', avatarStyle: 2 },
    'blog': { name: 'CMS_Connector', role: 'Publisher', efficiency: 99, reliability: 98, type: 'ai' },
    'social': { name: 'SNS_API', role: 'Distributor', efficiency: 96, reliability: 95, type: 'ai' },
    'brand': { name: 'Brand_Guard', role: 'Context Provider', efficiency: 100, reliability: 100, type: 'ai' },
    'tic': { name: 'Support_Inbound', role: 'Trigger', efficiency: 100, reliability: 100, type: 'ai' },
    'class': { name: 'Triage_Model', role: 'Classifier', efficiency: 92, reliability: 89, type: 'ai' },
    'kb': { name: 'Vector_DB', role: 'Knowledge Base', efficiency: 95, reliability: 97, type: 'ai' },
    'reply': { name: 'Responder_Bot', role: 'Action', efficiency: 90, reliability: 85, type: 'ai' },
    'esc': { name: 'David Kim', role: 'Support Manager', efficiency: 60, reliability: 100, type: 'human', avatarStyle: 3 },
    'db': { name: 'Log_Store', role: 'Memory', efficiency: 100, reliability: 100, type: 'ai' },
    'conf1': { name: 'RAG_Source', role: 'Context', efficiency: 100, reliability: 100, type: 'ai' },
    'conf2': { name: 'Param_Store', role: 'Config', efficiency: 100, reliability: 100, type: 'ai' },
    'conf3': { name: 'Search_Tool', role: 'External Tool', efficiency: 85, reliability: 90, type: 'ai' },
};

export const NodeGraphModal: React.FC<{ stage: number, isDark: boolean, tNodeGraph?: any }> = ({ stage, isDark, tNodeGraph }) => {
    const borderColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
    const bgColor = isDark ? '#000000' : '#e0e0e0';
    const textColor = isDark ? 'text-white' : 'text-black';
    const nodeBg = isDark ? 'bg-[#1a1a1a]' : 'bg-[#f0f0f0]';
    const nodeBorder = isDark ? 'border-white/20' : 'border-black/10';
    const lineColor = isDark ? '#ffffff' : '#000000';

    const [activeTab, setActiveTab] = useState<'dev' | 'mkt' | 'sup'>('dev');
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [isDragging, setIsDragging] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

    useEffect(() => {
        setPan({ x: 0, y: 0 });
        setZoom(1);
        if (activeTab === 'dev') setSelectedNodeId('sw');
        else if (activeTab === 'mkt') setSelectedNodeId('rev');
        else if (activeTab === 'sup') setSelectedNodeId('esc');
    }, [activeTab]);

    const currentWorkflow = activeTab === 'dev' ? WORKFLOW_DEV : activeTab === 'mkt' ? WORKFLOW_MKT : WORKFLOW_SUP;

    const handleMouseDown = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsDragging(true);
        setStartPos({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        e.stopPropagation();
        setPan({ x: e.clientX - startPos.x, y: e.clientY - startPos.y });
    };

    const handleMouseUp = () => setIsDragging(false);

    const handleWheel = (e: React.WheelEvent) => {
        const scaleChange = -e.deltaY * 0.001;
        const nextZoom = zoom + scaleChange;

        // 줌 범위 내에 있거나 범위 안으로 들어오는 스크롤인 경우에만 줌 처리 및 이벤트 차단
        if ((scaleChange > 0 && zoom < 1.6) || (scaleChange < 0 && zoom > 0.6)) {
            e.preventDefault();
            e.stopPropagation();
            setZoom(Math.min(Math.max(0.6, nextZoom), 1.6));
        }
        // 범위를 벗어나는 스크롤은 버블링되도록 두어 CosmicCanvas에서 단계 이동이 발생하게 함
    };

    const getPortPos = (nodeId: string, port: 'left' | 'right' | 'top' | 'bottom' | 'bottom-1' | 'bottom-2' | 'bottom-3') => {
        const node = currentWorkflow.nodes.find(n => n.id === nodeId);
        if (!node) return { x: 0, y: 0 };
        const w = node.w || 100;
        const h = node.h || 60;

        if (port === 'left') return { x: node.x, y: node.y + h / 2 };
        if (port === 'right') return { x: node.x + w, y: node.y + h / 2 };
        if (port === 'top') return { x: node.x + w / 2, y: node.y };
        if (port === 'bottom') return { x: node.x + w / 2, y: node.y + h };
        if (port === 'bottom-1') return { x: node.x + w * 0.25, y: node.y + h };
        if (port === 'bottom-2') return { x: node.x + w * 0.5, y: node.y + h };
        if (port === 'bottom-3') return { x: node.x + w * 0.75, y: node.y + h };

        return { x: node.x, y: node.y };
    };

    const getDisplayNode = () => {
        const id = selectedNodeId || hoveredNodeId;
        if (!id) return null;
        return currentWorkflow.nodes.find(n => n.id === id);
    };

    const displayNode = getDisplayNode();
    const profile = displayNode ? NODE_PROFILES[displayNode.id] : null;

    let translateY = '105%';
    let opacity = 1;
    let pointerEvents = 'none';

    if (stage === 2) {
        translateY = '0%';
        opacity = 1;
        pointerEvents = 'auto';
    } else if (stage > 2) {
        translateY = '105%'; // Slide down to disappear
        opacity = 0;
        pointerEvents = 'none';
    } else {
        translateY = '105%';
        opacity = 1;
        pointerEvents = 'none';
    }

    return (
        <div
            className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-[95%] md:w-[80%] h-[50vh] z-[70] transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] border-t border-l border-r rounded-t-2xl overflow-hidden shadow-2xl flex flex-col`}
            style={{
                transform: `translate(-50%, ${translateY})`,
                opacity: opacity,
                pointerEvents: pointerEvents as any,
                backgroundColor: bgColor,
                borderColor: borderColor
            }}
        >
            <div className={`w-full h-10 border-b flex items-center px-4 gap-2 shrink-0`} style={{ borderColor: borderColor }}>
                <div className={`w-3 h-3 rounded-full ${isDark ? 'bg-zinc-600' : 'bg-zinc-400'}`} />
                <div className={`w-3 h-3 rounded-full ${isDark ? 'bg-zinc-600' : 'bg-zinc-400'}`} />
                <div className={`w-3 h-3 rounded-full ${isDark ? 'bg-zinc-600' : 'bg-zinc-400'}`} />
                <div className={`ml-4 text-[10px] font-mono opacity-40 uppercase tracking-widest ${textColor}`}>GRIDGE_WORKFLOW_EDITOR.app</div>
                <div className="ml-auto flex items-center gap-4">
                    <span className={`text-[10px] ${textColor} opacity-30`}>Zoom: {Math.round(zoom * 100)}%</span>
                    <span className={`text-[10px] ${textColor} opacity-30`}>Auto-save: ON</span>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                <div className="relative flex-1 overflow-hidden cursor-grab active:cursor-grabbing"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onWheel={handleWheel}
                    onClick={() => setSelectedNodeId(null)}
                >
                    <div
                        className={`absolute top-0 left-0 w-full h-full origin-top-left transition-all duration-75 ease-out ${selectedNodeId ? 'opacity-90' : ''}`}
                        style={{
                            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                            transformOrigin: '0 0'
                        }}
                    >
                        {/* Background Pattern */}
                        <div className="absolute -inset-[5000px]"
                            style={{
                                backgroundImage: isDark
                                    ? `linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)`
                                    : `linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)`,
                                backgroundSize: '40px 40px'
                            }}
                        />

                        <svg className="absolute top-0 left-0 w-[2000px] h-[2000px] pointer-events-none overflow-visible">
                            <defs>
                                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                                    <polygon points="0 0, 10 3.5, 0 7" fill={lineColor} opacity="0.5" />
                                </marker>
                            </defs>
                            {currentWorkflow.edges.map((edge, i) => {
                                const start = getPortPos(edge.from, edge.fromPort as any);
                                const end = getPortPos(edge.to, edge.toPort as any);
                                let d = '';
                                if (edge.type === 'dotted') {
                                    d = `M ${start.x} ${start.y} C ${start.x} ${start.y - 50}, ${end.x} ${end.y + 50}, ${end.x} ${end.y}`;
                                } else {
                                    const dist = Math.abs(end.x - start.x);
                                    d = `M ${start.x} ${start.y} C ${start.x + dist / 2} ${start.y}, ${end.x - dist / 2} ${end.y}, ${end.x} ${end.y}`;
                                }

                                return (
                                    <path
                                        key={i}
                                        d={d}
                                        fill="none"
                                        stroke={lineColor}
                                        strokeWidth={edge.type === 'dotted' ? 1 : 1.5}
                                        strokeDasharray={edge.type === 'dotted' ? '4 4' : 'none'}
                                        opacity={edge.type === 'dotted' ? 0.3 : 0.6}
                                        markerEnd="url(#arrowhead)"
                                    />
                                );
                            })}
                        </svg>

                        {currentWorkflow.nodes.map(node => (
                            <div
                                key={node.id}
                                onClick={(e) => { e.stopPropagation(); setSelectedNodeId(node.id); }}
                                onMouseEnter={() => setHoveredNodeId(node.id)}
                                onMouseLeave={() => setHoveredNodeId(null)}
                                className={`absolute flex flex-col items-center justify-center rounded-xl border transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer ${nodeBg} ${nodeBorder} ${textColor} ${node.id === selectedNodeId ? 'ring-2 ring-white/50 shadow-2xl scale-105 z-10' : ''}`}
                                style={{
                                    left: node.x,
                                    top: node.y,
                                    width: node.w || 100,
                                    height: node.h || 60,
                                    borderColor: node.id === selectedNodeId ? (isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)') : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)')
                                }}
                            >
                                <div className={`absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full border ${isDark ? 'bg-black border-white/50' : 'bg-white border-black/50'}`} />
                                <div className={`absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full border ${isDark ? 'bg-black border-white/50' : 'bg-white border-black/50'}`} />
                                {node.type === 'agent' && (
                                    <>
                                        <div className={`absolute bottom-0 left-1/4 translate-y-1/2 w-2 h-2 rounded-full border ${isDark ? 'bg-black border-white/50' : 'bg-white border-black/50'}`} />
                                        <div className={`absolute bottom-0 left-1/2 translate-y-1/2 w-2 h-2 rounded-full border ${isDark ? 'bg-black border-white/50' : 'bg-white border-black/50'}`} />
                                        <div className={`absolute bottom-0 left-3/4 translate-y-1/2 w-2 h-2 rounded-full border ${isDark ? 'bg-black border-white/50' : 'bg-white border-black/50'}`} />
                                    </>
                                )}
                                {node.type === 'config' && (
                                    <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full border ${isDark ? 'bg-black border-white/50' : 'bg-white border-black/50'}`} />
                                )}

                                <div className={`p-2 rounded-lg mb-1 ${isDark ? 'bg-white/5' : 'bg-black/5'}`}>{node.icon}</div>
                                <span className="text-[10px] font-bold uppercase tracking-wider">{node.label}</span>
                                {node.subLabel && <span className="text-[8px] opacity-50">{node.subLabel}</span>}

                                {node.badge && (
                                    <div className={`absolute -top-2 -right-2 px-1.5 py-0.5 rounded-full text-[8px] font-bold shadow-lg ${isDark ? 'bg-zinc-700 text-white' : 'bg-zinc-200 text-black'}`}>
                                        {node.badge}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {displayNode && profile && (
                        <div
                            className={`absolute z-20 min-w-[16rem] w-auto max-w-[24rem] p-5 rounded-xl border backdrop-blur-md shadow-2xl transition-all duration-300 animate-fade-in-up ${isDark ? 'bg-black/80 border-white/20 text-white' : 'bg-white/80 border-black/20 text-black'}`}
                            style={{
                                left: Math.min(Math.max(displayNode.x + pan.x * zoom + (displayNode.w || 100) * zoom + 20, 20), 800),
                                top: Math.max(displayNode.y + pan.y * zoom - 20, 20)
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-start gap-4 mb-4">
                                <div className={`w-12 h-12 flex items-center justify-center shrink-0 transition-all duration-500
                                    ${profile.type === 'human'
                                        ? (profile.avatarStyle === 1
                                            ? `rounded-full border-2 ${isDark ? 'border-white bg-black' : 'border-black bg-white'}`
                                            : profile.avatarStyle === 2
                                                ? `rounded-xl border-2 border-dashed ${isDark ? 'border-white bg-black' : 'border-black bg-white'}`
                                                : `rounded-lg border-2 double ${isDark ? 'border-white bg-black' : 'border-black bg-white'} rotate-3`)
                                        : `rounded-lg border border-dashed ${isDark ? 'border-blue-400 bg-blue-900/20' : 'border-blue-600 bg-blue-100'}`
                                    }
                                `}>
                                    {profile.type === 'human' ? (
                                        <User size={24} strokeWidth={1.5} className={isDark ? 'text-white' : 'text-black'} />
                                    ) : (
                                        <Bot size={24} strokeWidth={1.5} className={isDark ? 'text-blue-400' : 'text-blue-600'} />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-sm font-bold uppercase tracking-wider whitespace-nowrap overflow-hidden text-ellipsis">{profile.name}</h3>
                                    <p className="text-xs opacity-60 mt-0.5 whitespace-nowrap">{profile.role}</p>
                                    {displayNode.subLabel && <p className="text-[10px] opacity-40 mt-0.5 whitespace-nowrap">{displayNode.subLabel}</p>}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <div className="flex justify-between text-[10px] uppercase font-bold tracking-wider mb-1 opacity-70">
                                        <span>Efficiency</span>
                                        <span>{profile.efficiency}%</span>
                                    </div>
                                    <div className={`w-full h-1 rounded-full ${isDark ? 'bg-white/10' : 'bg-black/10'}`}>
                                        <div className={`h-full rounded-full ${isDark ? 'bg-white' : 'bg-black'}`} style={{ width: `${profile.efficiency}%` }} />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-[10px] uppercase font-bold tracking-wider mb-1 opacity-70">
                                        <span>Reliability</span>
                                        <span>{profile.reliability}%</span>
                                    </div>
                                    <div className={`w-full h-1 rounded-full ${isDark ? 'bg-white/10' : 'bg-black/10'}`}>
                                        <div className={`h-full rounded-full ${isDark ? 'bg-white' : 'bg-black'}`} style={{ width: `${profile.reliability}%` }} />
                                    </div>
                                </div>
                            </div>

                            <div className={`mt-4 pt-3 border-t text-[10px] font-mono opacity-50 flex gap-2 ${isDark ? 'border-white/10' : 'border-black/10'}`}>
                                <Activity size={12} />
                                <span>ID: {displayNode.id.toUpperCase()}_NODE</span>
                            </div>
                        </div>
                    )}
                </div>

                <div className={`w-16 md:w-64 border-l flex flex-col ${isDark ? 'bg-black/20' : 'bg-black/5'}`} style={{ borderColor: borderColor }}>
                    <div className="p-4 border-b" style={{ borderColor: borderColor }}>
                        <span className={`text-xs font-bold uppercase tracking-widest opacity-50 hidden md:block ${textColor}`}>Team Workflows</span>
                    </div>

                    <button onClick={() => setActiveTab('dev')} className={`p-4 text-left transition-colors flex items-center gap-3 border-b border-transparent ${activeTab === 'dev' ? (isDark ? 'bg-white/10 border-l-2 border-l-white' : 'bg-black/10 border-l-2 border-l-black') : 'opacity-50 hover:opacity-100'}`}>
                        <div className={`p-2 rounded-lg ${isDark ? 'bg-white/10' : 'bg-black/5'}`}><Zap size={16} /></div>
                        <div className="hidden md:block">
                            <span className={`block text-sm font-bold ${textColor}`}>DevOps</span>
                            <span className={`block text-[10px] opacity-60 ${textColor}`}>Automated Pipeline</span>
                        </div>
                    </button>

                    <button onClick={() => setActiveTab('mkt')} className={`p-4 text-left transition-colors flex items-center gap-3 border-b border-transparent ${activeTab === 'mkt' ? (isDark ? 'bg-white/10 border-l-2 border-l-white' : 'bg-black/10 border-l-2 border-l-black') : 'opacity-50 hover:opacity-100'}`}>
                        <div className={`p-2 rounded-lg ${isDark ? 'bg-white/10' : 'bg-black/5'}`}><LayoutTemplate size={16} /></div>
                        <div className="hidden md:block">
                            <span className={`block text-sm font-bold ${textColor}`}>Marketing</span>
                            <span className={`block text-[10px] opacity-60 ${textColor}`}>Content Engine</span>
                        </div>
                    </button>

                    <button onClick={() => setActiveTab('sup')} className={`p-4 text-left transition-colors flex items-center gap-3 border-b border-transparent ${activeTab === 'sup' ? (isDark ? 'bg-white/10 border-l-2 border-l-white' : 'bg-black/10 border-l-2 border-l-black') : 'opacity-50 hover:opacity-100'}`}>
                        <div className={`p-2 rounded-lg ${isDark ? 'bg-white/10' : 'bg-black/5'}`}><MessageSquare size={16} /></div>
                        <div className="hidden md:block">
                            <span className={`block text-sm font-bold ${textColor}`}>Support</span>
                            <span className={`block text-[10px] opacity-60 ${textColor}`}>Ticket Routing</span>
                        </div>
                    </button>

                    <div className="mt-auto p-4 border-t" style={{ borderColor: borderColor }}>
                        <div className={`p-3 rounded-xl border border-dashed flex items-center justify-center gap-2 cursor-pointer opacity-50 hover:opacity-100 ${isDark ? 'border-white/20' : 'border-black/20'}`}>
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center`}>+</div>
                            <span className={`text-xs font-bold hidden md:block ${textColor}`}>Team Performance Monitor</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
