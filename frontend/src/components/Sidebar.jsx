import React from "react";
import {
  FiGrid,
  FiUsers,
  FiTruck,
  FiCalendar,
  FiShuffle,
  FiActivity,
  FiFileText,
  FiLogOut,
} from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: FiGrid, path: "/admin" },
  { id: "drivers", label: "Drivers", icon: FiUsers, path: "/drivers" },
  { id: "loads", label: "Loads", icon: FiTruck, path: "/loads" },
  {
    id: "attendance",
    label: "Attendance",
    icon: FiCalendar,
    path: "/attendance",
  },
  {
    id: "auto-assignment",
    label: "Auto Assignment",
    icon: FiShuffle,
    path: "/auto-assignment",
  },
  {
    id: "fatigue",
    label: "Fatigue & Safety",
    icon: FiActivity,
    path: "/fatigue",
  },
  { id: "reports", label: "Reports", icon: FiFileText, path: "/reports" },
];

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActivePath = (path) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">
          <FiTruck />
        </div>
        <span className="logo-text">ShiftSync</span>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActivePath(item.path);
          return (
            <button
              key={item.id}
              type="button"
              className={`sidebar-link ${active ? "active" : ""}`}
              onClick={() => navigate(item.path)}
            >
              <Icon className="sidebar-icon" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer" onClick={handleLogout} style={{ cursor: 'pointer' }}>
        <FiLogOut className="sidebar-icon" />
        <span>Logout</span>
      </div>
    </aside>
  );
}

export default Sidebar;