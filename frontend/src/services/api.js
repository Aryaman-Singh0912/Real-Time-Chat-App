export const API_BASE_URL = "http://127.0.0.1:8000";

export async function login(username, password) {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!response.ok) throw new Error("Invalid username or password");
  return response.json();
}

export async function signup(username, password) {
  const response = await fetch(`${API_BASE_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!response.ok)
    throw new Error(
      "Could not create that account — the username may already be taken",
    );
  return response.json();
}

export async function getMe(token) {
  const response = await fetch(`${API_BASE_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to load the current user");
  return response.json();
}

export async function searchUsers(query, token) {
  const response = await fetch(
    `${API_BASE_URL}/users/search?query=${encodeURIComponent(query)}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  if (!response.ok) throw new Error("Failed to search users");
  return response.json();
}

export async function addContact(contactId, token) {
  const response = await fetch(`${API_BASE_URL}/contacts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ contact_id: contactId }),
  });
  if (!response.ok) throw new Error("Failed to add contact");
  return response.json();
}

export async function startConversation(otherUserId, token) {
  const response = await fetch(`${API_BASE_URL}/conversations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ other_user_id: otherUserId }),
  });
  if (!response.ok) throw new Error("Failed to start conversation");
  return response.json();
}

export async function getConversations(token) {
  const response = await fetch(`${API_BASE_URL}/conversations`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to load conversations");
  return response.json();
}

export async function getMessages(conversationId, skip = 0, limit = 20, token) {
  const response = await fetch(
    `${API_BASE_URL}/conversations/${conversationId}/messages?skip=${skip}&limit=${limit}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  if (!response.ok) throw new Error("Failed to load messages");
  return response.json();
}

export async function getUserStatus(userId, token) {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/status`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to load user status");
  return response.json();
}
