import React, { useState, useRef, useEffect, useCallback } from 'react';
import { LogOut, Pencil, Settings } from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { useAuth } from '../contexts/AuthContext';
import { ProfileEditModal } from './ProfileEditModal';
import { AccountSettingsModal } from './AccountSettingsModal';
import { AVATAR_COLORS } from '../lib/constants';

interface UserDropdownProps {
  user: User;
  isDarkMode: boolean;
}

function getUserInitials(user: User): string {
  const displayName = user.user_metadata?.display_name;
  if (displayName) {
    return displayName.charAt(0).toUpperCase();
  }
  return (user.email ?? '?').charAt(0).toUpperCase();
}

function getUserAvatarColor(user: User): string {
  return user.user_metadata?.avatar_color ?? AVATAR_COLORS[0];
}

function getUserDisplayName(user: User): string | null {
  return user.user_metadata?.display_name ?? null;
}

export const UserDropdown: React.FC<UserDropdownProps> = ({ user, isDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { signOut } = useAuth();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const initials = getUserInitials(user);
  const avatarColor = getUserAvatarColor(user);
  const displayName = getUserDisplayName(user);

  const handleToggle = useCallback(() => setIsOpen(prev => !prev), []);
  const handleOpenProfile = useCallback(() => { setIsOpen(false); setShowProfileModal(true); }, []);
  const handleOpenSettings = useCallback(() => { setIsOpen(false); setShowSettingsModal(true); }, []);
  const handleSignOut = useCallback(() => { setIsOpen(false); signOut(); }, [signOut]);

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={handleToggle}
          className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:ring-offset-2 focus:ring-offset-transparent"
          style={{ backgroundColor: avatarColor }}
          title={displayName ?? user.email ?? 'Account'}
        >
          {initials}
        </button>

        {isOpen && (
          <div
            className={`absolute right-0 top-full mt-2 w-64 rounded-xl border shadow-xl overflow-hidden z-50 transition-all origin-top-right animate-in fade-in slide-in-from-top-1 ${
              isDarkMode
                ? 'bg-gray-900 border-gray-800 shadow-black/40'
                : 'bg-white border-gray-200 shadow-gray-200/50'
            }`}
          >
            {/* User info header */}
            <div className={`px-4 py-3 border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-100'}`}>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold shrink-0"
                  style={{ backgroundColor: avatarColor }}
                >
                  {initials}
                </div>
                <div className="min-w-0">
                  {displayName && (
                    <p className={`text-sm font-medium truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {displayName}
                    </p>
                  )}
                  <p className={`text-xs truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {user.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Menu items */}
            <div className="py-1">
              <button
                onClick={handleOpenProfile}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                  isDarkMode
                    ? 'text-gray-300 hover:bg-white/5 hover:text-white'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Pencil className="w-4 h-4" />
                Edit Profile
              </button>
              <button
                onClick={handleOpenSettings}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                  isDarkMode
                    ? 'text-gray-300 hover:bg-white/5 hover:text-white'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Settings className="w-4 h-4" />
                Account Settings
              </button>
            </div>

            {/* Divider + Sign out */}
            <div className={`border-t py-1 ${isDarkMode ? 'border-gray-800' : 'border-gray-100'}`}>
              <button
                onClick={handleSignOut}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                  isDarkMode
                    ? 'text-red-400 hover:bg-red-500/10'
                    : 'text-red-500 hover:bg-red-50'
                }`}
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>

      <ProfileEditModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        isDarkMode={isDarkMode}
        user={user}
      />

      <AccountSettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        isDarkMode={isDarkMode}
      />
    </>
  );
};
