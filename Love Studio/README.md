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
- 💡 **Mood Modes** — Choose between *Just Listen*, *Distract Me*, and *Cheer Me Up*
- 🛡️ **Crisis Detection** — Automatically shows emergency resources when needed
- 🎨 **Onboarding** — Personalize your companion's name and avatar
- 😊 **Emoji Quick-Inserts** — Tap a mood emoji to start the conversation easily
- 🌙 **Dark Mode** — Automatic dark theme based on your OS preference

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A [Groq API key](https://console.groq.com)

### Installation

```bash
npm install
```

### Running the app

Start the backend server:
```bash
npm run server
```

Start the frontend dev server:
```bash
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

### Environment Variables

Create a `server/.env` file (copy from the provided template):
```bash
cp server/.env.example server/.env
```

Then fill in your key:
```env
GROQ_API_KEY=your_key_here
```

## ⌨️ Keyboard Shortcuts

| Action | Shortcut |
|---|---|
| Send message | `Enter` |
| New line in message | `Shift + Enter` |
| Toggle mic | Click 🎤 button |

## 🛠️ Tech Stack

- **Frontend:** React 19, Vite, Framer Motion, Lucide Icons
- **Backend:** Node.js, Express, Groq SDK
- **Routing:** React Router v7

## 📁 Project Structure

```
src/
  pages/       # Chat, Journal, Onboarding
  components/  # SettingsModal
server/
  index.js     # Express API server
  .env.example # Environment variable template
```

## 🔧 Troubleshooting

**Voice input not working?**
- Check that your browser supports the Web Speech API (Chrome/Edge recommended).
- Make sure microphone permissions are granted for `localhost`.

**AI not responding?**
- Confirm the backend server is running on port `3001`.
- Verify your `GROQ_API_KEY` is set correctly in `server/.env`.

**Dark mode not activating?**
- Dark mode follows your OS setting. Change your system appearance to *Dark* to see it.

## 📄 License

MIT
