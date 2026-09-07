import { useState, useRef } from "react";

const MAX_HEIGHT = 160; // px - roughly 6-7 lines before it starts scrolling internally

export default function MessageInput({ onSend, onTyping }) {
  const [value, setValue] = useState("");
  const textareaRef = useRef(null);

  function resizeTextarea(el) {
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, MAX_HEIGHT)}px`;
  }

  function handleChange(event) {
    setValue(event.target.value);
    resizeTextarea(event.target);
    onTyping?.();
  }

  function submitMessage() {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    submitMessage();
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submitMessage();
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-end gap-3 px-5 py-4 border-t border-white/10"
    >
      <textarea
        ref={textareaRef}
        rows={1}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        className="flex-1 resize-none bg-white/10 text-white placeholder:text-white/40 rounded-2xl px-4 py-2.5 text-base leading-snug focus:outline-none focus:ring-2 focus:ring-ember/60 transition-[height] duration-150 ease-out max-h-40 overflow-y-auto thin-scroll"
      />
      <button
        type="submit"
        className="bg-ember hover:bg-ember-dark transition-colors text-white w-10 h-10 rounded-full flex items-center justify-center shrink-0"
        aria-label="Send message"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M3 11.5L21 3l-8.5 18-2.5-7.5L3 11.5z" fill="currentColor" />
        </svg>
      </button>
    </form>
  );
}
