import Link from "next/link";
import { FaBookOpen, FaUpload, FaSignInAlt } from "react-icons/fa";

export default function Navbar() {
  return (
    <nav className="glass-nav">
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '80px' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ background: 'var(--primary)', padding: '0.5rem', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FaBookOpen size={24} color="white" />
          </div>
          <span style={{ fontSize: '1.5rem', fontWeight: 700 }} className="text-gradient">UCER Portal</span>
        </Link>
        
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link href="/papers" style={{ fontWeight: 500, transition: 'color 0.2s' }} className="nav-link">
            Browse Papers
          </Link>
          <Link href="/upload" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }} className="nav-link">
            <FaUpload /> Upload
          </Link>
          <Link href="/login" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}>
            <FaSignInAlt /> Login
          </Link>
        </div>
      </div>
      <style>{`
        .nav-link:hover {
          color: var(--primary-light);
        }
      `}</style>
    </nav>
  );
}
