import React, { useState, useEffect } from 'react';
import { Check, Shield, AlertTriangle, TrendingUp, Zap, Clock, DollarSign, Users, Activity, ChevronDown } from 'lucide-react';

const statusConfig: Record<string, { color: string; dotColor: string; icon: React.ReactNode }> = {
    excellent: { color: 'text-emerald-400', dotColor: 'bg-emerald-400', icon: <TrendingUp size={13} /> },
    good: { color: 'text-blue-400', dotColor: 'bg-blue-400', icon: <Zap size={13} /> },
    warning: { color: 'text-amber-400', dotColor: 'bg-amber-400', icon: <AlertTriangle size={13} /> },
    risk: { color: 'text-red-400', dotColor: 'bg-red-400', icon: <Shield size={13} /> },
};

const channelColors: Record<string, string> = {
    anthropic: 'bg-orange-500',
    openai: 'bg-emerald-500',
    gemini: 'bg-blue-500',
    extension: 'bg-purple-500',
    crawler: 'bg-zinc-500',
};

/* ── Left Panel: Setup ── */
const SetupPanel: React.FC<{ data: any; isDark: boolean }> = ({ data, isDark }) => (
    <div className={`h-full rounded-xl border backdrop-blur-md p-6 flex flex-col ${isDark ? 'bg-black/60 border-white/10 text-white' : 'bg-white/60 border-black/10 text-black'}`}>
        <h3 className="text-lg font-black tracking-tight mb-1">{data.title}</h3>
        <p className="text-[11px] opacity-40 mb-6 font-medium">{data.desc}</p>
        <div className="space-y-3 flex-1">
            {data.items.map((item: any, i: number) => (
                <div key={i} className={`p-3.5 rounded-lg border ${isDark ? 'bg-white/5 border-white/5' : 'bg-black/[0.02] border-black/5'}`}>
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold">{item.l}</span>
                        <span className="text-xs font-black text-emerald-500 font-mono">{item.v}</span>
                    </div>
                    <span className="text-[10px] opacity-30">{item.d}</span>
                </div>
            ))}
        </div>
        <div className={`mt-4 pt-4 border-t text-[11px] font-bold opacity-50 ${isDark ? 'border-white/10' : 'border-black/10'}`}>
            {data.footer}
        </div>
    </div>
);

