export const WS_BASE_URL =
import.meta.env.VITE_WS_BASE_URL || "ws://127.0.0.1:8000";

// Opens a real connection to the /ws route, exactly like the Postman
// WebSocket tabs you tested with — the token rides along as a query param
// since browsers can't attach custom headers to a WebSocket handshake.
export function createChatSocket(token) {
  return new WebSocket(`${WS_BASE_URL}/ws?token=${token}`);
}
