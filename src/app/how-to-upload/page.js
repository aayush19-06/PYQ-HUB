"use client";
import Link from "next/link";
import { FaBook, FaUpload, FaCheckCircle, FaQuestionCircle, FaArrowLeft } from "react-icons/fa";

export default function HowToUploadPage() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-secondary)", padding: "2rem" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "3rem" }}>
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
          <h1 style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: "0.5rem" }}>
            How to Upload <span className="text-gradient">Papers</span>
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "1.1rem" }}>
            Complete guide to share exam papers with the community
          </p>
        </div>

        {/* Main Content */}
        <div style={{ display: "grid", gap: "2rem", marginBottom: "3rem" }}>
          {/* Step 1 */}
          <div className="glass" style={{ padding: "2rem", borderLeft: "4px solid var(--primary)" }}>
            <div style={{ display: "flex", gap: "1.5rem", alignItems: "flex-start" }}>
              <div style={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                background: "var(--primary)",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.5rem",
                fontWeight: 700,
                flexShrink: 0
              }}>1</div>
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>
                  Register as Contributor
                </h2>
                <p style={{ color: "var(--text-muted)", lineHeight: "1.6", marginBottom: "1rem" }}>
                  To upload papers, you must first create an account with the "Contributor" role. Go to the 
                  <Link href="/register" style={{ color: "var(--primary-light)", textDecoration: "none", margin: "0 0.25rem", fontWeight: 600 }}>
                    registration page
                  </Link> 
                  and select <strong>"Contributor"</strong> during signup.
                </p>
                <div style={{
                  background: "rgba(59, 130, 246, 0.1)",
                  border: "1px solid rgba(59, 130, 246, 0.3)",
                  borderRadius: "8px",
                  padding: "1rem",
                  color: "var(--text-main)"
                }}>
                  <p style={{ margin: 0, fontSize: "0.95rem" }}>
                    💡 <strong>Tip:</strong> If you're already a student, you'll need to create a new account with the contributor role.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="glass" style={{ padding: "2rem", borderLeft: "4px solid var(--primary)" }}>
            <div style={{ display: "flex", gap: "1.5rem", alignItems: "flex-start" }}>
              <div style={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                background: "var(--primary)",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.5rem",
                fontWeight: 700,
                flexShrink: 0
              }}>2</div>
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>
                  Wait for Admin Approval
                </h2>
                <p style={{ color: "var(--text-muted)", lineHeight: "1.6", marginBottom: "1rem" }}>
                  After registering as a contributor, your account will be reviewed by the admin. This usually takes 
                  <strong> 24-48 hours</strong>. You'll receive approval to start uploading papers.
                </p>
                <div style={{
                  background: "rgba(251, 146, 60, 0.1)",
                  border: "1px solid rgba(251, 146, 60, 0.3)",
                  borderRadius: "8px",
                  padding: "1rem",
                  color: "var(--text-main)"
                }}>
                  <p style={{ margin: 0, fontSize: "0.95rem" }}>
                    ⏳ <strong>Status:</strong> You'll see an "Upload" button in the navbar once approved.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="glass" style={{ padding: "2rem", borderLeft: "4px solid var(--primary)" }}>
            <div style={{ display: "flex", gap: "1.5rem", alignItems: "flex-start" }}>
              <div style={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                background: "var(--primary)",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.5rem",
                fontWeight: 700,
                flexShrink: 0
              }}>3</div>
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>
                  Click Upload Button
                </h2>
                <p style={{ color: "var(--text-muted)", lineHeight: "1.6", marginBottom: "1rem" }}>
                  Once approved, you'll see the <strong>"📤 Upload"</strong> button in the navbar. Click it to access the upload form.
                </p>
                <div style={{
                  background: "rgba(34, 197, 94, 0.1)",
                  border: "1px solid rgba(34, 197, 94, 0.3)",
                  borderRadius: "8px",
                  padding: "1rem",
                  color: "var(--text-main)"
                }}>
                  <p style={{ margin: 0, fontSize: "0.95rem" }}>
                    ✓ <strong>Location:</strong> The upload button appears in the top navigation bar next to your name.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="glass" style={{ padding: "2rem", borderLeft: "4px solid var(--primary)" }}>
            <div style={{ display: "flex", gap: "1.5rem", alignItems: "flex-start" }}>
              <div style={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                background: "var(--primary)",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.5rem",
                fontWeight: 700,
                flexShrink: 0
              }}>4</div>
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>
                  Fill Upload Form
                </h2>
                <p style={{ color: "var(--text-muted)", lineHeight: "1.6", marginBottom: "1rem" }}>
                  Complete all required fields with accurate information about the paper:
                </p>
                <ul style={{
                  color: "var(--text-muted)",
                  lineHeight: "1.8",
                  paddingLeft: "1.5rem",
                  marginBottom: "1rem"
                }}>
                  <li><strong>Paper Title:</strong> e.g., "Data Structures Mid Term 2023"</li>
                  <li><strong>Subject:</strong> e.g., "Data Structures", "Physics", "Chemistry"</li>
                  <li><strong>Year:</strong> e.g., 2023, 2024 (the year exam was held)</li>
                  <li><strong>Semester:</strong> Select 1-8 (your semester)</li>
                  <li><strong>Branch:</strong> CSE, IT, ECE, ME, CE, or EE</li>
                  <li><strong>Category:</strong> Mid Term, End Term, Assignment, or Quiz</li>
                  <li><strong>PDF File:</strong> Your scanned/saved paper (Max 50MB)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Step 5 */}
          <div className="glass" style={{ padding: "2rem", borderLeft: "4px solid var(--primary)" }}>
            <div style={{ display: "flex", gap: "1.5rem", alignItems: "flex-start" }}>
              <div style={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                background: "var(--primary)",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.5rem",
                fontWeight: 700,
                flexShrink: 0
              }}>5</div>
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>
                  Submit & Wait
                </h2>
                <p style={{ color: "var(--text-muted)", lineHeight: "1.6", marginBottom: "1rem" }}>
                  Click the <strong>"📤 Upload Paper"</strong> button. Your paper will be uploaded and stored securely. 
                  You'll see a success message when complete.
                </p>
                <div style={{
                  background: "rgba(34, 197, 94, 0.1)",
                  border: "1px solid rgba(34, 197, 94, 0.3)",
                  borderRadius: "8px",
                  padding: "1rem",
                  color: "var(--text-main)"
                }}>
                  <p style={{ margin: 0, fontSize: "0.95rem" }}>
                    ✅ <strong>Success:</strong> Your paper will be visible to all students immediately.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="glass" style={{ padding: "2.5rem", marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "2rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <FaQuestionCircle /> Frequently Asked Questions
          </h2>

          <div style={{ display: "grid", gap: "1.5rem" }}>
            <div>
              <h3 style={{ fontWeight: 700, marginBottom: "0.5rem", color: "var(--text-main)" }}>
                Why do I need to register as a contributor?
              </h3>
              <p style={{ color: "var(--text-muted)", margin: 0, lineHeight: "1.6" }}>
                The contributor role ensures that only dedicated users who want to share papers can upload them. 
                This maintains the quality of the repository and prevents spam.
              </p>
            </div>

            <div>
              <h3 style={{ fontWeight: 700, marginBottom: "0.5rem", color: "var(--text-main)" }}>
                How long does admin approval take?
              </h3>
              <p style={{ color: "var(--text-muted)", margin: 0, lineHeight: "1.6" }}>
                Admin approval typically takes 24-48 hours. During this time, your contributor account is being verified. 
                Once approved, you can start uploading immediately.
              </p>
            </div>

            <div>
              <h3 style={{ fontWeight: 700, marginBottom: "0.5rem", color: "var(--text-main)" }}>
                Can I upload papers as a student?
              </h3>
              <p style={{ color: "var(--text-muted)", margin: 0, lineHeight: "1.6" }}>
                No, only contributors and admins can upload papers. If you want to contribute, you need to register 
                as a contributor and wait for approval.
              </p>
            </div>

            <div>
              <h3 style={{ fontWeight: 700, marginBottom: "0.5rem", color: "var(--text-main)" }}>
                What file formats are supported?
              </h3>
              <p style={{ color: "var(--text-muted)", margin: 0, lineHeight: "1.6" }}>
                Currently, only PDF files are supported. Maximum file size is 50MB. If you have a paper in another 
                format, convert it to PDF first.
              </p>
            </div>

            <div>
              <h3 style={{ fontWeight: 700, marginBottom: "0.5rem", color: "var(--text-main)" }}>
                What if I uploaded incorrect information?
              </h3>
              <p style={{ color: "var(--text-muted)", margin: 0, lineHeight: "1.6" }}>
                Please contact the admin to edit or remove papers. Make sure to double-check all information before 
                submitting to avoid this issue.
              </p>
            </div>

            <div>
              <h3 style={{ fontWeight: 700, marginBottom: "0.5rem", color: "var(--text-main)" }}>
                Can I delete papers after uploading?
              </h3>
              <p style={{ color: "var(--text-muted)", margin: 0, lineHeight: "1.6" }}>
                Contact the admin to delete papers. We keep papers to maintain a complete archive for all students.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem" }}>
          <Link href="/register" className="glass" style={{
            padding: "2rem",
            textAlign: "center",
            textDecoration: "none",
            borderRadius: "10px",
            transition: "all 0.2s",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1rem"
          }}>
            <span style={{ fontSize: "2rem" }}>📝</span>
            <div>
              <h3 style={{ fontWeight: 700, marginBottom: "0.5rem", color: "var(--text-main)" }}>Register Now</h3>
              <p style={{ color: "var(--text-muted)", margin: 0, fontSize: "0.9rem" }}>Create contributor account</p>
            </div>
          </Link>

          <Link href="/papers" className="glass" style={{
            padding: "2rem",
            textAlign: "center",
            textDecoration: "none",
            borderRadius: "10px",
            transition: "all 0.2s",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1rem"
          }}>
            <span style={{ fontSize: "2rem" }}>📚</span>
            <div>
              <h3 style={{ fontWeight: 700, marginBottom: "0.5rem", color: "var(--text-main)" }}>View Papers</h3>
              <p style={{ color: "var(--text-muted)", margin: 0, fontSize: "0.9rem" }}>Browse uploaded papers</p>
            </div>
          </Link>

          <Link href="/upload" className="glass" style={{
            padding: "2rem",
            textAlign: "center",
            textDecoration: "none",
            borderRadius: "10px",
            transition: "all 0.2s",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1rem"
          }}>
            <span style={{ fontSize: "2rem" }}>📤</span>
            <div>
              <h3 style={{ fontWeight: 700, marginBottom: "0.5rem", color: "var(--text-main)" }}>Upload Paper</h3>
              <p style={{ color: "var(--text-muted)", margin: 0, fontSize: "0.9rem" }}>Share exam papers</p>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
