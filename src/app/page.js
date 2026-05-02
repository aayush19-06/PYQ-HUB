import Link from "next/link";
import { FaSearch, FaBook, FaShieldAlt, FaGraduationCap, FaArrowRight } from "react-icons/fa";

export default function Home() {
  const branches = [
    { name: "Computer Science", code: "CSE", icon: "💻" },
    { name: "Information Technology", code: "IT", icon: "🌐" },
    { name: "Electronics & Comm.", code: "ECE", icon: "📡" },
    { name: "Mechanical Engg.", code: "ME", icon: "⚙️" },
    { name: "Civil Engg.", code: "CE", icon: "🏗️" },
    { name: "Electrical Engg.", code: "EE", icon: "⚡" },
  ];

  const categories = [
    { name: "Class Test", color: "badge-blue", desc: "Unit-wise class tests" },
    { name: "Sessional 1", color: "badge-purple", desc: "First Sessional papers" },
    { name: "Sessional 2", color: "badge-purple", desc: "Second Sessional papers" },
    { name: "Semester", color: "badge-green", desc: "End-semester exams" },
  ];

  return (
    <main>
      {/* Hero */}
      <section style={{ padding: '7rem 0 5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-100px', left: '-100px', width: '400px', height: '400px', background: 'var(--primary)', filter: 'blur(140px)', opacity: 0.15, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-80px', right: '-80px', width: '350px', height: '350px', background: 'var(--accent)', filter: 'blur(140px)', opacity: 0.1, pointerEvents: 'none' }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(37,99,235,0.25)', borderRadius: '20px', padding: '0.4rem 1rem', marginBottom: '1.75rem', fontSize: '0.875rem', color: 'var(--primary-light)' }}>
            <FaShieldAlt size={12} /> Trusted by UCER Students
          </div>

          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.5rem' }}>
            Your Complete<br />
            <span className="text-gradient">Previous Year Question</span><br />
            Repository
          </h1>

          <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', maxWidth: '580px', margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
            Find Class Tests, Sessionals & Semester papers for every branch and every semester at United College of Engineering and Research.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/papers" className="btn btn-primary" style={{ padding: '1rem 2.25rem', fontSize: '1.05rem' }}>
              <FaSearch /> Browse All Papers
            </Link>
            <Link href="/register" className="btn btn-secondary" style={{ padding: '1rem 2.25rem', fontSize: '1.05rem' }}>
              Join as Contributor <FaArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Category Pills */}
      <section style={{ padding: '1rem 0 3rem' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <Link href={`/papers?category=${encodeURIComponent(cat.name)}`} key={cat.name}
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 1.75rem', borderRadius: '12px', transition: 'transform 0.2s, box-shadow 0.2s' }}
              className="glass category-card">
              <span className={`badge ${cat.color}`}>{cat.name}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{cat.desc}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Branch Grid */}
      <section style={{ padding: '3rem 0' }}>
        <div className="container">
          <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem', textAlign: 'center' }}>
            Browse by <span className="text-gradient">Branch</span>
          </h2>
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2.5rem', fontSize: '0.95rem' }}>
            Select your department to quickly find relevant papers
          </p>

          <div className="grid grid-3">
            {branches.map(branch => (
              <Link href={`/papers?branch=${branch.code}`} key={branch.code} className="glass branch-card"
                style={{ padding: '2rem 1.75rem', display: 'flex', alignItems: 'center', gap: '1.25rem', transition: 'all 0.3s ease' }}>
                <div style={{ fontSize: '2.25rem', lineHeight: 1 }}>{branch.icon}</div>
                <div>
                  <h3 style={{ fontWeight: 700, marginBottom: '0.25rem', fontSize: '1.05rem' }}>{branch.name}</h3>
                  <span className="badge badge-blue">{branch.code}</span>
                </div>
                <FaArrowRight style={{ marginLeft: 'auto', opacity: 0.4 }} size={14} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '4rem 0', background: 'rgba(15, 23, 42, 0.4)', margin: '2rem 0' }}>
        <div className="container">
          <div className="grid grid-3" style={{ textAlign: 'center' }}>
            {[
              { icon: <FaBook size={28} color="var(--primary-light)" />, title: "All Paper Types", desc: "Class tests, sessionals, and year-end semester papers in one portal." },
              { icon: <FaSearch size={28} color="var(--accent)" />, title: "Smart Filtering", desc: "Filter by branch, semester, subject, category, and year instantly." },
              { icon: <FaShieldAlt size={28} color="var(--success)" />, title: "Verified Uploads", desc: "All papers are uploaded only by authorized contributors. Quality guaranteed." },
            ].map((f, i) => (
              <div key={i} style={{ padding: '2rem 1.5rem' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(37,99,235,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                  {f.icon}
                </div>
                <h3 style={{ fontWeight: 700, marginBottom: '0.75rem', fontSize: '1.1rem' }}>{f.title}</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.925rem' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .branch-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(37,99,235,0.2) !important; border-color: rgba(96,165,250,0.3) !important; }
        .category-card:hover { transform: translateY(-3px); box-shadow: 0 10px 30px rgba(37,99,235,0.15) !important; }
      `}</style>
    </main>
  );
}
