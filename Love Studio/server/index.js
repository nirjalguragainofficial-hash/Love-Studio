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

const GROQ_API_KEY = process.env.GROQ_API_KEY;

app.post('/api/chat', async (req, res) => {
    try {
        const { messages, mode, companionName } = req.body;

        const modeInstructions = {
            vent: "Be warm, empathetic, and a great listener. Validate feelings, ask gentle follow-up questions. Don't rush to give advice unless asked.",
            distract: "Be light, fun, and distracting. Share interesting facts, ask playful questions, keep things upbeat.",
            cheer: "Be uplifting and encouraging. Remind the user of their strengths, be genuinely warm and supportive."
        };

        const systemPrompt = `You are ${companionName || 'a caring companion'}, a warm, emotionally supportive AI friend. ${modeInstructions[mode] || modeInstructions.vent} Keep responses natural and conversational, usually 1-4 sentences unless the user clearly wants to talk more in depth. Never claim to be a licensed therapist. If the user seems in crisis, gently encourage professional help.`;

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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));