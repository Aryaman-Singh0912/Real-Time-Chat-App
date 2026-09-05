// This is a placeholder for the real-time connection. Nothing here
// actually opens a WebSocket yet - see the TODO below for what to do
// in your Day 4 route's terms.

export const WS_BASE_URL = "ws://127.0.0.1:8000"; // update if your backend runs elsewhere

// TODO: connect to backend
// Open a connection with: new WebSocket(`${WS_BASE_URL}/ws?token=${token}`)
// Then wire up its event handlers:
//   socket.onopen    -> connection accepted (manager.connect ran on the server)
//   socket.onmessage -> a JSON string arrives; JSON.parse it and check its
//                        "type" field ("message" vs "typing") to decide what to do
//   socket.onclose    -> connection dropped
// To send something: socket.send(JSON.stringify({ type: "message", ... }))
//
// A good place to actually create and hold onto this connection is a custom
// hook (e.g. src/hooks/useChatSocket.js) so any component can send/receive
// through the same shared socket instead of opening a new one each time.
export function createChatSocket(token) {
  throw new Error("createChatSocket() is not connected to the backend yet");
}
