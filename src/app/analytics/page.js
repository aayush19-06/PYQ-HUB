"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaBarChart, FaArrowLeft, FaUsers, FaFileAlt, FaDownload } from "react-icons/fa";

export default function AnalyticsDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("ucer_user");
    if (stored) {
      const userData = JSON.parse(stored);
      if (userData.role !== "admin") {
        router.push("/");
        return;
      }
      setUser(userData);
      fetchAnalytics();
    } else {
      router.push("/login");
    }
  }, [router]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("ucer_token");
      const res = await fetch("/api/admin/analytics", {
        headers: { authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setAnalytics(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!analytics) {
    return (
      <main style={{ minHeight: "100vh", background: "var(--bg-secondary)", padding: "2rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div className="spinner" style={{ width: "40px", height: "40px", borderWidth: "3px", margin: "0 auto 1rem" }} />
          {loading ? "Loading analytics..." : "No data available"}
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-secondary)", padding: "2rem" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <Link href="/" style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            color: "var(--primary-light)",
            textDecoration: "none",
            marginBottom: "1rem",
            fontWeight: 500
          }}>
            <FaArrowLeft size={14} /> Back to Home
          </Link>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "0.5rem" }}>
            <span className="text-gradient">Analytics</span> Dashboard
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "1rem" }}>
            Overview of platform statistics and insights
          </p>
        </div>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: "2rem" }}>
            {error}
          </div>
        )}

        {/* Users Section */}
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <FaUsers /> Users
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem", marginBottom: "3rem" }}>
          <div className="glass" style={{ padding: "1.5rem", borderTop: "3px solid var(--primary)" }}>
            <p style={{ color: "var(--text-muted)", margin: 0, fontSize: "0.9rem" }}>Total Users</p>
            <h2 style={{ fontSize: "2rem", fontWeight: 800, margin: "0.5rem 0 0 0" }}>{analytics.users.total}</h2>
          </div>
          <div className="glass" style={{ padding: "1.5rem", borderTop: "3px solid #f97316" }}>
            <p style={{ color: "var(--text-muted)", margin: 0, fontSize: "0.9rem" }}>Students</p>
            <h2 style={{ fontSize: "2rem", fontWeight: 800, margin: "0.5rem 0 0 0" }}>{analytics.users.students}</h2>
          </div>
          <div className="glass" style={{ padding: "1.5rem", borderTop: "3px solid var(--primary-light)" }}>
            <p style={{ color: "var(--text-muted)", margin: 0, fontSize: "0.9rem" }}>Contributors</p>
            <h2 style={{ fontSize: "2rem", fontWeight: 800, margin: "0.5rem 0 0 0" }}>{analytics.users.contributors}</h2>
          </div>
          <div className="glass" style={{ padding: "1.5rem", borderTop: "3px solid #22c55e" }}>
            <p style={{ color: "var(--text-muted)", margin: 0, fontSize: "0.9rem" }}>Approved</p>
            <h2 style={{ fontSize: "2rem", fontWeight: 800, margin: "0.5rem 0 0 0" }}>{analytics.users.approvedContributors}</h2>
          </div>
          <div className="glass" style={{ padding: "1.5rem", borderTop: "3px solid #f97316" }}>
            <p style={{ color: "var(--text-muted)", margin: 0, fontSize: "0.9rem" }}>Pending Approval</p>
            <h2 style={{ fontSize: "2rem", fontWeight: 800, margin: "0.5rem 0 0 0" }}>{analytics.users.pendingContributors}</h2>
          </div>
        </div>

        {/* Papers Section */}
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <FaFileAlt /> Papers
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem", marginBottom: "3rem" }}>
          <div className="glass" style={{ padding: "1.5rem", borderTop: "3px solid var(--primary)" }}>
            <p style={{ color: "var(--text-muted)", margin: 0, fontSize: "0.9rem" }}>Total Papers</p>
            <h2 style={{ fontSize: "2rem", fontWeight: 800, margin: "0.5rem 0 0 0" }}>{analytics.papers.total}</h2>
          </div>
          <div className="glass" style={{ padding: "1.5rem", borderTop: "3px solid #22c55e" }}>
            <p style={{ color: "var(--text-muted)", margin: 0, fontSize: "0.9rem" }}>Total Downloads</p>
            <h2 style={{ fontSize: "2rem", fontWeight: 800, margin: "0.5rem 0 0 0" }}>{analytics.papers.totalDownloads}</h2>
          </div>
        </div>

        {/* Two Column Layout */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginBottom: "2rem" }}>
          {/* Papers by Category */}
          <div className="glass" style={{ padding: "1.5rem" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "1rem" }}>Papers by Category</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {Object.entries(analytics.papers.byCategory).map(([category, count]) => (
                <div key={category} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "var(--text-main)", fontWeight: 500 }}>{category}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div style={{
                      flex: 1,
                      height: "8px",
                      background: "var(--border)",
                      borderRadius: "4px",
                      minWidth: "100px"
                    }}>
                      <div style={{
                        height: "100%",
                        width: `${(count / analytics.papers.total) * 100}%`,
                        background: "var(--primary)",
                        borderRadius: "4px"
                      }} />
                    </div>
                    <span style={{ color: "var(--text-muted)", fontSize: "0.9rem", minWidth: "30px", textAlign: "right" }}>{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Papers by Branch */}
          <div className="glass" style={{ padding: "1.5rem" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "1rem" }}>Papers by Branch</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {Object.entries(analytics.papers.byBranch).map(([branch, count]) => (
                <div key={branch} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "var(--text-main)", fontWeight: 500 }}>{branch}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div style={{
                      flex: 1,
                      height: "8px",
                      background: "var(--border)",
                      borderRadius: "4px",
                      minWidth: "100px"
                    }}>
                      <div style={{
                        height: "100%",
                        width: `${(count / analytics.papers.total) * 100}%`,
                        background: "var(--primary-light)",
                        borderRadius: "4px"
                      }} />
                    </div>
                    <span style={{ color: "var(--text-muted)", fontSize: "0.9rem", minWidth: "30px", textAlign: "right" }}>{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Papers */}
        <div className="glass" style={{ padding: "1.5rem" }}>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <FaDownload /> Top Papers by Downloads
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {analytics.papers.topPapers.length === 0 ? (
              <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "2rem" }}>
                No papers downloaded yet
              </p>
            ) : (
              analytics.papers.topPapers.map((paper, idx) => (
                <div key={idx} style={{
                  background: "rgba(59, 130, 246, 0.05)",
                  border: "1px solid var(--border)",
                  borderRadius: "10px",
                  padding: "1rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: "0 0 0.25rem 0", fontWeight: 600, color: "var(--text-main)" }}>
                      {idx + 1}. {paper.title}
                    </h4>
                    <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.9rem" }}>
                      {paper.subject}
                    </p>
                  </div>
                  <div style={{
                    background: "var(--primary)",
                    color: "white",
                    padding: "0.5rem 1rem",
                    borderRadius: "8px",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem"
                  }}>
                    <FaDownload size={14} /> {paper.downloads}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
