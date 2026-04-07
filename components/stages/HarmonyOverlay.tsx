
import React, { useState, useEffect, useRef } from 'react';
import { Zap, Bot, Network, Globe, Database, Trash2, FileText, Settings, Search, User, LayoutTemplate, Send, FileJson, AlertCircle, MessageSquare, PenTool, Activity, Clock, Link, FileDown, Mail, Github, Sparkles, Code, ArrowLeft, Cpu, ShieldCheck, BookOpen, Wrench, GitCommit, Eye, Terminal } from 'lucide-react';

// --- Types ---
type NodeType = 'webhook' | 'agent' | 'router' | 'action' | 'config' | 'start' | 'process' | 'end' | 'grid-node';

interface NodeData {
    id: string;
    type: NodeType;
    label: string;
    subLabel: string;
    desc?: string;
    color?: string;
    icon?: React.ReactNode;
    x: number;
    y: number;
    w?: number;
    h?: number;
    highlight?: boolean;
    badge?: string;
    // For Grid
    status?: 'neutral' | 'problem' | 'solution' | 'tool';
    boxStyle?: 'solid' | 'dashed';
    borderColor?: string;
    groupId?: string; // For simultaneous activation
}

interface EdgeData {
    from: string;
    to: string;
    type: 'solid' | 'dotted';
    fromPort: 'right' | 'bottom' | 'top' | 'left';
    toPort: 'left' | 'top' | 'bottom' | 'right' | 'bottom-1' | 'bottom-2' | 'bottom-3';
}

// --- Workflow Definitions ---

const WORKFLOW_DEV: { nodes: NodeData[], edges: EdgeData[] } = {
    nodes: [
        { id: 'planning', type: 'start', label: 'CONNECT', subLabel: 'API Proxy + Extension', desc: 'Channel Integration', color: '#06b6d4', icon: <FileText size={20} />, x: 50, y: 80, w: 220, h: 100 },
        { id: 'design', type: 'agent', label: 'LOG', subLabel: 'Async Storage Engine', desc: 'Zero-latency Logging', color: '#6366f1', icon: <PenTool size={20} />, x: 330, y: 80, w: 220, h: 100 },
        { id: 'execution', type: 'agent', label: 'ANALYZE', subLabel: 'Pattern Detection', desc: 'Usage Pattern Analysis', color: '#10b981', icon: <Cpu size={20} />, x: 610, y: 80, w: 220, h: 100 },
        { id: 'val_top', type: 'process', label: 'DETECT', subLabel: 'Risk & Anomaly', desc: 'Auto Risk Flagging', color: '#ec4899', icon: <ShieldCheck size={20} />, x: 890, y: 80, w: 220, h: 100 },
        { id: 'knowledge', type: 'config', label: 'COACH', subLabel: 'Auto Advisory', desc: 'Coaching Cards', color: '#8b5cf6', icon: <BookOpen size={20} />, x: 50, y: 320, w: 220, h: 100 },
        { id: 'operations', type: 'action', label: 'REPORT', subLabel: 'Weekly Digest', desc: 'Auto Weekly Report', color: '#f97316', icon: <Wrench size={20} />, x: 470, y: 320, w: 220, h: 100 },
        { id: 'val_bot', type: 'process', label: 'REVIEW (HITL)', subLabel: 'Human Approval', desc: 'Sensitive Data Review', color: '#ec4899', icon: <ShieldCheck size={20} />, x: 890, y: 320, w: 220, h: 100 },
    ],
    edges: [
        { from: 'planning', to: 'design', type: 'solid', fromPort: 'right', toPort: 'left' },
        { from: 'design', to: 'execution', type: 'solid', fromPort: 'right', toPort: 'left' },
        { from: 'execution', to: 'val_top', type: 'solid', fromPort: 'right', toPort: 'left' },
        { from: 'val_top', to: 'val_bot', type: 'dotted', fromPort: 'bottom', toPort: 'top' },
        { from: 'val_bot', to: 'operations', type: 'solid', fromPort: 'left', toPort: 'right' },
        { from: 'operations', to: 'knowledge', type: 'solid', fromPort: 'left', toPort: 'right' },
        { from: 'knowledge', to: 'planning', type: 'solid', fromPort: 'top', toPort: 'bottom' },
    ]
};

