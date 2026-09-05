import Avatar from "./Avatar";
import { formatLastSeen } from "../utils/time";

export default function ChatHeader({ contact }) {
  return (
    <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
      <Avatar username={contact.username} size={40} showStatus online={contact.online} />
      <div>
        <p className="font-display font-semibold text-white capitalize">{contact.username}</p>
        <p className="text-xs text-white/50">
          {contact.online ? "Online" : formatLastSeen(contact.last_seen)}
        </p>
      </div>
    </div>
  );
}
