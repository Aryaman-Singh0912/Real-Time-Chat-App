import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import ThemeToggle from "../components/ThemeToggle";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="min-h-screen flex items-center justify-center bg-cloud px-4 py-10 relative overflow-hidden">
      <div className="absolute inset-0 bg-pattern opacity-[0.22] pointer-events-none" />

      <div className="absolute top-6 right-6 z-10">
        <ThemeToggle />
      </div>

      <div className="relative z-10 w-full max-w-4xl bg-paper rounded-3xl shadow-sm overflow-hidden flex">
        <div className="hidden md:flex flex-col justify-center gap-3 w-1/2 bg-teal p-10">
          <div className="self-start bg-white/95 text-black text-base rounded-bubble rounded-bl-md px-4 py-2 max-w-[75%]">
            Hola! Nice to hear from you.
          </div>
          <div className="self-end bg-ember text-white text-base rounded-bubble rounded-br-md px-4 py-2 max-w-[75%]">
            And you, too!
          </div>
          <div className="self-start bg-white/95 text-black text-base rounded-bubble rounded-bl-md px-4 py-2 max-w-[75%]">
            Let's meet? 8 at J's?
          </div>
          <div className="self-end bg-ember text-white text-base rounded-bubble rounded-br-md px-4 py-2 max-w-[75%]">
            See you there 🎉
          </div>
        </div>

        <div className="w-full md:w-1/2 p-8 sm:p-10">
          <h1 className="font-display font-bold text-3xl text-ink mb-1">Sign in</h1>
          <p className="text-slate text-base mb-6">Talk, text, and share as much as you want.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-base font-medium text-ink mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                required
                className="w-full bg-cloud rounded-xl px-4 py-2.5 text-base text-ink focus:outline-none focus:ring-2 focus:ring-ember/40"
              />
            </div>

            <div>
              <label className="block text-base font-medium text-ink mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  className="w-full bg-cloud rounded-xl px-4 py-2.5 pr-11 text-base text-ink focus:outline-none focus:ring-2 focus:ring-ember/40"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  tabIndex={-1}
                  title={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate hover:text-ink transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && <p className="text-base text-ember-dark">{error}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-teal text-white font-medium rounded-xl py-2.5 hover:bg-teal/90 transition-colors disabled:opacity-60"
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="text-base text-slate mt-6">
            Don't have an account?{" "}
            <Link to="/signup" className="text-ember font-medium hover:text-ember-dark">
              Sign up here
            </Link>
          </p>
        </div>
      </div>

      <footer className="absolute bottom-4 inset-x-0 text-center text-sm text-slate z-10 leading-snug">
        Made by{" "}
        <a
        
          href="https://github.com/Aryaman-Singh0912"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-ink"
        >
          Aryaman Singh
        </a>
        <br />
        MIT Manipal
      </footer>
    </div>
  );
}