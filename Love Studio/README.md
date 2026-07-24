# 💜 Love Studio

**Love Studio** is a personal AI companion app designed to provide emotional support, a safe space to vent, and positive distraction — whenever you need it.

## ✨ Features

- 🤖 **AI Companion** — Chat with a personalized AI companion powered by Groq
- 🎙️ **Voice Input** — Speak your thoughts using the built-in speech recognition
- 🔊 **Voice Output** — Hear responses read aloud via text-to-speech
- 📔 **Journal** — Log your thoughts and feelings privately
- 💡 **Mood Modes** — Choose between *Just Listen*, *Distract Me*, and *Cheer Me Up*
- 🛡️ **Crisis Detection** — Automatically shows emergency resources when needed
- 🎨 **Onboarding** — Personalize your companion's name and avatar

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

Create a `server/.env` file:
```env
GROQ_API_KEY=your_key_here
```

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
```

## 📄 License

MIT

