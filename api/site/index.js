import { createClient } from '@supabase/supabase-js';

export const config = { maxDuration: 10 };

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { slug } = req.query;

  if (!slug || typeof slug !== 'string') {
    return res.status(400).send('Missing slug parameter');
  }

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    return res.status(500).send('Server configuration error');
  }

  const supabase = createClient(url, key);

  try {
    const { data, error } = await supabase
      .from('projects')
      .select('compiled_html')
      .eq('slug', slug)
      .single();

    if (error || !data) {
      return res.status(404).send(`
        <!DOCTYPE html>
        <html><head><title>Not Found</title></head>
        <body style="font-family:system-ui;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;color:#666">
          <div style="text-align:center">
            <h1 style="font-size:48px;margin:0">404</h1>
            <p>This site doesn't exist yet.</p>
            <a href="/" style="color:#3b82f6">Create one on folate</a>
          </div>
        </body></html>
      `);
    }

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
    return res.status(200).send(data.compiled_html);
  } catch (error) {
    console.error('Site serve error:', error);
    return res.status(500).send('Failed to load site');
  }
}
