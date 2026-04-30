"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaBell, FaArrowLeft, FaCheckCircle, FaTimesCircle, FaFileAlt, FaTrash } from "react-icons/fa";

export default function NotificationsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("ucer_user");
    if (stored) {
      setUser(JSON.parse(stored));
      fetchNotifications();
    } else {
      router.push("/login");
    }
  }, [router]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("ucer_token");
      const res = await fetch("/api/notifications", {
        headers: { authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem("ucer_token");
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ notificationId })
      });
      fetchNotifications();
    } catch (err) {
      console.error("Error marking as read:", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const token = localStorage.getItem("ucer_token");
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ markAllAsRead: true })
      });
      fetchNotifications();
    } catch (err) {
      console.error("Error marking all as read:", err);
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      const token = localStorage.getItem("ucer_token");
      await fetch("/api/notifications", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ notificationId })
      });
      fetchNotifications();
    } catch (err) {
      console.error("Error deleting notification:", err);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "approved":
        return <FaCheckCircle style={{ color: "#22c55e" }} />;
      case "rejected":
        return <FaTimesCircle style={{ color: "#ef4444" }} />;
      case "paper_uploaded":
        return <FaFileAlt style={{ color: "var(--primary)" }} />;
      default:
        return <FaBell style={{ color: "var(--primary-light)" }} />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case "approved":
        return "rgba(34, 197, 94, 0.1)";
      case "rejected":
        return "rgba(239, 68, 68, 0.1)";
      case "paper_uploaded":
      case "paper_downloaded":
        return "rgba(59, 130, 246, 0.1)";
      default:
        return "rgba(99, 102, 241, 0.1)";
    }
  };

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-secondary)", padding: "2rem" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
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
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <div>
              <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "0.5rem" }}>
                <FaBell style={{ marginRight: "0.5rem" }} />Notifications
              </h1>
              <p style={{ color: "var(--text-muted)", fontSize: "1rem" }}>
                {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}` : "All caught up!"}
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                style={{
                  background: "var(--primary)",
                  color: "white",
                  border: "none",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: 600,
                  whiteSpace: "nowrap"
                }}
              >
                Mark all as read
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>
            <div className="spinner" style={{ width: "40px", height: "40px", borderWidth: "3px", margin: "0 auto 1rem" }} />
            Loading notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div className="glass" style={{ padding: "3rem", textAlign: "center" }}>
            <FaBell size={48} style={{ margin: "0 auto 1rem", display: "block", color: "var(--text-muted)" }} />
            <h2 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "0.5rem" }}>No notifications</h2>
            <p style={{ color: "var(--text-muted)" }}>You'll see updates about your papers and account here.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {notifications.map(notif => (
              <div
                key={notif._id}
                onClick={() => !notif.read && handleMarkAsRead(notif._id)}
                style={{
                  background: getNotificationColor(notif.type),
                  border: notif.read ? "1px solid var(--border)" : "2px solid var(--primary-light)",
                  borderRadius: "10px",
                  padding: "1.5rem",
                  cursor: notif.read ? "default" : "pointer",
                  transition: "all 0.2s"
                }}
              >
                <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                  <div style={{ fontSize: "1.5rem", flexShrink: 0 }}>
                    {getNotificationIcon(notif.type)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", marginBottom: "0.5rem" }}>
                      <h3 style={{ margin: 0, fontWeight: 700, color: "var(--text-main)" }}>
                        {notif.title}
                        {!notif.read && (
                          <span style={{
                            display: "inline-block",
                            width: "8px",
                            height: "8px",
                            background: "var(--primary)",
                            borderRadius: "50%",
                            marginLeft: "0.5rem"
                          }} />
                        )}
                      </h3>
                      <span style={{ color: "var(--text-muted)", fontSize: "0.85rem", whiteSpace: "nowrap" }}>
                        {new Date(notif.createdAt).toLocaleDateString()} {new Date(notif.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <p style={{ margin: "0 0 0.75rem 0", color: "var(--text-muted)" }}>
                      {notif.message}
                    </p>
                    {notif.link && (
                      <Link href={notif.link} style={{
                        display: "inline-block",
                        color: "var(--primary-light)",
                        textDecoration: "none",
                        fontWeight: 600,
                        fontSize: "0.9rem"
                      }}>
                        View Details →
                      </Link>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(notif._id);
                    }}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "var(--text-muted)",
                      cursor: "pointer",
                      fontSize: "1.1rem",
                      padding: "0.5rem",
                      flexShrink: 0
                    }}
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
