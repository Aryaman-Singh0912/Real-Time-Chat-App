import { useState } from "react";

export default function MessageInput({ onSend, onTyping }) {
  const [value, setValue] = useState("");

  function handleChange(event) {
    setValue(event.target.value);
    // TODO: connect to backend - this is where a "typing" signal should be
    // sent over the WebSocket, e.g. onTyping(). Consider debouncing this so
    // it doesn't fire on every single keystroke.
    onTyping?.();
  }

  function handleSubmit(event) {
    event.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setValue("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-3 px-5 py-4 border-t border-white/10">
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="Type a message..."
        className="flex-1 bg-white/10 text-white placeholder:text-white/40 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ember/60"
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
