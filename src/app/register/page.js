"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaUser, FaEnvelope, FaLock, FaUserGraduate } from "react-icons/fa";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", username: "", password: "", role: "student" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      let data = null;
      try {
        data = await res.json();
      } catch (parseError) {
        throw new Error(`API response was not JSON: ${parseError.message}`);
      }

      if (!res.ok) {
        setError(data?.error || data?.message || "Registration failed. Please try again.");
        return;
      }

      localStorage.setItem("ucer_token", data.token);
      localStorage.setItem("ucer_user", JSON.stringify(data.user));
      router.push("/papers");
    } catch (err) {
      console.error("Register error:", err);
      setError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: '460px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            Create <span className="text-gradient">Account</span>
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>Join the UCER PYQ community</p>
        </div>

        <div className="glass" style={{ padding: '2.5rem' }}>
          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <FaUser style={{ position: 'absolute', left: '1rem', color: 'var(--text-muted)' }} size={13} />
                <input className="form-control" style={{ paddingLeft: '2.5rem' }} placeholder="Your name"
                  value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
              </div>
            </div>

            <div className="form-group">
              <label>Username</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <span style={{ position: 'absolute', left: '1rem', color: 'var(--text-muted)' }}>@</span>
                <input className="form-control" type="text" style={{ paddingLeft: '2.5rem' }} placeholder="unique_username"
                  value={form.username} onChange={e => setForm(p => ({ ...p, username: e.target.value }))} required />
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <FaLock style={{ position: 'absolute', left: '1rem', color: 'var(--text-muted)' }} size={13} />
                <input className="form-control" type="password" style={{ paddingLeft: '2.5rem' }} placeholder="Min 6 characters"
                  value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required minLength={6} />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '2rem' }}>
              <label>Register As</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                {[{ val: "student", label: "Student", icon: "🎓" }, { val: "contributor", label: "Contributor", icon: "📤" }].map(opt => (
                  <button key={opt.val} type="button" onClick={() => setForm(p => ({ ...p, role: opt.val }))}
                    style={{
                      padding: '0.75rem', borderRadius: '10px', border: `1.5px solid ${form.role === opt.val ? 'var(--primary-light)' : 'var(--border)'}`,
                      background: form.role === opt.val ? 'rgba(37,99,235,0.1)' : 'transparent',
                      color: 'var(--text-main)', cursor: 'pointer', fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '0.9rem',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: 'all 0.2s'
                    }}>
                    {opt.icon} {opt.label}
                  </button>
                ))}
              </div>
              {form.role === "contributor" && (
                <p style={{ fontSize: '0.8rem', color: 'var(--primary-light)', marginTop: '0.6rem' }}>
                  Ready to contribute papers to the community!
                </p>
              )}
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.875rem' }} disabled={loading}>
              {loading ? <span className="spinner" /> : <><FaUserGraduate /> Create Account</>}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Already have an account?{" "}
            <Link href="/login" style={{ color: 'var(--primary-light)', fontWeight: 600 }}>Log In</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
