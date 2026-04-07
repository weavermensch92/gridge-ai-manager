import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { X, Check, ChevronUp, ChevronDown, Paperclip } from 'lucide-react';
import { GlitchText } from './GlitchText';
import { Language } from './types';

const BUSINESS_HOURS = ["10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

const Tooltip: React.FC<{ text: string; x: number; y: number; show: boolean; containerBounds: DOMRect | null; isDark: boolean; }> = ({ text, x, y, show, containerBounds, isDark }) => {
    const tooltipRef = useRef<HTMLDivElement>(null);
    const [style, setStyle] = useState<React.CSSProperties>({ opacity: 0, transform: 'translate(-50%, -100%)', left: 0, top: 0 });
    const [arrowLeft, setArrowLeft] = useState('50%');
    useLayoutEffect(() => {
        if (show && tooltipRef.current && containerBounds) {
            const width = tooltipRef.current.offsetWidth, height = tooltipRef.current.offsetHeight;
            let top = y - containerBounds.top - height - 20, left = x - containerBounds.left;
            const margin = 32, containerWidth = containerBounds.width;
            let clampedLeft = Math.max(margin + width / 2, Math.min(containerWidth - margin - width / 2, left));
            const relativeArrowX = left - (clampedLeft - width / 2);
            setArrowLeft(`${Math.max(10, Math.min(width - 10, relativeArrowX))}px`);
            setStyle({ opacity: 1, transform: 'translate(-50%, 0)', left: clampedLeft, top: top, transition: 'opacity 0.2s ease-out' });
        } else {
            setStyle({ opacity: 0, pointerEvents: 'none' });
        }
    }, [x, y, show, text, containerBounds]);
    if (!show) return null;
    return (
        <div ref={tooltipRef} className={`fixed z-[150] pointer-events-none px-4 py-3 rounded-xl shadow-xl max-w-[240px] text-xs md:text-sm font-medium leading-relaxed ${isDark ? 'bg-white text-black' : 'bg-black text-white'}`} style={style}>
            {text}<div className={`absolute w-3 h-3 rotate-45 transform bottom-[-4px] ${isDark ? 'bg-white' : 'bg-black'}`} style={{ left: arrowLeft, transform: 'translateX(-50%) rotate(45deg)' }} />
        </div>
    );
};

const OrbitCheckbox: React.FC<{ selected: boolean; onClick: () => void; label: string; isDark: boolean; onMouseEnter?: (e: React.MouseEvent) => void; onMouseLeave?: (e: React.MouseEvent) => void; onMouseMove?: (e: React.MouseEvent) => void; }> = ({ selected, onClick, label, isDark, onMouseEnter, onMouseLeave, onMouseMove }) => {
    const borderColor = isDark ? 'border-white' : 'border-black';
    const dotColor = isDark ? 'bg-white' : 'bg-black';
    const textColor = isDark ? 'text-white' : 'text-black';
    const ringRef = useRef<HTMLDivElement>(null);
    const dotRef = useRef<HTMLDivElement>(null);
    const stateRef = useRef({ progress: selected ? 1 : 0, angle: 0, burstSpeed: 0 });

    useEffect(() => {
        let animationFrameId: number;
        const animate = () => {
            const state = stateRef.current;
            const target = selected ? 1 : 0;
            state.progress += (target - state.progress) * 0.08;
            state.burstSpeed *= 0.92;
            const currentSpeed = 0.005 + state.burstSpeed;
            state.angle += currentSpeed;
            if (ringRef.current && dotRef.current) {
                const size = 200;
                const minH = 2;
                const maxH = 200;
                const h = minH + (maxH - minH) * state.progress;
                ringRef.current.style.width = `${size}px`;
                ringRef.current.style.height = `${h}px`;
                ringRef.current.style.borderRadius = '50%';
                const rx = size / 2;
                const ry = h / 2;
                const x = rx + rx * Math.cos(state.angle);
                const y = ry + ry * Math.sin(state.angle);
                dotRef.current.style.transform = `translate(${x - 2.5}px, ${y - 2.5}px)`;
            }
            animationFrameId = requestAnimationFrame(animate);
        };
        animate();
        return () => cancelAnimationFrame(animationFrameId);
    }, [selected]);

    useEffect(() => {
        if (selected) {
            stateRef.current.burstSpeed = 0.15;
        }
    }, [selected]);

    return (
        <button onClick={onClick} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onMouseMove={onMouseMove} className="group relative flex flex-col items-center justify-center outline-none w-[200px] h-[60px]" >
            <span className={` relative z-20 text-xl font-bold tracking-widest whitespace-nowrap ${textColor} transition-all duration-300 ${selected ? 'opacity-100 -translate-y-[2px]' : 'opacity-40 group-hover:opacity-100 translate-y-0'} `}> {label} </span>
            <div className={` absolute left-1/2 -translate-x-1/2 pointer-events-none w-[200px] flex items-center justify-center transition-all duration-500 ${selected ? 'top-1/2 -translate-y-1/2' : 'top-[calc(50%+24px)] -translate-y-1/2'} `}>
                <div ref={ringRef} className={`relative border-[1px] ${borderColor} opacity-30 box-border overflow-visible`}>
                    <div ref={dotRef} className={`absolute top-0 left-0 w-[5px] h-[5px] rounded-full ${dotColor}`} />
                </div>
            </div>
        </button>
    );
};

const CustomCalendar: React.FC<{ selectedDates: Date[]; onToggleDate: (date: Date) => void; isDark: boolean; }> = ({ selectedDates, onToggleDate, isDark }) => {
    const [viewDate, setViewDate] = useState(new Date());
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));
    const isSelected = (date: Date) => selectedDates.some(d => d.toDateString() === date.toDateString());
    const isToday = (date: Date) => date.toDateString() === new Date().toDateString();
    return (
        <div className="w-full max-sm p-4">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-3xl md:text-4xl font-black tracking-tighter">
                    <GlitchText text={`${year}. ${String(month + 1).padStart(2, '0')}`} delay={100} />
                </h3>
                <div className="flex gap-4">
                    <button onClick={() => setViewDate(new Date(year, month - 1, 1))} className="hover:opacity-100 opacity-40 transition-opacity"><ChevronUp className="rotate-[-90deg]" size={20} /></button>
                    <button onClick={() => setViewDate(new Date(year, month + 1, 1))} className="hover:opacity-100 opacity-40 transition-opacity"><ChevronUp className="rotate-[90deg]" size={20} /></button>
                </div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center mb-4">
                {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(d => (
                    <span key={d} className="text-[10px] font-black opacity-30 tracking-widest">{d}</span>
                ))}
            </div>
            <div className="grid grid-cols-7 gap-x-2 gap-y-1">
                {days.map((date, i) => (
                    <div key={i} className="aspect-square flex items-center justify-center">
                        {date && (
                            <button onClick={() => onToggleDate(date)} className={` w-11 h-11 rounded-full text-sm font-bold transition-all flex flex-col items-center justify-center relative group ${isSelected(date) ? (isDark ? 'bg-white text-black scale-110 shadow-lg' : 'bg-black text-white scale-110 shadow-lg') : 'hover:bg-current/10'} ${isToday(date) && !isSelected(date) ? 'text-blue-500' : ''} `} >
                                {date.getDate()}
                                {isToday(date) && !isSelected(date) && (<div className="absolute bottom-2.5 w-1 h-1 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />)}
                                {isSelected(date) && (<div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-black ${isDark ? 'bg-blue-500 text-white' : 'bg-blue-500 text-white'}`}> {selectedDates.findIndex(d => d.toDateString() === date.toDateString()) + 1} </div>)}
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export const ContactWizard: React.FC<{ isOpen: boolean; onClose: () => void; theme: 'dark' | 'light'; lang: Language; t: any; zIndex?: number; onFocus?: () => void; initialRequestTypes?: string[] }> = ({ isOpen, onClose, theme, lang, t, zIndex = 100, onFocus, initialRequestTypes = [] }) => {
    const [stepFlow, setStepFlow] = useState<string[]>(['intro']);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [requestTypes, setRequestTypes] = useState<string[]>([]);
    const [formData, setFormData] = useState({ scopes: [] as string[], budget: null as string | null, startDate: { year: 2026, month: 2, period: t.options.periods[1] }, endDate: { year: 2026, month: 3, period: t.options.periods[0] }, teamSize: null as string | null, aiCost: null as string | null, aiTools: [] as string[], aiToolsOther: "", consultationSlots: [] as { date: Date, times: string[] }[], name: "", company: "", email: "", phone: "", details: "", privacyAgreed: false });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [animationClass, setAnimationClass] = useState('animate-fade-in-right');
    const [shouldRender, setShouldRender] = useState(false);
    const [tooltip, setTooltip] = useState<{ show: boolean; text: string; x: number; y: number }>({ show: false, text: '', x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);
    const isDark = theme === 'dark';
    const currentStep = stepFlow[currentStepIndex];

    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
            const timer = setTimeout(() => {
                setStepFlow(['intro']);
                setCurrentStepIndex(0);
                setIsSuccess(false);
                setRequestTypes(initialRequestTypes);
                setAnimationClass('animate-fade-in-right');
            }, 100);
            return () => clearTimeout(timer);
        } else {
            const timer = setTimeout(() => setShouldRender(false), 700);
            return () => clearTimeout(timer);
        }
    }, [isOpen, initialRequestTypes]);

    // Reset periods when lang changes
    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            startDate: { ...prev.startDate, period: t.options.periods[1] },
            endDate: { ...prev.endDate, period: t.options.periods[0] }
        }));
    }, [t]);

    const changeStep = (nextIndex: number, direction: 'next' | 'prev') => {
        setAnimationClass(direction === 'next' ? 'animate-slide-out-left' : 'animate-slide-out-right');
        setTimeout(() => {
            setCurrentStepIndex(nextIndex);
            setAnimationClass(direction === 'next' ? 'animate-slide-in-right' : 'animate-slide-in-left');
        }, 400);
    };

    const handleNext = () => {
        if (currentStep === 'intro') {
            const flow = ['intro'];
            if (requestTypes.includes('project')) flow.push('project_scope', 'project_budget', 'project_schedule');
            if (requestTypes.includes('other') || requestTypes.includes('aiops')) flow.push('ai_team', 'ai_cost', 'ai_tools');
            flow.push('common_date', 'common_info', 'common_extra');
            setStepFlow(flow);
            changeStep(1, 'next');
        } else if (currentStepIndex < stepFlow.length - 1) {
            changeStep(currentStepIndex + 1, 'next');
        } else {
            handleSubmit();
        }
    };

    const handlePrev = () => {
        if (currentStepIndex > 0) changeStep(currentStepIndex - 1, 'prev');
    };

    const toggleRequestType = (type: string) => setRequestTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
    const toggleAiTool = (tool: string) => setFormData(prev => ({ ...prev, aiTools: prev.aiTools.includes(tool) ? prev.aiTools.filter(t => t !== tool) : [...prev.aiTools, tool] }));
    const toggleConsultDate = (date: Date) => {
        const isSelected = formData.consultationSlots.some(slot => slot.date.toDateString() === date.toDateString());
        if (isSelected) {
            setFormData(prev => ({ ...prev, consultationSlots: prev.consultationSlots.filter(slot => slot.date.toDateString() !== date.toDateString()) }));
        } else if (formData.consultationSlots.length < 3) {
            setFormData(prev => ({ ...prev, consultationSlots: [...prev.consultationSlots, { date, times: [] }] }));
        }
    };
    const toggleSlotTime = (dateString: string, time: string) => {
        setFormData(prev => ({ ...prev, consultationSlots: prev.consultationSlots.map(slot => { if (slot.date.toDateString() === dateString) { const times = slot.times.includes(time) ? slot.times.filter(t => t !== time) : [...slot.times, time]; return { ...slot, times }; } return slot; }) }));
    };
    const handleSubmit = async () => {
        if (!formData.privacyAgreed) return;
        setIsSubmitting(true);
        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    requestTypes,
                    lang
                }),
            });

            if (response.ok) {
                setIsSuccess(true);
            } else {
                console.error("Submission failed:", await response.text());
                // Optional: Show an error toast or message here
                alert("Submission failed. Please try again later.");
            }
        } catch (error) {
            console.error("Submission error:", error);
            alert("An error occurred. Please try again later.");
        } finally {
            setIsSubmitting(false);
        }
    };
    const handleTooltip = (e: React.MouseEvent, text: string) => setTooltip({ show: true, text, x: e.clientX, y: e.clientY });
    const hideTooltip = () => setTooltip(prev => ({ ...prev, show: false }));

    const DateScroller = ({ label, value, onChange }: { label: string, value: any, onChange: (v: any) => void }) => (
        <div className="flex flex-col gap-4 text-left items-start w-full">
            <span className={`text-sm font-bold opacity-40 uppercase tracking-widest`}>{label}</span>
            <div className="flex items-center gap-4 md:gap-8 flex-nowrap">
                <div className="flex items-center gap-4 shrink-0">
                    <span className="text-3xl md:text-7xl font-bold tracking-tighter whitespace-nowrap">{value.year}</span>
                    <div className="flex flex-col gap-2">
                        <button onClick={() => onChange({ ...value, year: value.year + 1 })} className="hover:opacity-100 opacity-40 transition-opacity"><ChevronUp size={24} /></button>
                        <button onClick={() => onChange({ ...value, year: value.year - 1 })} className="hover:opacity-100 opacity-40 transition-opacity"><ChevronDown size={24} /></button>
                    </div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                    <span className="text-3xl md:text-7xl font-bold tracking-tighter whitespace-nowrap">{String(value.month).padStart(2, '0')}</span>
                    <div className="flex flex-col gap-2">
                        <button onClick={() => onChange({ ...value, month: Math.min(12, value.month + 1) })} className="hover:opacity-100 opacity-40 transition-opacity"><ChevronUp size={24} /></button>
                        <button onClick={() => onChange({ ...value, month: Math.max(1, value.month - 1) })} className="hover:opacity-100 opacity-40 transition-opacity"><ChevronDown size={24} /></button>
                    </div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                    <span className="text-2xl md:text-6xl font-bold tracking-tighter whitespace-nowrap">{value.period}</span>
                    <div className="flex flex-col gap-2">
                        {t.options.periods.map((p: string) => (
                            <button key={p} onClick={() => onChange({ ...value, period: p })} className={`text-xs md:text-sm font-bold px-2 py-1 rounded transition-colors whitespace-nowrap ${value.period === p ? (isDark ? 'bg-white text-black' : 'bg-black text-white') : 'opacity-30 hover:opacity-100'}`}>{p}</button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    if (!shouldRender) return null;
    const totalSteps = stepFlow.length - 1;
    const currentStepNumber = currentStepIndex;

    return (
        <div ref={containerRef} className={`fixed flex flex-col transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ${isDark ? 'bg-black/5 text-white' : 'bg-white/5 text-black'} backdrop-blur-md border-l shadow-2xl md:top-[12%] md:bottom-[5%] md:w-[92vw] md:right-6 md:rounded-[3rem] md:border-t md:border-b md:border-r inset-0 md:inset-auto overflow-hidden ${isOpen ? 'translate-x-0 opacity-100 pointer-events-auto' : 'translate-x-full opacity-0 pointer-events-none'} ${isDark ? 'border-current/5' : 'border-current/10'}`} style={{ zIndex }} onClick={e => { e.stopPropagation(); if (onFocus) onFocus(); }} >
            <style>{` 
                @keyframes slideOutLeft { from { opacity: 1; transform: translateX(0) scale(1); } to { opacity: 0; transform: translateX(-50%) scale(0.9); } } 
                @keyframes slideInRight { from { opacity: 0; transform: translateX(50%) scale(0.95); } to { opacity: 1; transform: translateX(0) scale(1); } } 
                @keyframes slideOutRight { from { opacity: 1; transform: translateX(0) scale(1); } to { opacity: 0; transform: translateX(50%) scale(0.9); } } 
                @keyframes slideInLeft { from { opacity: 0; transform: translateX(-50%) scale(0.95); } to { opacity: 1; transform: translateX(0) scale(1); } } 
                .animate-slide-out-left { animation: slideOutLeft 0.4s cubic-bezier(0.25, 1, 0.5, 1) forwards; } 
                .animate-slide-in-right { animation: slideInRight 0.5s cubic-bezier(0.25, 1, 0.5, 1) forwards; } 
                .animate-slide-out-right { animation: slideOutRight 0.4s cubic-bezier(0.25, 1, 0.5, 1) forwards; } 
                .animate-fade-in-right { animation: slideInRight 0.5s cubic-bezier(0.25, 1, 0.5, 1) forwards; } 
            `}</style>
            <Tooltip text={tooltip.text} x={tooltip.x} y={tooltip.y} show={tooltip.show} containerBounds={containerRef.current?.getBoundingClientRect() ?? null} isDark={isDark} />
            <div className="flex items-center justify-between px-6 py-6 md:px-8 md:py-8 z-20">
                <div className="flex items-center gap-4"><span className="text-xs md:text-sm font-light uppercase tracking-widest opacity-60">{t.contactUs || "Contact Us"}</span></div>
                <button onClick={onClose} className="hover:rotate-90 transition-transform"><X size={32} strokeWidth={1.5} /></button>
            </div>
            <div className={`flex-1 overflow-y-auto px-6 md:px-8 custom-scrollbar flex items-center`}>
                {isSuccess ? (
                    <div className="h-full w-full flex flex-col items-center justify-center text-center max-w-2xl mx-auto">
                        <div className={`w-32 h-32 rounded-full flex items-center justify-center mb-10 ${isDark ? 'bg-white text-black' : 'bg-black text-white'}`}><Check size={64} strokeWidth={3} /></div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">{t.successTitle}</h2>
                        <p className="text-lg md:text-xl opacity-60">{t.successSub}</p>
                        <button onClick={onClose} className={`mt-12 px-12 py-4 rounded-full border border-current font-bold hover:bg-current hover:text-invert transition-all`}>{t.btnClose}</button>
                    </div>
                ) : (
                    <div className={`w-full max-w-[96%] mx-auto h-fit py-10 ${animationClass}`}>
                        {currentStep === 'intro' ? (
                            <div className="flex flex-col md:flex-row items-center justify-between w-full gap-8 md:gap-16">
                                <div className="text-left w-full md:w-[55%]">
                                    <h2 className="text-3xl md:text-6xl font-black leading-[1.3] tracking-tighter whitespace-pre-wrap"><GlitchText text={t.startTitle} delay={200} /></h2>
                                    {t.startSub && <p className="text-sm md:text-lg opacity-40 mt-4 font-light">{t.startSub}</p>}
                                </div>
                                <div className="flex flex-row items-center justify-center w-full md:w-[45%] gap-4 md:gap-8 flex-wrap mt-8 md:mt-0">
                                    <OrbitCheckbox label={t.typeOther} selected={requestTypes.includes('other') || requestTypes.includes('aiops')} onClick={() => toggleRequestType('other')} isDark={isDark} onMouseEnter={(e) => handleTooltip(e, t.tooltipAiOPS)} onMouseMove={(e) => handleTooltip(e, t.tooltipAiOPS)} onMouseLeave={hideTooltip} />
                                    <OrbitCheckbox label={t.typeProject} selected={requestTypes.includes('project')} onClick={() => toggleRequestType('project')} isDark={isDark} onMouseEnter={(e) => handleTooltip(e, t.tooltipAX)} onMouseMove={(e) => handleTooltip(e, t.tooltipAX)} onMouseLeave={hideTooltip} />
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col md:flex-row w-full gap-12 md:gap-16">
                                <div className="w-full md:w-[48%] text-left flex flex-col shrink-0">
                                    <span className="text-sm font-black opacity-30 mb-4 block">{currentStepNumber} — {totalSteps}</span>
                                    {currentStep === 'project_scope' && (<><h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-[1.3] mb-8 whitespace-pre-wrap break-keep"><GlitchText text={t.stepScopeTitle} /></h2><p className="text-xl opacity-40 break-keep">{t.stepScopeSub}</p></>)}
                                    {currentStep === 'project_budget' && (<h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-[1.3] mb-12 whitespace-pre-wrap break-keep"><GlitchText text={t.stepBudgetTitle} /></h2>)}
                                    {currentStep === 'project_schedule' && (<h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-[1.3] mb-16 whitespace-pre-wrap break-keep"><GlitchText text={t.stepScheduleTitle} /></h2>)}
                                    {currentStep === 'ai_team' && (<h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-[1.3] mb-12 whitespace-pre-wrap break-keep"><GlitchText text={t.stepTeamTitle} /></h2>)}
                                    {currentStep === 'ai_cost' && (<><h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-[1.3] mb-8 whitespace-pre-wrap break-keep"><GlitchText text={t.stepCostTitle} /></h2><p className="text-xl opacity-40 break-keep">{t.stepCostSub}</p></>)}
                                    {currentStep === 'ai_tools' && (<><h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-[1.3] mb-8 whitespace-pre-wrap break-keep"><GlitchText text={t.stepToolsTitle} /></h2><p className="text-xl opacity-40 break-keep">{t.stepToolsSub}</p></>)}
                                    {currentStep === 'common_date' && (
                                        <>
                                            <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-[1.3] mb-8 whitespace-pre-wrap break-keep"><GlitchText text={t.stepConsultDateTitle} /></h2>
                                            {formData.consultationSlots.length > 0 && (
                                                <div className="space-y-8 animate-fade-in-up w-full max-w-md">
                                                    {formData.consultationSlots.map((slot, i) => (
                                                        <div key={slot.date.toISOString()} className="flex flex-col gap-4">
                                                            <div className="flex items-center justify-between border-b border-current/10 pb-2">
                                                                <div className="flex flex-col">
                                                                    <span className="text-[10px] font-black opacity-30 uppercase tracking-[0.2em] mb-1">{t.option || "OPTION"} {i + 1}</span>
                                                                    <span className="text-xl font-black tracking-tighter"> {slot.date.getFullYear()}. {String(slot.date.getMonth() + 1).padStart(2, '0')}. {String(slot.date.getDate()).padStart(2, '0')} </span>
                                                                </div>
                                                                <button onClick={() => toggleConsultDate(slot.date)} className="p-2 opacity-30 hover:opacity-100 hover:scale-110 transition-all"><X size={16} /></button>
                                                            </div>
                                                            <div className="flex flex-wrap gap-2">
                                                                {BUSINESS_HOURS.map(time => (
                                                                    <button key={time} onClick={() => toggleSlotTime(slot.date.toDateString(), time)} className={`px-3 py-2 rounded-lg text-xs font-bold transition-all border ${slot.times.includes(time) ? (isDark ? 'bg-white text-black border-white shadow-md' : 'bg-black text-white border-black shadow-md') : (isDark ? 'opacity-40 hover:opacity-100 bg-white/5 border-white/10' : 'opacity-40 hover:opacity-100 bg-black/5 border-black/10')}`} > {time} </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </>
                                    )}
                                    {currentStep === 'common_info' && (<h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-[1.3] mb-16 whitespace-pre-wrap break-keep"><GlitchText text={t.stepInfoTitle} /></h2>)}
                                    {currentStep === 'common_extra' && (<h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-[1.3] mb-12 whitespace-pre-wrap break-keep"><GlitchText text={t.stepExtraTitle} /></h2>)}
                                </div>
                                <div className="w-full md:w-[52%] pt-2 flex flex-col md:translate-x-[30px]">
                                    {currentStep === 'project_scope' && (<div className="flex flex-wrap gap-3 md:gap-4 max-w-2xl">{t.options.scopes.map((opt: string) => (<button key={opt} onClick={() => setFormData(prev => ({ ...prev, scopes: prev.scopes.includes(opt) ? prev.scopes.filter(s => s !== opt) : [...prev.scopes, opt] }))} className={`py-4 px-6 md:py-6 md:px-8 rounded-full text-base md:text-lg font-bold transition-all text-left break-keep ${formData.scopes.includes(opt) ? (isDark ? 'bg-white text-black' : 'bg-black text-white') : (isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-white hover:bg-black/5 shadow-sm')}`}>{opt}</button>))}</div>)}
                                    {currentStep === 'project_budget' && (<div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-2xl">{t.options.budgets.map((opt: string) => (<button key={opt} onClick={() => setFormData({ ...formData, budget: opt })} className={`h-24 md:h-32 rounded-[30px] md:rounded-[40px] text-lg md:text-2xl font-bold transition-all break-keep ${formData.budget === opt ? (isDark ? 'bg-white text-black' : 'bg-black text-white') : (isDark ? 'bg-white/10 text-white shadow-inner' : 'bg-white hover:bg-black/5 shadow-sm')}`}>{opt}</button>))}</div>)}
                                    {currentStep === 'project_schedule' && (<div className="space-y-16 w-full max-w-4xl"><DateScroller label={t.startDate} value={formData.startDate} onChange={v => setFormData({ ...formData, startDate: v })} /><div className="w-full h-px bg-current opacity-10" /><DateScroller label={t.endDate} value={formData.endDate} onChange={v => setFormData({ ...formData, endDate: v })} /></div>)}
                                    {currentStep === 'ai_team' && (<div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-2xl">{t.options.teamSizes.map((opt: string) => (<button key={opt} onClick={() => setFormData({ ...formData, teamSize: opt })} className={`h-24 md:h-32 rounded-[30px] md:rounded-[40px] text-xl md:text-2xl font-bold transition-all break-keep ${formData.teamSize === opt ? (isDark ? 'bg-white text-black' : 'bg-black text-white') : (isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-white hover:bg-black/5 shadow-sm')}`}>{opt}</button>))}</div>)}
                                    {currentStep === 'ai_cost' && (<div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">{t.options.aiCosts.map((opt: string) => (<button key={opt} onClick={() => setFormData({ ...formData, aiCost: opt })} className={`h-24 md:h-32 rounded-[30px] md:rounded-[40px] text-lg md:text-xl font-bold transition-all px-6 break-keep ${formData.aiCost === opt ? (isDark ? 'bg-white text-black' : 'bg-black text-white') : (isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-white hover:bg-black/5 shadow-sm')}`}>{opt}</button>))}</div>)}
                                    {currentStep === 'ai_tools' && (<div className="flex flex-col gap-6 max-w-2xl"><div className="flex flex-wrap gap-3 md:gap-4">{t.options.aiTools.map((opt: string) => (<button key={opt} onClick={() => toggleAiTool(opt)} className={`py-4 px-6 md:py-6 md:px-8 rounded-full text-base md:text-lg font-bold transition-all text-left break-keep ${formData.aiTools.includes(opt) ? (isDark ? 'bg-white text-black' : 'bg-black text-white') : (isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-white hover:bg-black/5 shadow-sm')}`}>{opt}</button>))}</div>{formData.aiTools.some(t => t.includes('기타') || t.includes('Other') || t.includes('その他')) && (<textarea className={`w-full p-6 rounded-[30px] text-lg font-medium outline-none transition-all ${isDark ? 'bg-white/5 focus:bg-white/10 border border-white/10' : 'bg-white focus:bg-black/[0.02] border border-black/10 shadow-inner'}`} placeholder={t.placeholderAiTools} value={formData.aiToolsOther} onChange={e => setFormData({ ...formData, aiToolsOther: e.target.value })} />)}</div>)}
                                    {currentStep === 'common_date' && (<div className="flex flex-col gap-12 max-w-2xl"> <div className="flex flex-col gap-2"> <span className="text-xs font-bold opacity-40 uppercase tracking-widest mb-4 block">{t.maxDatesHint}</span> <CustomCalendar selectedDates={formData.consultationSlots.map(s => s.date)} onToggleDate={toggleConsultDate} isDark={isDark} /> </div> </div>)}
                                    {currentStep === 'common_info' && (<div className="flex flex-col gap-8 w-full max-w-2xl"><div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full">{['company', 'name', 'email', 'phone'].map(field => (<div key={field} className="border-b-2 border-current/20 focus-within:border-current transition-colors pb-4"><input type="text" className="bg-transparent w-full text-3xl md:text-4xl font-bold outline-none placeholder:opacity-20" placeholder={t.placeholders?.[field] || field.toUpperCase()} value={(formData as any)[field]} onChange={e => setFormData({ ...formData, [field]: e.target.value })} /></div>))}</div><label className="mt-8 flex items-center gap-4 cursor-pointer"><div className={`w-8 h-8 border-2 border-current flex items-center justify-center transition-colors ${formData.privacyAgreed ? 'bg-current' : 'bg-transparent'}`}>{formData.privacyAgreed && <Check size={20} className={isDark ? "text-black" : "text-white"} />}</div><input type="checkbox" className="hidden" checked={formData.privacyAgreed} onChange={e => setFormData({ ...formData, privacyAgreed: e.target.checked })} /><span className="text-lg font-medium underline opacity-60 hover:opacity-100 break-keep">{t.privacy}</span></label></div>)}
                                    {currentStep === 'common_extra' && (<div className="max-w-2xl space-y-8 w-full"><textarea className={`w-full min-h-[250px] md:min-h-[300px] p-8 md:p-10 rounded-[30px] md:rounded-[40px] text-lg md:text-xl font-medium outline-none transition-all ${isDark ? 'bg-white/5 focus:bg-white/10 border border-white/10' : 'bg-white focus:bg-black/[0.02] border border-black/10 shadow-inner'}`} placeholder={t.placeholderDetails} value={formData.details} onChange={e => setFormData({ ...formData, details: e.target.value })} /><div className="flex flex-col md:flex-row items-center justify-between p-6 md:p-8 rounded-[24px] md:rounded-[30px] border-2 border-dashed border-current/20 gap-4"><div className="flex items-center gap-4 opacity-50"><Paperclip size={24} /> <span className="text-base md:text-lg break-keep">{t.fileUpload}</span></div><button className={`w-full md:w-auto px-8 py-3 rounded-full font-black uppercase text-xs md:text-sm break-keep ${isDark ? 'bg-white text-black' : 'bg-black text-white'}`}>{t.btnFileUpload}</button></div></div>)}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
            {!isSuccess && (
                <div className="px-6 py-6 md:px-8 md:py-8 flex items-center justify-between">
                    <button onClick={handlePrev} className={`px-8 py-4 md:px-12 md:py-6 rounded-full text-lg md:text-2xl font-black transition-all hover:bg-current/10 ${isDark ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-gray-200 text-black hover:bg-gray-300'} ${currentStep === 'intro' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>{t.btnPrev}</button>
                    <button disabled={currentStep === 'intro' ? requestTypes.length === 0 : currentStep === 'common_info' ? !formData.privacyAgreed : currentStep === 'common_date' ? (formData.consultationSlots.length === 0 || formData.consultationSlots.some(s => s.times.length === 0)) : false} onClick={handleNext} className={`px-8 py-4 md:px-12 md:py-6 rounded-full text-lg md:text-2xl font-black transition-all ${isDark ? 'bg-white text-black' : 'bg-black text-white'} disabled:opacity-30 disabled:grayscale`}> {isSubmitting ? t.sending : (currentStep === 'common_extra' ? t.btnSubmit : (currentStep === 'intro' ? t.btnStart : t.btnNext))} </button>
                </div>
            )}
        </div>
    );
};