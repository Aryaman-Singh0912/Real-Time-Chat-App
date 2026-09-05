import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ChatPage from "./pages/ChatPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      {/* TODO: connect to backend - wrap this in a route guard once real
          auth exists, so /chat redirects to /login when there's no token. */}
      <Route path="/chat" element={<ChatPage />} />
    </Routes>
  );
}
