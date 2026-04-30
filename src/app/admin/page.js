"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaCheckCircle, FaTimesCircle, FaArrowLeft, FaUserCheck, FaUsers } from "react-icons/fa";

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [contributors, setContributors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState({});
  const [activeTab, setActiveTab] = useState("pending"); // pending, approved, rejected

  useEffect(() => {
    const stored = localStorage.getItem("ucer_user");
    if (stored) {
      const userData = JSON.parse(stored);
      if (userData.role !== "admin") {
        router.push("/");
        return;
      }
      setUser(userData);
      fetchContributors();
    } else {
      router.push("/login");
    }
  }, [router]);

  const fetchContributors = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("ucer_token");
      const res = await fetch("/api/admin/contributors", {
        headers: { authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setContributors(data.contributors || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (contributorId) => {
    try {
      setProcessing(prev => ({ ...prev, [contributorId]: true }));
      const token = localStorage.getItem("ucer_token");
      const res = await fetch("/api/admin/contributors", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ userId: contributorId, action: "approve" })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      // Update local state
      setContributors(prev => prev.map(c => 
        c._id === contributorId ? { ...c, approved: true } : c
      ));
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessing(prev => ({ ...prev, [contributorId]: false }));
    }
  };

  const handleReject = async (contributorId) => {
    try {
      setProcessing(prev => ({ ...prev, [contributorId]: true }));
      const token = localStorage.getItem("ucer_token");
      const res = await fetch("/api/admin/contributors", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ userId: contributorId, action: "reject" })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      setContributors(prev => prev.filter(c => c._id !== contributorId));
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessing(prev => ({ ...prev, [contributorId]: false }));
    }
  };

  const pendingCount = contributors.filter(c => c.approved !== true && c.approved !== false).length;
  const approvedCount = contributors.filter(c => c.approved === true).length;
  const rejectedCount = contributors.filter(c => c.approved === false).length;

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-secondary)", padding: "2rem" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
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
            Admin <span className="text-gradient">Dashboard</span>
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "1rem" }}>
            Manage contributor requests and approvals
          </p>
        </div>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: "2rem" }}>
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
          <div className="glass" style={{ padding: "1.5rem", borderTop: "3px solid var(--primary)" }}>
            <p style={{ color: "var(--text-muted)", margin: 0, fontSize: "0.9rem" }}>Pending Requests</p>
            <h2 style={{ fontSize: "2rem", fontWeight: 800, margin: "0.5rem 0 0 0" }}>{pendingCount}</h2>
          </div>
          <div className="glass" style={{ padding: "1.5rem", borderTop: "3px solid #22c55e" }}>
            <p style={{ color: "var(--text-muted)", margin: 0, fontSize: "0.9rem" }}>Approved</p>
            <h2 style={{ fontSize: "2rem", fontWeight: 800, margin: "0.5rem 0 0 0" }}>{approvedCount}</h2>
          </div>
          <div className="glass" style={{ padding: "1.5rem", borderTop: "3px solid #ef4444" }}>
            <p style={{ color: "var(--text-muted)", margin: 0, fontSize: "0.9rem" }}>Rejected</p>
            <h2 style={{ fontSize: "2rem", fontWeight: 800, margin: "0.5rem 0 0 0" }}>{rejectedCount}</h2>
          </div>
          <div className="glass" style={{ padding: "1.5rem", borderTop: "3px solid #f97316" }}>
            <p style={{ color: "var(--text-muted)", margin: 0, fontSize: "0.9rem" }}>Total Contributors</p>
            <h2 style={{ fontSize: "2rem", fontWeight: 800, margin: "0.5rem 0 0 0" }}>{contributors.length}</h2>
          </div>
        </div>

        {/* Tabs */}
        <div className="glass" style={{ padding: "2rem" }}>
          <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", borderBottom: "1px solid var(--border)" }}>
            {[
              { id: "pending", label: `Pending (${pendingCount})`, icon: "⏳" },
              { id: "approved", label: `Approved (${approvedCount})`, icon: "✅" },
              { id: "rejected", label: `Rejected (${rejectedCount})`, icon: "❌" }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: activeTab === tab.id ? "var(--primary)" : "var(--text-muted)",
                  fontWeight: activeTab === tab.id ? 700 : 500,
                  fontSize: "1rem",
                  padding: "1rem 0",
                  borderBottom: activeTab === tab.id ? "2px solid var(--primary)" : "none",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* Contributors List */}
          {loading ? (
            <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>
              Loading contributors...
            </div>
          ) : contributors.length === 0 ? (
            <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>
              No contributors to display
            </div>
          ) : (
            <div style={{ display: "grid", gap: "1rem" }}>
              {contributors
                .filter(c => {
                  if (activeTab === "pending") return c.approved !== true && c.approved !== false;
                  if (activeTab === "approved") return c.approved === true;
                  if (activeTab === "rejected") return c.approved === false;
                })
                .map(contributor => (
                  <div
                    key={contributor._id}
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
                        {contributor.name}
                      </h3>
                      <p style={{ margin: "0 0 0.25rem 0", color: "var(--text-muted)", fontSize: "0.9rem" }}>
                        📧 {contributor.email}
                      </p>
                      <p style={{ margin: "0 0 0.25rem 0", color: "var(--text-muted)", fontSize: "0.9rem" }}>
                        📅 Joined {new Date(contributor.createdAt).toLocaleDateString()}
                      </p>
                      <p style={{ margin: "0", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                        Status: {contributor.approved === true ? "✅ Approved" : contributor.approved === false ? "❌ Rejected" : "⏳ Pending"}
                      </p>
                    </div>

                    {activeTab === "pending" && (
                      <div style={{ display: "flex", gap: "0.75rem" }}>
                        <button
                          onClick={() => handleApprove(contributor._id)}
                          disabled={processing[contributor._id]}
                          style={{
                            background: "#22c55e",
                            color: "white",
                            border: "none",
                            padding: "0.75rem 1.5rem",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontWeight: 600,
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            transition: "all 0.2s"
                          }}
                        >
                          <FaCheckCircle /> Approve
                        </button>
                        <button
                          onClick={() => handleReject(contributor._id)}
                          disabled={processing[contributor._id]}
                          style={{
                            background: "#ef4444",
                            color: "white",
                            border: "none",
                            padding: "0.75rem 1.5rem",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontWeight: 600,
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            transition: "all 0.2s"
                          }}
                        >
                          <FaTimesCircle /> Reject
                        </button>
                      </div>
                    )}

                    {activeTab === "approved" && (
                      <div style={{
                        background: "rgba(34, 197, 94, 0.2)",
                        padding: "0.75rem 1.5rem",
                        borderRadius: "8px",
                        color: "#22c55e",
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem"
                      }}>
                        <FaCheckCircle /> Approved
                      </div>
                    )}

                    {activeTab === "rejected" && (
                      <div style={{
                        background: "rgba(239, 68, 68, 0.2)",
                        padding: "0.75rem 1.5rem",
                        borderRadius: "8px",
                        color: "#ef4444",
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem"
                      }}>
                        <FaTimesCircle /> Rejected
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
