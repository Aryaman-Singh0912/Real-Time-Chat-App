import { useState, useCallback } from "react";
import { login as loginRequest, signup as signupRequest } from "../services/api";

export function useAuth() {
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  const login = useCallback(async (username, password) => {
    // TODO: connect to backend - loginRequest() currently just throws.
    // Once it's implemented, this should look roughly like:
    //   const { access_token } = await loginRequest(username, password);
    //   localStorage.setItem("token", access_token);
    //   setToken(access_token);
    const { access_token } = await loginRequest(username, password);
    localStorage.setItem("token", access_token);
    setToken(access_token);
  }, []);

  const signup = useCallback(async (username, password) => {
    // TODO: connect to backend - see signupRequest() in services/api.js
    await signupRequest(username, password);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setToken(null);
  }, []);

  return { token, isAuthenticated: Boolean(token), login, signup, logout };
}
