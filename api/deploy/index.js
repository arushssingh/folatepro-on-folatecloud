import { createClient } from '@supabase/supabase-js';

export const config = { maxDuration: 10 };

const SLUG_REGEX = /^[a-z0-9][a-z0-9-]{1,48}[a-z0-9]$/;

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error('Missing Supabase server config');
  }
  return createClient(url, key);
}

function getUserId(req) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) return null;
  return auth.slice(7);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = getUserId(req);
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const supabase = getSupabase();

  // Verify JWT and get user
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  const { slug, name, files, compiledHtml, projectId } = req.body;

  // Validate inputs
  if (!slug || typeof slug !== 'string' || !SLUG_REGEX.test(slug)) {
    return res.status(400).json({
      error: 'Invalid slug. Use 3-50 lowercase letters, numbers, and hyphens.',
    });
  }

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({ error: 'Project name is required' });
  }

  if (!files || typeof files !== 'object') {
    return res.status(400).json({ error: 'Project files are required' });
  }

  if (!compiledHtml || typeof compiledHtml !== 'string') {
    return res.status(400).json({ error: 'Compiled HTML is required' });
  }

  try {
    if (projectId) {
      // Update existing project — verify ownership
      const { data: existing } = await supabase
        .from('projects')
        .select('id, user_id')
        .eq('id', projectId)
        .single();

      if (!existing) {
        return res.status(404).json({ error: 'Project not found' });
      }
      if (existing.user_id !== user.id) {
        return res.status(403).json({ error: 'Not authorized to update this project' });
      }

      const { data: updated, error: updateError } = await supabase
        .from('projects')
        .update({
          slug,
          name: name.trim(),
          files,
          compiled_html: compiledHtml,
          updated_at: new Date().toISOString(),
        })
        .eq('id', projectId)
        .select()
        .single();

      if (updateError) {
        if (updateError.code === '23505') {
          return res.status(409).json({ error: 'This slug is already taken' });
        }
        throw updateError;
      }

      return res.status(200).json({ project: updated });
    }

    // Create new project
    const { data: created, error: insertError } = await supabase
      .from('projects')
      .insert({
        user_id: user.id,
        slug,
        name: name.trim(),
        files,
        compiled_html: compiledHtml,
      })
      .select()
      .single();

    if (insertError) {
      if (insertError.code === '23505') {
        return res.status(409).json({ error: 'This slug is already taken' });
      }
      throw insertError;
    }

    return res.status(201).json({ project: created });
  } catch (error) {
    console.error('Deploy error:', error);
    return res.status(500).json({ error: 'Failed to deploy project' });
  }
}
