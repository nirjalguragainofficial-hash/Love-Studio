# Setup Guide

Get Love Studio running locally in five minutes.

---

## Prerequisites

| Tool | Minimum version | Check |
|------|----------------|-------|
| Node.js | 18+ LTS | `node -v` |
| npm | 9 | `npm -v` |
| Python | 3.9 | `python --version` |
| Git | any | `git --version` |

You will also need a **free Groq API key** — sign up at [console.groq.com](https://console.groq.com).

---

## 1 · Clone the repository

```bash
git clone https://github.com/nirjalguragainofficial/Love-Studio.git
cd Love-Studio
```

---

## 2 · Install Node.js dependencies

```bash
npm install
```

This installs the React frontend, Express API server, and all shared tooling.

---

## 3 · Configure environment variables

Copy the example env file and fill in your key:

```bash
cp server/.env.example server/.env
```

Open `server/.env` and set:

```env
GROQ_API_KEY=gsk_your_key_here
```

> **Never commit your `.env` file.** It is already listed in `.gitignore`.

---

## 4 · Install Python dependencies

It is recommended to use a virtual environment to avoid polluting your global Python installation:

```bash
# Create and activate a virtual environment (optional but recommended)
python -m venv .venv

# Windows
.venv\Scripts\activate

# macOS / Linux
source .venv/bin/activate

# Install dependencies
pip install flask flask-cors edge-tts
```

For **voice cloning** support (optional, requires a GPU or a fast CPU):

```bash
pip install TTS torch torchaudio soundfile numpy
```

> The Coqui TTS model (~1.8 GB) is downloaded on first use. If it is not installed, Love Studio falls back automatically to the lightweight Edge-TTS engine.

---

## 5 · Start the application

```bash
npm start
```

This single command launches all three services in parallel:

| Service | URL | Description |
|---------|-----|-------------|
| Vite dev server (frontend) | http://localhost:5173 | React UI |
| Express API server | http://localhost:3001 | Groq chat proxy |
| Python TTS server | http://localhost:8000 | Edge-TTS / Coqui TTS |

Open **http://localhost:5173** in your browser to begin.

---

## Verification checklist

- [ ] `http://localhost:3001/api/health` returns `{"status":"ok"}`
- [ ] `http://localhost:8000/health` returns `{"status":"ok"}`
- [ ] The onboarding screen loads at `http://localhost:5173`
- [ ] Sending a chat message returns a Nepali-language response from the companion

---

## Common issues

See [docs/troubleshooting.md](./troubleshooting.md) for solutions to TTS not working, API errors, voice input problems, and blank screen on load.
