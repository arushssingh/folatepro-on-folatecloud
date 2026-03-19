import { createClient } from '@supabase/supabase-js';

export const config = { maxDuration: 10 };

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  const token = auth.slice(7);

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const supabase = createClient(url, key);

  // Verify JWT and get user
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  try {
    const { data: projects, error } = await supabase
      .from('projects')
      .select('id, user_id, slug, name, files, compiled_html, created_at, updated_at')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    if (error) throw error;

    return res.status(200).json({ projects: projects || [] });
  } catch (error) {
    console.error('Projects fetch error:', error);
    return res.status(500).json({ error: 'Failed to fetch projects' });
  }
}
