import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      // TODO: connect to backend - this calls useAuth's login(), which
      // itself calls services/api.js's login(). Both are stubs right now.
      await login(username, password);
      navigate("/chat");
    } catch (err) {
      setError("Couldn't sign in — the backend isn't connected yet.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cloud px-4 py-10">
      <div className="w-full max-w-4xl bg-paper rounded-3xl shadow-sm overflow-hidden flex">
        {/* Decorative preview panel - purely visual, hidden on small screens */}
        <div className="hidden md:flex flex-col justify-center gap-3 w-1/2 bg-ink p-10">
          <div className="self-start bg-white/95 text-ink text-sm rounded-bubble rounded-bl-md px-4 py-2 max-w-[75%]">
            Hola! Nice to hear from you.
          </div>
          <div className="self-end bg-ember text-white text-sm rounded-bubble rounded-br-md px-4 py-2 max-w-[75%]">
            And you, too!
          </div>
          <div className="self-start bg-white/95 text-ink text-sm rounded-bubble rounded-bl-md px-4 py-2 max-w-[75%]">
            Let's meet? 8 at J's?
          </div>
          <div className="self-end bg-ember text-white text-sm rounded-bubble rounded-br-md px-4 py-2 max-w-[75%]">
            See you there 🎉
          </div>
        </div>

        {/* Form panel */}
        <div className="w-full md:w-1/2 p-8 sm:p-10">
          <h1 className="font-display font-bold text-3xl text-ink mb-1">Sign in</h1>
          <p className="text-slate text-sm mb-6">Talk, text, and share as much as you want.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-ink mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                required
                className="w-full bg-cloud rounded-xl px-4 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ember/40"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-ink mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                className="w-full bg-cloud rounded-xl px-4 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ember/40"
              />
            </div>

            {error && <p className="text-sm text-ember-dark">{error}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-ink text-white font-medium rounded-xl py-2.5 hover:bg-ink/90 transition-colors disabled:opacity-60"
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="text-sm text-slate mt-6">
            Don't have an account?{" "}
            <Link to="/signup" className="text-ember font-medium hover:text-ember-dark">
              Sign up here
            </Link>
          </p>

          {/* Demo-only shortcut - remove once real auth is wired up */}
          <p className="text-xs text-slate/70 mt-8 text-center">
            <Link to="/chat" className="underline hover:text-slate">
              View chat screen demo (no login)
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
