import { GoogleGenAI } from '@google/genai';

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

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents,
      config: genConfig,
    });

    res.json({ text: response.text });
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ error: 'Failed to generate content.' });
  }
}
