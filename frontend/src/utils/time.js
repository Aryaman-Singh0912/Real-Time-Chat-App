// Formats a raw ISO timestamp (what the backend's created_at / last_seen
// fields look like) into something readable, e.g. "2:30 PM" or "Sep 3".
export function formatMessageTime(isoString) {
  if (!isoString) return "";
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export function formatLastSeen(isoString) {
  if (!isoString) return "Offline";
  const date = new Date(isoString);
  const now = new Date();
  const sameDay = date.toDateString() === now.toDateString();

  if (sameDay) {
    return `Last seen today at ${date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`;
  }
  return `Last seen ${date.toLocaleDateString([], { month: "short", day: "numeric" })}`;
}
