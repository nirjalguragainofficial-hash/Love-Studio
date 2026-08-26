# Troubleshooting Guide

A step-by-step reference for the most common issues you may encounter running Love Studio locally.

---

## Voice output (TTS) not working

1. Make sure Python ≥ 3.9 is installed and on your `PATH` (`python --version`).
2. Install the required dependencies:
   ```bash
   pip install flask flask-cors edge-tts
   ```
3. The Python TTS server runs on port `5000`. Verify it started successfully by opening [http://localhost:5000](http://localhost:5000) in your browser — you should see a simple status message.
4. If you started Love Studio with `npm start`, check the terminal output for TTS-server errors. The `server/start_all.js` script logs per-process exit codes.
5. On **macOS/Linux**, port 5000 may be occupied by AirPlay Receiver. Change the TTS port in `server/tts_server.py` and update the corresponding fetch URL in the frontend.

---

## API / Chat errors

1. Ensure `server/.env` exists and contains your key:
   ```
   GROQ_API_KEY=gsk_...
   ```
   Copy `server/.env.example` if the file is missing.
2. Confirm the Express API server is running on port `3001` (`npm start` starts it automatically).
3. Check the Node.js console for detailed error messages from the Groq SDK.
4. If you see **401 Unauthorized**, your key is invalid or has been revoked — generate a new one at [console.groq.com](https://console.groq.com).
5. If you see **429 Too Many Requests**, the Groq API quota has been exceeded. Wait a minute or switch to a less-loaded model.

---

## Voice input (speech recognition) not working

1. Voice input uses the browser's **Web Speech API**, which is only available over `https://` or `localhost`. Make sure you are not accessing the app over a plain `http://` remote URL.
2. Chrome / Edge have the best support. Firefox requires enabling the feature flag (`media.webspeech.recognition.enable`). Safari has very limited support.
3. Grant microphone permissions when the browser prompts. If you previously denied access, click the lock icon in the address bar and reset microphone permission.
4. If you see **`InvalidStateError`**, the speech session was already active. This is a known bug fixed in `v0.3.0` — make sure you are on the latest version.

---

## Blank or white screen on load

1. Open the browser console (`F12 → Console`) and look for JavaScript errors.
2. Make sure all dependencies are installed: `npm install`.
3. Delete the Vite cache and rebuild: `rm -rf node_modules/.vite && npm run dev`.
4. Clear `localStorage` — a malformed saved state can crash the app on boot:
   ```
   F12 → Application → Local Storage → Clear All
   ```

---

## Rate-limit errors from the local server

The built-in Express server caps requests at **10 per IP per minute**. If you are testing rapidly, you may hit this limit yourself.

- **To temporarily increase the limit**, open `server/index.js`, find the rate-limiter config, and raise `max`.
- The server responds with a `429` status and a `Retry-After` header indicating when you can retry.

---

## CORS errors in the browser console

CORS errors typically mean the frontend is making requests to a port where no server is running, or the server has not started yet.

1. Confirm both servers are running (`npm start` starts all processes).
2. Check that the API base URL in the frontend matches the port your Express server is listening on (default: `3001`).
3. If you changed the port in `server/index.js`, update the corresponding `VITE_API_URL` in your `.env` file.

---

## Resetting a stuck onboarding flow

If you get stuck on the onboarding screen even after completing setup, the saved step in `sessionStorage` may be corrupted.

1. Open **DevTools → Application → Session Storage**.
2. Delete the `loveStudio_onboardingStep` key.
3. Reload the page.

---

## Still stuck?

Open an issue on the [GitHub repository](https://github.com/nirjalguragainofficial/Love-Studio/issues) and include:
- Your OS and browser version
- The full error message from the browser console or terminal
- Steps to reproduce
