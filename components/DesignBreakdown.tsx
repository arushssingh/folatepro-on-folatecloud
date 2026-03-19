import React, { useState } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { DesignMeta } from '../types';

interface DesignBreakdownProps {
  designMeta: DesignMeta;
  isDarkMode: boolean;
}

function contrastColor(hex: string): string {
  const c = hex.replace('#', '');
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.55 ? '#1a1a1a' : '#ffffff';
}

export const DesignBreakdown: React.FC<DesignBreakdownProps> = ({ designMeta, isDarkMode }) => {
  const [paletteIndex, setPaletteIndex] = useState(0);
  const palette = designMeta.colorPalette;
  const currentColor = palette[paletteIndex];

  const prevColor = () => setPaletteIndex(i => (i - 1 + palette.length) % palette.length);
  const nextColor = () => setPaletteIndex(i => (i + 1) % palette.length);

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Summary */}
      <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        {designMeta.summary}
      </p>

      {/* Color Palette Carousel */}
      {palette.length > 0 && (
        <div className={`rounded-xl border overflow-hidden ${isDarkMode ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-gray-50 border-gray-200'}`}>
          <div className="relative" style={{ backgroundColor: currentColor?.hex || '#888' }}>
            <div className="px-4 pt-4 pb-12">
              <span
                className="text-2xl font-bold tracking-tight"
                style={{ color: contrastColor(currentColor?.hex || '#888') }}
              >
                {currentColor?.hex}
              </span>
            </div>

            {palette.length > 1 && (
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

            <div className={`px-4 py-2.5 text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}
              style={{
                backgroundColor: isDarkMode ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.85)',
                backdropFilter: 'blur(8px)',
              }}
            >
              {currentColor?.label}
            </div>
          </div>

          {/* Dots indicator */}
          {palette.length > 1 && (
            <div className="flex items-center justify-center gap-1.5 py-2">
              {palette.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPaletteIndex(i)}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    i === paletteIndex
                      ? 'bg-blue-500 w-3'
                      : isDarkMode ? 'bg-white/20' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Site Structure */}
      {designMeta.siteStructure.length > 0 && (
        <div>
          <h4 className={`text-xs font-semibold uppercase tracking-wider mb-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            Site Structure
          </h4>
          <div className={`rounded-xl border px-4 py-3 ${isDarkMode ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-gray-50 border-gray-200'}`}>
            <div className="flex flex-col gap-2.5">
              {designMeta.siteStructure.map((section, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <span className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>↳</span>
                  <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{section}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Design Style */}
      {designMeta.designStyle.length > 0 && (
        <div>
          <h4 className={`text-xs font-semibold uppercase tracking-wider mb-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            Design Style
          </h4>
          <div className={`rounded-xl border px-4 py-3 ${isDarkMode ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-gray-50 border-gray-200'}`}>
            <div className="flex flex-col gap-2.5">
              {designMeta.designStyle.map((style, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-400 shrink-0" />
                  <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{style}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
