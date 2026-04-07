import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Pencil, Layers, Rocket } from 'lucide-react';
import { ProjectType } from '../types';

interface PreviewPlaceholderProps {
  isGenerating: boolean;
  isDarkMode: boolean;
  projectType?: ProjectType;
  streamingChars?: number;
  userPrompt?: string;
}

const FolateLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="4" y="3" width="16" height="7" rx="2" />
    <rect x="4" y="14" width="16" height="7" rx="2" />
    <path d="M8 10v4" />
    <path d="M16 10v4" />
  </svg>
);

const BRAND = 'folate';

const CAROUSEL_CARDS = [
  { gradient: 'from-violet-500 to-fuchsia-500', shape: 'circle' },
  { gradient: 'from-blue-500 to-cyan-400', shape: 'triangle' },
  { gradient: 'from-emerald-500 to-teal-400', shape: 'square' },
  { gradient: 'from-orange-500 to-amber-400', shape: 'diamond' },
  { gradient: 'from-rose-500 to-pink-400', shape: 'circle' },
  { gradient: 'from-indigo-500 to-blue-400', shape: 'triangle' },
];

const FEATURES = [
  { icon: Sparkles, title: 'Generate', subtitle: 'Start with a prompt, we handle the rest' },
  { icon: Pencil, title: 'Customize', subtitle: 'Edit anything with follow-up prompts' },
  { icon: Layers, title: 'Multi-page', subtitle: 'Complete websites with navigation' },
  { icon: Rocket, title: 'Deploy', subtitle: 'Launch instantly with one click' },
];

// Shape components for carousel cards
const Shape: React.FC<{ type: string }> = ({ type }) => {
  switch (type) {
    case 'circle':
      return <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm" />;
    case 'triangle':
      return (
        <div className="w-0 h-0 border-l-[32px] border-r-[32px] border-b-[56px] border-l-transparent border-r-transparent border-b-white/20" />
      );
    case 'square':
      return <div className="w-14 h-14 rounded-lg bg-white/20 backdrop-blur-sm rotate-12" />;
    case 'diamond':
      return <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rotate-45 rounded-sm" />;
    default:
      return <div className="w-16 h-16 rounded-full bg-white/20" />;
  }
};

const letterVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.3 + i * 0.08, duration: 0.4, ease: 'easeOut' },
  }),
};