/* ── Center Panel: Dashboard Mock ── */
const DashboardPanel: React.FC<{ data: any; isDark: boolean }> = ({ data, isDark }) => {
    const bg = isDark ? 'bg-[#0c0c0c]' : 'bg-[#f8f8f8]';
    const border = isDark ? 'border-white/10' : 'border-black/10';
    const cardBg = isDark ? 'bg-white/[0.03]' : 'bg-white';
    const subText = isDark ? 'text-white/40' : 'text-black/40';

    const kpiIcons = [<Activity size={14} key={0} />, <DollarSign size={14} key={1} />, <Users size={14} key={2} />, <Clock size={14} key={3} />];

    return (
        <div className={`h-full rounded-xl border overflow-hidden flex flex-col ${bg} ${border} ${isDark ? 'text-white' : 'text-black'}`}>
            {/* Title Bar */}
            <div className={`flex items-center gap-2 px-4 py-2.5 border-b ${isDark ? 'bg-white/[0.03] border-white/5' : 'bg-black/[0.02] border-black/5'}`}>
                <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <span className="text-[10px] font-mono font-bold opacity-40 ml-2">{data.appName}</span>
            </div>

            {/* Tabs */}
            <div className={`flex gap-0 px-4 pt-3 border-b ${isDark ? 'border-white/5' : 'border-black/5'}`}>
                {data.tabs.map((tab: string, i: number) => (
                    <button key={i} className={`px-4 py-2 text-[10px] font-bold transition-all rounded-t-md ${i === 0 ? (isDark ? 'bg-white/10 text-white' : 'bg-white text-black shadow-sm') : `opacity-40 hover:opacity-70`}`}>
                        {tab}
                    </button>
                ))}
            </div>

            {/* KPI Row */}
            <div className="grid grid-cols-4 gap-2 p-3">
                {data.kpi.map((k: any, i: number) => (
                    <div key={i} className={`p-2.5 rounded-lg border ${cardBg} ${border}`}>
                        <div className={`flex items-center gap-1.5 mb-1 ${subText}`}>
                            {kpiIcons[i]}
                            <span className="text-[9px] font-bold">{k.l}</span>
                        </div>
                        <div className="text-sm font-black font-mono tracking-tight">{k.v}</div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className={`flex items-center gap-2 px-4 py-2 border-y ${isDark ? 'border-white/5' : 'border-black/5'}`}>
                <span className={`text-[9px] font-bold ${subText}`}>Filter</span>
                <div className="flex gap-1">
                    {data.teamFilters.slice(0, 4).map((f: string, i: number) => (
                        <span key={i} className={`px-2 py-0.5 rounded text-[9px] font-bold ${i === 0 ? (isDark ? 'bg-white text-black' : 'bg-black text-white') : `opacity-40 ${isDark ? 'bg-white/5' : 'bg-black/5'}`}`}>
                            {f}
                        </span>
                    ))}
                </div>
                <div className="w-px h-3 bg-current/10 mx-1" />
                <div className="flex gap-1">
                    {data.channelFilters.slice(0, 5).map((f: string, i: number) => (
                        <span key={i} className={`px-2 py-0.5 rounded text-[9px] font-bold ${i === 0 ? (isDark ? 'bg-blue-500 text-white' : 'bg-blue-500 text-white') : `opacity-40 ${isDark ? 'bg-white/5' : 'bg-black/5'}`}`}>
                            {f}
                        </span>
                    ))}
                </div>
            </div>

            {/* Table Header */}
            <div className={`grid grid-cols-[80px_56px_72px_108px_1fr_52px_64px_56px] gap-0 px-4 py-2 ${subText}`}>
                {data.headers.map((h: string, i: number) => (
                    <span key={i} className="text-[9px] font-bold uppercase tracking-wide">{h}</span>
                ))}
            </div>

            {/* Log Rows */}
            <div className="flex-1 overflow-hidden px-1">
                {data.logs.map((log: any, i: number) => {
                    const cfg = statusConfig[log.status] || statusConfig.good;
                    return (
                        <div key={i} className={`grid grid-cols-[80px_56px_72px_108px_1fr_52px_64px_56px] gap-0 px-3 py-2 mx-1 rounded-md items-center text-[10px] transition-colors ${isDark ? 'hover:bg-white/5' : 'hover:bg-black/[0.02]'} ${i === 0 ? (isDark ? 'bg-white/[0.03]' : 'bg-black/[0.015]') : ''}`}>
                            <span className="font-bold flex items-center gap-1.5">
                                <span className={`w-1.5 h-1.5 rounded-full ${cfg.dotColor}`} />
                                {log.user}
                            </span>
                            <span className="opacity-50">{log.team}</span>
                            <span>
                                <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold text-white ${channelColors[log.ch] || 'bg-zinc-500'}`}>
                                    {log.ch}
                                </span>
                            </span>
                            <span className="font-mono opacity-60 text-[9px]">{log.model}</span>
                            <span className="opacity-50 truncate pr-2">{log.prompt}</span>
                            <span className="font-mono opacity-60">{log.tokens}</span>
                            <span className="font-mono opacity-60">{log.cost}</span>
                            <span className="font-mono opacity-60">{log.latency}</span>
                        </div>
                    );
                })}
                {/* Fade out hint */}
                <div className={`flex items-center justify-center py-2 opacity-20`}>
                    <ChevronDown size={14} />
                </div>
            </div>
        </div>
    );
};

/* ── Right Panel: Value ── */
const ValuePanel: React.FC<{ data: any; isDark: boolean }> = ({ data, isDark }) => (
    <div className={`h-full rounded-xl border backdrop-blur-md p-6 flex flex-col ${isDark ? 'bg-black/60 border-white/10 text-white' : 'bg-white/60 border-black/10 text-black'}`}>
        <h3 className="text-lg font-black tracking-tight mb-6">{data.title}</h3>
        <div className="space-y-4 flex-1">
            {data.items.map((item: any, i: number) => {
                const cfg = statusConfig[item.status] || statusConfig.good;
                return (
                    <div key={i} className={`p-4 rounded-lg border ${isDark ? 'bg-white/5 border-white/5' : 'bg-black/[0.02] border-black/5'}`}>
                        <div className="flex items-center gap-2.5 mb-2">
                            <div className={`w-7 h-7 rounded-md flex items-center justify-center ${isDark ? 'bg-white/10' : 'bg-black/5'} ${cfg.color}`}>
                                {cfg.icon}
                            </div>
                            <span className="text-xs font-bold">{item.title}</span>
                        </div>
                        <p className="text-[10px] opacity-40 leading-relaxed pl-[38px]">{item.desc}</p>
                    </div>
                );
            })}
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

    useEffect(() => {
        if (active) {
            const t1 = setTimeout(() => setPhase(1), 100);
            const t2 = setTimeout(() => setPhase(2), 2500);
            return () => { clearTimeout(t1); clearTimeout(t2); };
        } else {
            const timer = setTimeout(() => setPhase(0), 1000);
            return () => clearTimeout(timer);
        }
    }, [active]);

    if (!active && phase === 0) return null;
    if (!t) return null;

    const w = t.widgets;
    const textBase = isDark ? 'text-white' : 'text-black';

    return (
        <div className={`absolute inset-0 z-[60] flex items-center justify-center overflow-hidden transition-all duration-1000 ease-in-out ${active ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
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
            <div className={`absolute inset-0 z-20 flex items-center justify-center px-4 md:px-8 transition-opacity duration-1000 delay-300 ${phase >= 2 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <div className="w-full max-w-[1400px] h-[75vh] max-h-[700px] flex gap-4 md:gap-5">
                    {/* Left: Setup */}
                    <div className="w-[220px] md:w-[260px] flex-shrink-0 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                        <SetupPanel data={w.setup} isDark={isDark} />
                    </div>

                    {/* Center: Dashboard */}
                    <div className="flex-1 min-w-0 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                        <DashboardPanel data={w.dashboard} isDark={isDark} />
                    </div>

                    {/* Right: Value */}
                    <div className="w-[220px] md:w-[260px] flex-shrink-0 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                        <ValuePanel data={w.value} isDark={isDark} />
                    </div>
                </div>
            </div>
        </div>
    );
};
