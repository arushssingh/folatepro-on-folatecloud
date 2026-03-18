import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { useAuth } from '../contexts/AuthContext';
import { AVATAR_COLORS } from '../lib/constants';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  user: User;
}

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({ isOpen, onClose, isDarkMode, user }) => {
  const { updateProfile } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [avatarColor, setAvatarColor] = useState(AVATAR_COLORS[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (isOpen) {
      setDisplayName(user.user_metadata?.display_name ?? '');
      setAvatarColor(user.user_metadata?.avatar_color ?? AVATAR_COLORS[0]);
      setError('');
      setSuccess('');
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const initials = displayName
    ? displayName.charAt(0).toUpperCase()
    : (user.email ?? '?').charAt(0).toUpperCase();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    const { error } = await updateProfile({ displayName: displayName.trim() || undefined, avatarColor });
    if (error) {
      setError(error);
    } else {
      setSuccess('Profile updated!');
      setTimeout(() => onClose(), 1000);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className={`relative w-full max-w-md mx-4 rounded-2xl shadow-2xl border overflow-hidden ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-1.5 rounded-lg transition-colors z-10 ${isDarkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="px-8 pt-8 pb-2">
          <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Edit Profile</h2>
          <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Customize your display name and avatar
          </p>
        </div>

        <form onSubmit={handleSave} className="px-8 py-6 space-y-5">
          {error && (
            <div className="px-4 py-3 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}
          {success && (
            <div className="px-4 py-3 rounded-lg bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 text-sm text-green-600 dark:text-green-400">
              {success}
            </div>
          )}

          {/* Avatar preview */}
          <div className="flex justify-center">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold transition-colors"
              style={{ backgroundColor: avatarColor }}
            >
              {initials}
            </div>
          </div>

          {/* Avatar color picker */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Avatar Color
            </label>
            <div className="flex items-center gap-2 justify-center">
              {AVATAR_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setAvatarColor(color)}
                  className={`w-8 h-8 rounded-full transition-transform hover:scale-110 ${
                    avatarColor === color ? 'ring-2 ring-offset-2 scale-110' : ''
                  } ${isDarkMode && avatarColor === color ? 'ring-white ring-offset-gray-900' : avatarColor === color ? 'ring-gray-900 ring-offset-white' : ''}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Display name */}
          <div>
            <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter your name"
              className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all focus:ring-2 focus:ring-blue-500/20 ${
                isDarkMode
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-blue-500'
                  : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-400'
              }`}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};
