import ConversationListItem from "./ConversationListItem";
import ThemeToggle from "./ThemeToggle";

export default function Sidebar({
  conversations,
  activeId,
  onSelect,
  onAddContactClick,
}) {
  return (
    <aside className="w-full sm:w-[340px] shrink-0 h-full bg-paper border-r border-mist flex flex-col">
      <div className="px-5 pt-6 pb-4 flex items-center justify-between">
        <h1 className="font-display font-bold text-2xl text-ink">Messages</h1>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={onAddContactClick}
            title="Add contact"
            className="w-9 h-9 rounded-full bg-ember text-white text-xl leading-none flex items-center justify-center hover:bg-ember-dark transition-colors"
          >
            +
          </button>
        </div>
      </div>

      <div className="px-5 pb-4">
        <input
          type="text"
          placeholder="Search"
          className="w-full bg-cloud rounded-full px-4 py-2 text-sm text-ink placeholder:text-slate focus:outline-none focus:ring-2 focus:ring-ember/40"
        />
      </div>

      <div className="flex-1 overflow-y-auto thin-scroll light">
        {conversations.length === 0 ? (
          <p className="px-5 text-sm text-slate">
            No conversations yet — add a contact to start chatting.
          </p>
        ) : (
          conversations.map((conversation) => (
            <ConversationListItem
              key={conversation.id}
              conversation={conversation}
              active={conversation.id === activeId}
              onClick={() => onSelect(conversation.id)}
            />
          ))
        )}
      </div>
    </aside>
  );
}
