import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
      // TODO: connect to backend - see services/api.js's signup()
      await signup(username, password);
      navigate("/login");
    } catch (err) {
      setError("Couldn't sign up — the backend isn't connected yet.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cloud px-4 py-10">
      <div className="w-full max-w-md bg-paper rounded-3xl shadow-sm p-8 sm:p-10">
        <h1 className="font-display font-bold text-3xl text-ink mb-1">
          Create account
        </h1>
        <p className="text-slate text-sm mb-6">
          Join and start chatting in seconds.
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

          <div>
            <label className="block text-sm font-medium text-ink mb-1">
              Confirm password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
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
            {isSubmitting ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <p className="text-sm text-slate mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-ember font-medium hover:text-ember-dark"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
