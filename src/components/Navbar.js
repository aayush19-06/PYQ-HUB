import Link from "next/link";
import { FaBookOpen } from "react-icons/fa";
import NavAuth from "./NavAuth";

export default function Navbar() {
  return (
    <nav className="glass-nav">
      <div className="container" style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', height: '72px'
      }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #2563eb, #1e40af)',
            padding: '8px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(37,99,235,0.4)'
          }}>
            <FaBookOpen size={20} color="white" />
          </div>
          <div>
            <span style={{ fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.02em' }} className="text-gradient">UCER</span>
            <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}> PYQ</span>
          </div>
        </Link>

        {/* Nav Links */}
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <Link href="/papers" className="nav-link" style={{ fontWeight: 500, color: 'var(--text-muted)', transition: 'color .2s' }}>
            Browse Papers
          </Link>
          <NavAuth />
        </div>
      </div>
      <style>{`
        .nav-link:hover { color: var(--primary-light) !important; }
      `}</style>
    </nav>
  );
}
