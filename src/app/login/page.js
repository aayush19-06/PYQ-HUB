"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaEnvelope, FaLock, FaSignInAlt } from "react-icons/fa";

export default function LoginPage() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      let data = null;
      try {
        data = await res.json();
      } catch (parseError) {
        throw new Error(`Unable to parse response: ${parseError.message}`);
      }

      if (!res.ok) {
        setError(data?.error || data?.message || "Login failed. Please try again.");
        return;
      }

      localStorage.setItem("ucer_token", data.token);
      localStorage.setItem("ucer_user", JSON.stringify(data.user));
      window.location.href = "/papers";
    } catch (err) {
      console.error("Login error:", err);
      setError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            Admin <span className="text-gradient">Login</span>
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>Log in to upload papers</p>
        </div>

        <div className="glass" style={{ padding: '2.5rem' }}>
          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Username</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <span style={{ position: 'absolute', left: '1rem', color: 'var(--text-muted)' }}>@</span>
                <input
                  className="form-control"
                  type="text"
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="yourusername"
                  value={form.username}
                  onChange={e => setForm(p => ({ ...p, username: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '2rem' }}>
              <label>Password</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <FaLock style={{ position: 'absolute', left: '1rem', color: 'var(--text-muted)' }} size={14} />
                <input
                  className="form-control"
                  type="password"
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.875rem' }} disabled={loading}>
              {loading ? <span className="spinner" /> : <><FaSignInAlt /> Log In</>}
            </button>
          </form>

        </div>
      </div>
    </main>
  );
}
