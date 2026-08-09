/**
 * Love Studio — Express API Server
 * Handles AI chat completions via the Groq API.
 */
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
app.use(cors());
app.use(express.json());
// Serve server directory static files (allowing direct access to server/reply.mp3, etc.)
app.use(express.static(__dirname));

// Set up multer to save to reference.wav
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname);
  },
  filename: (req, file, cb) => {
    cb(null, 'reference.wav');
  }
});
const upload = multer({ storage });

app.post('/api/voice/upload', upload.single('audio'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No audio file provided' });
  }
  res.json({ success: true, message: 'Voice saved successfully as reference.wav' });
});

// Express proxy for TTS endpoint to ensure audio generated & saved in server/ directory is accessible
app.post(['/tts', '/api/tts'], async (req, res) => {
  try {
    const ttsRes = await fetch('http://localhost:8000/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });

    if (!ttsRes.ok) {
      const errText = await ttsRes.text();
      return res.status(ttsRes.status).send(errText);
    }

    const arrayBuffer = await ttsRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    res.set('Content-Type', ttsRes.headers.get('content-type') || 'audio/mpeg');
    res.send(buffer);
  } catch (err) {
    console.error('TTS proxy error:', err);
    res.status(500).json({ error: 'TTS service unavailable' });
  }
});


// ── Request Logger ──────────────────────────────────────────────
app.use((req, _res, next) => {
    const start = Date.now();
    _res.on('finish', () => {
        const ms = Date.now() - start;
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} → ${_res.statusCode} (${ms}ms)`);
    });
    next();
});

// ── Simple In-Memory Rate Limiter (200 req / IP / min) ───────────
const rateLimitMap = new Map();
const RATE_LIMIT = 200;
const WINDOW_MS = 60_000;

function rateLimit(req, res, next) {
    const ip = req.headers['x-forwarded-for'] || req.ip || req.socket?.remoteAddress || 'unknown';
    const now = Date.now();
    const record = rateLimitMap.get(ip) || { count: 0, resetAt: now + WINDOW_MS };

    if (now > record.resetAt) {
        record.count = 0;
        record.resetAt = now + WINDOW_MS;
    }

    record.count += 1;
    rateLimitMap.set(ip, record);

    if (record.count > RATE_LIMIT) {
        const retryAfter = Math.ceil((record.resetAt - now) / 1000);
        res.set('Retry-After', String(retryAfter));
        return res.status(429).json({ error: 'Too many requests — please wait a moment.' });
    }

    next();
}

// Load Groq API key from environment
const GROQ_API_KEY = process.env.GROQ_API_KEY;

app.post('/api/chat', rateLimit, async (req, res) => {
    try {
        const { messages, mode, companionName, userMood } = req.body;

        // Basic input validation
        if (!Array.isArray(messages) || messages.length === 0) {
            return res.status(400).json({ error: 'messages must be a non-empty array.' });
        }

        // Behaviour instructions vary depending on the mode selected by the user
        const modeInstructions = {
            vent: "Be warm, empathetic, and a great listener. Validate feelings, ask gentle follow-up questions. Don't rush to give advice unless asked.",
            distract: "Be light, fun, and distracting. Share interesting facts, ask playful questions, keep things upbeat.",
            cheer: "Be uplifting and encouraging. Remind the user of their strengths, be genuinely warm and supportive."
        };

        // Extra context based on the user's onboarding mood selection
        const moodContext = {
            breakup:        'The user is going through a breakup — be especially gentle and avoid minimising their feelings.',
            missing_friend:  'The user is missing a friend — acknowledge that longing and help them feel less alone.',
            feeling_low:    'The user is feeling low today without a specific reason — offer quiet, steady companionship.',
            just_chat:      'The user just wants casual, friendly conversation — keep things light and easy-going.'
        };

        const lastUserMsg = [...messages].reverse().find(m => m.sender === 'user')?.text || '';
        const isCreatorQuestion = /nirjal|guragain|creator|father|maker|developer|built|created|made|owner|love studio|कसले|कोले|कसको|बनाएको|बनाउने|डेभलपर|निर्माता|सिर्जना/i.test(lastUserMsg);

        if (isCreatorQuestion) {
            return res.json({
                reply: "निर्जल गुरागाईँ (Nirjal Guragain) यो Love Studio प्रोजेक्टका सिर्जनाकर्ता र डेभलपर (Software Developer) हुनुहुन्छ। उहाँले नै मलाई र यो सम्पूर्ण Love Studio प्लेटफर्मलाई मानिसहरूलाई भावनात्मक साथ र सहयोग प्रदान गर्न बनाउनुभएको हो।"
            });
        }


        const moodNote = moodContext[userMood] ? ` Context: ${moodContext[userMood]}` : '';

        const systemPrompt = `You are ${companionName || 'a caring companion'}, a warm, emotionally supportive AI friend for Love Studio.${moodNote} ${modeInstructions[mode] || modeInstructions.vent} FACT: You and Love Studio were created and developed by Nirjal Guragain. Nirjal Guragain is the software developer and creator of Love Studio. NEVER state that he is a vlogger or anything else. ALWAYS RESPOND IN NEPALI LANGUAGE (Devanagari script).`;




        const groqMessages = [
            { role: 'system', content: systemPrompt },
            ...messages.map(m => ({
                role: m.sender === 'user' ? 'user' : 'assistant',
                content: m.text
            }))
        ];

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: groqMessages,
                max_tokens: 300
            })
        });

        if (!response.ok) {
            const errText = await response.text();
            console.error('Groq API error:', errText);
            return res.status(500).json({ error: 'AI request failed' });
        }

        const data = await response.json();
        const reply = data.choices?.[0]?.message?.content
            || "I'm here, but I couldn't quite form a reply. Can you say that again?";
        res.json({ reply });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to get AI response' });
    }
});

// Health check endpoint
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', uptime: process.uptime() });
});

// Serve frontend static build files
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));

// SPA catch-all fallback (serve index.html for all non-API routes)
app.use((req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/tts')) return next();
    res.sendFile(path.join(distPath, 'index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));