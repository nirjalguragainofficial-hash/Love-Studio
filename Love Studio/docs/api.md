# Local API Documentation

## `POST /api/chat`
Handles interactions with the Groq API.
- **Body:** `{ "messages": [ { "role": "user", "content": "..." } ] }`
- **Response:** `{ "message": { "role": "assistant", "content": "..." } }`

## `POST /tts/generate`
Generates an audio file from text using edge-tts.
- **Body:** `{ "text": "...", "voice": "en-US-JennyNeural" }`
- **Response:** Audio stream (`audio/mpeg`)
