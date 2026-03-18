import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Mail, Lock, Eye, EyeOff, Loader2, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, isDarkMode }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // OTP state
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);

  const { signIn, signUp, signInWithGoogle, verifySignupOtp, resendSignupOtp } = useAuth();

  // Reset all state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setStep('form');
      setOtpDigits(['', '', '', '', '', '']);
      setOtpError('');
      setError('');
      setResendCooldown(0);
    }
  }, [isOpen]);

  // Resend cooldown countdown
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  // Auto-focus first OTP box when entering OTP step
  useEffect(() => {
    if (step === 'otp') {
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    }
  }, [step]);

  const handleVerifyOtp = useCallback(async (code: string) => {
    setOtpError('');
    setIsVerifying(true);
    const { error } = await verifySignupOtp(email, code);
    if (error) {
      setOtpError(error);
      setOtpDigits(['', '', '', '', '', '']);
      setTimeout(() => otpRefs.current[0]?.focus(), 50);
    } else {
      onClose();
    }
    setIsVerifying(false);
  }, [email, verifySignupOtp, onClose]);

  // Auto-verify when all 6 digits filled
  useEffect(() => {
    if (step !== 'otp') return;
    if (otpDigits.every((d) => d !== '')) {
      handleVerifyOtp(otpDigits.join(''));
    }
  }, [otpDigits, step, handleVerifyOtp]);

  if (!isOpen) return null;

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError('');
    setStep('form');
    setOtpDigits(['', '', '', '', '', '']);
    setOtpError('');
    setResendCooldown(0);
  };

  const switchMode = (newMode: 'login' | 'signup') => {
    setMode(newMode);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    if (mode === 'signup' && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsSubmitting(true);

    if (mode === 'login') {
      const { error } = await signIn(email, password);
      if (error) {
        setError(error);
      } else {
        onClose();
      }
    } else {
      const { error } = await signUp(email, password);
      if (error) {
        setError(error);
      } else {
        // Move to OTP verification step
        setStep('otp');
        setResendCooldown(30);
      }
    }

    setIsSubmitting(false);
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setOtpError('');
    const { error } = await resendSignupOtp(email);
    if (error) {
      setOtpError(error);
    } else {
      setResendCooldown(30);
      setOtpDigits(['', '', '', '', '', '']);
      setTimeout(() => otpRefs.current[0]?.focus(), 50);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    // Allow only one digit
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...otpDigits];
    next[index] = digit;
    setOtpDigits(next);
    if (digit && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const next = ['', '', '', '', '', ''];
    pasted.split('').forEach((ch, i) => { next[i] = ch; });
    setOtpDigits(next);
    const focusIndex = Math.min(pasted.length, 5);
    otpRefs.current[focusIndex]?.focus();
  };

  const handleGoogleLogin = async () => {
    setError('');
    const { error } = await signInWithGoogle();
    if (error) setError(error);
  };

  const inputBase = `w-full py-2.5 rounded-xl border text-sm outline-none transition-all focus:ring-2 focus:ring-blue-500/20 ${
    isDarkMode
      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-blue-500'
      : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-400'
  }`;

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

        {step === 'form' ? (
          <div>
              {/* Header */}
              <div className="px-8 pt-8 pb-2">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-lg flex items-center justify-center shadow-sm">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-white">
                      <rect x="4" y="3" width="16" height="7" rx="2" />
                      <rect x="4" y="14" width="16" height="7" rx="2" />
                      <path d="M8 10v4" />
                      <path d="M16 10v4" />
                    </svg>
                  </div>
                  <span className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>folate</span>
                </div>
                <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {mode === 'login' ? 'Sign in to start generating' : 'Create an account to get started'}
                </p>
              </div>

              {/* Mode toggle */}
              <div className="px-8 pt-4">
                <div className={`flex rounded-lg p-1 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                  {(['login', 'signup'] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => switchMode(m)}
                      className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                        mode === m
                          ? isDarkMode ? 'bg-gray-700 text-white shadow-sm' : 'bg-white text-gray-900 shadow-sm'
                          : isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    >
                      {m === 'login' ? 'Sign In' : 'Sign Up'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="px-8 py-6 space-y-4">
                {error && (
                  <div className="px-4 py-3 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-sm text-red-600 dark:text-red-400">
                    {error}
                  </div>
                )}

                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email</label>
                  <div className="relative">
                    <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={`${inputBase} pl-10 pr-4`} />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Password</label>
                  <div className="relative">
                    <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                    <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" className={`${inputBase} pl-10 pr-10`} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className={`absolute right-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}>
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {mode === 'signup' && (
                  <div>
                    <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Confirm Password</label>
                    <div className="relative">
                      <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                      <input type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm your password" className={`${inputBase} pl-10 pr-4`} />
                    </div>
                  </div>
                )}

                <button type="submit" disabled={isSubmitting} className="w-full py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                </button>

                <div className="relative my-2">
                  <div className={`absolute inset-0 flex items-center`}>
                    <div className={`w-full border-t ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`} />
                  </div>
                  <div className="relative flex justify-center">
                    <span className={`px-3 text-xs uppercase tracking-wider ${isDarkMode ? 'bg-gray-900 text-gray-500' : 'bg-white text-gray-400'}`}>or</span>
                  </div>
                </div>

                <button type="button" onClick={handleGoogleLogin} className={`w-full py-2.5 rounded-xl border text-sm font-medium transition-all flex items-center justify-center gap-3 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}>
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Continue with Google
                </button>
              </form>
          </div>
        ) : (
          <div className="px-8 py-8 animate-in fade-in duration-150">
              {/* Back button */}
              <button
                onClick={() => { setStep('form'); setOtpDigits(['', '', '', '', '', '']); setOtpError(''); }}
                className={`flex items-center gap-1.5 text-sm mb-6 transition-colors ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>

              {/* Icon + heading */}
              <div className="flex flex-col items-center text-center mb-8">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${isDarkMode ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-blue-50 border border-blue-100'}`}>
                  <ShieldCheck className={`w-7 h-7 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                </div>
                <h2 className={`text-xl font-bold mb-1.5 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Check your email</h2>
                <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  We sent a 6-digit code to<br />
                  <span className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>{email}</span>
                </p>
              </div>

              {/* 6 digit inputs */}
              <div className="flex items-center justify-center gap-2.5 mb-4">
                {otpDigits.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { otpRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    onPaste={i === 0 ? handleOtpPaste : undefined}
                    disabled={isVerifying}
                    className={`w-11 h-14 text-center text-xl font-bold rounded-xl border outline-none transition-all duration-150 ${
                      isDarkMode
                        ? `bg-gray-800 border-gray-700 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 ${digit ? 'border-blue-500/60' : ''}`
                        : `bg-white border-gray-200 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 ${digit ? 'border-blue-400' : ''}`
                    } disabled:opacity-50`}
                  />
                ))}
              </div>

              {/* Error */}
              {otpError && (
                <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-sm text-red-600 dark:text-red-400 text-center">
                  {otpError}
                </div>
              )}

              {/* Verifying indicator */}
              {isVerifying && (
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Verifying...</span>
                </div>
              )}

              {/* Resend */}
              <div className="text-center mt-2">
                <span className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  Didn't receive it?{' '}
                </span>
                <button
                  onClick={handleResend}
                  disabled={resendCooldown > 0 || isVerifying}
                  className={`text-sm font-medium transition-colors ${
                    resendCooldown > 0 || isVerifying
                      ? isDarkMode ? 'text-gray-600 cursor-default' : 'text-gray-300 cursor-default'
                      : 'text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300'
                  }`}
                >
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend code'}
                </button>
              </div>
          </div>
        )}
      </div>
    </div>
  );
};
