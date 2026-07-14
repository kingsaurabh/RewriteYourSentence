require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');

const app = express();
//app.use(cors());
const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:3000';
app.use(cors({ origin: allowedOrigin }));
app.use(express.json());

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const TONE_INSTRUCTIONS = {
  Professional: 'Rewrite this sentence in a professional, formal, business-appropriate tone.',
  Friendly: 'Rewrite this sentence in a warm, friendly, casual tone, like talking to a close friend.',
  Polite: 'Rewrite this sentence in a polite, respectful, courteous tone.',
  Funny: 'Rewrite this sentence to be humorous and witty, while keeping it lighthearted and not offensive.',
  Rude: 'Rewrite this sentence in a blunt, curt, slightly rude tone — but not abusive or containing slurs.',
  Short: 'Rewrite this sentence to be as short and concise as possible.',
};

app.post('/api/rewrite', async (req, res) => {
  try {
    const { text, label } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Text is required' });
    }
    if (!TONE_INSTRUCTIONS[label]) {
      return res.status(400).json({ error: 'Invalid label' });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `${TONE_INSTRUCTIONS[label]}\n\nSentence: "${text.trim()}"`,
      config: {
        systemInstruction: 'You rewrite sentences in a requested tone. Reply with ONLY the rewritten sentence — no preamble, no quotes, no explanation.',
      },
    });

    res.json({ result: response.text.trim() });
  } catch (err) {
    console.error('Gemini API error:', err);
    res.status(500).json({ error: 'Something went wrong generating the rewrite.' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));