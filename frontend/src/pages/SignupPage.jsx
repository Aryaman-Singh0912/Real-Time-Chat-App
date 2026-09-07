import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import ThemeToggle from "../components/ThemeToggle";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setIsSubmitting(true);
    try {
      await signup(username, password);
      navigate("/login");
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

      <div className="relative z-10 w-full max-w-md bg-paper rounded-3xl shadow-sm p-8 sm:p-10">
        <h1 className="font-display font-bold text-3xl text-ink mb-1">Create account</h1>
        <p className="text-slate text-base mb-6">Join and start chatting in seconds.</p>

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

          <div>
            <label className="block text-base font-medium text-ink mb-1">Confirm password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
                className="w-full bg-cloud rounded-xl px-4 py-2.5 pr-11 text-base text-ink focus:outline-none focus:ring-2 focus:ring-ember/40"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                tabIndex={-1}
                title={showConfirmPassword ? "Hide password" : "Show password"}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate hover:text-ink transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && <p className="text-base text-ember-dark">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-teal text-white font-medium rounded-xl py-2.5 hover:bg-teal/90 transition-colors disabled:opacity-60"
          >
            {isSubmitting ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <p className="text-base text-slate mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-ember font-medium hover:text-ember-dark">
            Sign in
          </Link>
        </p>
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