# AI Mystery Room

A fictional, AI-generated investigation game. The React client talks only to the Express API; Gemini credentials, session ownership, and solution data stay on the server.

## Requirements

- Node.js 20+
- MongoDB (local or hosted)
- A Google Gemini API key for mystery generation

## Run locally

1. Copy `.env.example` to `server/.env` and set `MONGODB_URI`, `GEMINI_API_KEY`, and a unique `SESSION_SECRET`.
2. Install dependencies with `npm install` at the repository root.
3. Start both applications with `npm run dev`.
4. Open `http://localhost:5173`. The API health endpoint is `http://localhost:5000/api/health`.

The server does not create pretend cases when Gemini or MongoDB is unavailable. It returns a safe, actionable error instead. Generated evidence is fictional text; media has an explicit unavailable placeholder and does not block play.

## Configuration

See `.env.example`. `GEMINI_MODEL` must name a model supported by the installed Google Gen AI SDK and structured JSON output. `COOKIE_SECURE` must be `true` behind HTTPS in production. Restrict `CLIENT_URL` to the deployed client origin and use a strong session secret.

Anonymous mysteries are scoped to an HttpOnly session cookie. There is no login or cross-device recovery. Production deployments should define and implement a retention policy appropriate to their privacy requirements; this MVP currently retains records until manually removed.

## Project structure

- `client/`: React, Vite, and responsive interface
- `server/`: Express API, Gemini integration, validation, and Mongoose models

All cases, chat excerpts, and evidence are fictional and must not be treated as real-world evidence.
