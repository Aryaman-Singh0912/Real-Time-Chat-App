import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import AddContactModal from "../components/AddContactModal";
import { useChatSocket } from "../hooks/useChatSocket";
import { useAuth } from "../hooks/useAuth";
import {
  getMe,
  getConversations,
  getMessages,
  addContact,
  startConversation,
} from "../services/api";
import { formatMessageTime } from "../utils/time";

export default function ChatPage() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [currentUser, setCurrentUser] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [messagesByConversation, setMessagesByConversation] = useState({});
  const [activeId, setActiveId] = useState(null);
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // Keeps the currently-active conversation available inside the
  // WebSocket's callbacks without those callbacks going stale - the effect
  // that opens the socket only runs once (see useChatSocket), so anything
  // it reads directly would otherwise be frozen at its first-render value.
  const activeConversationRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const lastTypingSentRef = useRef(0);

  const activeConversation =
    conversations.find((c) => c.id === activeId) ?? null;
  const activeMessages = messagesByConversation[activeId] ?? [];

  useEffect(() => {
    activeConversationRef.current = activeConversation;
  }, [activeConversation]);

  // Reusable so both the initial load and "add contact" can refresh the list.
  const refreshConversations = useCallback(async () => {
    const data = await getConversations(token);
    const mapped = data.map((raw) => ({
      id: raw.id,
      contact: raw.contact,
      lastMessage: raw.last_message ?? "Say hello!",
      time: raw.last_message_time
        ? formatMessageTime(raw.last_message_time)
        : "",
      unread: 0,
    }));
    setConversations(mapped);
    return mapped;
  }, [token]);

  // Load the current user once, then the conversation list.
  useEffect(() => {
    async function init() {
      const me = await getMe(token);
      setCurrentUser(me);

      const mapped = await refreshConversations();
      if (mapped.length > 0) {
        setActiveId(mapped[0].id);
      }
    }
    init();
  }, [token, refreshConversations]);

  // Load real message history whenever the active conversation changes.
  useEffect(() => {
    if (activeId == null || currentUser == null) return;

    async function loadMessages() {
      const data = await getMessages(activeId, 0, 20, token);
      const mapped = data.map((m) => ({
        id: m.id,
        type: "message",
        isOwn: m.sender_id === currentUser.id,
        content: m.content,
        created_at: m.created_at,
      }));
      setMessagesByConversation((prev) => ({ ...prev, [activeId]: mapped }));
    }
    loadMessages();
  }, [activeId, currentUser, token]);

  function handleIncomingMessage(data) {
    setMessagesByConversation((prev) => ({
      ...prev,
      [data.conversation_id]: [
        ...(prev[data.conversation_id] ?? []),
        {
          id: data.id,
          type: "message",
          isOwn: false,
          content: data.content,
          created_at: data.created_at,
        },
      ],
    }));

    setConversations((prev) =>
      prev.map((c) =>
        c.id === data.conversation_id
          ? {
              ...c,
              lastMessage: data.content,
              time: formatMessageTime(data.created_at),
              unread:
                activeConversationRef.current?.id === data.conversation_id
                  ? 0
                  : (c.unread ?? 0) + 1,
            }
          : c,
      ),
    );
  }

  function handleIncomingTyping(data) {
    const current = activeConversationRef.current;
    if (!current || current.contact.id !== data.sender_id) return;

    setIsTyping(true);
    clearTimeout(typingTimeoutRef.current);
    // The backend only ever sends "typing" on each keystroke - there's no
    // "stopped typing" signal - so we clear it ourselves after a short
    // pause with nothing new arriving.
    typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 2000);
  }

  const { sendMessage, sendTyping } = useChatSocket(token, {
    onMessage: handleIncomingMessage,
    onTyping: handleIncomingTyping,
  });

  function handleSend(content) {
    if (!activeConversation) return;
    const receiverId = activeConversation.contact.id;

    sendMessage(activeId, receiverId, content);

    const newMessage = {
      id: Date.now(),
      type: "message",
      isOwn: true,
      content,
      created_at: new Date().toISOString(),
    };
    setMessagesByConversation((prev) => ({
      ...prev,
      [activeId]: [...(prev[activeId] ?? []), newMessage],
    }));
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeId
          ? {
              ...c,
              lastMessage: content,
              time: formatMessageTime(newMessage.created_at),
            }
          : c,
      ),
    );
  }

  function handleTyping() {
    if (!activeConversation) return;
    const now = Date.now();
    // Simple throttle - at most one "typing" signal every 1.5s, instead of
    // firing on every single keystroke.
    if (now - lastTypingSentRef.current > 1500) {
      sendTyping(activeConversation.contact.id);
      lastTypingSentRef.current = now;
    }
  }

  async function handleLoadMore() {
    if (activeId == null) return;
    const currentCount = (messagesByConversation[activeId] ?? []).length;
    const data = await getMessages(activeId, currentCount, 20, token);
    const mapped = data.map((m) => ({
      id: m.id,
      type: "message",
      isOwn: m.sender_id === currentUser?.id,
      content: m.content,
      created_at: m.created_at,
    }));
    setMessagesByConversation((prev) => ({
      ...prev,
      [activeId]: [...mapped, ...(prev[activeId] ?? [])],
    }));
  }

  function handleSelectConversation(id) {
    setActiveId(id);
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c)),
    );
  }

  async function handleAddContact(user) {
    await addContact(user.id, token);
    const convo = await startConversation(user.id, token);
    await refreshConversations();
    setActiveId(convo.id);
    setIsAddContactOpen(false);
  }

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="h-screen flex">
      <Sidebar
        conversations={conversations}
        activeId={activeId}
        onSelect={handleSelectConversation}
        onAddContactClick={() => setIsAddContactOpen(true)}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {activeConversation ? (
        <ChatWindow
          contact={activeConversation.contact}
          messages={activeMessages}
          isTyping={isTyping}
          onSend={handleSend}
          onTyping={handleTyping}
          onLoadMore={handleLoadMore}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center bg-teal text-white/60 text-center px-6">
          {conversations.length === 0
            ? "No conversations yet — add a contact to start chatting."
            : "Loading..."}
        </div>
      )}

      {isAddContactOpen && (
        <AddContactModal
          token={token}
          onClose={() => setIsAddContactOpen(false)}
          onAdd={handleAddContact}
        />
      )}
    </div>
  );
}
