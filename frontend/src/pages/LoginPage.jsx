import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import ThemeToggle from "../components/ThemeToggle";

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
      await login(username, password);
      navigate("/chat");
    } catch (err) {
      setError(err.message || "Something went wrong — please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cloud px-4 py-10 relative">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-4xl bg-paper rounded-3xl shadow-sm overflow-hidden flex">
        {/* Decorative preview panel - purely visual, hidden on small screens */}
        <div className="hidden md:flex flex-col justify-center gap-3 w-1/2 bg-teal p-10">
          <div className="self-start bg-white/95 text-black text-sm rounded-bubble rounded-bl-md px-4 py-2 max-w-[75%]">
            Hola! Nice to hear from you.
          </div>
          <div className="self-end bg-ember text-white text-sm rounded-bubble rounded-br-md px-4 py-2 max-w-[75%]">
            And you, too!
          </div>
          <div className="self-start bg-white/95 text-black text-sm rounded-bubble rounded-bl-md px-4 py-2 max-w-[75%]">
            Let's meet? 8 at J's?
          </div>
          <div className="self-end bg-ember text-white text-sm rounded-bubble rounded-br-md px-4 py-2 max-w-[75%]">
            See you there 🎉
          </div>
        </div>

        {/* Form panel */}
        <div className="w-full md:w-1/2 p-8 sm:p-10">
          <h1 className="font-display font-bold text-3xl text-ink mb-1">
            Sign in
          </h1>
          <p className="text-slate text-sm mb-6">
            Talk, text, and share as much as you want.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-ink mb-1">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                required
                className="w-full bg-cloud rounded-xl px-4 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ember/40"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-ink mb-1">
                Password
              </label>
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
              className="w-full bg-teal text-white font-medium rounded-xl py-2.5 hover:bg-teal/90 transition-colors disabled:opacity-60"
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="text-sm text-slate mt-6">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-ember font-medium hover:text-ember-dark"
            >
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
