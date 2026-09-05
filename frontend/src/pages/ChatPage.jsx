import { useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import AddContactModal from "../components/AddContactModal";
import { CONVERSATIONS, MESSAGES_BY_CONVERSATION } from "../data/mockData";

export default function ChatPage() {
  // TODO: connect to backend - conversations and messages below are mock
  // data (src/data/mockData.js). Replace with real data from
  // GET /conversations and GET /conversations/{id}/messages once ready.
  const [conversations] = useState(CONVERSATIONS);
  const [messagesByConversation, setMessagesByConversation] = useState(MESSAGES_BY_CONVERSATION);
  const [activeId, setActiveId] = useState(CONVERSATIONS[0]?.id ?? null);
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);

  // TODO: connect to backend - this should come from incoming
  // {"type": "typing", ...} messages on the WebSocket, not local state.
  const [isTyping] = useState(false);

  const activeConversation = conversations.find((c) => c.id === activeId);
  const activeMessages = messagesByConversation[activeId] ?? [];

  function handleSend(content) {
    // TODO: connect to backend - this should send
    // {"type": "message", "conversation_id": activeId, "receiver_id": ..., "content": content}
    // over the WebSocket, and let the real saved message come back through
    // the socket rather than appending it locally like this.
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
  }

  function handleTyping() {
    // TODO: connect to backend - send {"type": "typing", "receiver_id": ...}
    // over the WebSocket here (ideally debounced).
  }

  function handleLoadMore() {
    // TODO: connect to backend - call GET /conversations/{id}/messages with
    // an increased `skip` value, then prepend the results to this
    // conversation's message list.
  }

  function handleAddContact(user) {
    // TODO: connect to backend - call POST /contacts with { contact_id: user.id },
    // then likely POST /conversations with { other_user_id: user.id } to open a chat.
    setIsAddContactOpen(false);
  }

  if (!activeConversation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cloud text-slate">
        No conversations yet.
      </div>
    );
  }

  return (
    <div className="h-screen flex">
      <Sidebar
        conversations={conversations}
        activeId={activeId}
        onSelect={setActiveId}
        onAddContactClick={() => setIsAddContactOpen(true)}
      />
      <ChatWindow
        contact={activeConversation.contact}
        messages={activeMessages}
        isTyping={isTyping}
        onSend={handleSend}
        onTyping={handleTyping}
        onLoadMore={handleLoadMore}
      />

      {isAddContactOpen && (
        <AddContactModal onClose={() => setIsAddContactOpen(false)} onAdd={handleAddContact} />
      )}
    </div>
  );
}
