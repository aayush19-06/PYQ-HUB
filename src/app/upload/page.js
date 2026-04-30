"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [file, setFile] = useState(null);
  const [form, setForm] = useState({
    title: "", subject: "", year: "",
    semester: "", branch: "", category: "",
  });

  // Check user role on mount
  useEffect(() => {
    const stored = localStorage.getItem("ucer_user");
    if (stored) {
      const userData = JSON.parse(stored);
      setUser(userData);
      if (userData.role !== "contributor" && userData.role !== "admin") {
        setError("❌ Only contributors and admins can upload papers. Request contributor access or contact admin.");
      }
    } else {
      router.push("/login");
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prevent if user doesn't have right role
    if (!user || (user.role !== "contributor" && user.role !== "admin")) {
      setError("❌ Only contributors and admins can upload. Go to register as contributor first.");
      return;
    }

    if (!file) {
      setError("❌ Please select a PDF file to upload");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("ucer_token");
      if (!token) {
        router.push("/login");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);
      Object.entries(form).forEach(([key, val]) => formData.append(key, val));

      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      
      if (!res.ok) {
        if (res.status === 403) {
          setError("❌ " + (data.error || "You don't have permission to upload. Contact admin for approval."));
        } else {
          setError("❌ " + (data.error || "Upload failed"));
        }
        return;
      }

      setSuccess("✅ Paper uploaded successfully!");
      setForm({ title: "", subject: "", year: "", semester: "", branch: "", category: "" });
      setFile(null);
      setTimeout(() => router.push("/papers"), 2000);
    } catch (err) {
      setError("❌ Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <div style={{ width: "100%", maxWidth: "500px" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: 800 }}>Upload <span className="text-gradient">Paper</span></h1>
          <p style={{ color: "var(--text-muted)" }}>Share previous year papers with students</p>
        </div>

        {user && user.role !== "contributor" && user.role !== "admin" && (
          <div style={{ 
            background: "rgba(239, 68, 68, 0.1)", 
            border: "1px solid rgba(239, 68, 68, 0.3)", 
            borderRadius: "10px", 
            padding: "1.5rem", 
            marginBottom: "1.5rem",
            textAlign: "center"
          }}>
            <p style={{ color: "var(--text-main)", marginBottom: "1rem" }}>
              📝 You are currently registered as a <strong>{user.role}</strong>
            </p>
            <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginBottom: "1rem" }}>
              Only <strong>Contributors</strong> and <strong>Admins</strong> can upload papers.
            </p>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "1rem" }}>
              Want to contribute? You need to create a new account as a contributor.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <a href="/register" style={{
                display: "inline-block",
                background: "var(--primary)",
                color: "white",
                padding: "0.75rem 1.5rem",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: 600,
                fontSize: "0.95rem",
                transition: "all 0.2s"
              }}>
                Register as Contributor →
              </a>
              <a href="/request-contributor" style={{
                display: "inline-block",
                background: "rgba(59, 130, 246, 0.1)",
                color: "var(--primary-light)",
                padding: "0.75rem 1.5rem",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: 600,
                fontSize: "0.95rem",
                border: "1px solid var(--primary-light)",
                transition: "all 0.2s"
              }}>
                Learn More ↓
              </a>
            </div>
          </div>
        )}

        <div className="glass" style={{ padding: "2.5rem" }}>
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit}>
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

            <div className="form-group">
              <label>PDF File</label>
              <div style={{
                border: "2px dashed var(--primary-light)",
                borderRadius: "10px",
                padding: "2rem",
                textAlign: "center",
                background: "rgba(59, 130, 246, 0.05)",
                cursor: "pointer",
                transition: "all 0.2s"
              }}>
                <input className="form-control" type="file" accept=".pdf" required
                  onChange={(e) => {
                    const f = e.target.files[0];
                    if (f) {
                      if (f.type !== "application/pdf") {
                        setError("❌ Please upload a PDF file only");
                        return;
                      }
                      if (f.size > 50 * 1024 * 1024) { // 50MB limit
                        setError("❌ File size must be less than 50MB");
                        return;
                      }
                      setFile(f);
                      setError("");
                    }
                  }}
                  style={{ display: "none" }}
                  id="pdf-file" />
                <label htmlFor="pdf-file" style={{ cursor: "pointer", display: "block" }}>
                  <p style={{ margin: "0 0 0.5rem 0", fontSize: "1.2rem" }}>📄</p>
                  <p style={{ margin: "0 0 0.5rem 0", color: "var(--text-main)", fontWeight: 600 }}>
                    {file ? file.name : "Click to upload or drag PDF here"}
                  </p>
                  <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.85rem" }}>
                    PDF file up to 50MB
                  </p>
                </label>
              </div>
              {file && (
                <p style={{ color: "var(--primary)", fontSize: "0.9rem", marginTop: "0.5rem" }}>
                  ✓ Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)}MB)
                </p>
              )}
            </div>

            <button type="submit" className="btn btn-primary"
              style={{ 
                width: "100%", 
                padding: "1rem", 
                marginTop: "1.5rem",
                fontSize: "1rem",
                fontWeight: 600,
                transition: "all 0.2s"
              }}
              disabled={loading || !file || !user || (user.role !== "contributor" && user.role !== "admin")}>
              {loading ? (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                  <span className="spinner" /> Uploading...
                </span>
              ) : (
                <>📤 Upload Paper</>
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}