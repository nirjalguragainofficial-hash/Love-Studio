# Changelog

All notable changes to **Love Studio** will be documented in this file.

This project follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and uses [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- Mood emoji quick-insert buttons above the chat input for faster emotional expression
- Live word and character count inside the journal editor
- Automatic dark mode support via `prefers-color-scheme` CSS media query
- **Emoji reactions** on AI chat messages (❤️ 👍 ✨) — hover a bubble to react
- **Clear Chat** button in the chat header to start a fresh conversation
- **Mood tag categories** for journal entries (Good, Low, Anxious, Frustrated, Grateful) — displayed as a badge on saved entries
- **New mood tags**: `Happy 😄` and `Calm 😌` added to the journal mood selector for a richer emotional palette
- **In-memory rate limiter** on the API server (10 req / IP / min) with `Retry-After` header
- **Request logger** middleware on the server for structured latency logging
- **Health check** endpoint (`GET /api/health`) returning server status and uptime
- **Step indicators** ("Step 1 of 2" / "Step 2 of 2") and character counter on the onboarding flow
- **Journal search** — live full-text filter above the entries list; supports searching by entry text or mood tag, with a match count badge (e.g. `2 / 7`)
- **Message count badge** — compact pill in the chat header showing how many messages are in the current session
- **Pin / Bookmark messages** — click the 📌 icon on any bubble to pin it; pinned messages appear in a persistent strip above the chat area for quick reference
- **Escape key** closes the Settings modal (with unsaved-changes guard)
- **Global `.icon-btn` utility** class, `button:disabled` opacity rule, and `:focus-visible` keyboard ring in `index.css`
- **`--transition-default` CSS variable** added to design tokens for consistent animation timing across components

### Fixed
- Speech recognition `InvalidStateError` caused by starting a session while one was still active; resolved by calling `.abort()` before `.start()`

### Accessibility
- Added `aria-label` and `title` attributes to all icon-only buttons in Journal and SettingsModal
- Journal entry delete button now has descriptive `aria-label="Delete this entry"`

---

## [0.3.0] — 2026-08-03

### Added
- **Pin / Bookmark messages** — click the 📌 icon on any bubble to pin it; pinned messages appear in a persistent strip above the chat area
- **Journal search** — live full-text filter; supports searching by entry text or mood tag, with match count badge
- **Message count badge** — compact pill in the chat header
- **Escape key** closes the Settings modal (with unsaved-changes guard)
- **Happy 😄** and **Calm 😌** mood tags added to the journal mood selector
- **Global `.icon-btn` utility** class and `:focus-visible` keyboard ring in `index.css`
- **In-memory rate limiter** on the API server (10 req / IP / min)
- **Health check** endpoint (`GET /api/health`)

### Fixed
- Speech recognition `InvalidStateError` when starting a session while one was active

### Accessibility
- `aria-label` and `title` on all icon-only buttons in Journal and SettingsModal

---


## [0.2.0] — 2026-07-25

### Added
- Expanded crisis keyword detection with additional phrases
- JSDoc and inline comments across `server/index.js` and `App.jsx`
- `server/.env.example` template file for easier onboarding
- Open Graph meta tags and `theme-color` in `index.html` for better sharing previews
- `CONTRIBUTING.md` with setup instructions and pull request guidelines
- Comprehensive `.gitignore` covering OS, editor, venv, and build artifacts

### Changed
- Rewrote README with full project description, setup guide, and tech stack
- Refined AI companion greeting to feel warmer and more welcoming

---

## [0.1.0] — Initial Release

### Added
- AI companion chat powered by Groq LLM
- Voice input (Web Speech API) and voice output (SpeechSynthesis)
- Journal with persistent local storage
- Onboarding flow to personalize companion name and avatar
- Mood modes: *Just Listen*, *Distract Me*, *Cheer Me Up*
- Crisis keyword detection with emergency resource modal
- Settings modal to update companion details
