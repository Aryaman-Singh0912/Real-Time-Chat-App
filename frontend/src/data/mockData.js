// All of this is placeholder data so the UI has something to render.
// Once the backend is wired up (see src/services/api.js), this file
// won't be needed for real data - it's only here for now so the screens
// look and feel finished while you build against them.

export const CURRENT_USER = { id: 3, username: "testuser3" };

export const CONVERSATIONS = [
  {
    id: 1,
    contact: { id: 10, username: "anna", online: true, last_seen: null },
    lastMessage: "Yay!",
    time: "09:31",
    unread: 2,
  },
  {
    id: 2,
    contact: { id: 11, username: "lucy", online: false, last_seen: "2026-09-05T06:53:00Z" },
    lastMessage: "Cool! I'll take them with me",
    time: "06:53",
    unread: 0,
  },
  {
    id: 3,
    contact: { id: 12, username: "izak", online: true, last_seen: null },
    lastMessage: "I'll call her later!",
    time: "Wed",
    unread: 0,
  },
  {
    id: 4,
    contact: { id: 13, username: "maya", online: false, last_seen: "2026-09-03T12:00:00Z" },
    lastMessage: "How about Friday next week?",
    time: "Wed",
    unread: 0,
  },
  {
    id: 5,
    contact: { id: 14, username: "jide", online: false, last_seen: "2026-09-01T18:20:00Z" },
    lastMessage: "It was awesome!!!",
    time: "Mon",
    unread: 0,
  },
];

export const MESSAGES_BY_CONVERSATION = {
  1: [
    { id: 1, type: "message", isOwn: false, content: "Hola! Nice to hear from you.", created_at: "2026-09-05T09:14:00Z" },
    { id: 2, type: "message", isOwn: true, content: "And you, too!", created_at: "2026-09-05T09:15:00Z" },
    { id: 3, type: "message", isOwn: false, content: "Let's meet? 8 at J's?", created_at: "2026-09-05T09:20:00Z" },
    { id: 4, type: "message", isOwn: true, content: "See you there 🎉", created_at: "2026-09-05T09:21:00Z" },
    { id: 5, type: "message", isOwn: false, content: "Yay!", created_at: "2026-09-05T09:31:00Z" },
  ],
  2: [
    { id: 6, type: "message", isOwn: false, content: "Did you see the photos from the trip?", created_at: "2026-09-05T06:40:00Z" },
    { id: 7, type: "message", isOwn: true, content: "Not yet, send them over", created_at: "2026-09-05T06:45:00Z" },
    { id: 8, type: "message", isOwn: false, content: "Cool! I'll take them with me", created_at: "2026-09-05T06:53:00Z" },
  ],
  3: [
    { id: 9, type: "message", isOwn: false, content: "Are we still on for later?", created_at: "2026-09-03T10:00:00Z" },
    { id: 10, type: "message", isOwn: true, content: "Yep, I'll call her later!", created_at: "2026-09-03T10:02:00Z" },
  ],
  4: [
    { id: 11, type: "message", isOwn: true, content: "How about Friday next week?", created_at: "2026-09-03T12:00:00Z" },
  ],
  5: [
    { id: 12, type: "message", isOwn: false, content: "It was awesome!!!", created_at: "2026-09-01T18:20:00Z" },
  ],
};

// Stand-in for a GET /users/search result, used by the Add Contact modal.
export const MOCK_SEARCH_RESULTS = [
  { id: 20, username: "priya" },
  { id: 21, username: "devraj" },
  { id: 22, username: "sameer" },
];
