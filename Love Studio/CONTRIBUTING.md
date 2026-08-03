# Contributing to Love Studio

Thank you for your interest in contributing to Love Studio! 💜

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/Love-Studio.git`
3. Install dependencies: `npm install`
4. Copy environment variables: `cp server/.env.example server/.env` and add your Groq API key
5. Start all servers in one command: `npm start` *(starts the frontend, API server, and TTS server)*

## Development Guidelines

- Keep components small and focused
- Use the existing CSS variable system for colors (`var(--color-primary)`, etc.)
- Do not commit your `server/.env` file — it's gitignored for security
- Test your changes across Chrome and Firefox

## Submitting Changes

1. Create a feature branch: `git checkout -b feat/your-feature-name`
2. Make your changes with descriptive commits
3. Push your branch and open a Pull Request

## Code Style

- Use `const` and arrow functions where possible
- Keep JSX readable with consistent indentation
- Add comments for non-obvious logic

## Security

- Never commit API keys or secrets — use `server/.env` (which is gitignored)
- If you discover a security vulnerability, please open a private issue rather than a public PR
