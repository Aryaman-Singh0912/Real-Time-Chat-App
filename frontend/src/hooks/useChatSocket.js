import { useEffect, useRef, useCallback } from "react";
import { createChatSocket } from "../services/websocket";

// Opens exactly one WebSocket connection for the whole chat page (not one
// per conversation — a user gets a single "walkie-talkie" the moment they
// open the app, same as tested in Postman). onMessage and onTyping are
// called whenever a matching {"type": ...} payload arrives.
export function useChatSocket(token, { onMessage, onTyping } = {}) {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!token) return;

    const socket = createChatSocket(token);
    socketRef.current = socket;

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "typing") {
        onTyping?.(data);
      } else if (data.type === "message") {
        onMessage?.(data);
      }
    };

    return () => {
      socket.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const sendMessage = useCallback((conversationId, receiverId, content) => {
    socketRef.current?.send(
      JSON.stringify({
        type: "message",
        conversation_id: conversationId,
        receiver_id: receiverId,
        content,
      }),
    );
  }, []);

  const sendTyping = useCallback((receiverId) => {
    socketRef.current?.send(
      JSON.stringify({ type: "typing", receiver_id: receiverId }),
    );
  }, []);

  return { sendMessage, sendTyping };
}
