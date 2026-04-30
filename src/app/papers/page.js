"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { FaSearch, FaExternalLinkAlt, FaFilter, FaBookOpen, FaCalendarAlt, FaDownload } from "react-icons/fa";

const BRANCHES = ["CSE", "IT", "ECE", "ME", "CE", "EE"];
const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];
const CATEGORIES = ["Mid Term", "End Term", "Assignment", "Quiz"];

const categoryColors = {
  "Mid Term": "badge-blue",
  "End Term": "badge-purple",
  "Assignment": "badge-green",
  "Quiz": "badge-orange",
};

function PapersContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState({});
  const [filters, setFilters] = useState({
    branch: searchParams.get("branch") || "",
    semester: searchParams.get("semester") || "",
    category: searchParams.get("category") || "",
    subject: "",
  });

  useEffect(() => {
    fetchPapers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  async function fetchPapers() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.branch) params.set("branch", filters.branch);
      if (filters.semester) params.set("semester", filters.semester);
      if (filters.category) params.set("category", filters.category);
      if (filters.subject) params.set("subject", filters.subject);

      const res = await fetch(`/api/papers?${params.toString()}`);
      const data = await res.json();
      setPapers(data.papers || []);
    } catch {
      setPapers([]);
    } finally {
      setLoading(false);
    }
  }

  function handleFilter(key, value) {
    setFilters(prev => ({ ...prev, [key]: value }));
  }

  function clearFilters() {
    setFilters({ branch: "", semester: "", category: "", subject: "" });
  }

  async function handleDownload(paperId, title) {
    try {
      setDownloading(prev => ({ ...prev, [paperId]: true }));
      const token = localStorage.getItem("ucer_token");
      
      if (!token) {
        alert("Please login to download papers");
        router.push("/login");
        return;
      }

      const res = await fetch(`/api/papers/${paperId}/download`, {
        method: "POST",
        headers: { authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Download failed");
        return;
      }

      // Open the PDF in new tab
      window.open(data.downloadUrl, "_blank");
      
      // Update papers list to reflect new download count
      setPapers(prev => prev.map(p => 
        p._id === paperId ? { ...p, downloads: data.downloads } : p
      ));
    } catch (err) {
      alert("Error downloading paper: " + err.message);
    } finally {
      setDownloading(prev => ({ ...prev, [paperId]: false }));
    }
  }

  return (
    <main style={{ padding: '3rem 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            Browse <span className="text-gradient">Papers</span>
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            {loading ? "Loading..." : `${papers.length} paper${papers.length !== 1 ? "s" : ""} found`}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '2rem', alignItems: 'start' }}>
          {/* Sidebar Filters */}
          <aside className="glass" style={{ padding: '1.75rem', position: 'sticky', top: '90px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontWeight: 700, display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <FaFilter size={14} color="var(--primary-light)" /> Filters
              </h3>
              {(filters.branch || filters.semester || filters.category || filters.subject) && (
                <button onClick={clearFilters} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8rem' }}>
                  Clear all
                </button>
              )}
            </div>

            <div className="form-group">
              <label>Branch</label>
              <select className="form-control" value={filters.branch} onChange={e => handleFilter("branch", e.target.value)}>
                <option value="">All Branches</option>
                {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>Semester</label>
              <select className="form-control" value={filters.semester} onChange={e => handleFilter("semester", e.target.value)}>
                <option value="">All Semesters</option>
                {SEMESTERS.map(s => <option key={s} value={s}>Semester {s}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>Category</label>
              <select className="form-control" value={filters.category} onChange={e => handleFilter("category", e.target.value)}>
                <option value="">All Categories</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>Search Subject</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <FaSearch style={{ position: 'absolute', left: '1rem', color: 'var(--text-muted)' }} size={14} />
                <input
                  className="form-control"
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="e.g. Data Structures"
                  value={filters.subject}
                  onChange={e => handleFilter("subject", e.target.value)}
                />
              </div>
            </div>
          </aside>

          {/* Paper Cards */}
          <div>
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
                <div className="spinner" style={{ width: '40px', height: '40px', borderWidth: '3px' }} />
              </div>
            ) : papers.length === 0 ? (
              <div className="glass" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                <FaBookOpen size={48} style={{ margin: '0 auto 1rem', display: 'block', color: 'var(--text-muted)' }} />
                <h3 style={{ marginBottom: '0.5rem' }}>No papers found</h3>
                <p style={{ color: 'var(--text-muted)' }}>Try adjusting your filters or check back later.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {papers.map(paper => (
                  <div key={paper._id} className="glass paper-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', transition: 'all 0.25s ease' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem', alignItems: 'center' }}>
                        <span className={`badge ${categoryColors[paper.category] || 'badge-blue'}`}>{paper.category}</span>
                        <span className="badge badge-blue">{paper.branch}</span>
                        <span className="badge badge-purple">Sem {paper.semester}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          <FaCalendarAlt size={11} /> {paper.year}
                        </span>
                      </div>
                      <h3 style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.35rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {paper.title}
                      </h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                        {paper.subject}
                        {paper.uploadedBy?.name && ` · Uploaded by ${paper.uploadedBy.name}`}
                        {paper.downloads > 0 && ` · 📥 ${paper.downloads} download${paper.downloads !== 1 ? "s" : ""}`}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDownload(paper._id, paper.title)}
                      disabled={downloading[paper._id]}
                      className="btn btn-primary"
                      style={{ whiteSpace: 'nowrap', flexShrink: 0, cursor: 'pointer' }}
                    >
                      {downloading[paper._id] ? (
                        <>
                          <span className="spinner" style={{ width: '14px', height: '14px', borderWidth: '2px' }} /> Downloading...
                        </>
                      ) : (
                        <>
                          <FaDownload size={13} /> Download
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`
        .paper-card:hover { transform: translateX(4px); border-color: rgba(96,165,250,0.25) !important; }
      `}</style>
    </main>
  );
}

export default function PapersPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>Loading...</div>}>
      <PapersContent />
    </Suspense>
  );
}