const WORKFLOW_GRID_ASIS: NodeData[] = [
    // Tools (Top Row)
    { id: 'prd', type: 'grid-node', label: '', subLabel: 'CLAUDE.AI', desc: 'Web Chat', x: 20, y: 20, w: 140, h: 90, status: 'tool', icon: <FileText size={16} /> },
    { id: 'claude', type: 'grid-node', label: '', subLabel: 'CHATGPT', desc: '', x: 180, y: 20, w: 140, h: 90, status: 'tool' },
    { id: 'cli', type: 'grid-node', label: '', subLabel: 'CURSOR', desc: '', x: 340, y: 20, w: 140, h: 90, status: 'tool' },
    { id: 'ci', type: 'grid-node', label: '', subLabel: 'COPILOT', desc: '', x: 500, y: 20, w: 120, h: 90, status: 'tool' },
    { id: 'monitor', type: 'grid-node', label: '', subLabel: 'GEMINI', desc: '', x: 640, y: 20, w: 140, h: 90, status: 'tool' },

    // Middle Row (Problems)
    { id: 'start', type: 'grid-node', label: '', subLabel: 'NO TRACKING', desc: '', x: 20, y: 130, w: 140, h: 140, status: 'neutral', boxStyle: 'dashed' },
    { id: 'arch', type: 'grid-node', label: 'BLIND', subLabel: 'COST SCATTERED', desc: '', x: 180, y: 130, w: 140, h: 140, status: 'problem' },
    { id: 'gen', type: 'grid-node', label: 'Unmanaged', subLabel: 'INDIVIDUAL BILLING', desc: 'Per-person accounts', x: 340, y: 130, w: 140, h: 140, status: 'problem' },
    { id: 'review', type: 'grid-node', label: '', subLabel: 'NO COMPLIANCE', desc: '', x: 500, y: 130, w: 120, h: 140, status: 'problem', boxStyle: 'dashed' },
    { id: 'ops', type: 'grid-node', label: '', subLabel: 'SECURITY ZERO', desc: 'No data protection', x: 640, y: 130, w: 140, h: 140, status: 'problem' },

    // Bottom Row (Roles)
    { id: 'decision', type: 'grid-node', label: '', subLabel: 'CTO', desc: '', x: 180, y: 290, w: 140, h: 90, status: 'neutral', icon: <User size={16} /> },
    { id: 'dev', type: 'grid-node', label: '', subLabel: 'TEAM LEAD', desc: '', x: 340, y: 290, w: 140, h: 90, status: 'neutral', icon: <User size={16} /> },
    { id: 'qa', type: 'grid-node', label: '', subLabel: 'DEVELOPER', desc: '', x: 500, y: 290, w: 120, h: 90, status: 'neutral', icon: <User size={16} /> },
    { id: 'oncall', type: 'grid-node', label: '', subLabel: 'FINANCE', desc: '', x: 640, y: 290, w: 140, h: 90, status: 'neutral', icon: <User size={16} /> },

    // Footer Row
    { id: 'repo', type: 'grid-node', label: '', subLabel: 'NO CENTRAL MANAGEMENT', desc: 'EACH TEAM MANAGES AI INDEPENDENTLY', x: 20, y: 410, w: 760, h: 150, status: 'neutral', icon: <BookOpen size={24} />, boxStyle: 'dashed' },
];

