import React from 'react';
import { Moon, Sun, Plus } from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { AppView } from '../types';
import { UserDropdown } from './UserDropdown';
import { motion } from 'framer-motion';

interface HeaderProps {
  onReset: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  currentView: AppView;
  onViewChange: (view: AppView) => void;
  user: User | null;
  onLoginClick: () => void;
}

const NAV_ITEMS = [
  { label: 'Website',    id: AppView.GENERATOR, authOnly: false },
  { label: 'Mobile App', id: AppView.MOBILE_APP, authOnly: false },
  { label: 'Playground', id: AppView.PLAYGROUND, authOnly: false },
  { label: 'Community',  id: AppView.COMMUNITY, authOnly: false },
  { label: 'My Projects', id: AppView.MY_PROJECTS, authOnly: true },
];

export const Header: React.FC<HeaderProps> = React.memo(({ onReset, isDarkMode, onToggleDarkMode, currentView, onViewChange, user, onLoginClick }) => {
  return (
    <header className={`sticky top-0 z-50 h-14 flex items-center px-5 transition-colors duration-300 border-b ${isDarkMode ? 'bg-[#050810]/90 border-white/[0.06]' : 'bg-white/90 border-gray-100'} backdrop-blur-lg`}>
      {/* Logo */}
      <button
        onClick={() => onViewChange(AppView.GENERATOR)}
        className="flex items-center gap-2.5 mr-8 shrink-0 group"
      >
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-opacity group-hover:opacity-80 ${isDarkMode ? 'bg-white/10' : 'bg-gray-900'}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`w-4 h-4 ${isDarkMode ? 'text-white' : 'text-white'}`}>
            <rect x="4" y="3" width="16" height="7" rx="2" />
            <rect x="4" y="14" width="16" height="7" rx="2" />
            <path d="M8 10v4" />
            <path d="M16 10v4" />
          </svg>
        </div>
        <span className={`text-sm font-semibold tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          folate
        </span>
      </button>

      {/* Center Nav */}
      <nav className="flex items-center gap-1 flex-1">
        {NAV_ITEMS.filter(item => !item.authOnly || user).map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`relative px-3 py-1.5 text-sm rounded-lg transition-all duration-150 ${
                isActive
                  ? isDarkMode ? 'text-white bg-white/8' : 'text-gray-900 bg-gray-100'
                  : isDarkMode ? 'text-gray-500 hover:text-gray-300 hover:bg-white/5' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              {item.label}
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className={`absolute inset-0 rounded-lg -z-10 ${isDarkMode ? 'bg-white/[0.07]' : 'bg-gray-100'}`}
                  transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Right Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onReset}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all duration-150 ${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
          title="New project"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New</span>
        </button>

        <button
          onClick={onToggleDarkMode}
          className={`p-1.5 rounded-lg transition-all duration-150 ${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
        >
          <div className="relative w-4 h-4">
            <Sun className={`w-4 h-4 absolute inset-0 transition-all duration-300 ${isDarkMode ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'}`} />
            <Moon className={`w-4 h-4 absolute inset-0 transition-all duration-300 ${isDarkMode ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'}`} />
          </div>
        </button>

        {user ? (
          <UserDropdown user={user} isDarkMode={isDarkMode} />
        ) : (
          <button
            onClick={onLoginClick}
            className={`text-sm font-medium px-3.5 py-1.5 rounded-lg transition-all duration-150 ${isDarkMode ? 'bg-white text-gray-900 hover:bg-gray-100' : 'bg-gray-900 text-white hover:bg-gray-700'}`}
          >
            Sign in
          </button>
        )}
      </div>
    </header>
  );
});
