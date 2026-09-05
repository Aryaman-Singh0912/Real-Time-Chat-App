# Wisp — Chat frontend

React + Vite + Tailwind frontend for the real-time chat app. Right now it
runs entirely on **mock data** (`src/data/mockData.js`) so every screen is
browsable before the backend is wired in.

## Running it

```
npm install
npm run dev
```

Then open the URL it prints (usually `http://127.0.0.1:5173`).

- `/login` — sign-in screen
- `/signup` — create-account screen
- `/chat` — the chat screen itself (there's also a "View chat screen demo"
  link on the login page that jumps straight here without signing in)

## Where the backend needs to be plugged in

Every spot that needs real backend wiring has a `// TODO: connect to backend`
comment. The main ones:

- `src/services/api.js` — one stub function per REST route (login, signup,
  search users, add contact, start conversation, get messages, get status).
  Each comment says exactly which endpoint and payload it maps to.
- `src/services/websocket.js` — where the `/ws` WebSocket connection should
  be opened.
- `src/hooks/useAuth.js` — currently calls the stubs above; also where the
  JWT token gets stored (localStorage) once login actually works.
- `src/pages/ChatPage.jsx` — currently reads/writes mock data for
  conversations and messages; each handler (`handleSend`, `handleTyping`,
  `handleLoadMore`, `handleAddContact`) has a TODO describing what it should
  call instead.
- `src/components/MessageInput.jsx` — `onTyping` fires on every keystroke;
  this is where a debounced "typing" WebSocket message should go.

Once those are filled in, `src/data/mockData.js` isn't needed anymore.

## Structure

```
src/
  components/   reusable UI pieces (Avatar, MessageBubble, Sidebar, ...)
  pages/        LoginPage, SignupPage, ChatPage
  services/     api.js and websocket.js — backend integration points
  hooks/        useAuth.js
  data/         mockData.js — placeholder data
  utils/        avatar.js, time.js — small formatting helpers
```