const WORKFLOW_GRID_TOBE: NodeData[] = [
    // --- Tools (Top Row) ---
    { id: 'prd', type: 'grid-node', label: '', subLabel: 'CLAUDE.AI', desc: 'Web Chat', x: 20, y: 20, w: 140, h: 90, status: 'tool', icon: <FileText size={16} /> },
    { id: 'claude', type: 'grid-node', label: '', subLabel: 'CHATGPT', desc: '', x: 180, y: 20, w: 140, h: 90, status: 'tool' },
    { id: 'cli', type: 'grid-node', label: '', subLabel: 'CURSOR', desc: '', x: 340, y: 20, w: 140, h: 90, status: 'tool' },
    { id: 'ci', type: 'grid-node', label: '', subLabel: 'COPILOT', desc: '', x: 500, y: 20, w: 140, h: 90, status: 'tool' },
    { id: 'monitor', type: 'grid-node', label: '', subLabel: 'GEMINI', desc: '', x: 660, y: 20, w: 140, h: 90, status: 'tool' },

    // --- Column 1: Connect ---
    { id: 'req_interpreter', type: 'grid-node', label: '', subLabel: 'CONNECT', desc: 'API Proxy\nExtension', x: 20, y: 130, w: 140, h: 250, status: 'solution', borderColor: 'border-blue-700' },

    // --- Column 2: Log ---
    { id: 'architect', type: 'grid-node', label: '', subLabel: 'LOG', desc: 'Async Storage\nZero Latency', x: 180, y: 130, w: 140, h: 150, status: 'solution', borderColor: 'border-indigo-600' },
    { id: 'decision', type: 'grid-node', label: '', subLabel: 'CTO', desc: '', x: 180, y: 290, w: 140, h: 90, status: 'neutral', icon: <User size={16} /> },

    // --- Column 3: Analyze ---
    { id: 'code_gen', type: 'grid-node', label: '', subLabel: 'ANALYZE', desc: 'Pattern Detection', x: 340, y: 130, w: 140, h: 150, status: 'solution', borderColor: 'border-orange-600' },
    { id: 'dev', type: 'grid-node', label: '', subLabel: 'TEAM LEAD', desc: '', x: 340, y: 290, w: 140, h: 90, status: 'neutral', icon: <User size={16} /> },

    // --- Column 4: Detect + Coach + Review ---
    { id: 'validator', type: 'grid-node', label: '', subLabel: 'DETECT', desc: 'Risk & Anomaly', x: 500, y: 130, w: 140, h: 80, status: 'solution', borderColor: 'border-red-600' },
    { id: 'test_gen', type: 'grid-node', label: '', subLabel: 'COACH', desc: 'Auto Advisory', x: 500, y: 220, w: 140, h: 80, status: 'solution', borderColor: 'border-emerald-600', groupId: 'qa_group' },
    { id: 'reviewer', type: 'grid-node', label: '', subLabel: 'REVIEW (HITL)', desc: 'Human Approval', x: 500, y: 310, w: 140, h: 70, status: 'solution', borderColor: 'border-blue-600', groupId: 'qa_group' },
    { id: 'qa', type: 'grid-node', label: '', subLabel: 'DEVELOPER', desc: '', x: 500, y: 390, w: 140, h: 60, status: 'neutral', icon: <User size={16} /> },

    // --- Column 5: Report + Dashboard ---
    { id: 'incident', type: 'grid-node', label: '', subLabel: 'REPORT', desc: 'Weekly Digest', x: 660, y: 130, w: 140, h: 110, status: 'solution', borderColor: 'border-orange-500', groupId: 'ops_group' },
    { id: 'runbook', type: 'grid-node', label: '', subLabel: 'DASHBOARD', desc: 'Real-time View', x: 660, y: 250, w: 140, h: 100, status: 'solution', borderColor: 'border-pink-600', groupId: 'ops_group' },
    { id: 'oncall', type: 'grid-node', label: '', subLabel: 'FINANCE', desc: '', x: 660, y: 360, w: 140, h: 90, status: 'neutral', icon: <User size={16} /> },

    // Footer Row
    { id: 'repo', type: 'grid-node', label: '', subLabel: 'GRIDGE AiOPS', desc: 'UNIFIED AI MANAGEMENT PLATFORM', x: 20, y: 460, w: 780, h: 100, status: 'neutral', icon: <BookOpen size={24} />, borderColor: 'border-white' },
];


const STATIC_NODE_CONFIG: Record<string, any> = {
    'planning': { stack: ["API Proxy", "Browser Extension"] },
    'design': { stack: ["Async Queue", "Log Storage"] },
    'execution': { stack: ["Pattern Engine", "Claude Haiku"] },
    'val_top': { stack: ["Risk Classifier", "Anomaly Detection"] },
    'val_bot': { stack: ["HITL Interface", "Admin Review"] },
    'operations': { stack: ["Report Generator", "Slack Webhook"] },
    'knowledge': { stack: ["Coaching Engine", "Prompt Library"] },
    'gen': { stack: ["Pattern Engine", "Claude Haiku"], type: 'solution' },
    'ops': { stack: ["Report Generator", "Slack Webhook"], type: 'solution' },
    'arch': { stack: ["No Central Tracking"], type: 'problem' },
    'review': { stack: ["No Usage Data"], type: 'problem' },
    'repo': { stack: ["AiOPS Platform", "Unified Dashboard"] },
    'req_interpreter': { stack: ["API Proxy", "Browser Extension"] },
    'architect': { stack: ["Async Queue", "Log Storage"] },
    'code_gen': { stack: ["Pattern Engine", "Claude Haiku"] },
    'validator': { stack: ["Risk Classifier", "Anomaly Detection"] },
    'test_gen': { stack: ["Coaching Engine", "Prompt Templates"] },
    'reviewer': { stack: ["HITL Interface", "Admin Review"] },
    'incident': { stack: ["Report Generator", "Slack Webhook"] },
    'runbook': { stack: ["Real-time Dashboard", "Metrics API"] },
};

