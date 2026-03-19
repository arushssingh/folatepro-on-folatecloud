import { GoogleGenAI } from '@google/genai';

export const config = {
  maxDuration: 60,
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API_KEY not configured' });
  }

  const { contents, config: genConfig } = req.body;

  if (!Array.isArray(contents) || contents.length === 0) {
    return res.status(400).json({ error: 'Invalid request: contents must be a non-empty array.' });
  }

  const ai = new GoogleGenAI({ apiKey });

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  try {
    const stream = await ai.models.generateContentStream({
      model: 'gemini-2.5-flash',
      contents,
      config: genConfig,
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
}
