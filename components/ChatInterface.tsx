import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { ArrowUp, User, Sparkles, Layout, Palette, Smartphone, Share2, Info, Lightbulb, X, ChevronRight, MessageSquare, ShieldCheck, Zap, Globe, MousePointer2, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Message, ProjectType } from '../types';
import { DesignBreakdown } from './DesignBreakdown';

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  isGenerating: boolean;
  isDarkMode: boolean;
  projectType?: ProjectType;
  streamingChars?: number;
}

const useTypewriter = (phrases: string[]) => {
  const [placeholder, setPlaceholder] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const currentPhrase = phrases[phraseIndex];

    if (isTyping) {
      if (placeholder.length < currentPhrase.length) {
        timeout = setTimeout(() => {
          setPlaceholder(currentPhrase.slice(0, placeholder.length + 1));
        }, 50);
      } else {
        timeout = setTimeout(() => {
          setIsTyping(false);
        }, 2000);
      }
    } else {
      if (placeholder.length > 0) {
        timeout = setTimeout(() => {
          setPlaceholder(currentPhrase.slice(0, placeholder.length - 1));
        }, 30);
      } else {
        setPhraseIndex((prev) => (prev + 1) % phrases.length);
        setIsTyping(true);
      }
    }
    return () => clearTimeout(timeout);
  }, [placeholder, isTyping, phraseIndex, phrases]);

  return placeholder;
};

const TypewriterMessage: React.FC<{ content: string }> = ({ content }) => {
  const [displayedContent, setDisplayedContent] = useState('');

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < content.length) {
        setDisplayedContent(content.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 5);
    return () => clearInterval(interval);
  }, [content]);

  return <div className="whitespace-pre-wrap">{displayedContent}</div>;
};

const PLACEHOLDER_PHRASES = [
  "Make the background darker...",
  "Add a navigation bar...",
  "Change the font to Inter...",
  "Fix the responsive layout...",
  "Add a contact form..."
];

const FolateLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="4" y="3" width="16" height="7" rx="2" />
    <rect x="4" y="14" width="16" height="7" rx="2" />
    <path d="M8 10v4" />
    <path d="M16 10v4" />
  </svg>
);

