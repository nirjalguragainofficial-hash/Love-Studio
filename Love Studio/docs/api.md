# Local API Reference

Love Studio's backend exposes two local HTTP services:

| Service | Default Port | Purpose |
|---------|-------------|---------|
| Express (Node.js) | `3001` | Groq chat proxy, rate limiting, health check |
| Flask (Python) | `5000` | Text-to-Speech via `edge-tts` |

> **Base URL (Express):** `http://localhost:3001`  
> **Base URL (TTS):** `http://localhost:5000`

You can override the Express base URL by setting `VITE_API_URL` in your `.env` file.

---

## Express API — Chat & Utilities

### `POST /api/chat`

Forwards a conversation to the Groq LLM and returns the assistant reply.

**Request headers**

| Header | Value |
|--------|-------|
| `Content-Type` | `application/json` |

**Request body**

```json
{
  "messages": [
    { "role": "system", "content": "You are a warm, empathetic companion..." },
    { "role": "user",   "content": "I'm feeling a bit anxious today." }
  ]
}
```

**Success response — `200 OK`**

```json
{
  "message": {
    "role": "assistant",
    "content": "I'm really glad you told me. Want to talk about what's on your mind?"
  }
}
```

**Error responses**

| Status | Meaning |
|--------|---------|
| `400 Bad Request` | `messages` array missing or malformed |
| `401 Unauthorized` | Invalid or missing `GROQ_API_KEY` in `server/.env` |
| `429 Too Many Requests` | Local rate limit exceeded (10 req / IP / min); includes `Retry-After` header |
| `500 Internal Server Error` | Unexpected server-side error; check Node.js console |

---

### `GET /api/health`

Returns a JSON snapshot of the server's current status and uptime. Useful for monitoring and for confirming the server started correctly.

**Request**

```
GET /api/health
```

**Success response — `200 OK`**

```json
{
  "status": "ok",
  "uptime": 142.37
}
```

`uptime` is the number of seconds the Node.js process has been running.

---

## Rate Limiting

All `/api/*` routes are protected by an in-memory rate limiter.

| Property | Value |
|----------|-------|
| Window | 60 seconds |
| Max requests | 10 per IP |
| Response on limit | `429 Too Many Requests` |
| `Retry-After` header | Seconds until the window resets |

To raise or lower the limit, edit the rate-limiter config in `server/index.js`.

---

## TTS Service — Text-to-Speech

### `POST /tts/generate`

Generates an MP3 audio stream from a text string using Microsoft's `edge-tts` neural voices.

**Request headers**

| Header | Value |
|--------|-------|
| `Content-Type` | `application/json` |

**Request body**

```json
{
  "text": "Hey there! I'm so happy you reached out.",
  "voice": "en-US-JennyNeural"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `text` | string | ✅ | The text to synthesize. Keep under ~500 chars for best latency. |
| `voice` | string | ✅ | Any valid `edge-tts` voice name (e.g. `en-GB-SoniaNeural`). |

**Success response — `200 OK`**

- **Content-Type:** `audio/mpeg`
- Body is a raw MP3 audio stream that can be piped directly into an `<audio>` element or the Web Audio API.

**Error responses**

| Status | Meaning |
|--------|---------|
| `400 Bad Request` | `text` or `voice` field missing |
| `500 Internal Server Error` | `edge-tts` process failed; check Python console |

---

## Useful `edge-tts` voices

| Voice name | Language | Gender |
|-----------|----------|--------|
| `en-US-JennyNeural` | English (US) | Female |
| `en-US-GuyNeural` | English (US) | Male |
| `en-GB-SoniaNeural` | English (UK) | Female |
| `en-AU-NatashaNeural` | English (AU) | Female |
| `en-IN-NeerjaNeural` | English (IN) | Female |

Run `edge-tts --list-voices` in your terminal to see the full list of available voices.
