// This file is intentionally left unfinished - each function below is a
// clearly marked spot to plug in a real call to your FastAPI backend.
// Nothing here is wired up yet; the UI currently runs on the mock data in
// src/data/mockData.js instead.

export const API_BASE_URL = "http://127.0.0.1:8000"; // update if your backend runs elsewhere

// TODO: connect to backend
// POST `${API_BASE_URL}/login` with JSON body { username, password }
// Returns { access_token, token_type } on success - store access_token
// somewhere (e.g. localStorage) so other requests can use it.
export async function login(username, password){
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type" : "application/json" },
    body: JSON.stringify({ username,password }),
  });

  if (!response.ok){
    throw new Error("Invalid username or password");
  }

  return response.json();
}

export async function getConversations(token){
  const response = await fetch(`${API_BASE_URL}/conversations`, {
    method: "GET",
    headers: { Authorization: `Bearer: ${token}` },
  });

  if (!response.ok){
    throw new Error("Failed to load conversations")
  }

  return response.json();
}

// TODO: connect to backend
// POST `${API_BASE_URL}/signup` with JSON body { username, password }
export async function signup(username, password) {
  throw new Error("signup() is not connected to the backend yet");
}

// TODO: connect to backend
// GET `${API_BASE_URL}/users/search?query=...`
// Needs header: Authorization: Bearer <token>
export async function searchUsers(query, token) {
  throw new Error("searchUsers() is not connected to the backend yet");
}

// TODO: connect to backend
// POST `${API_BASE_URL}/contacts` with JSON body { contact_id }
export async function addContact(contactId, token) {
  throw new Error("addContact() is not connected to the backend yet");
}

// TODO: connect to backend
// POST `${API_BASE_URL}/conversations` with JSON body { other_user_id }
export async function startConversation(otherUserId, token) {
  throw new Error("startConversation() is not connected to the backend yet");
}

// TODO: connect to backend
// GET `${API_BASE_URL}/conversations/${conversationId}/messages?skip=${skip}&limit=${limit}`
export async function getMessages(conversationId, skip = 0, limit = 20, token) {
  throw new Error("getMessages() is not connected to the backend yet");
}

// TODO: connect to backend
// GET `${API_BASE_URL}/users/${userId}/status`
export async function getUserStatus(userId, token) {
  throw new Error("getUserStatus() is not connected to the backend yet");
}
