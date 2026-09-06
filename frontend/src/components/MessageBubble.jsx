import { formatMessageTime } from "../utils/time";

export default function MessageBubble({ content, created_at, isOwn }) {
  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} px-4`}>
      <div
        className={`max-w-[70%] px-4 py-2.5 mb-2 text-base font-medium leading-snug rounded-bubble ${
          isOwn
            ? "bg-ember text-white rounded-br-md"
            : "bg-white/95 text-black rounded-bl-md"
        }`}
      >
        <p className="whitespace-pre-wrap break-words">{content}</p>
        <span
          className={`block text-xs mt-1 text-right ${
            isOwn ? "text-white/70" : "text-black/60"
          }`}
        >
          {formatMessageTime(created_at)}
        </span>
      </div>
    </div>
  );
}
