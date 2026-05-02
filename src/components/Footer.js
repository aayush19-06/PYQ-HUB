"use client";
import { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";

export default function Footer() {
  const [visits, setVisits] = useState(null);

  useEffect(() => {
    // Check if they already visited this session so we don't overcount
    const hasVisited = sessionStorage.getItem("hasVisited");
    const method = hasVisited ? "GET" : "POST";
    
    fetch("/api/analytics/visit", { method })
      .then(res => res.json())
      .then(data => {
        if (data.visits !== undefined) {
          setVisits(data.visits);
        }
        if (!hasVisited) sessionStorage.setItem("hasVisited", "true");
      })
      .catch(() => {});
  }, []);

  return (
    <footer style={{
      textAlign: 'center',
      padding: '2rem',
      color: 'var(--text-muted)',
      fontSize: '0.875rem',
      borderTop: '1px solid var(--border)',
      marginTop: '4rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      alignItems: 'center'
    }}>
      <div>&copy; {new Date().getFullYear()} UCER PYQ Portal &mdash; Built with ❤️ for students.</div>
      
      <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>
        Deployed by: 1. Ayush Khare &nbsp;|&nbsp; 2. Utkarsh Singh
      </div>

      {visits !== null && (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.4rem', 
          background: 'rgba(37,99,235,0.1)', 
          padding: '0.4rem 1rem', 
          borderRadius: '20px', 
          color: 'var(--primary-light)', 
          fontWeight: 600,
          marginTop: '0.5rem',
          fontSize: '0.9rem'
        }}>
          <FaEye size={15} /> Total Visitors: {visits}
        </div>
      )}
    </footer>
  );
}
