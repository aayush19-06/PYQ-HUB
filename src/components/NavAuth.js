"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaUpload, FaSignInAlt, FaSignOutAlt, FaUser, FaUserTie, FaChartBar, FaBell } from "react-icons/fa";

export default function NavAuth() {
  const [user, setUser] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("ucer_user");
    // eslint-disable-next-line
    if (stored) {
      setUser(JSON.parse(stored));
      fetchUnreadCount();
    }
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem("ucer_token");
      const res = await fetch("/api/notifications", {
        headers: { authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (err) {
      // Silently fail
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("ucer_user");
    localStorage.removeItem("ucer_token");
    setUser(null);
    router.push("/");
  };

  if (user) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        {(user.role === "contributor" || user.role === "admin") && (
          <Link href="/upload" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
            <FaUpload /> Upload
          </Link>
        )}
        {user.role === "admin" && (
          <>
            <Link href="/admin" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
              <FaUserTie /> Admin
            </Link>
            <Link href="/analytics" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
              <FaChartBar /> Analytics
            </Link>
          </>
        )}
        <Link href="/profile" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
          <FaUser /> Profile
        </Link>
        <Link href="/notifications" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', position: 'relative' }}>
          <FaBell /> 
          {unreadCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '-5px',
              right: '-5px',
              background: '#ef4444',
              color: 'white',
              borderRadius: '50%',
              width: '20px',
              height: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.75rem',
              fontWeight: 700
            }}>
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          <span>{user.name}</span>
        </div>
        <button onClick={handleLogout} className="btn btn-danger" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
          <FaSignOutAlt /> Logout
        </button>
      </div>
    );
  }

  return (
    <Link href="/login" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem' }}>
      <FaSignInAlt /> Admin Login
    </Link>
  );
}
