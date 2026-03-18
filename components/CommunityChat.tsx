import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Send, User, Hash, MessageSquare, Loader2, LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { supabase } from '../lib/supabase';

interface ChatMessage {
  id: string;
  username: string;
  content: string;
  created_at: string;
  user_id: string;
}

interface CommunityChatProps {
  isDarkMode: boolean;
}

export const CommunityChat: React.FC<CommunityChatProps> = ({ isDarkMode }) => {
  const { user, isLoading: authLoading } = useAuth();
  const { profile, loading: profileLoading, checkUsernameAvailable, createProfile } = useProfile(user?.id);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [usernameInput, setUsernameInput] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load recent messages when user has a profile
  useEffect(() => {
    if (!profile) return;

    const loadMessages = async () => {
      const { data } = await supabase
        .from('community_messages')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(100);

      if (data) setMessages(data);
    };

    loadMessages();
  }, [profile]);

  // Subscribe to real-time inserts
  useEffect(() => {
    if (!profile) return;

    const channel = supabase
      .channel('community-chat')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'community_messages' },
        (payload) => {
          const newMsg = payload.new as ChatMessage;
          setMessages((prev) => [...prev, newMsg]);
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
      supabase.removeChannel(channel);
    };
  }, [profile]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSetUsername = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = usernameInput.trim();

    if (!/^[a-zA-Z0-9_]{2,20}$/.test(trimmed)) {
      setUsernameError('2-20 characters, letters, numbers, and underscores only.');
      return;
    }

    setIsSaving(true);
    setUsernameError('');

    const available = await checkUsernameAvailable(trimmed);
    if (!available) {
      setUsernameError('That username is taken. Try another.');
      setIsSaving(false);
      return;
    }

    const { error } = await createProfile(user!.id, trimmed);
    if (error) {
      setUsernameError(error);
    }
    setIsSaving(false);
  }, [usernameInput, checkUsernameAvailable, createProfile, user]);

  const handleSend = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || !user || !profile) return;

    const content = input.trim();
    setInput('');

    const { error } = await supabase.from('community_messages').insert({
      user_id: user.id,
      username: profile.username,
      content,
    });

    if (error) {
      console.error('Failed to send message:', error);
      setInput(content);
    }
  }, [input, user, profile]);

  // Loading state
  if (authLoading || profileLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader2 className={`w-8 h-8 animate-spin ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-transparent">
        <div className={`w-full max-w-md p-8 rounded-2xl shadow-2xl backdrop-blur-2xl ${isDarkMode ? 'bg-white/5 border border-white/10' : 'bg-white border border-gray-200'}`}>
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-600/20 rounded-xl flex items-center justify-center mb-4">
              <LogIn className="w-8 h-8 text-blue-600 dark:text-blue-500" />
            </div>
            <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Sign in to Chat</h2>
            <p className={`text-center mt-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              You need an account to join the community chat. Use the Sign In button in the header.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Logged in but no username — show username picker
  if (!profile) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-transparent">
        <div className={`w-full max-w-md p-8 rounded-2xl shadow-2xl backdrop-blur-2xl ${isDarkMode ? 'bg-white/5 border border-white/10' : 'bg-white border border-gray-200'}`}>
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-600/20 rounded-xl flex items-center justify-center mb-4">
              <User className="w-8 h-8 text-blue-600 dark:text-blue-500" />
            </div>
            <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Pick a Username</h2>
            <p className={`text-center mt-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Choose a unique username to start chatting.
            </p>
          </div>

          <form onSubmit={handleSetUsername} className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Username</label>
              <div className="relative">
                <Hash className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => { setUsernameInput(e.target.value); setUsernameError(''); }}
                  placeholder="Ex: CreativeDev"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                    isDarkMode
                      ? 'bg-black/40 border-white/10 text-white placeholder-gray-600'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                  } ${usernameError ? 'border-red-500 focus:ring-red-500' : ''}`}
                  minLength={2}
                  maxLength={20}
                  required
                />
              </div>
              {usernameError && (
                <p className="mt-1.5 text-xs text-red-500">{usernameError}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className={`w-full py-2.5 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${
                isSaving
                  ? 'bg-blue-800 text-blue-200 cursor-wait'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30 active:scale-[0.98]'
              }`}
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Checking...</span>
                </>
              ) : (
                'Set Username & Join'
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Logged in with username — show chat
  return (
    <div className="w-full h-full flex flex-col bg-transparent">
      <div className={`px-6 py-4 border-b flex items-center justify-between shrink-0 backdrop-blur-md ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-600/20 rounded-lg">
            <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-500" />
          </div>
          <div>
            <h2 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Global Chat</h2>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Connect with other builders
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-3 py-1 rounded-lg border bg-blue-500/5 ${isDarkMode ? 'border-blue-500/20 text-blue-400' : 'border-blue-200 text-blue-600'}`}>
            Joined as <span className="font-bold">{profile.username}</span>
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar scrollbar-hide">
        {messages.length === 0 && (
          <div className={`text-center py-12 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No messages yet. Be the first to say something!</p>
          </div>
        )}
        {messages.map((msg) => {
          const isMe = msg.user_id === user.id;
          return (
            <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
              <div className="flex items-center gap-2 mb-1 px-1">
                <span className={`text-[10px] font-bold tracking-wider uppercase ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {msg.username}
                </span>
                <span className={`text-[9px] ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className={`max-w-[85%] sm:max-w-[70%] px-4 py-2.5 rounded-xl text-sm leading-relaxed shadow-sm break-words ${
                isMe
                  ? 'bg-blue-600 text-white rounded-tr-sm'
                  : isDarkMode
                    ? 'bg-white/5 backdrop-blur-sm text-gray-200 border border-white/5 rounded-tl-sm'
                    : 'bg-white text-gray-800 border border-gray-200 rounded-tl-sm'
              }`}>
                {msg.content}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className={`p-4 backdrop-blur-xl border-t ${isDarkMode ? 'bg-[#000205]/40 border-white/5' : 'bg-white border-gray-200'}`}>
        <form onSubmit={handleSend} className="relative flex items-center max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Share a tip or ask a question..."
            className={`w-full pl-4 pr-12 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all ${
              isDarkMode
                ? 'bg-black/40 border-white/10 text-white placeholder-gray-500'
                : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
            }`}
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className={`absolute right-2 p-2 rounded-lg transition-all ${
              input.trim()
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg'
                : 'bg-transparent text-gray-400 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
