/**
 * Love Studio — Express API Server
 * Handles AI chat completions via the Groq API.
 */
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
app.use(cors());
app.use(express.json());

// ── Request Logger ──────────────────────────────────────────────
app.use((req, _res, next) => {
    const start = Date.now();
    _res.on('finish', () => {
        const ms = Date.now() - start;
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} → ${_res.statusCode} (${ms}ms)`);
    });
    next();
});

// ── Simple In-Memory Rate Limiter (10 req / IP / min) ───────────
const rateLimitMap = new Map();
const RATE_LIMIT = 10;
const WINDOW_MS = 60_000;

function rateLimit(req, res, next) {
    const ip = req.ip || req.socket?.remoteAddress || 'unknown';
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

        const moodNote = moodContext[userMood] ? ` Context: ${moodContext[userMood]}` : '';

        const systemPrompt = `You are ${companionName || 'a caring companion'}, a warm, emotionally supportive AI friend.${moodNote} ${modeInstructions[mode] || modeInstructions.vent} Keep responses natural and conversational, usually 1-4 sentences unless the user clearly wants to talk more in depth. Never claim to be a licensed therapist. If the user seems in crisis, gently encourage professional help.`;

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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));