import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Download, Sparkles, Pencil, Smartphone } from 'lucide-react';
import { ProjectType } from '../types';

interface PreviewPlaceholderProps {
  isGenerating: boolean;
  isDarkMode: boolean;
  projectType?: ProjectType;
  streamingChars?: number;
}

const FolateLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="4" y="3" width="16" height="7" rx="2" />
    <rect x="4" y="14" width="16" height="7" rx="2" />
    <path d="M8 10v4" />
    <path d="M16 10v4" />
  </svg>
);

const features = [
  { icon: Globe, label: "Multi-page websites" },
  { icon: Smartphone, label: "Mobile Apps" },
  { icon: Download, label: "Export as ZIP" },
  { icon: Pencil, label: "Follow-up edits with AI" },
  { icon: Sparkles, label: "Powered by Gemini" },
];

export const PreviewPlaceholder: React.FC<PreviewPlaceholderProps> = ({
  isGenerating,
  isDarkMode,
  projectType,
  streamingChars = 0,
}) => {
  const typeLabel = projectType === ProjectType.MOBILE_APP ? 'app' : 'project';
  const progressPct = isGenerating
    ? Math.min(5 + (streamingChars / 65_000) * 88, 95)
    : 0;

  return (
    <div className={`w-full h-full flex flex-col items-center justify-center relative overflow-hidden ${isDarkMode ? 'bg-[#0a0d14]' : 'bg-gray-50'}`}>

      {/* Progress bar */}
      <motion.div
        className="absolute top-0 left-0 h-[2px] bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"
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

      <div className="relative z-10 flex flex-col items-center gap-7 max-w-md px-6 text-center">

        {/* Logo */}
        <motion.div
          animate={!isGenerating ? { scale: [1, 1.04, 1] } : { scale: 1 }}
          transition={!isGenerating ? { repeat: Infinity, duration: 3, ease: 'easeInOut' } : {}}
          className={`relative w-20 h-20 rounded-2xl flex items-center justify-center border ${isDarkMode ? 'bg-white/[0.03] border-white/[0.08]' : 'bg-white border-gray-200 shadow-sm'}`}
        >
          {/* Static ring while generating */}
          {isGenerating && (
            <div className="absolute inset-0 rounded-2xl border border-blue-500/40" />
          )}
          <FolateLogo className={`w-10 h-10 relative z-10 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
        </motion.div>

        {/* Status text */}
        <AnimatePresence mode="wait">
          {isGenerating ? (
            <motion.div
              key="generating"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col items-center gap-3"
            >
              <h2 className={`text-xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Generating your {typeLabel}
              </h2>

              {/* Char count — fades in once streaming starts */}
              <AnimatePresence>
                {streamingChars > 0 && (
                  <motion.span
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`text-xs tabular-nums ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}
                  >
                    {(streamingChars / 1000).toFixed(1)}k chars
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col items-center gap-3"
            >
              <h2 className={`text-xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                folate
              </h2>
              <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                Your generated preview will appear here.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Feature pills — hidden during generation */}
        <AnimatePresence>
          {!isGenerating && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.3 }}
              className="flex flex-wrap items-center justify-center gap-2"
            >
              {features.map((f, i) => {
                const Icon = f.icon;
                return (
                  <div
                    key={i}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium border transition-colors ${
                      isDarkMode
                        ? 'bg-white/[0.03] border-white/[0.07] text-gray-400'
                        : 'bg-white border-gray-200 text-gray-500 shadow-sm'
                    }`}
                  >
                    <Icon className={`w-3 h-3 ${isDarkMode ? 'text-blue-400/60' : 'text-blue-500/60'}`} />
                    {f.label}
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};
