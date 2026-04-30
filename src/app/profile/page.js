"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaUser, FaFileAlt, FaDownload, FaArrowLeft, FaEdit, FaTrash } from "react-icons/fa";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUploads: 0,
    totalDownloads: 0,
    totalViews: 0
  });

  useEffect(() => {
    const stored = localStorage.getItem("ucer_user");
    if (stored) {
      const userData = JSON.parse(stored);
      setUser(userData);
      if (userData.role === "contributor" || userData.role === "admin") {
        fetchUserPapers();
      } else {
        setLoading(false);
      }
    } else {
      router.push("/login");
    }
  }, [router]);

  const fetchUserPapers = async () => {
    try {
      const token = localStorage.getItem("ucer_token");
      const res = await fetch("/api/papers/my-papers", {
        headers: { authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setPapers(data.papers || []);
        setStats(data.stats || {});
      }
    } catch (err) {
      console.error("Error fetching papers:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-secondary)", padding: "2rem" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        {/* Header */}
        <Link href="/" style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          color: "var(--primary-light)",
          textDecoration: "none",
          marginBottom: "1.5rem",
          fontWeight: 500
        }}>
          <FaArrowLeft size={14} /> Back to Home
        </Link>

        {/* User Info Card */}
        <div className="glass" style={{ padding: "2.5rem", marginBottom: "2rem" }}>
          <div style={{ display: "flex", gap: "2rem", alignItems: "center", flexWrap: "wrap" }}>
            <div style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "3rem",
              color: "white"
            }}>
              <FaUser size={50} />
            </div>
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "0.5rem" }}>
                {user.name}
              </h1>
              <p style={{ color: "var(--text-muted)", marginBottom: "0.75rem", fontSize: "1rem" }}>
                📧 {user.email}
              </p>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <span style={{
                  background: "rgba(59, 130, 246, 0.2)",
                  color: "var(--primary)",
                  padding: "0.5rem 1rem",
                  borderRadius: "20px",
                  fontWeight: 600,
                  fontSize: "0.9rem"
                }}>
                  {user.role.toUpperCase()}
                </span>
                {user.approved === true && (
                  <span style={{
                    background: "rgba(34, 197, 94, 0.2)",
                    color: "#22c55e",
                    padding: "0.5rem 1rem",
                    borderRadius: "20px",
                    fontWeight: 600,
                    fontSize: "0.9rem"
                  }}>
                    ✓ Approved
                  </span>
                )}
                {user.approved === false && (
                  <span style={{
                    background: "rgba(239, 68, 68, 0.2)",
                    color: "#ef4444",
                    padding: "0.5rem 1rem",
                    borderRadius: "20px",
                    fontWeight: 600,
                    fontSize: "0.9rem"
                  }}>
                    ❌ Rejected
                  </span>
                )}
                {user.approved !== true && user.approved !== false && (
                  <span style={{
                    background: "rgba(251, 146, 60, 0.2)",
                    color: "#f97316",
                    padding: "0.5rem 1rem",
                    borderRadius: "20px",
                    fontWeight: 600,
                    fontSize: "0.9rem"
                  }}>
                    ⏳ Pending Approval
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        {(user.role === "contributor" || user.role === "admin") && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
            <div className="glass" style={{ padding: "1.5rem", textAlign: "center", borderTop: "3px solid var(--primary)" }}>
              <p style={{ color: "var(--text-muted)", margin: 0, fontSize: "0.9rem" }}>Papers Uploaded</p>
              <h2 style={{ fontSize: "2rem", fontWeight: 800, margin: "0.5rem 0 0 0" }}>{stats.totalUploads || 0}</h2>
            </div>
            <div className="glass" style={{ padding: "1.5rem", textAlign: "center", borderTop: "3px solid #22c55e" }}>
              <p style={{ color: "var(--text-muted)", margin: 0, fontSize: "0.9rem" }}>Total Downloads</p>
              <h2 style={{ fontSize: "2rem", fontWeight: 800, margin: "0.5rem 0 0 0" }}>{stats.totalDownloads || 0}</h2>
            </div>
            <div className="glass" style={{ padding: "1.5rem", textAlign: "center", borderTop: "3px solid #f97316" }}>
              <p style={{ color: "var(--text-muted)", margin: 0, fontSize: "0.9rem" }}>Joined</p>
              <h2 style={{ fontSize: "1.1rem", fontWeight: 700, margin: "0.5rem 0 0 0" }}>
                {new Date(user.createdAt).toLocaleDateString()}
              </h2>
            </div>
          </div>
        )}

        {/* My Papers */}
        {(user.role === "contributor" || user.role === "admin") && (
          <div className="glass" style={{ padding: "2rem" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <FaFileAlt /> My Uploaded Papers
            </h2>

            {loading ? (
              <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>
                Loading your papers...
              </div>
            ) : papers.length === 0 ? (
              <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>
                <p>You haven't uploaded any papers yet.</p>
                <Link href="/upload" style={{
                  display: "inline-block",
                  background: "var(--primary)",
                  color: "white",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "8px",
                  textDecoration: "none",
                  marginTop: "1rem",
                  fontWeight: 600
                }}>
                  Upload your first paper →
                </Link>
              </div>
            ) : (
              <div style={{ display: "grid", gap: "1rem" }}>
                {papers.map(paper => (
                  <div
                    key={paper._id}
                    style={{
                      background: "rgba(59, 130, 246, 0.05)",
                      border: "1px solid var(--border)",
                      borderRadius: "10px",
                      padding: "1.5rem",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "1rem"
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <h3 style={{ margin: "0 0 0.5rem 0", fontWeight: 700, color: "var(--text-main)" }}>
                        {paper.title}
                      </h3>
                      <p style={{ margin: "0 0 0.5rem 0", color: "var(--text-muted)", fontSize: "0.9rem" }}>
                        {paper.subject} • {paper.branch} • Sem {paper.semester} • {paper.category}
                      </p>
                      <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.85rem" }}>
                        📥 {paper.downloads || 0} downloads • Uploaded {new Date(paper.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div style={{ display: "flex", gap: "0.75rem" }}>
                      <Link
                        href={`/edit-paper/${paper._id}`}
                        style={{
                          background: "var(--primary)",
                          color: "white",
                          border: "none",
                          padding: "0.75rem 1.25rem",
                          borderRadius: "8px",
                          cursor: "pointer",
                          fontWeight: 600,
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          textDecoration: "none",
                          transition: "all 0.2s"
                        }}
                      >
                        <FaEdit size={14} /> Edit
                      </Link>
                      <button
                        style={{
                          background: "#ef4444",
                          color: "white",
                          border: "none",
                          padding: "0.75rem 1.25rem",
                          borderRadius: "8px",
                          cursor: "pointer",
                          fontWeight: 600,
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          transition: "all 0.2s"
                        }}
                        onClick={() => {
                          if (confirm("Are you sure you want to delete this paper?")) {
                            // TODO: Implement delete
                          }
                        }}
                      >
                        <FaTrash size={14} /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Student Info */}
        {user.role === "student" && (
          <div className="glass" style={{ padding: "2rem", textAlign: "center" }}>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "1rem" }}>
              Want to share papers?
            </h2>
            <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem" }}>
              Become a contributor and help other students by sharing exam papers.
            </p>
            <Link href="/register" style={{
              display: "inline-block",
              background: "var(--primary)",
              color: "white",
              padding: "1rem 2rem",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: 600,
              fontSize: "1rem"
            }}>
              Register as Contributor →
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