export const PreviewPlaceholder: React.FC<PreviewPlaceholderProps> = ({
  isGenerating,
  isDarkMode,
  streamingChars = 0,
  userPrompt,
}) => {
  const [phase, setPhase] = useState(1);
  const [featureIndex, setFeatureIndex] = useState(0);

  const progressPct = isGenerating
    ? Math.min(5 + (streamingChars / 65_000) * 88, 95)
    : 0;

  const promptDisplay = useMemo(() => {
    if (!userPrompt) return '';
    return userPrompt.length > 60 ? userPrompt.slice(0, 60).trimEnd() + '\u2026' : userPrompt;
  }, [userPrompt]);

  // Phase auto-advance
  useEffect(() => {
    if (!isGenerating) {
      setPhase(1);
      setFeatureIndex(0);
      return;
    }

    // Phase 1 → 2 after 2s
    const t1 = setTimeout(() => setPhase(2), 2000);
    // Phase 2 → 3 after 8s
    const t2 = setTimeout(() => setPhase(3), 8000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [isGenerating]);

  // Feature carousel cycling in phase 3
  useEffect(() => {
    if (phase !== 3 || !isGenerating) return;
    const interval = setInterval(() => {
      setFeatureIndex(prev => (prev + 1) % FEATURES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [phase, isGenerating]);

  return (
    <div className={`w-full h-full flex flex-col items-center justify-center relative overflow-hidden ${isDarkMode ? 'bg-[#0a0d14]' : 'bg-gray-50'}`}>

      {/* Progress bar */}
      <motion.div
        className="absolute top-0 left-0 h-[2px] bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 z-50"
        initial={{ width: '0%', opacity: 0 }}
        animate={isGenerating
          ? { width: `${progressPct}%`, opacity: 1 }
          : { width: '0%', opacity: 0 }}
        transition={{ ease: 'linear', duration: 0.5 }}
      />

      {/* Background gradient blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={isGenerating
            ? { opacity: [0.6, 1, 0.6], scale: [1, 1.06, 1] }
            : { opacity: 0.5, scale: 1 }}
          transition={{ repeat: isGenerating ? Infinity : 0, duration: 4, ease: 'easeInOut' }}
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl ${isDarkMode ? 'bg-blue-600/[0.14]' : 'bg-blue-500/[0.20]'}`}
        />
        <motion.div
          animate={isGenerating
            ? { opacity: [0.4, 0.8, 0.4], scale: [1, 1.08, 1] }
            : { opacity: 0.4, scale: 1 }}
          transition={{ repeat: isGenerating ? Infinity : 0, duration: 5, delay: 1, ease: 'easeInOut' }}
          className={`absolute top-1/3 left-1/3 w-[400px] h-[400px] rounded-full blur-3xl ${isDarkMode ? 'bg-purple-600/[0.10]' : 'bg-purple-500/[0.14]'}`}
        />
      </div>

      {/* Phase content */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
        <AnimatePresence mode="wait">

          {/* === PHASE 1: Logo intro === */}
          {phase === 1 && (
            <motion.div
              key="phase1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center gap-6"
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15, duration: 0.8 }}
                className={`relative w-24 h-24 rounded-2xl flex items-center justify-center border ${isDarkMode ? 'bg-white/[0.03] border-white/[0.08]' : 'bg-white border-gray-200 shadow-lg'}`}
              >
                {/* Pulse ring */}
                <motion.div
                  animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                  className={`absolute inset-0 rounded-2xl ${isDarkMode ? 'border-2 border-blue-500/30' : 'border-2 border-blue-400/30'}`}
                />
                <FolateLogo className={`w-12 h-12 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              </motion.div>

              {/* Letter-by-letter brand */}
              <div className="flex items-center gap-0.5">
                {BRAND.split('').map((letter, i) => (
                  <motion.span
                    key={i}
                    custom={i}
                    variants={letterVariants}
                    initial="hidden"
                    animate="visible"
                    className={`text-3xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                  >
                    {letter}
                  </motion.span>
                ))}
              </div>

              {isGenerating && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}
                >
                  Preparing your workspace...
                </motion.p>
              )}
            </motion.div>
          )}

          {/* === PHASE 2: 3D Card Carousel === */}
          {phase === 2 && (
            <motion.div
              key="phase2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center gap-8 w-full"
            >
              {/* 3D Carousel */}
              <div className="relative w-full flex items-center justify-center" style={{ perspective: '1000px', height: '280px' }}>
                <motion.div
                  animate={{ rotateY: 360 }}
                  transition={{ repeat: Infinity, duration: 18, ease: 'linear' }}
                  className="relative"
                  style={{
                    transformStyle: 'preserve-3d',
                    width: '180px',
                    height: '120px',
                  }}
                >
                  {CAROUSEL_CARDS.map((card, i) => {
                    const angle = (360 / CAROUSEL_CARDS.length) * i;
                    return (
                      <div
                        key={i}
                        className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-2xl`}
                        style={{
                          transform: `rotateY(${angle}deg) translateZ(220px)`,
                          backfaceVisibility: 'hidden',
                        }}
                      >
                        <Shape type={card.shape} />
                      </div>
                    );
                  })}
                </motion.div>
              </div>

              {/* User prompt in frosted pill */}
              {promptDisplay && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className={`px-6 py-3 rounded-full backdrop-blur-xl border max-w-md ${
                    isDarkMode
                      ? 'bg-white/[0.06] border-white/[0.1] text-gray-300'
                      : 'bg-white/70 border-gray-200/60 text-gray-700 shadow-lg'
                  }`}
                >
                  <p className="text-sm font-medium text-center truncate">{promptDisplay}</p>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* === PHASE 3: Feature Showcase === */}
          {phase === 3 && (
            <motion.div
              key="phase3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-center w-full h-full relative px-8"
            >
              {/* Vertical step indicator (left side) */}
              <div className="absolute left-8 top-1/2 -translate-y-1/2 flex flex-col items-center gap-3">
                {FEATURES.map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      scale: i === featureIndex ? 1.4 : 1,
                      backgroundColor: i === featureIndex
                        ? '#3b82f6'
                        : i < featureIndex
                          ? isDarkMode ? '#374151' : '#d1d5db'
                          : isDarkMode ? '#1f2937' : '#e5e7eb',
                    }}
                    transition={{ duration: 0.3 }}
                    className="w-2.5 h-2.5 rounded-full"
                  />
                ))}
                {/* Connecting line */}
                <div className={`absolute top-0 bottom-0 w-px -z-10 ${isDarkMode ? 'bg-white/[0.06]' : 'bg-gray-200'}`} />
              </div>

              {/* Feature card */}
              <div className="flex flex-col items-center gap-6 max-w-sm">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={featureIndex}
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -30, scale: 0.95 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="flex flex-col items-center gap-5"
                  >
                    {/* Icon container */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
                      className={`w-20 h-20 rounded-2xl flex items-center justify-center ${
                        isDarkMode
                          ? 'bg-blue-500/10 border border-blue-500/20'
                          : 'bg-blue-50 border border-blue-100 shadow-sm'
                      }`}
                    >
                      {React.createElement(FEATURES[featureIndex].icon, {
                        className: `w-9 h-9 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`,
                      })}
                    </motion.div>

                    {/* Title */}
                    <h2 className={`text-2xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {FEATURES[featureIndex].title}
                    </h2>

                    {/* Subtitle */}
                    <p className={`text-sm text-center leading-relaxed ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      {FEATURES[featureIndex].subtitle}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Bottom status bar */}
              <div className={`absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2.5 px-4 py-2.5 rounded-full border ${
                isDarkMode
                  ? 'bg-white/[0.04] border-white/[0.08] text-gray-500'
                  : 'bg-white border-gray-200 text-gray-400 shadow-sm'
              }`}>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                  className={`w-4 h-4 rounded-full border-2 border-t-transparent ${isDarkMode ? 'border-blue-500' : 'border-blue-400'}`}
                />
                <span className="text-xs font-medium">
                  Generation usually takes 30–60 seconds
                </span>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Idle state — shown when NOT generating */}
      {!isGenerating && phase === 1 && (
        <div className="absolute bottom-8 flex flex-wrap items-center justify-center gap-2 px-6 max-w-lg">
          {[
            { label: 'Multi-page websites' },
            { label: 'Mobile Apps' },
            { label: 'Export as ZIP' },
            { label: 'AI-powered edits' },
          ].map((f, i) => (
            <div
              key={i}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium border ${
                isDarkMode
                  ? 'bg-white/[0.03] border-white/[0.07] text-gray-400'
                  : 'bg-white border-gray-200 text-gray-500 shadow-sm'
              }`}
            >
              {f.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
