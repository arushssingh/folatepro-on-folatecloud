import React from 'react';
import { AppView } from '../types';
import { TextHoverEffect } from './ui/text-hover-effect';

interface FooterProps {
  isDarkMode: boolean;
  onViewChange: (view: AppView) => void;
}

export function Footer({ isDarkMode }: FooterProps) {
  return (
    <footer
      className={`w-full border-t mt-auto ${
        isDarkMode
          ? 'bg-[#050810] border-white/[0.06]'
          : 'bg-gray-50 border-gray-100'
      }`}
    >
      {/* Brand section */}
      <div className="max-w-5xl mx-auto px-6 flex items-center h-64">
        {/* Left: animated brand mark */}
        <div className="w-1/2 h-full">
          <TextHoverEffect text="folate" duration={0} isDarkMode={isDarkMode} />
        </div>
        {/* Right: tagline */}
        <div className="w-1/2 flex items-center pl-8">
          <p
            className={`text-4xl md:text-5xl font-bold leading-snug tracking-tight ${
              isDarkMode ? 'text-white/10' : 'text-gray-900/10'
            }`}
          >
            Build websites &amp; mobile apps with AI — in seconds.
          </p>
        </div>
      </div>

      {/* Copyright bar */}
      <div
        className={`border-t px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 max-w-5xl mx-auto ${
          isDarkMode ? 'border-white/[0.06]' : 'border-gray-100'
        }`}
      >
        <span
          className={`text-xs ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}
        >
          © 2026 folate. All rights reserved.
        </span>
        <div className="flex items-center gap-5">
          {['Privacy', 'Terms'].map((item) => (
            <button
              key={item}
              className={`text-xs transition-colors ${
                isDarkMode
                  ? 'text-gray-600 hover:text-gray-400'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </footer>
  );
}
