# Architecture Overview

Love Studio consists of three main components:
1. **Frontend**: A React application built with Vite, Framer Motion, and Tailwind CSS (or regular CSS).
2. **Backend API**: An Express.js server that acts as a proxy to the Groq API and handles rate limiting.
3. **TTS Service**: A Python Flask server that generates Text-to-Speech audio using the `edge-tts` library.

The services communicate over local HTTP.
