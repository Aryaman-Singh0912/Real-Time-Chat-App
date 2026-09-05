import { useRef, useEffect } from "react";
import ChatHeader from "./ChatHeader";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import MessageInput from "./MessageInput";

export default function ChatWindow({ contact, messages, isTyping, onSend, onTyping, onLoadMore }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages.length, isTyping]);

  return (
    <section className="flex-1 h-full flex flex-col bg-ink">
      <ChatHeader contact={contact} />

      <div ref={scrollRef} className="flex-1 overflow-y-auto thin-scroll py-4">
        <div className="flex justify-center mb-2">
          <button
            onClick={onLoadMore}
            className="text-xs text-white/50 hover:text-white/80 transition-colors"
          >
            Load earlier messages
          </button>
        </div>

        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            content={message.content}
            created_at={message.created_at}
            isOwn={message.isOwn}
          />
        ))}

        {isTyping && <TypingIndicator username={contact.username} />}
      </div>

      <MessageInput onSend={onSend} onTyping={onTyping} />
    </section>
  );
}
