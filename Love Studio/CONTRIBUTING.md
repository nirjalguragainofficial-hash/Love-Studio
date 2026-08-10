# Contributing to Love Studio

Thank you for your interest in contributing to Love Studio! 💜

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/Love-Studio.git`
3. Install dependencies: `npm install`
4. Copy environment variables: `cp server/.env.example server/.env` and add your Groq API key
5. Start all servers in one command: `npm start` *(starts the frontend, API server, and TTS server)*

## Project Structure

```
Love Studio/
├── src/
│   ├── pages/          # Route-level page components (Chat, Journal, Onboarding)
│   ├── components/     # Reusable UI components (SettingsModal, etc.)
│   ├── App.jsx         # Root component with routing
│   └── index.css       # Global design tokens and utility classes
├── server/
│   ├── index.js        # Express API server (port 3001)
│   ├── tts_server.py   # Python TTS server (port 8000)
│   ├── start_all.js    # Dev launcher for all three processes
│   └── requirements.txt
├── public/             # Static assets
└── index.html          # App entry point
```

## Development Guidelines

- Keep components small and focused
- Use the existing CSS variable system for colors (`var(--color-primary)`, etc.)
- Do not commit your `server/.env` file — it's gitignored for security
- Test your changes across Chrome and Firefox

## Commit Message Convention

This project uses [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix | When to use |
|--------|-------------|
| `feat:` | New feature or user-facing addition |
| `fix:` | Bug fix |
| `refactor:` | Code restructure without behaviour change |
| `chore:` | Tooling, deps, or config changes |
| `docs:` | Documentation only |
| `assets:` | Binary / media asset changes |

Example: `feat(chat): add emoji reactions to AI messages`

## Submitting Changes

1. Create a feature branch: `git checkout -b feat/your-feature-name`
2. Make your changes with descriptive commits
3. Push your branch and open a Pull Request

**PR Checklist:**
- [ ] Code follows existing style conventions
- [ ] No `console.log` left in production paths
- [ ] `server/.env` is NOT committed
- [ ] Tested in Chrome and Firefox
- [ ] CHANGELOG.md updated under `[Unreleased]` if user-facing

## Code Style

- Use `const` and arrow functions where possible
- Keep JSX readable with consistent indentation
- Add comments for non-obvious logic

## Reporting Bugs

Found a bug? Please open a GitHub issue and include:

- A clear description of the problem
- Steps to reproduce (step-by-step)
- Expected vs. actual behaviour
- Your browser and OS version

> **Tip:** Screenshots or console error logs are always helpful!

## Security

- Never commit API keys or secrets — use `server/.env` (which is gitignored)
- If you discover a security vulnerability, please open a private issue rather than a public PR
