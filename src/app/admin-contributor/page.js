"use client";
import { useState } from "react";
import { FaUserPlus, FaUser, FaLock, FaKey } from "react-icons/fa";

export default function AdminCreateContributorPage() {
  const [form, setForm] = useState({ name: "", username: "", password: "", adminSecret: "" });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });
    try {
      const res = await fetch("/api/admin/create-contributor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setMessage({ type: "error", text: data.error || "Failed to create contributor" });
        return;
      }

      setMessage({ type: "success", text: "Contributor account created! You can now give them the username and password." });
      setForm({ name: "", username: "", password: "", adminSecret: form.adminSecret });
    } catch (err) {
      setMessage({ type: "error", text: "Something went wrong." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: '460px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            Admin <span className="text-gradient">Control</span>
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>Create a new contributor account</p>
        </div>

        <div className="glass" style={{ padding: '2.5rem', borderRadius: '16px', border: '1px solid var(--border)' }}>
          {message.text && (
            <div className={`alert alert-${message.type === 'error' ? 'error' : 'success'}`} style={{ marginBottom: '1.5rem', padding: '1rem', borderRadius: '8px', background: message.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)', color: message.type === 'error' ? '#ef4444' : '#22c55e' }}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>Full Name</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <FaUser style={{ position: 'absolute', left: '1rem', color: 'var(--text-muted)' }} size={13} />
                <input className="form-control" style={{ paddingLeft: '2.5rem', width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-main)' }} placeholder="Contributor's Name"
                  value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>Username</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <span style={{ position: 'absolute', left: '1rem', color: 'var(--text-muted)' }}>@</span>
                <input className="form-control" type="text" style={{ paddingLeft: '2.5rem', width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-main)' }} placeholder="e.g. Aayush@711"
                  value={form.username} onChange={e => setForm(p => ({ ...p, username: e.target.value }))} required />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>Password</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <FaLock style={{ position: 'absolute', left: '1rem', color: 'var(--text-muted)' }} size={13} />
                <input className="form-control" type="text" style={{ paddingLeft: '2.5rem', width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-main)' }} placeholder="e.g. Aayush200619"
                  value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required minLength={6} />
              </div>
            </div>

            <hr style={{ margin: '2rem 0', borderColor: 'var(--border)', opacity: 0.5 }} />

            <div className="form-group" style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600, color: '#ef4444' }}>Admin Secret Passcode</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <FaKey style={{ position: 'absolute', left: '1rem', color: 'var(--text-muted)' }} size={13} />
                <input className="form-control" type="password" style={{ paddingLeft: '2.5rem', width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ef4444', background: 'var(--bg-secondary)', color: 'var(--text-main)' }} placeholder="Required to authorize"
                  value={form.adminSecret} onChange={e => setForm(p => ({ ...p, adminSecret: e.target.value }))} required />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.875rem', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }} disabled={loading}>
              {loading ? "Creating..." : <><FaUserPlus /> Create Contributor</>}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
