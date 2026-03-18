import React, { useEffect, useState, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { FileSet } from '../types';
import { buildPreviewHtml } from '../services/snackService';

interface MobilePreviewProps {
  files: FileSet;
  isDarkMode: boolean;
}

export const MobilePreview: React.FC<MobilePreviewProps> = ({ files, isDarkMode }) => {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  const previewHtml = buildPreviewHtml(files);

  // Reset loaded flag whenever the generated code changes
  const prevHtmlRef = useRef('');
  if (prevHtmlRef.current !== previewHtml) {
    prevHtmlRef.current = previewHtml;
    // Synchronously reset so the spinner shows on re-render
    if (iframeLoaded) setIframeLoaded(false);
  }

  // Scale phone to fit available container space
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const PHONE_H = 852;
    const PHONE_W = 415; // 393 + 22 for side buttons

    const update = () => {
      const availH = container.clientHeight - 32;
      const availW = container.clientWidth - 32;
      const s = Math.min(availH / PHONE_H, availW / PHONE_W, 1);
      setScale(Math.max(s, 0.3));
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex items-center justify-center w-full h-full"
    >
      {/* iPhone 15 Pro frame — scaled to fit */}
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          flexShrink: 0,
          width: 393,
          height: 852,
          position: 'relative',
        }}
      >
        {/* Volume buttons (left) */}
        <div className={`absolute left-[-11px] top-[120px] w-[11px] h-8 rounded-l-md ${isDarkMode ? 'bg-gray-700' : 'bg-gray-500'}`} />
        <div className={`absolute left-[-11px] top-[168px] w-[11px] h-10 rounded-l-md ${isDarkMode ? 'bg-gray-700' : 'bg-gray-500'}`} />
        <div className={`absolute left-[-11px] top-[218px] w-[11px] h-10 rounded-l-md ${isDarkMode ? 'bg-gray-700' : 'bg-gray-500'}`} />
        {/* Power button (right) */}
        <div className={`absolute right-[-11px] top-[168px] w-[11px] h-14 rounded-r-md ${isDarkMode ? 'bg-gray-700' : 'bg-gray-500'}`} />

        {/* Outer bezel */}
        <div
          className={`absolute inset-0 rounded-[52px] shadow-2xl ${isDarkMode ? 'bg-gray-800 shadow-black/60' : 'bg-gray-900 shadow-black/40'}`}
          style={{ border: '2px solid rgba(255,255,255,0.08)' }}
        />

        {/* Inner border highlight */}
        <div
          className="absolute inset-[3px] rounded-[50px]"
          style={{ border: '1px solid rgba(255,255,255,0.06)', background: 'transparent' }}
        />

        {/* Screen area */}
        <div className="absolute inset-[6px] rounded-[46px] overflow-hidden bg-white">
          {/* Dynamic Island */}
          <div
            className="absolute top-3 left-1/2 z-20 bg-black rounded-full"
            style={{ width: 120, height: 34, transform: 'translateX(-50%)' }}
          />

          {/* Loading spinner while code compiles */}
          {!iframeLoaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gray-50 z-10">
              <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
              <p className="text-xs font-medium text-gray-500">Compiling preview...</p>
            </div>
          )}

          {/* In-browser React Native preview */}
          <iframe
            key={previewHtml}
            srcDoc={previewHtml}
            title="React Native Preview"
            className="absolute inset-0 w-full h-full border-0"
            sandbox="allow-scripts"
            onLoad={() => setIframeLoaded(true)}
          />
        </div>

        {/* Home indicator */}
        <div
          className="absolute bottom-3 left-1/2 z-20 rounded-full bg-white/40"
          style={{ width: 120, height: 5, transform: 'translateX(-50%)' }}
        />
      </div>
    </div>
  );
};
