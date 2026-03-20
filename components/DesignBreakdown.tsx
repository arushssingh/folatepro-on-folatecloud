import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DesignMeta } from '../types';

interface DesignBreakdownProps {
  designMeta: DesignMeta;
  isDarkMode: boolean;
  animate?: boolean;
}

function contrastColor(hex: string): string {
  const c = hex.replace('#', '');
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.55 ? '#1a1a1a' : '#ffffff';
}

const phaseVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, x: -8 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: 'easeOut' } },
};

// Typewriter component for streaming text
const SummaryTypewriter: React.FC<{ text: string; onComplete: () => void }> = ({ text, onComplete }) => {
  const [displayed, setDisplayed] = useState('');
  const completeRef = useRef(false);

  useEffect(() => {
    let index = 0;
    completeRef.current = false;
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayed(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
        if (!completeRef.current) {
          completeRef.current = true;
          onComplete();
        }
      }
    }, 10);
    return () => clearInterval(interval);
  }, [text, onComplete]);

  return <>{displayed}</>;
};

export const DesignBreakdown: React.FC<DesignBreakdownProps> = ({ designMeta, isDarkMode, animate = true }) => {
  const [paletteIndex, setPaletteIndex] = useState(0);
  const [revealPhase, setRevealPhase] = useState(animate ? 0 : 4);
  const [isShuffling, setIsShuffling] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shuffleRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const palette = designMeta.colorPalette;
  const currentColor = palette[paletteIndex];

  const prevColor = () => { if (!isShuffling) setPaletteIndex(i => (i - 1 + palette.length) % palette.length); };
  const nextColor = () => { if (!isShuffling) setPaletteIndex(i => (i + 1) % palette.length); };

  // Phase advancement: summary typewriter completion triggers phase 2
  const handleSummaryComplete = useCallback(() => {
    timeoutRef.current = setTimeout(() => setRevealPhase(2), 400);
  }, []);

  // Start phase 1 (summary) after short delay
  useEffect(() => {
    if (!animate) return;
    timeoutRef.current = setTimeout(() => setRevealPhase(1), 100);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [animate]);

  // When palette phase (2) appears, start shuffling animation
  useEffect(() => {
    if (revealPhase !== 2 || !animate || palette.length <= 1) {
      if (revealPhase === 2 && animate) {
        // No shuffle needed, advance to next phase
        timeoutRef.current = setTimeout(() => setRevealPhase(3), 1500);
      }
      return;
    }

    setIsShuffling(true);
    let cycles = 0;
    const totalCycles = palette.length * 3; // cycle through all colors 3 times

    shuffleRef.current = setInterval(() => {
      cycles++;
      setPaletteIndex(cycles % palette.length);
      if (cycles >= totalCycles) {
        if (shuffleRef.current) clearInterval(shuffleRef.current);
        setPaletteIndex(0);
        setIsShuffling(false);
        // Advance to design style after shuffle settles
        timeoutRef.current = setTimeout(() => setRevealPhase(3), 500);
      }
    }, 180);

    return () => {
      if (shuffleRef.current) clearInterval(shuffleRef.current);
    };
  }, [revealPhase, animate, palette.length]);

  // Phase 3 → 4 transition (design style → site structure)
  useEffect(() => {
    if (revealPhase === 3 && animate) {
      const itemCount = designMeta.designStyle.length;
      const staggerTime = itemCount * 200 + 400;
      timeoutRef.current = setTimeout(() => setRevealPhase(4), staggerTime);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [revealPhase, animate, designMeta.designStyle.length]);

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Phase 1: Summary — typewriter streaming */}
      <AnimatePresence>
        {revealPhase >= 1 && (
          <motion.p
            key="summary"
            variants={phaseVariants}
            initial={animate ? 'hidden' : 'visible'}
            animate="visible"
            className={`text-sm leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
          >
            {animate && revealPhase === 1 ? (
              <SummaryTypewriter text={designMeta.summary} onComplete={handleSummaryComplete} />
            ) : (
              designMeta.summary
            )}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Phase 2: Color Palette Carousel with shuffle */}
      <AnimatePresence>
        {revealPhase >= 2 && palette.length > 0 && (
          <motion.div
            key="palette"
            variants={phaseVariants}
            initial={animate ? 'hidden' : 'visible'}
            animate="visible"
            className={`rounded-xl border overflow-hidden ${isDarkMode ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-gray-50 border-gray-200'}`}
          >
            <motion.div
              className="relative"
              style={{ backgroundColor: currentColor?.hex || '#888' }}
              animate={{ backgroundColor: currentColor?.hex || '#888' }}
              transition={{ duration: isShuffling ? 0.15 : 0.3 }}
            >
              <div className="px-4 pt-4 pb-12">
                <motion.span
                  key={currentColor?.hex}
                  initial={isShuffling ? { opacity: 0, scale: 0.9 } : false}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.15 }}
                  className="text-2xl font-bold tracking-tight"
                  style={{ color: contrastColor(currentColor?.hex || '#888') }}
                >
                  {currentColor?.hex}
                </motion.span>
              </div>

              {palette.length > 1 && !isShuffling && (
                <>
                  <button
                    onClick={prevColor}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 shadow-md flex items-center justify-center hover:bg-white transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4 text-gray-700" />
                  </button>
                  <button
                    onClick={nextColor}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 shadow-md flex items-center justify-center hover:bg-white transition-colors"
                  >
                    <ChevronRight className="w-4 h-4 text-gray-700" />
                  </button>
                </>
              )}

              <motion.div
                key={currentColor?.label}
                initial={isShuffling ? { opacity: 0 } : false}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.15 }}
                className={`px-4 py-2.5 text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}
                style={{
                  backgroundColor: isDarkMode ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.85)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                {currentColor?.label}
              </motion.div>
            </motion.div>

            {/* Dots indicator */}
            {palette.length > 1 && (
              <div className="flex items-center justify-center gap-1.5 py-2">
                {palette.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { if (!isShuffling) setPaletteIndex(i); }}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      i === paletteIndex
                        ? 'bg-blue-500 w-3'
                        : isDarkMode ? 'bg-white/20' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Phase 3: Design Style — staggered items */}
      <AnimatePresence>
        {revealPhase >= 3 && designMeta.designStyle.length > 0 && (
          <motion.div
            key="style"
            variants={phaseVariants}
            initial={animate ? 'hidden' : 'visible'}
            animate="visible"
          >
            <h4 className={`text-xs font-semibold uppercase tracking-wider mb-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              Design Style
            </h4>
            <div className={`rounded-xl border px-4 py-3 ${isDarkMode ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-gray-50 border-gray-200'}`}>
              <motion.div
                className="flex flex-col gap-2.5"
                variants={animate ? staggerContainer : undefined}
                initial={animate ? 'hidden' : 'visible'}
                animate="visible"
              >
                {designMeta.designStyle.map((style, i) => (
                  <motion.div
                    key={i}
                    variants={animate ? staggerItem : undefined}
                    className="flex items-center gap-2.5"
                  >
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-400 shrink-0" />
                    <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{style}</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Phase 4: Site Structure — staggered items */}
      <AnimatePresence>
        {revealPhase >= 4 && designMeta.siteStructure.length > 0 && (
          <motion.div
            key="structure"
            variants={phaseVariants}
            initial={animate ? 'hidden' : 'visible'}
            animate="visible"
          >
            <h4 className={`text-xs font-semibold uppercase tracking-wider mb-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              Site Structure
            </h4>
            <div className={`rounded-xl border px-4 py-3 ${isDarkMode ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-gray-50 border-gray-200'}`}>
              <motion.div
                className="flex flex-col gap-2.5"
                variants={animate ? staggerContainer : undefined}
                initial={animate ? 'hidden' : 'visible'}
                animate="visible"
              >
                {designMeta.siteStructure.map((section, i) => (
                  <motion.div
                    key={i}
                    variants={animate ? staggerItem : undefined}
                    className="flex items-center gap-2.5"
                  >
                    <span className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>↳</span>
                    <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{section}</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
