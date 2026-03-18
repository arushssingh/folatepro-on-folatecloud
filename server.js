import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';

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
      model: 'gemini-2.5-flash',
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
      model: 'gemini-2.5-flash',
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

app.listen(port, '0.0.0.0', () => {
  console.log(`folate Secure Proxy running on http://0.0.0.0:${port}`);
});
