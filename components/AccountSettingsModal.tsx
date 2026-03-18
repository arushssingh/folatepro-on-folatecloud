import React, { useState } from 'react';
import { X, Loader2, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface AccountSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

export const AccountSettingsModal: React.FC<AccountSettingsModalProps> = ({ isOpen, onClose, isDarkMode }) => {
  const { updateEmail, updatePassword, user } = useAuth();
  const [section, setSection] = useState<'email' | 'password'>('email');

  // Email state
  const [newEmail, setNewEmail] = useState('');
  const [emailSubmitting, setEmailSubmitting] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [emailSuccess, setEmailSuccess] = useState('');

  // Password state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  if (!isOpen) return null;

  const resetState = () => {
    setNewEmail('');
    setEmailError('');
    setEmailSuccess('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError('');
    setPasswordSuccess('');
    setShowPassword(false);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const switchSection = (s: 'email' | 'password') => {
    setSection(s);
    resetState();
  };

  const handleEmailUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');
    setEmailSuccess('');

    if (!newEmail.trim()) {
      setEmailError('Please enter a new email address.');
      return;
    }

    setEmailSubmitting(true);
    const { error } = await updateEmail(newEmail.trim());
    if (error) {
      setEmailError(error);
    } else {
      setEmailSuccess('Confirmation email sent! Check your inbox to verify the new address.');
    }
    setEmailSubmitting(false);
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!newPassword.trim()) {
      setPasswordError('Please enter a new password.');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    setPasswordSubmitting(true);
    const { error } = await updatePassword(newPassword);
    if (error) {
      setPasswordError(error);
    } else {
      setPasswordSuccess('Password updated successfully!');
      setNewPassword('');
      setConfirmPassword('');
    }
    setPasswordSubmitting(false);
  };

  const inputClass = `w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm outline-none transition-all focus:ring-2 focus:ring-blue-500/20 ${
    isDarkMode
      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-blue-500'
      : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-400'
  }`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleClose} />

      <div className={`relative w-full max-w-md mx-4 rounded-2xl shadow-2xl border overflow-hidden ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
        <button
          onClick={handleClose}
          className={`absolute top-4 right-4 p-1.5 rounded-lg transition-colors z-10 ${isDarkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="px-8 pt-8 pb-2">
          <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Account Settings</h2>
          <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Update your email or password
          </p>
        </div>

        {/* Section tabs */}
        <div className="px-8 pt-4">
          <div className={`flex rounded-lg p-1 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
            <button
              onClick={() => switchSection('email')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                section === 'email'
                  ? isDarkMode ? 'bg-gray-700 text-white shadow-sm' : 'bg-white text-gray-900 shadow-sm'
                  : isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}
            >
              Email
            </button>
            <button
              onClick={() => switchSection('password')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                section === 'password'
                  ? isDarkMode ? 'bg-gray-700 text-white shadow-sm' : 'bg-white text-gray-900 shadow-sm'
                  : isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}
            >
              Password
            </button>
          </div>
        </div>

        {/* Email section */}
        {section === 'email' && (
          <form onSubmit={handleEmailUpdate} className="px-8 py-6 space-y-4">
            {emailError && (
              <div className="px-4 py-3 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-sm text-red-600 dark:text-red-400">
                {emailError}
              </div>
            )}
            {emailSuccess && (
              <div className="px-4 py-3 rounded-lg bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 text-sm text-green-600 dark:text-green-400">
                {emailSuccess}
              </div>
            )}

            <div>
              <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Current Email
              </label>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{user?.email}</p>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                New Email
              </label>
              <div className="relative">
                <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="new@example.com"
                  className={inputClass}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={emailSubmitting}
              className="w-full py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {emailSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Update Email
            </button>
          </form>
        )}

        {/* Password section */}
        {section === 'password' && (
          <form onSubmit={handlePasswordUpdate} className="px-8 py-6 space-y-4">
            {passwordError && (
              <div className="px-4 py-3 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-sm text-red-600 dark:text-red-400">
                {passwordError}
              </div>
            )}
            {passwordSuccess && (
              <div className="px-4 py-3 rounded-lg bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 text-sm text-green-600 dark:text-green-400">
                {passwordSuccess}
              </div>
            )}

            <div>
              <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                New Password
              </label>
              <div className="relative">
                <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className={`${inputClass} !pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Confirm Password
              </label>
              <div className="relative">
                <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className={inputClass}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={passwordSubmitting}
              className="w-full py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {passwordSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Update Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
