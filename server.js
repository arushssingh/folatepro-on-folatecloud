import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';
import { createClient } from '@supabase/supabase-js';

// Fail fast on missing API key
if (!process.env.API_KEY) {
  console.error('FATAL: API_KEY environment variable is not set. Exiting.');
  process.exit(1);
}

const app = express();
const port = process.env.PORT || 3000;

const ALLOWED_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';
app.use(cors({
  origin: ALLOWED_ORIGIN,
  methods: ['POST', 'GET'],
  allowedHeaders: ['Content-Type'],
}));
app.use(express.json({ limit: '10mb' }));

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Supabase helper for local dev (mirrors Vercel serverless functions)
function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

async function authenticateRequest(req, res) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authentication required' });
    return null;
  }
  const token = auth.slice(7);
  const supabase = getSupabase();
  if (!supabase) {
    res.status(500).json({ error: 'Server configuration error' });
    return null;
  }
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) {
    res.status(401).json({ error: 'Invalid or expired token' });
    return null;
  }
  return { user, supabase };
}

app.get('/', (req, res) => {
  res.send('folate Generator Proxy is running');
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.post('/api/generate', async (req, res) => {
  const { contents, config } = req.body;

  if (!Array.isArray(contents) || contents.length === 0) {
    return res.status(400).json({ error: 'Invalid request: contents must be a non-empty array.' });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents,
      config,
    });

    res.json({ text: response.text });

  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ error: 'Failed to generate content.' });
  }
});

app.post('/api/generate/stream', async (req, res) => {
  const { contents, config } = req.body;

  if (!Array.isArray(contents) || contents.length === 0) {
    return res.status(400).json({ error: 'Invalid request: contents must be a non-empty array.' });
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  try {
    const stream = await ai.models.generateContentStream({
      model: 'gemini-2.5-flash-lite',
      contents,
      config,
    });

    for await (const chunk of stream) {
      const text = chunk.text;
      if (text) {
        res.write(`data: ${JSON.stringify({ chunk: text })}\n\n`);
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    console.error('Gemini Stream Error:', error);
    res.write(`data: ${JSON.stringify({ error: 'Failed to generate content.' })}\n\n`);
    res.end();
  }
});

// --- Local dev routes (mirror Vercel serverless functions) ---

const SLUG_REGEX = /^[a-z0-9][a-z0-9-]{1,48}[a-z0-9]$/;

app.get('/api/projects', async (req, res) => {
  const auth = await authenticateRequest(req, res);
  if (!auth) return;
  const { user, supabase } = auth;

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
});

app.post('/api/deploy', async (req, res) => {
  const auth = await authenticateRequest(req, res);
  if (!auth) return;
  const { user, supabase } = auth;

  const { slug, name, files, compiledHtml, projectId } = req.body;

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
});

app.listen(port, '0.0.0.0', () => {
  console.log(`folate Secure Proxy running on http://0.0.0.0:${port}`);
});