export const ChatInterface: React.FC<ChatInterfaceProps> = React.memo(({ messages, onSendMessage, isGenerating, isDarkMode, projectType, streamingChars = 0 }) => {
  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const suggestions = useMemo(() => {
    if (messages.length === 0) return [];

    if (projectType === ProjectType.MOBILE_APP) {
      return [
        { label: "Add Screen", prompt: "Add a new screen appropriate to the app and link it from the bottom navigation.", icon: Smartphone },
        { label: "Dark Mode", prompt: "Add a dark mode theme to all screens, toggle-able from the settings or profile screen.", icon: Sparkles },
        { label: "Animations", prompt: "Add smooth screen transition animations and micro-interactions to all buttons and cards.", icon: Zap },
        { label: "Onboarding", prompt: "Add a 3-step onboarding flow shown on first launch with illustrations and a 'Get Started' CTA.", icon: Layout },
      ];
    }

    const lastUserMessage = messages.filter(m => m.role === 'user').pop()?.content.toLowerCase() || '';

    if (lastUserMessage.includes('saas') || lastUserMessage.includes('software') || lastUserMessage.includes('app')) {
      return [
        { label: "Add Pricing Table", prompt: "Add a modern 3-tier pricing section with a monthly/yearly toggle and a 'Most Popular' badge for the middle plan.", icon: Zap },
        { label: "Integrate FAQ", prompt: "Add a frequently asked questions section with an accordion style layout for common SaaS inquiries.", icon: MessageSquare },
        { label: "Style Tech Stack", prompt: "Add a 'Built With' section showing logos of modern technologies like React, Tailwind, and Node.js.", icon: Layout },
        { label: "Add Feature Grid", prompt: "Create a 3x2 grid of features with sleek icons and descriptive text for the platform's capabilities.", icon: Sparkles }
      ];
    }
    return [
      { label: "Add Navigation", prompt: "Add a responsive sticky navigation bar with a logo and links to different sections.", icon: Layout },
      { label: "Dark Theme Toggle", prompt: "Add a dark/light mode toggle to the header that changes the entire site's color scheme.", icon: Sparkles },
      { label: "Mobile Optimization", prompt: "Ensure all sections are fully responsive and look great on small mobile screens.", icon: Smartphone },
      { label: "Improve Copy", prompt: "Refine the marketing copy and headings to be more persuasive and professional.", icon: Info }
    ];
  }, [messages, projectType]);

  const activePlaceholder = useTypewriter(PLACEHOLDER_PHRASES);

  useEffect(() => {
    if (!isGenerating) { setElapsedSeconds(0); return; }
    setElapsedSeconds(0);
    const id = setInterval(() => setElapsedSeconds(s => s + 1), 1000);
    return () => clearInterval(id);
  }, [isGenerating]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = useCallback((e?: React.FormEvent) => {
    e?.preventDefault();
    if (input.trim() && !isGenerating) {
      onSendMessage(input);
      setInput('');
      if (textareaRef.current) textareaRef.current.style.height = 'auto';
    }
  }, [input, isGenerating, onSendMessage]);

  const handleSuggestionClick = useCallback((prompt: string) => {
    setInput(prompt);
    textareaRef.current?.focus();
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
      }
    }, 0);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }, [handleSubmit]);

  const adjustTextareaHeight = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  }, []);

  return (
    <div className="flex flex-col h-full bg-transparent transition-colors duration-300">
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6 pt-6">
        {messages.map((msg, idx) => {
          const isUser = msg.role === 'user';
          return (
            <div key={idx} className={`flex gap-3 w-full ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border ${
                isUser
                  ? 'bg-blue-600 border-blue-700'
                  : isDarkMode ? 'bg-blue-900/30 border-blue-800' : 'bg-blue-50 border-blue-100'
              }`}>
                {isUser ? <User className="w-3.5 h-3.5 text-white" /> : <FolateLogo className={`w-3.5 h-3.5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />}
              </div>
              <div className={`flex flex-col max-w-[80%] ${isUser ? 'items-end' : 'items-start'}`}>
                <div className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm transition-colors ${
                  isUser
                    ? 'bg-blue-600 text-white border border-transparent shadow-md'
                    : isDarkMode ? 'bg-white/[0.06] backdrop-blur-sm border border-white/5 text-gray-300' : 'bg-white border border-gray-100 text-gray-600 shadow-sm'
                }`}>
                  {isUser ? (
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  ) : (
                    <>
                      {msg.designMeta && <DesignBreakdown designMeta={msg.designMeta} isDarkMode={isDarkMode} animate={idx === messages.length - 1} />}
                      {idx === messages.length - 1 ? <TypewriterMessage content={msg.content} /> : <div className="whitespace-pre-wrap">{msg.content}</div>}
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {isGenerating && (() => {
          const lastUserMessage = messages.filter(m => m.role === 'user').pop()?.content ?? '';
          const description = lastUserMessage.length > 110
            ? lastUserMessage.slice(0, 110).trimEnd() + '\u2026'
            : lastUserMessage;

          let currentFile: string;
          let currentActivity: string;
          if (projectType === ProjectType.MOBILE_APP) {
            if (streamingChars < 10_000)      { currentFile = 'index.html'; currentActivity = 'Designing screen layouts'; }
            else if (streamingChars < 30_000) { currentFile = 'index.html'; currentActivity = 'Styling mobile components'; }
            else if (streamingChars < 55_000) { currentFile = 'index.html'; currentActivity = 'Adding screen navigation'; }
            else                              { currentFile = 'index.html'; currentActivity = 'Assembling final build'; }
          } else {
            if (streamingChars < 10_000)      { currentFile = 'index.html';  currentActivity = 'Writing page structure & content'; }
            else if (streamingChars < 30_000) { currentFile = 'styles.css';  currentActivity = 'Applying Tailwind styles'; }
            else if (streamingChars < 55_000) { currentFile = 'scripts.js';  currentActivity = 'Adding interactivity'; }
            else                              { currentFile = 'index.html';  currentActivity = 'Assembling final build'; }
          }

          return (
            <div className="flex gap-3 w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border ${isDarkMode ? 'bg-blue-900/30 border-blue-800' : 'bg-blue-50 border-blue-100'}`}>
                <FolateLogo className={`w-3.5 h-3.5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              </div>
              <div className="flex flex-col gap-2 max-w-[82%] pt-0.5">
                <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  {streamingChars === 0 ? 'Thinking\u2026' : `Thought for ${elapsedSeconds}s`}
                </span>
                <AnimatePresence>
                  {streamingChars > 0 && (
                    <motion.div
                      key="building-card"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col gap-2"
                    >
                      <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {description}
                      </p>
                      <span className={`text-xs ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                        Let me build it:
                      </span>
                      <div className={`rounded-xl border px-3.5 py-2.5 ${isDarkMode ? 'bg-white/[0.04] border-white/[0.08]' : 'bg-gray-50 border-gray-200'}`}>
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className={`text-xs shrink-0 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Editing</span>
                            <span className={`text-xs font-mono px-1.5 py-0.5 rounded-md shrink-0 ${isDarkMode ? 'bg-white/[0.08] text-gray-300' : 'bg-white border border-gray-200 text-gray-600'}`}>
                              {currentFile}
                            </span>
                          </div>
                          <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                        </div>
                        <p className={`text-xs mt-1.5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                          {currentActivity}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          );
        })()}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-transparent border-t border-gray-100/10 flex flex-col gap-3">
        <AnimatePresence>
          {!isGenerating && messages.length > 0 && showSuggestions && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="flex flex-col gap-3 px-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-400">Suggestions</span>
                </div>
                <button onClick={() => setShowSuggestions(false)} className="p-0.5 hover:bg-white/5 rounded-md transition-colors">
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide shrink-0">
                {suggestions.map((s, i) => (
                  <button key={i} onClick={() => handleSuggestionClick(s.prompt)} className={`group flex items-center gap-2 px-3 py-1.5 rounded-full border whitespace-nowrap transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${isDarkMode ? 'bg-gray-800 border-gray-700 hover:border-blue-500/50 hover:bg-gray-700' : 'bg-gray-50 border-gray-200 hover:border-blue-300 hover:bg-blue-50'}`}>
                    {s.icon && <s.icon className={`w-3.5 h-3.5 group-hover:scale-110 transition-transform ${isDarkMode ? 'text-blue-400 fill-blue-400/20' : 'text-blue-500 fill-blue-500/20'}`} />}
                    <span className={`text-xs font-medium transition-colors tracking-tight ${isDarkMode ? 'text-gray-200 group-hover:text-white' : 'text-gray-600 group-hover:text-gray-900'}`}>{s.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className={`relative rounded-xl border shadow-sm transition-all ${
          isDarkMode
            ? 'bg-black/60 backdrop-blur-xl border-white/10 focus-within:border-blue-500/60 focus-within:shadow-[0_0_0_3px_rgba(59,130,246,0.12)]'
            : 'bg-white border-gray-200 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-400'
        }`}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={adjustTextareaHeight}
            onKeyDown={handleKeyDown}
            className={`w-full bg-transparent px-4 py-3.5 pr-12 focus:outline-none resize-none max-h-32 min-h-[52px] scrollbar-hide text-sm font-medium leading-relaxed z-10 relative ${
              isDarkMode ? 'text-gray-200 placeholder-gray-500' : 'text-gray-900'
            }`}
            rows={1}
            disabled={isGenerating}
          />
          {!input && (
            <div className={`absolute top-3.5 left-4 pointer-events-none text-sm font-medium flex items-center ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              <span>{activePlaceholder}</span>
              <span className="w-0.5 h-4 bg-blue-400 ml-0.5 animate-pulse"></span>
            </div>
          )}
          <button
            onClick={() => handleSubmit()}
            disabled={!input.trim() || isGenerating}
            className={`absolute right-2 bottom-2 p-1.5 rounded-lg transition-all z-20 ${
              input.trim() && !isGenerating ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md' : isDarkMode ? 'bg-white/5 text-gray-500' : 'bg-gray-100 text-gray-300'
            }`}
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
});
