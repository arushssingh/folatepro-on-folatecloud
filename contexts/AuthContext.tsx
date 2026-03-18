import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signInWithGoogle: () => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  verifySignupOtp: (email: string, token: string) => Promise<{ error: string | null }>;
  resendSignupOtp: (email: string) => Promise<{ error: string | null }>;
  updateProfile: (data: { displayName?: string; avatarColor?: string }) => Promise<{ error: string | null }>;
  updateEmail: (newEmail: string) => Promise<{ error: string | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const NETWORK_ERROR_MSG = 'Cannot connect to auth service. Your Supabase project may be paused — resume it at supabase.com/dashboard.';
const isNetworkError = (msg: string) =>
  msg.includes('Failed to fetch') || msg.includes('NetworkError') || msg.includes('Load failed') || msg.includes('ERR_CONNECTION');

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) return { error: isNetworkError(error.message) ? NETWORK_ERROR_MSG : error.message };
      return { error: null };
    } catch (e: any) {
      const msg: string = e?.message || '';
      return { error: isNetworkError(msg) ? NETWORK_ERROR_MSG : msg || 'An unexpected error occurred.' };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { error: isNetworkError(error.message) ? NETWORK_ERROR_MSG : error.message };
      return { error: null };
    } catch (e: any) {
      const msg: string = e?.message || '';
      return { error: isNetworkError(msg) ? NETWORK_ERROR_MSG : msg || 'An unexpected error occurred.' };
    }
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
    return { error: error?.message ?? null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const verifySignupOtp = async (email: string, token: string) => {
    try {
      const { error } = await supabase.auth.verifyOtp({ email, token, type: 'signup' });
      if (error) return { error: isNetworkError(error.message) ? NETWORK_ERROR_MSG : error.message };
      return { error: null };
    } catch (e: any) {
      const msg: string = e?.message || '';
      return { error: isNetworkError(msg) ? NETWORK_ERROR_MSG : msg || 'An unexpected error occurred.' };
    }
  };

  const resendSignupOtp = async (email: string) => {
    try {
      const { error } = await supabase.auth.resend({ type: 'signup', email });
      if (error) return { error: isNetworkError(error.message) ? NETWORK_ERROR_MSG : error.message };
      return { error: null };
    } catch (e: any) {
      const msg: string = e?.message || '';
      return { error: isNetworkError(msg) ? NETWORK_ERROR_MSG : msg || 'An unexpected error occurred.' };
    }
  };

  const updateProfile = async (data: { displayName?: string; avatarColor?: string }) => {
    const { error } = await supabase.auth.updateUser({
      data: { display_name: data.displayName, avatar_color: data.avatarColor },
    });
    return { error: error?.message ?? null };
  };

  const updateEmail = async (newEmail: string) => {
    const { error } = await supabase.auth.updateUser({ email: newEmail });
    return { error: error?.message ?? null };
  };

  const updatePassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    return { error: error?.message ?? null };
  };

  return (
    <AuthContext.Provider value={{ user, session, isLoading, signUp, signIn, signInWithGoogle, signOut, verifySignupOtp, resendSignupOtp, updateProfile, updateEmail, updatePassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
