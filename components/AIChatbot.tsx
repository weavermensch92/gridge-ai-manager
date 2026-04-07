import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Sparkles, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { CHATBOT_CONTEXT } from '../src/data/chatbot_context';

interface Message {
    role: 'user' | 'model';
    text: string;
}

export const AIChatbot: React.FC<{ isDark: boolean; zIndex?: number; onFocus?: () => void; t: any }> = ({ isDark, zIndex = 100, onFocus, t }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: 'model', text: t.greeting }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Update initial greeting when language changes if it's the only message
    useEffect(() => {
        if (messages.length === 1 && messages[0].role === 'model') {
             setMessages([{ role: 'model', text: t.greeting }]);
        }
    }, [t]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSendMessage = async () => {
        if (!inputValue.trim() || isLoading) return;

        const userMessage = inputValue.trim();
        setInputValue('');
        setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: userMessage,
                    context: CHATBOT_CONTEXT
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.details || 'Failed to fetch response');
            }

            const data = await response.json();
            setMessages(prev => [...prev, { role: 'model', text: data.response }]);
        } catch (error: any) {
            console.error("Error sending message:", error);
            setMessages(prev => [...prev, { role: 'model', text: `${t.error}${error.message}` }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // Styles
    const bgColor = isDark ? 'bg-black/80' : 'bg-white/80';
    const borderColor = isDark ? 'border-white/10' : 'border-black/10';
    const textColor = isDark ? 'text-white' : 'text-black';
    const inputBg = isDark ? 'bg-white/5' : 'bg-black/5';

    return (
        <div 
            className="fixed bottom-8 left-8 flex flex-col items-start gap-4 pointer-events-none"
            style={{ zIndex }}
            onClick={onFocus}
        >
            {/* Chat Window */}
            <div 
                className={`
                    w-[350px] md:w-[400px] h-[500px] rounded-2xl border backdrop-blur-xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 origin-bottom-left
                    ${bgColor} ${borderColor} ${textColor}
                    ${isOpen ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto' : 'opacity-0 scale-90 translate-y-10 pointer-events-none'}
                `}
            >
                {/* Header */}
                <div className={`p-4 border-b flex items-center justify-between ${borderColor} ${isDark ? 'bg-white/5' : 'bg-black/5'}`}>
                    <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-lg ${isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                            <Sparkles size={16} />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold">{t.name}</h3>
                            <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-[10px] opacity-60">{t.status}</span>
                            </div>
                        </div>
                    </div>
                    <button 
                        onClick={() => setIsOpen(false)}
                        className={`p-1.5 rounded-lg transition-colors ${isDark ? 'hover:bg-white/10' : 'hover:bg-black/5'}`}
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                            <div 
                                className={`
                                    w-8 h-8 rounded-full flex items-center justify-center shrink-0 border
                                    ${msg.role === 'user' 
                                        ? (isDark ? 'bg-white/10 border-white/20' : 'bg-black/5 border-black/10') 
                                        : (isDark ? 'bg-blue-500/20 border-blue-500/30 text-blue-400' : 'bg-blue-100 border-blue-200 text-blue-600')
                                    }
                                `}
                            >
                                {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                            </div>
                            <div 
                                className={`
                                    max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed
                                    ${msg.role === 'user' 
                                        ? (isDark ? 'bg-white/10 text-white rounded-tr-none' : 'bg-black text-white rounded-tr-none') 
                                        : (isDark ? 'bg-white/5 border border-white/10 rounded-tl-none' : 'bg-white border border-black/5 shadow-sm rounded-tl-none')
                                    }
                                `}
                            >
                                <ReactMarkdown>{msg.text}</ReactMarkdown>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${isDark ? 'bg-blue-500/20 border-blue-500/30 text-blue-400' : 'bg-blue-100 border-blue-200 text-blue-600'}`}>
                                <Bot size={14} />
                            </div>
                            <div className={`px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-2 ${isDark ? 'bg-white/5 border border-white/10' : 'bg-white border border-black/5 shadow-sm'}`}>
                                <Loader2 size={14} className="animate-spin opacity-50" />
                                <span className="text-xs opacity-50">{t.thinking}</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className={`p-4 border-t ${borderColor} ${isDark ? 'bg-black/20' : 'bg-white/50'}`}>
                    <div className={`flex items-center gap-2 rounded-xl px-4 py-2 border transition-all focus-within:ring-2 focus-within:ring-blue-500/50 ${inputBg} ${borderColor}`}>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={t.placeholder}
                            className="flex-1 bg-transparent outline-none text-sm placeholder:opacity-40"
                            disabled={isLoading}
                        />
                        <button 
                            onClick={handleSendMessage}
                            disabled={!inputValue.trim() || isLoading}
                            className={`p-1.5 rounded-lg transition-all ${!inputValue.trim() || isLoading ? 'opacity-30 cursor-not-allowed' : 'opacity-100 hover:scale-110 text-blue-500'}`}
                        >
                            <Send size={18} />
                        </button>
                    </div>
                    <div className="text-[10px] text-center mt-2 opacity-30">
                        {t.disclaimer}
                    </div>
                </div>
            </div>

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    w-14 h-14 rounded-full flex items-center justify-center shadow-lg border transition-all duration-300 hover:scale-110 hover:shadow-blue-500/20 pointer-events-auto
                    ${isOpen ? 'rotate-90 bg-red-500 text-white border-red-400' : (isDark ? 'bg-blue-600 text-white border-blue-400' : 'bg-blue-500 text-white border-blue-400')}
                `}
            >
                {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
            </button>
        </div>
    );
};
