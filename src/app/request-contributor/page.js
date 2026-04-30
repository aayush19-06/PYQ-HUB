"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaCheck, FaArrowLeft } from "react-icons/fa";

export default function RequestContributorPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("ucer_user");
    if (stored) {
      const userData = JSON.parse(stored);
      setUser(userData);
      // If already contributor, redirect to upload
      if (userData.role === "contributor" || userData.role === "admin") {
        router.push("/upload");
      }
    }
  }, [router]);

  return (
    <main style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <div style={{ width: "100%", maxWidth: "500px" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: 800 }}>Become a <span className="text-gradient">Contributor</span></h1>
          <p style={{ color: "var(--text-muted)" }}>Help the community by sharing exam papers</p>
        </div>

        <div className="glass" style={{ padding: "2.5rem" }}>
          <div style={{ marginBottom: "2.5rem" }}>
            <h2 style={{ fontSize: "1.3rem", marginBottom: "1.5rem", fontWeight: 700 }}>Steps to Upload Papers</h2>
            
            <div style={{ display: "flex", gap: "1.5rem", marginBottom: "1.5rem" }}>
              <div style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "var(--primary)",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                flexShrink: 0
              }}>1</div>
              <div>
                <h3 style={{ fontWeight: 600, marginBottom: "0.3rem" }}>Register as Contributor</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Go to registration page and select "Contributor" option</p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "1.5rem", marginBottom: "1.5rem" }}>
              <div style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "var(--primary)",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                flexShrink: 0
              }}>2</div>
              <div>
                <h3 style={{ fontWeight: 600, marginBottom: "0.3rem" }}>Wait for Approval</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Admin will review and approve your contributor request within 24-48 hours</p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "1.5rem", marginBottom: "1.5rem" }}>
              <div style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "var(--primary)",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                flexShrink: 0
              }}>3</div>
              <div>
                <h3 style={{ fontWeight: 600, marginBottom: "0.3rem" }}>Start Uploading</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Once approved, click "Upload" in navbar to share papers</p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "1.5rem" }}>
              <div style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "var(--primary)",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                flexShrink: 0
              }}>4</div>
              <div>
                <h3 style={{ fontWeight: 600, marginBottom: "0.3rem" }}>Fill Upload Form</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Enter paper details (subject, year, semester, branch, category) and select PDF file</p>
              </div>
            </div>
          </div>

          <div style={{ 
            background: "rgba(34, 197, 94, 0.1)", 
            border: "1px solid rgba(34, 197, 94, 0.3)", 
            borderRadius: "10px", 
            padding: "1.5rem",
            marginBottom: "2rem",
            textAlign: "center"
          }}>
            <p style={{ color: "var(--text-main)", fontSize: "0.95rem" }}>
              <FaCheck style={{ marginRight: "0.5rem", color: "var(--primary)" }} />
              <strong>Paper Details Needed:</strong>
            </p>
            <ul style={{
              textAlign: "left",
              color: "var(--text-muted)",
              fontSize: "0.9rem",
              marginTop: "1rem",
              paddingLeft: "1.5rem"
            }}>
              <li>✓ Paper Title (e.g., "Data Structures Mid Term 2023")</li>
              <li>✓ Subject Name (e.g., "Data Structures")</li>
              <li>✓ Year (e.g., 2023, 2024)</li>
              <li>✓ Semester (1-8)</li>
              <li>✓ Branch (CSE, IT, ECE, ME, CE, EE)</li>
              <li>✓ Category (Mid Term, End Term, Assignment, Quiz)</li>
              <li>✓ PDF File (Max size: as per Cloudinary limits)</li>
            </ul>
          </div>

          <div style={{ display: "flex", gap: "1rem" }}>
            <Link href="/register" className="btn btn-primary" style={{ flex: 1, padding: "1rem", textAlign: "center", textDecoration: "none" }}>
              Register as Contributor
            </Link>
            <Link href="/papers" className="btn btn-secondary" style={{ flex: 1, padding: "1rem", textAlign: "center", textDecoration: "none" }}>
              View Papers
            </Link>
          </div>

          <Link href="/" style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            marginTop: "1.5rem",
            color: "var(--primary-light)",
            textDecoration: "none",
            fontWeight: 500,
            fontSize: "0.95rem"
          }}>
            <FaArrowLeft size={14} /> Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
