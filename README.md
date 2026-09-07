# Real-Time-Chat-App

![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?style=flat&logo=react&logoColor=white)
![Styling](https://img.shields.io/badge/Styling-Tailwind%20CSS-38BDF8?style=flat&logo=tailwindcss&logoColor=white)
![Backend](https://img.shields.io/badge/Backend-FastAPI-009688?style=flat&logo=fastapi&logoColor=white)
![Realtime](https://img.shields.io/badge/Realtime-WebSockets-4A90D9?style=flat)
![Auth](https://img.shields.io/badge/Auth-JWT-111111?style=flat&logo=jsonwebtokens&logoColor=white)
![License](https://img.shields.io/badge/License-UNLICENSED-lightgrey?style=flat)

A full-stack real-time messaging app: FastAPI + WebSockets backend, React + Vite + Tailwind frontend, JWT auth.

Real-Time-Chat-App is a two-person direct-messaging app built to explore what a production-shaped chat stack looks like end to end:

- A **FastAPI** backend that handles signup/login, contacts, conversations, and message history over REST, and pushes live messages + typing indicators over a single WebSocket connection per user.
- A **React + Vite + Tailwind** frontend (internally called **Wisp**) that consumes that API and socket.

Note on naming: the frontend's `package.json` still uses the Vite-scaffolded name `frontend` rather than a project-specific one — the UI itself is referred to as **Wisp** in its own README and code.

## Table of Contents

- [Features](#features)
- [How It Works](#how-it-works)
- [Security](#security)
- [Background](#background)
- [Install](#install)
  - [Backend](#backend)
  - [Frontend](#frontend)
- [Usage](#usage)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [API](#api)
- [Maintainers](#maintainers)
- [Contributing](#contributing)
- [License](#license)

## Features

- **JWT authentication** — signup/login with bcrypt-hashed passwords, short-lived HS256 access tokens.
- **Real-time messaging** — a single authenticated WebSocket per user delivers messages instantly, no polling.
- **Typing indicators** — debounced typing events pushed over the same socket.
- **Online / last-seen status** — tracked per user from live WebSocket connections.
- **Contact search & add** — case-insensitive username search, then add as a contact.
- **1:1 conversations** — auto-created or reused between two users, with paginated message history.
- **Light/dark theme toggle** and deterministic avatar generation on the frontend.

*(Add a screenshot or short demo GIF of the chat screen here — recruiters skim visuals before text.)*

## How It Works

1. A user signs up or logs in — the backend hashes/verifies the password and returns a JWT.
2. The frontend stores that JWT and opens one WebSocket connection for the whole session (`/ws?token=<jwt>`), authenticated the same way the REST calls are.
3. The user searches for another username, adds them as a contact, and starts (or reuses) a conversation.
4. Sending a message pushes it over the WebSocket → the backend persists it to the database → if the recipient is currently connected, the backend pushes it straight to their socket; otherwise they'll see it next time they fetch message history over REST.
5. Typing events follow the same path as a lightweight `{"type": "typing"}` payload, not persisted to the database.

## Security

- Passwords are hashed with **bcrypt** (via `passlib`) before storage — never stored in plain text.
- Auth uses **JWT** access tokens (`python-jose`, HS256), signed with a `SECRET_KEY` environment variable that must never be committed.
- The WebSocket handshake passes the JWT as a `?token=` query parameter, since browsers can't set custom headers on a WS upgrade — treat these URLs as sensitive (they can end up in logs).
- CORS is currently locked to `http://127.0.0.1:5173` / `http://localhost:5173`; update `main.py` before deploying anywhere else.
- There's no rate limiting on `/login` or `/signup` yet — add one before exposing this publicly.

If you find a security issue, please open an issue rather than posting exploit details in a public PR.

## Background

This project exists to practice wiring a real-time feature (WebSockets) into a conventional REST + JWT auth stack, instead of leaning on a third-party chat SDK. A few of the design choices:

- **FastAPI** for the backend — async-native, so one process can hold many open WebSocket connections without extra worker infrastructure.
- **SQLAlchemy ORM** over raw SQL for the four core tables (`users`, `contacts`, `conversations`, `messages`).
- **One WebSocket per logged-in user**, not one per open conversation — simpler connection bookkeeping (see `ConnectionManager` in `backend/main.py`).
- **React + Vite + Tailwind** on the frontend for a fast dev loop and utility-first styling.

See also: [FastAPI WebSockets docs](https://fastapi.tiangolo.com/advanced/websockets/), [SQLAlchemy ORM docs](https://docs.sqlalchemy.org/).

## Install

### Backend

Requires Python 3.10+ and a database reachable via a SQLAlchemy connection string (SQLite works with zero setup; Postgres/MySQL work too).

```bash
cd backend
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install fastapi uvicorn sqlalchemy python-jose passlib[bcrypt] python-dotenv
```

#### Dependencies

- Create a `backend/.env` file (see [Environment Variables](#environment-variables)) — the app won't start without `SECRET_KEY` and `DATABASE_URL`.
- Create the database tables once:

```bash
python create_tables.py
```

### Frontend

Requires Node.js 18+.

```bash
cd frontend
npm install
```

## Usage

Run both halves in separate terminals.

**Backend** (from `backend/`):

```bash
uvicorn main:app --reload
```

Serves the REST API and the `/ws` WebSocket endpoint on `http://127.0.0.1:8000`.

**Frontend** (from `frontend/`):

```bash
npm run dev
```

Prints a local URL (usually `http://127.0.0.1:5173`) with:

- `/login` — sign in
- `/signup` — create an account
- `/chat` — the chat screen (requires a valid token in `localStorage`)

Sign up, use the contact-search UI to add another user, start a conversation, and messages sent from one browser tab arrive in the other in real time over the WebSocket.

## Architecture

**Backend** (`backend/`, FastAPI + SQLAlchemy):

- `main.py` — all REST routes, the `/ws` WebSocket route, and an in-memory `ConnectionManager` mapping `user_id → WebSocket` so messages can be pushed to a specific online user.
- `models.py` — SQLAlchemy models: `Users`, `Contact`, `Conversation`, `Message`.
- `schemas.py` — Pydantic request/response models.
- `auth.py` — password hashing (bcrypt) and JWT creation/verification.
- `database.py` — engine/session setup; reads `DATABASE_URL` from the environment.
- `create_tables.py` — one-off script that creates all tables from the models.

Message flow: the client sends `{"type": "message", ...}` over its open WebSocket → the server saves a `Message` row → the server looks up the recipient's live connection in `ConnectionManager` and pushes the saved message if they're online. REST endpoints (`/messages`, `/conversations/{id}/messages`) sit alongside the socket for sending/fetching history when a recipient is offline or a client is paginating.

**Frontend** (`frontend/`, React + Vite + Tailwind):

- `src/pages/` — `LoginPage`, `SignupPage`, `ChatPage` (the main authenticated screen).
- `src/components/` — `Sidebar`, `ChatWindow`, `MessageBubble`, `MessageInput`, `AddContactModal`, `Avatar`, `StatusDot`, `TypingIndicator`, `ThemeToggle`, `ConversationListItem`.
- `src/hooks/useAuth.js` — owns the JWT in `localStorage`, exposes `login` / `signup` / `logout`.
- `src/hooks/useChatSocket.js` — opens a single WebSocket for the whole session, exposes `sendMessage` / `sendTyping`.
- `src/services/api.js` — one function per REST call.
- `src/services/websocket.js` — builds the `ws://.../ws?token=...` connection.
- `src/utils/` — `time.js` and `avatar.js` formatting helpers.

`ChatPage.jsx` is the integration point: it loads the current user and conversation list over REST on mount, loads message history for whichever conversation is active, and layers live updates from the WebSocket on top of that state.

## Project Structure

```
Real-Time-Chat-App/
├── backend/
│   ├── main.py
│   ├── models.py
│   ├── schemas.py
│   ├── auth.py
│   ├── database.py
│   └── create_tables.py
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── hooks/
    │   ├── services/
    │   └── utils/
    ├── index.html
    └── vite.config.js
```

## Environment Variables

Set these in `backend/.env` (never commit this file — it's already in `.gitignore`):

| Variable | Required | Description |
| --- | --- | --- |
| `SECRET_KEY` | Yes | Signing secret for JWTs. Use a long random string. |
| `DATABASE_URL` | Yes | SQLAlchemy connection string, e.g. `sqlite:///./chat.db` or a Postgres URL. |

## API

Base URL: `http://127.0.0.1:8000`. Every route except `/`, `/signup`, and `/login` requires `Authorization: Bearer <token>`.

**Auth**

- `POST /signup` — `{ username, password }` → creates a user, returns `{ id, username }`.
- `POST /login` — `{ username, password }` → returns `{ access_token, token_type }`.
- `GET /me` — returns the current authenticated user.

**Contacts & users**

- `GET /users/search?query=` — case-insensitive username search, excludes yourself.
- `POST /contacts` — `{ contact_id }` → adds a contact.
- `GET /users/{user_id}/status` — `{ user_id, online, last_seen }`.

**Conversations & messages**

- `GET /conversations` — lists conversations for the current user, each with the other participant and a last-message preview.
- `POST /conversations` — `{ other_user_id }` → gets or creates a 1:1 conversation.
- `POST /messages` — `{ conversation_id, content }` → persists a message (REST fallback to the socket).
- `GET /conversations/{conversation_id}/messages?skip=&limit=` — paginated message history, oldest-first.

**WebSocket**

- `WS /ws?token=<jwt>` — one connection per logged-in user.
  - Client → server: `{"type": "message", "conversation_id", "receiver_id", "content"}` or `{"type": "typing", "receiver_id"}`.
  - Server → client: `{"type": "message", ...saved message...}` or `{"type": "typing", "sender_id"}` — delivered only if the recipient is currently connected.

## Maintainers

- [@Aryaman-Singh0912](https://github.com/Aryaman-Singh0912)

## Contributing

- Questions and bug reports: please [open an issue](https://github.com/Aryaman-Singh0912/Real-Time-Chat-App/issues).
- PRs are welcome — for anything non-trivial, open an issue first to discuss the approach.
- No formal commit sign-off is required; keep commits reasonably scoped and explain *why*, not just *what*.

## License

No license has been chosen for this project yet — **UNLICENSED**, all rights reserved by the repository owner. If you add a `LICENSE` file later, update this section to `SEE LICENSE IN LICENSE` and link it.

© Aryaman-Singh0912
