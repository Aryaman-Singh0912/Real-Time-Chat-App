export default function TypingIndicator({ username }) {
  return (
    <div className="flex justify-start px-4">
      <div className="bg-white/95 rounded-bubble rounded-bl-md px-4 py-3 mb-2 flex items-center gap-1">
        <span className="typing-dot w-1.5 h-1.5 rounded-full bg-slate" style={{ animationDelay: "0s" }} />
        <span className="typing-dot w-1.5 h-1.5 rounded-full bg-slate" style={{ animationDelay: "0.15s" }} />
        <span className="typing-dot w-1.5 h-1.5 rounded-full bg-slate" style={{ animationDelay: "0.3s" }} />
        <span className="sr-only">{username} is typing</span>
      </div>
    </div>
  );
}
