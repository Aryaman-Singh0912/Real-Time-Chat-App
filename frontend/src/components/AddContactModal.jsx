import { useState } from "react";
import Avatar from "./Avatar";
import { MOCK_SEARCH_RESULTS } from "../data/mockData";

export default function AddContactModal({ onClose, onAdd }) {
  const [query, setQuery] = useState("");

  // TODO: connect to backend - replace this filter with a real call to
  // GET /users/search?query=... and use its results instead of MOCK_SEARCH_RESULTS.
  const results = MOCK_SEARCH_RESULTS.filter((user) =>
    user.username.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-teal/50 flex items-center justify-center z-50 px-4">
      <div className="bg-paper rounded-2xl w-full max-w-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-xl text-ink">Add contact</h2>
          <button onClick={onClose} className="text-slate hover:text-ink text-xl leading-none">
            &times;
          </button>
        </div>

        <input
          autoFocus
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by username"
          className="w-full bg-cloud rounded-full px-4 py-2 text-sm text-ink placeholder:text-slate focus:outline-none focus:ring-2 focus:ring-ember/40 mb-4"
        />

        <div className="space-y-1 max-h-60 overflow-y-auto thin-scroll light">
          {results.length === 0 ? (
            <p className="text-sm text-slate px-1 py-2">No users found.</p>
          ) : (
            results.map((user) => (
              <div key={user.id} className="flex items-center gap-3 px-1 py-2">
                <Avatar username={user.username} size={36} />
                <p className="flex-1 text-sm font-medium text-ink capitalize">{user.username}</p>
                <button
                  onClick={() => onAdd(user)}
                  className="text-xs font-semibold text-ember hover:text-ember-dark"
                >
                  Add
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
