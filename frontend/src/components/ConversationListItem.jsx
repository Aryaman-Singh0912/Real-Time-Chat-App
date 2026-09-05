import Avatar from "./Avatar";

export default function ConversationListItem({ conversation, active, onClick }) {
  const { contact, lastMessage, time, unread } = conversation;

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
        active ? "bg-cloud" : "hover:bg-cloud/60"
      }`}
    >
      <Avatar username={contact.username} showStatus online={contact.online} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="font-display font-semibold text-ink capitalize truncate">
            {contact.username}
          </p>
          <span className="text-xs text-slate shrink-0 ml-2">{time}</span>
        </div>
        <div className="flex items-center justify-between mt-0.5">
          <p className="text-sm text-slate truncate">{lastMessage}</p>
          {unread > 0 && (
            <span className="ml-2 shrink-0 bg-ember text-white text-[11px] font-semibold w-5 h-5 rounded-full flex items-center justify-center">
              {unread}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
