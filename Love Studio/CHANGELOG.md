# Changelog

All notable changes to **Love Studio** will be documented in this file.

This project follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and uses [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- Mood emoji quick-insert buttons above the chat input for faster emotional expression
- Live word and character count inside the journal editor
- Automatic dark mode support via `prefers-color-scheme` CSS media query

### Fixed
- Speech recognition `InvalidStateError` caused by starting a session while one was still active; resolved by calling `.abort()` before `.start()`

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
