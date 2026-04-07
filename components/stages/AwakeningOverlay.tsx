import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, TrendingUp, Zap, DollarSign, Users, ExternalLink, Lock, Wifi } from 'lucide-react';

const statusConfig: Record<string, { color: string; dotColor: string; icon: React.ReactNode }> = {
    excellent: { color: 'text-emerald-400', dotColor: 'bg-emerald-400', icon: <TrendingUp size={16} /> },
    good: { color: 'text-blue-400', dotColor: 'bg-blue-400', icon: <Zap size={16} /> },
    warning: { color: 'text-amber-400', dotColor: 'bg-amber-400', icon: <AlertTriangle size={16} /> },
    risk: { color: 'text-red-400', dotColor: 'bg-red-400', icon: <Shield size={16} /> },
};

/* ── Left Panel: Setup ── */
const SetupPanel: React.FC<{ data: any; isDark: boolean; focused: boolean }> = ({ data, isDark, focused }) => {
    const exp = data.expanded;
    return (
        <div className={`h-full rounded-2xl border backdrop-blur-md p-8 flex flex-col overflow-y-auto custom-scrollbar ${isDark ? 'bg-black/60 border-white/10 text-white' : 'bg-white/60 border-black/10 text-black'}`}>
            <h3 className="text-2xl font-black tracking-tight mb-2">{data.title}</h3>
            <p className="text-sm opacity-40 mb-8 font-medium whitespace-pre-wrap leading-relaxed">{data.desc}</p>
            <div className={`space-y-4 ${focused ? '' : 'flex-1'}`}>
                {data.items.map((item: any, i: number) => (
                    <div key={i} className={`p-4 rounded-xl border ${isDark ? 'bg-white/5 border-white/5' : 'bg-black/[0.02] border-black/5'}`}>
                        <div className="flex items-center justify-between mb-1.5">
                            <span className="text-sm font-bold">{item.l}</span>
                            <span className="text-base font-black text-emerald-500 font-mono">{item.v}</span>
                        </div>
                        <span className="text-xs opacity-30">{item.d}</span>
                    </div>
                ))}
            </div>
            <div className={`mt-6 pt-4 border-t text-xs font-bold opacity-40 ${isDark ? 'border-white/10' : 'border-black/10'}`}>
                {data.footer}
            </div>

            {/* Expanded Detail */}
            {focused && exp && (
                <div className="mt-8 pt-6 border-t border-dashed border-current/10 space-y-6 animate-fade-in-up">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Wifi size={16} className="opacity-50" />
                            <span className="text-sm font-bold">{exp.channelsTitle}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            {exp.channels.map((ch: string, i: number) => (
                                <div key={i} className={`px-3 py-2.5 rounded-lg text-xs font-bold text-center border ${isDark ? 'bg-white/5 border-white/5' : 'bg-black/[0.02] border-black/5'}`}>
                                    {ch}
                                </div>
                            ))}
                        </div>
                        {exp.customChannel && (
                            <div className={`mt-3 flex items-center justify-center gap-2 px-3 py-3 rounded-lg border border-dashed text-xs font-bold opacity-50 ${isDark ? 'border-white/20' : 'border-black/20'}`}>
                                <span className="text-lg leading-none">+</span>
                                <span>{exp.customChannel}</span>
                            </div>
                        )}
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <Lock size={16} className="opacity-50" />
                            <span className="text-sm font-bold">{exp.securityTitle}</span>
                        </div>
                        <div className="space-y-2">
                            {exp.security.map((s: string, i: number) => (
                                <div key={i} className="flex items-center gap-2 text-xs opacity-60">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                    {s}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

/* ── Center Panel: Dashboard Mock ── */
const DashboardPanel: React.FC<{ data: any; isDark: boolean; demoUrl: string; onExpand: () => void }> = ({ data, isDark, demoUrl, onExpand }) => {
    const bg = isDark ? 'bg-[#0c0c0c]' : 'bg-[#f8f8f8]';
    const border = isDark ? 'border-white/10' : 'border-black/10';
    const cardBg = isDark ? 'bg-white/[0.03]' : 'bg-white';
    const subText = isDark ? 'text-white/40' : 'text-black/40';
    const kpiIcons = [<DollarSign size={16} key={0} />, <Users size={16} key={1} />];

    return (
        <div
            className={`h-full rounded-2xl border overflow-hidden flex flex-col cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-[1.01] ${bg} ${border} ${isDark ? 'text-white' : 'text-black'}`}
            onClick={onExpand}
        >
            {/* Title Bar */}
            <div className={`flex items-center gap-2 px-5 py-3 border-b ${isDark ? 'bg-white/[0.03] border-white/5' : 'bg-black/[0.02] border-black/5'}`}>
                <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <span className="text-xs font-mono font-bold opacity-40 ml-2">{data.appName}</span>
            </div>

            {/* KPI Row */}
            <div className="grid grid-cols-2 gap-3 p-5">
                {data.kpi.map((k: any, i: number) => (
                    <div key={i} className={`p-5 rounded-xl border ${cardBg} ${border}`}>
                        <div className={`flex items-center gap-2 mb-2 ${subText}`}>
                            {kpiIcons[i]}
                            <span className="text-sm font-bold">{k.l}</span>
                        </div>
                        <div className="text-3xl font-black font-mono tracking-tight">{k.v}</div>
                    </div>
                ))}
            </div>

            {/* Table Header */}
            <div className={`grid grid-cols-[1fr_1fr_2fr_0.6fr] gap-0 px-6 py-3 ${subText}`}>
                {data.headers.map((h: string, i: number) => (
                    <span key={i} className="text-xs font-bold uppercase tracking-wide">{h}</span>
                ))}
            </div>

            {/* Log Rows */}
            <div className="flex-1 overflow-hidden px-3">
                {data.logs.map((log: any, i: number) => {
                    const cfg = statusConfig[log.status] || statusConfig.good;
                    const isRisk = log.status === 'risk';
                    return (
                        <div key={i} className={`grid grid-cols-[1fr_1fr_2fr_0.6fr] gap-0 px-3 py-3.5 mx-1 rounded-lg items-center text-sm transition-colors ${isDark ? 'hover:bg-white/5' : 'hover:bg-black/[0.02]'} ${isRisk ? (isDark ? 'bg-red-500/[0.07]' : 'bg-red-50') : i === 0 ? (isDark ? 'bg-white/[0.03]' : 'bg-black/[0.015]') : ''}`}>
                            <span className="font-bold flex items-center gap-2.5">
                                <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${cfg.dotColor}`} />
                                {log.user}
                            </span>
                            <span className="font-mono opacity-60 text-xs">{log.model}</span>
                            <span className="opacity-50 truncate pr-3">{log.prompt}</span>
                            <span className="flex items-center justify-end">
                                {isRisk ? (
                                    <span className="flex items-center justify-center w-7 h-7 rounded-md bg-red-500/20 text-red-400">
                                        <AlertTriangle size={16} fill="currentColor" />
                                    </span>
                                ) : (
                                    <span className={`font-mono font-bold text-xs ${log.status === 'excellent' ? 'text-emerald-400' : log.status === 'warning' ? 'text-amber-400' : 'opacity-60'}`}>{log.level}</span>
                                )}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* CTA */}
            <div className={`px-5 py-4 border-t ${isDark ? 'border-white/5' : 'border-black/5'}`}>
                <a
                    href={demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-sm transition-all hover:scale-[1.02] active:scale-95 ${isDark ? 'bg-white text-black hover:bg-white/90' : 'bg-black text-white hover:bg-black/90'}`}
                    onClick={(e) => e.stopPropagation()}
                >
                    {data.cta} <ExternalLink size={14} />
                </a>
            </div>
        </div>
    );
};

/* ── Right Panel: Value ── */
const ValuePanel: React.FC<{ data: any; isDark: boolean; focused: boolean }> = ({ data, isDark, focused }) => {
    const exp = data.expanded;
    return (
        <div className={`h-full rounded-2xl border backdrop-blur-md p-8 flex flex-col overflow-y-auto custom-scrollbar ${isDark ? 'bg-black/60 border-white/10 text-white' : 'bg-white/60 border-black/10 text-black'}`}>
            <h3 className="text-2xl font-black tracking-tight mb-8">{data.title}</h3>
            <div className={`space-y-5 ${focused ? '' : 'flex-1'}`}>
                {data.items.map((item: any, i: number) => {
                    const cfg = statusConfig[item.status] || statusConfig.good;
                    return (
                        <div key={i} className={`p-5 rounded-xl border ${isDark ? 'bg-white/5 border-white/5' : 'bg-black/[0.02] border-black/5'}`}>
                            <div className="flex items-center gap-3 mb-2.5">
                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${isDark ? 'bg-white/10' : 'bg-black/5'} ${cfg.color}`}>
                                    {cfg.icon}
                                </div>
                                <span className="text-sm font-bold">{item.title}</span>
                            </div>
                            <p className="text-xs opacity-40 leading-relaxed pl-12">{item.desc}</p>
                        </div>
                    );
                })}
            </div>

            {/* Expanded Detail */}
            {focused && exp && (
                <div className="mt-8 pt-6 border-t border-dashed border-current/10 space-y-6 animate-fade-in-up">
                    {/* Coaching Card Example */}
                    <div>
                        <span className="text-sm font-bold mb-3 block">{exp.coachingTitle}</span>
                        <div className={`p-5 rounded-xl border ${isDark ? 'bg-amber-500/[0.07] border-amber-500/20' : 'bg-amber-50 border-amber-200'}`}>
                            <div className="flex items-center gap-2 mb-2">
                                <AlertTriangle size={14} className="text-amber-400" />
                                <span className="text-sm font-bold">{exp.coaching.user}</span>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400">{exp.coaching.badge}</span>
                            </div>
                            <p className="text-xs opacity-60 leading-relaxed">{exp.coaching.suggestion}</p>
                        </div>
                    </div>
                    {/* Weekly Report */}
                    <div>
                        <span className="text-sm font-bold mb-3 block">{exp.reportTitle}</span>
                        <div className={`p-4 rounded-xl border text-sm font-medium opacity-70 ${isDark ? 'bg-white/5 border-white/5' : 'bg-black/[0.02] border-black/5'}`}>
                            {exp.report}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

/* ── Expanded Dashboard (iframe) ── */
const ExpandedDashboard: React.FC<{ demoUrl: string; isDark: boolean; onClose: () => void }> = ({ demoUrl, isDark, onClose }) => (
    <div
        className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in-up"
        onClick={onClose}
    >
        <div
            className={`w-[95vw] h-[90vh] max-w-[1400px] rounded-2xl overflow-hidden border shadow-2xl ${isDark ? 'bg-[#0c0c0c] border-white/10' : 'bg-white border-black/10'}`}
            onClick={(e) => e.stopPropagation()}
        >
            <div className={`flex items-center gap-2 px-5 py-3 border-b ${isDark ? 'bg-white/[0.03] border-white/5' : 'bg-black/[0.02] border-black/5'}`}>
                <div className="flex gap-1.5">
                    <button onClick={onClose} className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <span className={`text-xs font-mono font-bold opacity-40 ml-2 ${isDark ? 'text-white' : 'text-black'}`}>GRIDGE_LOG — Demo</span>
            </div>
            <iframe src={demoUrl} className="w-full h-[calc(100%-44px)]" title="GRIDGE LOG Demo" />
        </div>
    </div>
);

/* ── Main Component ── */
export const AwakeningOverlay: React.FC<{
    active: boolean;
    isDark: boolean;
    t?: any;
}> = ({ active, isDark, t }) => {
    const [phase, setPhase] = useState(0);
    const [expanded, setExpanded] = useState(false);
    const [focus, setFocus] = useState<'setup' | 'value' | null>(null);

    useEffect(() => {
        if (active) {
            const t1 = setTimeout(() => setPhase(1), 100);
            const t2 = setTimeout(() => setPhase(2), 2500);
            return () => { clearTimeout(t1); clearTimeout(t2); };
        } else {
            const timer = setTimeout(() => { setPhase(0); setExpanded(false); setFocus(null); }, 1000);
            return () => clearTimeout(timer);
        }
    }, [active]);

    if (!active && phase === 0) return null;
    if (!t) return null;

    const w = t.widgets;
    const demoUrl = t.demoUrl || 'https://gridge-logging.vercel.app/admin';
    const textBase = isDark ? 'text-white' : 'text-black';

    const handleBgClick = () => { if (focus) setFocus(null); };

    return (
        <div
            className={`absolute inset-0 z-[60] flex items-center justify-center overflow-hidden transition-all duration-1000 ease-in-out ${active ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
            onClick={handleBgClick}
        >
            {/* Title Phase */}
            <div className={`absolute z-10 flex flex-col items-center justify-center text-center transition-all duration-[800ms] ease-out pointer-events-none
                ${phase >= 2 ? 'opacity-0 blur-xl scale-110' : 'opacity-100 blur-0 scale-100'}`}>
                <div className={`text-4xl md:text-5xl font-bold mb-6 tracking-widest uppercase opacity-0 transition-opacity duration-700 ${phase >= 1 ? 'opacity-100' : ''} ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                    {t.title1}
                </div>
                <div className={`text-6xl md:text-9xl font-black leading-tight tracking-tight opacity-0 transition-opacity duration-700 delay-300 ${phase >= 1 ? 'opacity-100' : ''} ${textBase}`}>
                    {t.title2}
                </div>
                <div className={`text-6xl md:text-9xl font-black leading-tight tracking-tight opacity-0 transition-opacity duration-700 delay-700 ${phase >= 1 ? 'opacity-100' : ''} ${textBase}`}>
                    {t.title3}
                </div>
            </div>

            {/* 3-Panel Layout */}
            <div
                className={`absolute inset-0 z-20 flex items-center justify-center px-6 md:px-12 transition-opacity duration-1000 delay-300 ${phase >= 2 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                style={{ perspective: '1200px' }}
            >
                <div className="w-full max-w-[1500px] h-[80vh] max-h-[750px] flex gap-5 md:gap-6 items-stretch" style={{ transformStyle: 'preserve-3d' }}>

                    {/* Left: Setup */}
                    <div
                        className={`flex-shrink-0 animate-fade-in-up transition-all duration-700 ease-out ${
                            focus === 'setup' ? 'flex-1 min-w-0 z-30' :
                            focus === 'value' ? 'w-0 opacity-0 overflow-hidden pointer-events-none' :
                            'w-[240px] md:w-[280px]'
                        }`}
                        style={{ animationDelay: '0.1s', perspective: focus ? 'none' : '800px' }}
                        onClick={(e) => { e.stopPropagation(); if (!focus) setFocus('setup'); }}
                    >
                        <div
                            className="h-full transition-transform duration-700 ease-out"
                            style={{
                                transform: focus === 'setup' ? 'rotateY(0deg)' : 'rotateY(30deg)',
                                transformOrigin: 'right center',
                            }}
                        >
                            <SetupPanel data={w.setup} isDark={isDark} focused={focus === 'setup'} />
                        </div>
                    </div>

                    {/* Center: Dashboard */}
                    <div
                        className={`min-w-0 animate-fade-in-up transition-all duration-700 ease-out ${
                            focus ? 'w-0 opacity-0 overflow-hidden pointer-events-none' : 'flex-1'
                        }`}
                        style={{ animationDelay: '0.3s' }}
                    >
                        <DashboardPanel data={w.dashboard} isDark={isDark} demoUrl={demoUrl} onExpand={() => setExpanded(true)} />
                    </div>

                    {/* Right: Value */}
                    <div
                        className={`flex-shrink-0 animate-fade-in-up transition-all duration-700 ease-out ${
                            focus === 'value' ? 'flex-1 min-w-0 z-30' :
                            focus === 'setup' ? 'w-0 opacity-0 overflow-hidden pointer-events-none' :
                            'w-[240px] md:w-[280px]'
                        }`}
                        style={{ animationDelay: '0.5s', perspective: focus ? 'none' : '800px' }}
                        onClick={(e) => { e.stopPropagation(); if (!focus) setFocus('value'); }}
                    >
                        <div
                            className="h-full transition-transform duration-700 ease-out"
                            style={{
                                transform: focus === 'value' ? 'rotateY(0deg)' : 'rotateY(-30deg)',
                                transformOrigin: 'left center',
                            }}
                        >
                            <ValuePanel data={w.value} isDark={isDark} focused={focus === 'value'} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Expanded Dashboard Overlay */}
            {expanded && <ExpandedDashboard demoUrl={demoUrl} isDark={isDark} onClose={() => setExpanded(false)} />}
        </div>
    );
};
