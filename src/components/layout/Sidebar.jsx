import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const S = {
  sidebar: {
    width: 220,
    background: "#fff",
    borderRight: "1px solid #eaeaf0",
    display: "flex",
    flexDirection: "column",
    padding: "20px 0",
    position: "fixed",
    top: 0, left: 0, bottom: 0,
    zIndex: 10,
  },
  logoWrap: {
    display: "flex", alignItems: "center", gap: 10,
    padding: "0 20px 20px", borderBottom: "1px solid #eaeaf0",
    marginBottom: 16, cursor: "pointer",
    userSelect: "none",
  },
  logoIcon: {
    width: 34, height: 34,
    background: "linear-gradient(135deg, #3b3bff, #7b5cff)",
    borderRadius: 9, display: "flex", alignItems: "center",
    justifyContent: "center", color: "#fff", fontSize: 16, flexShrink: 0,
  },
  logoText: { fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 15, color: "#0a0a1a" },
  logoSub: { fontSize: 10, color: "#3b3bff", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" },
  navItem: (active) => ({
    display: "flex", alignItems: "center", gap: 10,
    padding: "9px 20px", cursor: "pointer",
    background: active ? "rgba(59,59,255,0.07)" : "transparent",
    color: active ? "#3b3bff" : "#555",
    fontWeight: active ? 600 : 500, fontSize: 13,
    margin: "1px 8px", borderRadius: 8,
    transition: "background 0.15s", userSelect: "none",
  }),
  badge: {
    marginLeft: "auto", background: "#3b3bff", color: "#fff",
    borderRadius: 20, fontSize: 10, fontWeight: 700,
    padding: "2px 7px", minWidth: 18, textAlign: "center",
  },
  userSection: {
    marginTop: "auto", padding: "16px 20px 16px",
    borderTop: "1px solid #eaeaf0",
    display: "flex", alignItems: "center", gap: 8,
    cursor: "pointer", position: "relative",
    transition: "background 0.15s",
    ":hover": { background: "#f9f9fc" }
  },
  userAvatar: {
    width: 32, height: 32, borderRadius: "50%",
    background: "linear-gradient(135deg, #3b3bff, #9b5cff)",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "#fff", fontSize: 12, fontWeight: 700, flexShrink: 0,
  },
  userName: { fontSize: 12, fontWeight: 700, color: "#0a0a1a" },
  userRole: { fontSize: 10, color: "#3b3bff", fontWeight: 600 },
  moreIcon: {
    marginLeft: "auto", color: "#888", fontSize: 14,
  },
  dropdown: {
    position: "absolute", bottom: "100%", left: 20, right: 20,
    marginBottom: 8, background: "#fff", borderRadius: 12,
    boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
    border: "1px solid #eaeaf0", overflow: "hidden",
    display: "flex", flexDirection: "column", zIndex: 20,
  },
  menuItem: {
    padding: "10px 16px", cursor: "pointer",
    fontSize: 13, fontWeight: 600, color: "#333",
    display: "flex", alignItems: "center", gap: 8,
    borderBottom: "1px solid #f5f5f8",
    background: "transparent", border: "none", textAlign: "left",
    width: "100%", fontFamily: "'DM Sans', sans-serif",
  },
};

const NAV_ITEMS = [
  { icon: "🏠", label: "Home", page: "home" },
  { icon: "📊", label: "Admin Dashboard", page: "admin" },
  { icon: "👤", label: "My Profile", page: "profile" },
  { icon: "💡", label: "My Brainstorm Rooms", page: "myrooms" },
  { icon: "📈", label: "Analytics", page: "analytics" },
  { icon: "🔔", label: "Notifications", page: "notifications", badge: 3 },
  { icon: "⚙️", label: "Settings", page: "settings" },
];

export default function Sidebar({ currentPage, onNavigate }) {
  const { user, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
      onNavigate("landing");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <aside style={S.sidebar}>
      {/* LOGO — always goes home */}
      <div style={S.logoWrap} onClick={() => onNavigate("home")}>
        <div style={S.logoIcon}>⚡</div>
        <div>
          <div style={S.logoText}>IdeaForge</div>
          <div style={S.logoSub}>AI Brainstorming</div>
        </div>
      </div>

      {NAV_ITEMS.map((item) => (
        <div
          key={item.label}
          style={S.navItem(currentPage === item.page)}
          onClick={() => onNavigate(item.page)}
        >
          <span>{item.icon}</span>
          {item.label}
          {item.badge && <span style={S.badge}>{item.badge}</span>}
        </div>
      ))}

      <div style={S.userSection} onClick={() => setMenuOpen(!menuOpen)}>
        <div style={S.userAvatar}>{(user?.user_metadata?.full_name?.[0] || user?.email?.[0] || "A").toUpperCase()}</div>
        <div>
          <div style={S.userName}>{user?.user_metadata?.full_name || user?.email?.split('@')[0] || "User"}</div>
          <div style={S.userRole}>{"Member"}</div>
        </div>
        <div style={S.moreIcon}>⋮</div>

        {menuOpen && (
          <div style={S.dropdown} onClick={(e) => e.stopPropagation()}>
            <button style={S.menuItem} onClick={() => { setMenuOpen(false); onNavigate("profile"); }}>
              <span>👤</span> Edit Profile
            </button>
            <button style={{ ...S.menuItem, color: "#e74c3c", borderBottom: "none" }} onClick={handleLogout}>
              <span>↗</span> Sign Out
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
