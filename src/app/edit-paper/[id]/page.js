"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { FaArrowLeft, FaTrash } from "react-icons/fa";

export default function EditPaperPage() {
  const router = useRouter();
  const params = useParams();
  const [paper, setPaper] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({
    title: "",
    subject: "",
    year: "",
    semester: "",
    branch: "",
    category: ""
  });

  useEffect(() => {
    const stored = localStorage.getItem("ucer_user");
    if (!stored) {
      router.push("/login");
      return;
    }

    fetchPaper();
  }, [router, params.id]);

  const fetchPaper = async () => {
    try {
      const res = await fetch(`/api/papers/${params.id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setPaper(data.paper);
      setForm({
        title: data.paper.title,
        subject: data.paper.subject,
        year: data.paper.year,
        semester: data.paper.semester,
        branch: data.paper.branch,
        category: data.paper.category
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("ucer_token");
      const res = await fetch(`/api/papers/${params.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSuccess("✅ Paper updated successfully!");
      setTimeout(() => router.push("/profile"), 2000);
    } catch (err) {
      setError("❌ " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this paper? This action cannot be undone.")) {
      return;
    }

    setSaving(true);
    setError("");

    try {
      const token = localStorage.getItem("ucer_token");
      const res = await fetch(`/api/papers/${params.id}`, {
        method: "DELETE",
        headers: { authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      alert("Paper deleted successfully!");
      router.push("/profile");
    } catch (err) {
      setError("❌ " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div className="spinner" style={{ width: "40px", height: "40px", borderWidth: "3px", margin: "0 auto 1rem" }} />
          Loading paper...
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <div style={{ width: "100%", maxWidth: "500px" }}>
        <Link href="/profile" style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          color: "var(--primary-light)",
          textDecoration: "none",
          marginBottom: "1.5rem",
          fontWeight: 500
        }}>
          <FaArrowLeft size={14} /> Back to Profile
        </Link>

        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: 800 }}>Edit <span className="text-gradient">Paper</span></h1>
          <p style={{ color: "var(--text-muted)" }}>Update your paper details</p>
        </div>

        <div className="glass" style={{ padding: "2.5rem" }}>
          {error && <div className="alert alert-error" style={{ marginBottom: "1rem" }}>{error}</div>}
          {success && <div className="alert alert-success" style={{ marginBottom: "1rem" }}>{success}</div>}

          <form onSubmit={handleSave}>
            <div className="form-group">
              <label>Paper Title</label>
              <input className="form-control" placeholder="e.g. Data Structures Mid Term 2023"
                required value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>

            <div className="form-group">
              <label>Subject</label>
              <input className="form-control" placeholder="e.g. Data Structures"
                required value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className="form-group">
                <label>Year</label>
                <input className="form-control" placeholder="e.g. 2023"
                  required type="number" value={form.year}
                  onChange={(e) => setForm({ ...form, year: e.target.value })} />
              </div>

              <div className="form-group">
                <label>Semester</label>
                <select className="form-control" required value={form.semester}
                  onChange={(e) => setForm({ ...form, semester: e.target.value })}>
                  <option value="">Select</option>
                  {[1,2,3,4,5,6,7,8].map(s =>
                    <option key={s} value={s}>Semester {s}</option>
                  )}
                </select>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className="form-group">
                <label>Branch</label>
                <select className="form-control" required value={form.branch}
                  onChange={(e) => setForm({ ...form, branch: e.target.value })}>
                  <option value="">Select</option>
                  <option value="CSE">CSE</option>
                  <option value="IT">IT</option>
                  <option value="ECE">ECE</option>
                  <option value="ME">ME</option>
                  <option value="CE">CE</option>
                  <option value="EE">EE</option>
                </select>
              </div>

              <div className="form-group">
                <label>Category</label>
                <select className="form-control" required value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  <option value="">Select</option>
                  <option value="Mid Term">Mid Term</option>
                  <option value="End Term">End Term</option>
                  <option value="Assignment">Assignment</option>
                  <option value="Quiz">Quiz</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn btn-primary"
              style={{ width: "100%", padding: "1rem", marginTop: "1.5rem", fontWeight: 600 }}
              disabled={saving}>
              {saving ? "Saving..." : "💾 Save Changes"}
            </button>
          </form>

          <button
            onClick={handleDelete}
            style={{
              width: "100%",
              padding: "1rem",
              marginTop: "1rem",
              background: "#ef4444",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              transition: "all 0.2s"
            }}
            disabled={saving}
          >
            <FaTrash /> Delete Paper
          </button>
        </div>
      </div>
    </main>
  );
}
