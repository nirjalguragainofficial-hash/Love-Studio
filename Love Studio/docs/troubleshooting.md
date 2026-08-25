# Troubleshooting Guide

## Voice output (TTS) not working
- Make sure Python and the TTS dependencies are installed: `pip install flask flask-cors edge-tts`
- The Python TTS server runs on port `5000`. Check it is running with `npm start` (which starts all servers together).

## API Errors
- Ensure your `GROQ_API_KEY` is set correctly in `server/.env`.
