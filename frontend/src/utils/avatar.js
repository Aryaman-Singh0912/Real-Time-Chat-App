// Turns a username into two initials, e.g. "aryaman" -> "AR"
export function getInitials(username) {
  if (!username) return "?";
  return username.slice(0, 2).toUpperCase();
}

// Picks a consistent background color for a given username, so the same
// person always gets the same colored avatar without us storing anything.
const PALETTE = ["#F0703B", "#BFE1F0", "#C9A6E8", "#F4C978", "#7FD1B9", "#F29CB0"];

export function getColorForName(username) {
  if (!username) return PALETTE[0];
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % PALETTE.length;
  return PALETTE[index];
}