export const HarmonyOverlay: React.FC<{ active: boolean; stage: number; isDark: boolean; t?: any; onStageChange?: (stage: number) => void }> = ({ active, stage, isDark, t, onStageChange }) => {
    // Styles
    const borderColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
    const bgColor = isDark ? '#000000' : '#e0e0e0';
    const textColor = isDark ? 'text-white' : 'text-black';
    const lineColor = isDark ? '#ffffff' : '#000000';
    const nodeBorder = isDark ? 'border-white/20' : 'border-black/10';

    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'AS-IS' | 'TO-BE'>('AS-IS');

    // Pan & Zoom State
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const scrollTimeoutRef = useRef<any>(null);

    const isPhase1 = stage >= 9;
    const isPhase2 = stage >= 10;
    const isPhase3 = stage >= 11;
    const isPhase4 = stage >= 12;

    useEffect(() => {
        if (stage === 10) {
            setSelectedNodeId('planning');
            setZoom(0.8); // Default zoom for Phase 2
        }
        if (stage === 11) {
            setSelectedNodeId(null);
            setViewMode('AS-IS');
            setZoom(1); // Reset zoom for Phase 3
        }
        if (stage === 12) {
            setSelectedNodeId('req_interpreter');
            setViewMode('TO-BE');
            setZoom(1); // Reset zoom for Phase 4
        }

        // Reset pan on stage change
        setPan({ x: 0, y: 0 });
    }, [stage]);

    let widgetTranslateY = '105%';
    let widgetHeight = '50vh';
    let titleTransform = 'translate-y-0 scale-100 gap-2';
    let titleOpacity = 1;

    if (stage === 9) {
    } else if (stage === 10) {
        widgetTranslateY = '0%';
        titleTransform = '-translate-y-48 scale-[0.4] gap-24';
    } else if (stage >= 11) {
        widgetTranslateY = '0%';
        widgetHeight = '85vh'; // Expanded
        titleTransform = '-translate-y-[60vh] scale-[0.3] gap-24'; // Push title way up
        titleOpacity = 0; // Fade out title
    }

    const WORKFLOW_GRID = viewMode === 'AS-IS' ? WORKFLOW_GRID_ASIS : WORKFLOW_GRID_TOBE;
    const showGrid = isPhase3;

    // Helper to get selected profile
    const getProfile = (id: string | null) => {
        if (!id) return null;
        const staticData = STATIC_NODE_CONFIG[id];
        const localizedData = t?.nodeDetails?.[id];
        if (!staticData || !localizedData) return null;
        return { ...staticData, ...localizedData };
    };

    const profile = getProfile(selectedNodeId);

    // Group Selection Logic
    const getSelectedGroupId = () => {
        if (!selectedNodeId) return null;
        const node = WORKFLOW_GRID.find(n => n.id === selectedNodeId);
        return node?.groupId;
    };
    const selectedGroupId = getSelectedGroupId();

    const getPortPos = (nodeId: string, port: 'left' | 'right' | 'top' | 'bottom' | 'bottom-1' | 'bottom-2' | 'bottom-3') => {
        const node = WORKFLOW_DEV.nodes.find(n => n.id === nodeId);
        if (!node) return { x: 0, y: 0 };
        const w = node.w || 100;
        const h = node.h || 60;

        const x = node.x;
        const y = node.y;

        if (port === 'left') return { x: x, y: y + h / 2 };
        if (port === 'right') return { x: x + w, y: y + h / 2 };
        if (port === 'top') return { x: x + w / 2, y: y };
        if (port === 'bottom') return { x: x + w / 2, y: y + h };

        return { x: x, y: y };
    };

    // --- Interaction Handlers ---
    const handleMouseDown = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsDragging(true);
        setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        e.stopPropagation();
        setPan({
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

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

    if (!t) return null;

    return (
        <div className={`absolute inset-0 z-[60] flex items-center justify-center ${active ? 'pointer-events-auto' : 'pointer-events-none'}`}>
            {/* Intro Text Animation Layer */}
            <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)]`} style={{ opacity: active ? 1 : 0 }}>
                {/* Feature Label */}
                <div className={`text-4xl md:text-5xl font-bold mb-8 tracking-widest uppercase transition-all duration-500 ${isDark ? 'text-blue-400' : 'text-blue-600'} ${isPhase1 && !isPhase2 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
                    {t.title1}
                </div>

                {/* Main Titles */}
                <div
                    className={`flex flex-col items-center text-center transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] ${titleTransform}`}
                    style={{ opacity: active ? titleOpacity : 0 }}
                >
                    <h2 className={`text-6xl md:text-9xl leading-tight tracking-tighter ${textColor} transition-all duration-1000 ${isPhase2 ? 'font-light' : 'font-black'}`}>
                        {t.title2}
                    </h2>
                    <h2 className={`text-6xl md:text-9xl leading-tight tracking-tighter ${textColor} transition-all duration-1000 ${isPhase2 ? 'font-bold' : 'font-black'}`}>
                        {t.title3}
                    </h2>
                </div>
            </div>

            {/* Editor Widget */}
            <div
                className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-[95%] md:w-[80%] z-[70] transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] border-t border-l border-r rounded-t-2xl overflow-hidden shadow-2xl flex flex-col`}
                style={{
                    height: widgetHeight,
                    transform: `translate(-50%, ${widgetTranslateY})`,
                    backgroundColor: bgColor,
                    borderColor: borderColor,
                    opacity: active ? 1 : 0
                }}
            >
                {/* Header */}
                <div className={`w-full h-10 border-b flex items-center px-4 gap-2 shrink-0`} style={{ borderColor: borderColor }}>
                    <div className={`w-3 h-3 rounded-full ${isDark ? 'bg-zinc-600' : 'bg-zinc-400'}`} />
                    <div className={`w-3 h-3 rounded-full ${isDark ? 'bg-zinc-600' : 'bg-zinc-400'}`} />
                    <div className={`w-3 h-3 rounded-full ${isDark ? 'bg-zinc-600' : 'bg-zinc-400'}`} />
                    <div className={`ml-4 text-[10px] font-mono opacity-40 uppercase tracking-widest ${textColor}`}>
                        {showGrid ? 'GRIDGE_ARCH_VIEWER.app' : 'GRIDGE_WORKFLOW_EDITOR.app'}
                    </div>
                    <div className="ml-auto flex items-center gap-4">
                        <span className={`text-[10px] ${textColor} opacity-30`}>Connected to: {showGrid ? 'LIVE_INFRA' : 'DEV_PIPELINE'}</span>
                        <span className={`text-[10px] ${textColor} opacity-30`}>Zoom: {Math.round(zoom * 100)}%</span>
                    </div>
                </div>

                <div className="flex-1 flex overflow-hidden">
                    {/* Main Canvas Area */}
                    <div
                        className="relative flex-1 overflow-hidden"
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        onWheel={handleWheel}
                        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
                    >
                        {/* Pan & Zoom Container */}
                        <div
                            style={{
                                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                                transformOrigin: '0 0',
                                width: '100%',
                                height: '100%'
                            }}
                        >
                            {/* Background Pattern - Moves with Pan/Zoom */}
                            <div className="absolute -inset-[5000px]"
                                style={{
                                    backgroundImage: isDark
                                        ? `linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)`
                                        : `linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)`,
                                    backgroundSize: '40px 40px'
                                }}
                            />

                            <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-700 ${showGrid ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                                {/* GRID LAYOUT (Stage 9/10) */}
                                <div className="relative w-[800px] h-[600px]">
                                    {showGrid && WORKFLOW_GRID.map(node => {
                                        // Status Logic
                                        const nodeProfile = getProfile(node.id);
                                        const isProblem = nodeProfile?.type === 'problem';
                                        const isSolution = nodeProfile?.type === 'solution';
                                        const isTool = node.status === 'tool';
                                        const isSelected = selectedNodeId === node.id;
                                        const isGroupSelected = node.groupId && selectedGroupId === node.groupId;
                                        const isHighlighted = isSelected || isGroupSelected;

                                        // Opacity based on View Mode
                                        let nodeOpacity = 1;
                                        let nodeBorderColor = isDark ? 'border-white/20' : 'border-black/20';
                                        let nodeBgColor = isDark ? 'bg-black' : 'bg-white';
                                        let nodeTextColor = textColor;

                                        if (viewMode === 'AS-IS') {
                                            if (isSolution) nodeOpacity = 0.3;
                                            if (isProblem) { nodeBorderColor = 'border-red-500'; nodeTextColor = 'text-red-500'; }
                                        } else { // TO-BE
                                            if (isProblem) nodeOpacity = 0.3;
                                            // Specific Border colors for TO-BE nodes
                                            if (node.borderColor) nodeBorderColor = node.borderColor;
                                        }

                                        if (isTool) { nodeBgColor = isDark ? 'bg-blue-900/20' : 'bg-blue-50'; nodeBorderColor = 'border-blue-500/30'; }
                                        if (isHighlighted) {
                                            nodeBorderColor = node.borderColor || 'border-blue-400';
                                            nodeBgColor = isDark ? 'bg-blue-900/30' : 'bg-blue-100';
                                            nodeOpacity = 1;
                                        }

                                        // Special Render for Repository Node
                                        if (node.id === 'repo') {
                                            return (
                                                <div
                                                    key={node.id}
                                                    onClick={(e) => { e.stopPropagation(); setSelectedNodeId(node.id); }}
                                                    className={`absolute flex flex-col justify-center rounded-2xl border transition-all duration-500 cursor-pointer hover:scale-[1.02]
                                                        ${nodeBorderColor} ${nodeBgColor} ${nodeTextColor}
                                                    `}
                                                    style={{
                                                        left: node.x, top: node.y, width: node.w, height: node.h,
                                                        opacity: nodeOpacity,
                                                        boxShadow: isSelected ? '0 0 20px rgba(59,130,246,0.3)' : 'none'
                                                    }}
                                                >
                                                    {/* Content */}
                                                    <div className="flex items-center justify-center gap-6 mb-6">
                                                        <div className={`p-3 rounded-xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'}`}>
                                                            {node.icon}
                                                        </div>
                                                        <div className="text-left">
                                                            <div className="text-lg font-black tracking-widest leading-none mb-1.5">{node.subLabel}</div>
                                                            <div className="text-xs font-bold opacity-40 tracking-[0.3em]">{node.desc}</div>
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-center gap-4 px-12">
                                                        <div className={`flex-1 py-3 rounded-lg border text-center text-[10px] font-bold tracking-widest ${isDark ? 'border-white/10 bg-white/5' : 'border-black/10 bg-black/5'}`}>SHARED CONTEXT</div>
                                                        <div className={`flex-1 py-3 rounded-lg border text-center text-[10px] font-bold tracking-widest ${isDark ? 'border-white/10 bg-white/5' : 'border-black/10 bg-black/5'}`}>PROMPT ASSETS</div>
                                                        <div className={`flex-1 py-3 rounded-lg border text-center text-[10px] font-bold tracking-widest ${isDark ? 'border-white/10 bg-white/5' : 'border-black/10 bg-black/5'}`}>VALIDATION SKILLSET</div>
                                                    </div>
                                                </div>
                                            )
                                        }

                                        return (
                                            <div
                                                key={node.id}
                                                onClick={(e) => { e.stopPropagation(); setSelectedNodeId(node.id); }}
                                                className={`absolute flex flex-col items-center justify-center rounded-xl border transition-all duration-500 cursor-pointer hover:scale-105
                                                    ${nodeBorderColor} ${nodeBgColor} ${nodeTextColor}
                                                    ${node.boxStyle === 'dashed' ? 'border-dashed' : ''}
                                                    ${viewMode === 'TO-BE' && !isTool && !['decision', 'dev', 'qa', 'oncall'].includes(node.id) ? 'bg-opacity-20 backdrop-blur-sm' : ''}
                                                `}
                                                style={{
                                                    left: node.x, top: node.y, width: node.w, height: node.h,
                                                    opacity: nodeOpacity,
                                                    boxShadow: isHighlighted ? `0 0 20px ${isDark ? 'rgba(59,130,246,0.3)' : 'rgba(59,130,246,0.2)'}` : 'none'
                                                }}
                                            >
                                                {/* Top Right Status Dot if active/solution */}
                                                {viewMode === 'TO-BE' && !isTool && !['decision', 'dev', 'qa', 'oncall'].includes(node.id) && (
                                                    <div className={`absolute top-3 right-3 w-2 h-2 rounded-full ${isHighlighted ? 'bg-blue-400' : 'bg-gray-600'}`} />
                                                )}

                                                {node.icon && <div className="mb-2 opacity-80">{node.icon}</div>}
                                                {node.label && <span className="text-[9px] font-bold uppercase tracking-widest mb-1 opacity-70">{node.label}</span>}

                                                {/* SubLabel logic for TO-BE cards that look like code blocks */}
                                                <span className={`font-black text-center leading-tight px-2 ${viewMode === 'TO-BE' && !isTool ? 'text-sm' : 'text-xs'}`}>{node.subLabel}</span>

                                                {node.desc && (
                                                    <div className={`mt-2 flex flex-col gap-1 items-center`}>
                                                        {node.desc.split('\n').map((line, i) => (
                                                            <span key={i} className={`text-[9px] px-2 py-0.5 rounded-sm whitespace-nowrap ${isDark ? 'bg-white/10' : 'bg-black/5'} opacity-70`}>{line}</span>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Status Dot for AS-IS */}
                                                {viewMode === 'AS-IS' && isProblem && <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />}
                                                {viewMode === 'AS-IS' && isSolution && <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-orange-500" />}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className={`absolute inset-0 transition-opacity duration-700 ${!showGrid ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                                {/* PIPELINE LAYOUT (Stage 8) */}
                                {/* Centered Container for Pipeline Nodes */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="relative w-[1200px] h-[500px]">
                                        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-visible">
                                            <defs>
                                                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                                                    <polygon points="0 0, 10 3.5, 0 7" fill={lineColor} opacity="0.5" />
                                                </marker>
                                            </defs>
                                            {!showGrid && WORKFLOW_DEV.edges.map((edge, i) => {
                                                const start = getPortPos(edge.from, edge.fromPort as any);
                                                const end = getPortPos(edge.to, edge.toPort as any);
                                                let d = '';
                                                if (edge.type === 'dotted') {
                                                    d = `M ${start.x} ${start.y} C ${start.x} ${start.y - 50}, ${end.x} ${end.y + 50}, ${end.x} ${end.y}`;
                                                } else {
                                                    const dist = Math.abs(end.x - start.x);
                                                    // Make lines straighter for the loop layout
                                                    if (edge.fromPort === 'right' && edge.toPort === 'left') {
                                                        d = `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
                                                    } else if (edge.fromPort === 'bottom' && edge.toPort === 'top') {
                                                        d = `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
                                                    } else if (edge.fromPort === 'top' && edge.toPort === 'bottom') {
                                                        d = `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
                                                    } else {
                                                        d = `M ${start.x} ${start.y} C ${start.x + dist / 2} ${start.y}, ${end.x - dist / 2} ${end.y}, ${end.x} ${end.y}`;
                                                    }
                                                }

                                                return (
                                                    <path
                                                        key={i}
                                                        d={d}
                                                        fill="none"
                                                        stroke={lineColor}
                                                        strokeWidth={2}
                                                        strokeDasharray={edge.type === 'dotted' ? '4 4' : '4 4'}
                                                        opacity={0.5}
                                                        className="flow-active"
                                                        markerEnd="url(#arrowhead)"
                                                    />
                                                );
                                            })}
                                        </svg>
                                        {!showGrid && WORKFLOW_DEV.nodes.map(node => (
                                            <div
                                                key={node.id}
                                                onClick={(e) => { e.stopPropagation(); setSelectedNodeId(node.id); }}
                                                className={`absolute flex flex-col rounded-xl border transition-all duration-300 hover:scale-105 cursor-pointer ${isDark ? 'bg-[#0f172a]' : 'bg-white'} ${nodeBorder} ${textColor} ${selectedNodeId === node.id ? 'ring-2 ring-blue-500 shadow-xl opacity-100' : 'opacity-80'}`}
                                                style={{
                                                    left: node.x,
                                                    top: node.y,
                                                    width: node.w || 100, height: node.h || 60,
                                                    borderColor: node.color || lineColor
                                                }}
                                            >
                                                <div className={`px-3 py-1.5 flex items-center gap-2 border-b ${isDark ? 'border-white/10' : 'border-black/5'} bg-black/20`}>
                                                    <div className="w-2 h-2 rounded-full shadow-[0_0_5px_currentColor]" style={{ color: node.color || '#fff', backgroundColor: node.color || '#fff' }} />
                                                    <span className="text-[10px] font-bold tracking-widest uppercase opacity-70" style={{ color: node.color || 'inherit' }}>{node.label}</span>
                                                </div>
                                                <div className="p-3 flex flex-col justify-center h-full">
                                                    <h3 className="text-sm font-black tracking-tight leading-tight mb-1">{node.subLabel}</h3>
                                                    <p className="text-[10px] opacity-50 font-medium leading-relaxed">{node.desc}</p>
                                                </div>
                                                {/* Connector Dots */}
                                                <div className={`absolute top-1/2 -left-1 w-2 h-2 rounded-full -translate-y-1/2 ${isDark ? 'bg-slate-700' : 'bg-slate-300'}`} />
                                                <div className={`absolute top-1/2 -right-1 w-2 h-2 rounded-full -translate-y-1/2 ${isDark ? 'bg-slate-700' : 'bg-slate-300'}`} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Panel */}
                    <div className={`w-16 md:w-[22rem] border-l flex flex-col ${isDark ? 'bg-black/20' : 'bg-black/5'}`} style={{ borderColor: borderColor }}>
                        {showGrid ? (
                            // Grid Mode Sidebar (Ref 2/3)
                            <div className="flex flex-col h-full animate-fade-in-right">
                                {/* Toggle Switch */}
                                <div className="p-6 border-b" style={{ borderColor: borderColor }}>
                                    <div className={`p-1 rounded-lg flex ${isDark ? 'bg-white/10' : 'bg-black/10'}`}>
                                        <button onClick={() => setViewMode('AS-IS')} className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${viewMode === 'AS-IS' ? (isDark ? 'bg-red-500/20 text-red-400 shadow-sm' : 'bg-white text-red-600 shadow') : 'opacity-50'}`}>AS-IS</button>
                                        <button onClick={() => setViewMode('TO-BE')} className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${viewMode === 'TO-BE' ? (isDark ? 'bg-blue-500/20 text-blue-400 shadow-sm' : 'bg-white text-blue-600 shadow') : 'opacity-50'}`}>TO-BE</button>
                                    </div>
                                </div>

                                {profile ? (
                                    <div className="p-6 space-y-8 animate-fade-in-up">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className={`w-2 h-2 rounded-full ${viewMode === 'AS-IS' && profile.type === 'problem' ? 'bg-red-500 animate-pulse' : (viewMode === 'TO-BE' && profile.type === 'solution' ? 'bg-orange-500' : 'bg-blue-500')}`} />
                                                <span className={`text-xs font-bold uppercase tracking-[0.2em] ${viewMode === 'AS-IS' && profile.type === 'problem' ? 'text-red-500' : (viewMode === 'TO-BE' && profile.type === 'solution' ? 'text-orange-500' : 'text-blue-500')}`}>Active Node</span>
                                            </div>
                                            <h2 className="text-2xl font-black tracking-tight leading-tight mb-1">{profile.name}</h2>
                                            <p className="text-sm opacity-50 italic">{profile.role}</p>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="text-[10px] font-bold uppercase tracking-widest opacity-40">Capabilities</div>
                                            <p className="text-sm font-medium leading-relaxed opacity-90 break-keep">
                                                {profile.capabilities}
                                            </p>
                                        </div>

                                        {profile.stack && (
                                            <div className="space-y-3">
                                                <div className="text-[10px] font-bold uppercase tracking-widest opacity-40">Stack Integration</div>
                                                <div className="flex flex-wrap gap-2">
                                                    {profile.stack.map((tech: string, i: number) => (
                                                        <div key={i} className={`px-3 py-1.5 rounded-md text-[11px] font-bold border ${isDark ? 'bg-blue-500/10 border-blue-500/20 text-blue-300' : 'bg-blue-50 border-blue-200 text-blue-700'}`}>
                                                            {tech}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div className={`relative pl-4 border-l-2 ${viewMode === 'AS-IS' ? 'border-red-500/50' : 'border-blue-500/50'}`}>
                                            <div className={`text-[10px] font-black uppercase tracking-widest mb-2 ${viewMode === 'AS-IS' ? 'text-red-500' : 'text-blue-500'}`}>Problem Target</div>
                                            <p className="text-sm font-medium opacity-80 leading-relaxed">
                                                {profile.problemTarget}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex-1 flex flex-col items-center justify-center opacity-40 p-8 text-center">
                                        <Eye size={32} className="mb-4" />
                                        <p className="text-sm font-bold">Click any node for details</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            // Pipeline Sidebar (Stage 8 - Restore Profile View)
                            <div className="flex flex-col h-full animate-fade-in-right">
                                {profile ? (
                                    <div className="p-8 pb-4 shrink-0">
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                                            <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-500">Active Pipeline Node</span>
                                        </div>
                                        <h2 className="text-2xl font-black tracking-tight leading-tight mb-1">{profile.name}</h2>
                                        <p className="text-sm opacity-50 italic">{profile.role}</p>

                                        <div className="space-y-8 mt-8">
                                            <div className="space-y-3">
                                                <div className="text-[10px] font-bold uppercase tracking-widest opacity-40">Capabilities</div>
                                                <p className="text-sm font-medium leading-relaxed opacity-90 break-keep">
                                                    {profile.capabilities}
                                                </p>
                                            </div>

                                            <div className="space-y-3">
                                                <div className="text-[10px] font-bold uppercase tracking-widest opacity-40">Stack Integration</div>
                                                <div className="flex flex-wrap gap-2">
                                                    {profile.stack?.map((tech: string, i: number) => (
                                                        <div key={i} className={`px-3 py-1.5 rounded-md text-[11px] font-bold border ${isDark ? 'bg-blue-500/10 border-blue-500/20 text-blue-300' : 'bg-blue-50 border-blue-200 text-blue-700'}`}>
                                                            {tech}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="relative pl-4 border-l-2 border-red-500/50">
                                                <div className="text-[10px] font-black uppercase tracking-widest text-red-500 mb-2">Problem Target</div>
                                                <p className="text-sm font-medium opacity-80 leading-relaxed">
                                                    {profile.problemTarget}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-6 opacity-50">
                                        <div className="text-xs font-bold uppercase tracking-widest mb-4">Pipeline Status</div>
                                        <div className="space-y-4 font-mono text-xs">
                                            <div className="flex justify-between"><span>Events</span><span>2.4k/s</span></div>
                                            <div className="flex justify-between"><span>Latency</span><span>14ms</span></div>
                                            <div className="flex justify-between text-green-500"><span>Healthy</span><span>100%</span></div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
