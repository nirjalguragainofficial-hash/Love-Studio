# 💜 Love Studio

**Love Studio** is a personal AI companion app designed to provide emotional support, a safe space to vent, and positive distraction — whenever you need it.

![License](https://img.shields.io/badge/license-MIT-pink?style=flat-square)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=flat-square&logo=node.js)
![Groq](https://img.shields.io/badge/powered%20by-Groq-orange?style=flat-square)

---

## ✨ Features

- 🤖 **AI Companion** — Chat with a personalized AI companion powered by Groq
- 🎙️ **Voice Input** — Speak your thoughts using the built-in speech recognition
- 🔊 **Voice Output** — Hear responses read aloud via text-to-speech
- 📔 **Journal** — Log your thoughts and feelings privately with a live word count
- 🔍 **Search** — Full-text and tag-based search for your journal entries
- 💡 **Mood Modes** — Choose between *Just Listen*, *Distract Me*, and *Cheer Me Up*
- 📌 **Pin Messages** — Bookmark important messages in chat for quick reference
- 💬 **Live Session Stats** — See your current message count at a glance
- 📱 **Responsive Design** — Optimized for both desktop and mobile screens
- ❤️ **Emoji Reactions** — React to AI messages with ❤️ 👍 ✨ by hovering a bubble
- 🛡️ **Crisis Detection** — Automatically shows emergency resources when needed
- 🎨 **Onboarding** — Personalize your companion's name and avatar
- 😊 **Emoji Quick-Inserts** — Tap a mood emoji to start the conversation easily
- 🌙 **Dark Mode** — Automatic dark theme based on your OS preference
- 🔒 **Rate Limiting** — Built-in API rate limiter (10 req / IP / min) to prevent abuse

## 🚀 Getting Started

### Prerequisites
- **Node.js**: 18+
- **Python**: 3.9+ (for Voice TTS & Voice Cloning)
- **Groq API Key**: Get a free key at [console.groq.com](https://console.groq.com)

### Installation & Quick Start

1. **Clone the repository**:
   ```bash
   git clone https://github.com/nirjalguragainofficial-hash/Love-Studio.git
   cd Love-Studio
   ```

2. **Install Dependencies**:
   ```bash
   # Install Node dependencies
   npm install

   # Install Python TTS dependencies
   pip install flask flask-cors edge-tts
   ```

3. **Set Up Environment Variables**:
   Create a file at `server/.env`:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   ```

4. **Launch the Full Application**:
   ```bash
   npm start
   ```
   *This single command starts the Frontend UI, Express API server, and Python Voice TTS server all together.*

5. **Open in Browser**:
   Go to [http://localhost:5173](http://localhost:5173) (or `http://localhost:5174`).

## ⌨️ Keyboard Shortcuts

| Action | Shortcut |
|---|---|
| Send message | `Enter` |
| New line in message | `Shift + Enter` |
| Toggle mic | Click 🎤 button |
| Close Settings modal | `Escape` |

## 🛠️ Tech Stack

- **Frontend:** React 19, Vite, Framer Motion, Lucide Icons
- **Backend:** Node.js, Express, Groq SDK
- **Routing:** React Router v7

## 📁 Project Structure

```
src/
  pages/         # Chat, Journal, Onboarding pages
  components/    # SettingsModal and shared UI components
  index.css      # Global design tokens and utility classes
server/
  index.js       # Express API server (Groq, rate limiter, health check)
  tts_server.py  # Python Flask TTS server (edge-tts)
  start_all.js   # Launcher — starts all three servers together
  .env.example   # Environment variable template
```

## 🌐 Browser Support

| Browser | Chat | Voice Input | Voice Output |
|---------|------|-------------|--------------|
| Chrome 90+ | ✅ | ✅ | ✅ |
| Edge 90+ | ✅ | ✅ | ✅ |
| Firefox 90+ | ✅ | ❌ | ✅ |
| Safari 15+ | ✅ | ⚠️ Partial | ✅ |

> **Note:** Voice input (speech recognition) requires a Chromium-based browser. All other features work in modern Firefox and Safari.

## 🔧 Troubleshooting

**Voice input not working?**
- Check that your browser supports the Web Speech API (Chrome/Edge recommended).
- Make sure microphone permissions are granted for `localhost`.

**AI not responding?**
- Confirm the backend server is running on port `3001`.
- Verify your `GROQ_API_KEY` is set correctly in `server/.env`.

**Dark mode not activating?**
- Dark mode follows your OS setting. Change your system appearance to *Dark* to see it.

**Voice output (TTS) not working?**
- Make sure Python and the TTS dependencies are installed: `pip install flask flask-cors edge-tts`
- The Python TTS server runs on port `5000`. Check it is running with `npm start` (which starts all servers together).

## 📄 License

MIT

---
*Built with ❤️ for mental wellness.*
