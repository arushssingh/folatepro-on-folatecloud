import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Profile {
  username: string;
}

export function useProfile(userId: string | undefined) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('user_id', userId)
        .maybeSingle();

      if (!error && data) {
        setProfile({ username: data.username });
      } else {
        setProfile(null);
      }
      setLoading(false);
    };

    fetchProfile();
  }, [userId]);

  const checkUsernameAvailable = async (username: string): Promise<boolean> => {
    const { data } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', username)
      .maybeSingle();
    return data === null;
  };

  const createProfile = async (userId: string, username: string): Promise<{ error: string | null }> => {
    const { error } = await supabase
      .from('profiles')
      .insert({ user_id: userId, username });

    if (error) {
      if (error.code === '23505') {
        return { error: 'Username is already taken.' };
      }
      return { error: error.message };
    }

    setProfile({ username });
    return { error: null };
  };

  return { profile, loading, checkUsernameAvailable, createProfile };
}
