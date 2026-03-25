import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  House,
  CirclePlus,
  ChevronsRight,
  ChevronsLeft,
  ChartBarStacked,
  QrCode,
  Utensils,
} from "lucide-react";

const NAV = [
  {
    section: "Home",
    items: [{ path: "/", label: "Home", icon: House }],
  },
  {
    section: "Onboarding",
    items: [
      { path: "/onboard", label: "Onboard Restaurant", icon: CirclePlus },
    ],
  },
  {
    section: "Categories",
    items: [{ path: "/category", label: "Categories", icon: ChartBarStacked }],
  },

  {
    section: "QR code generator",
    items: [{ path: "/qr-code", label: "QR code generator", icon: QrCode }],
  },

  // {
  //   section: "Restaurant Details",
  //   items: [
  //     {
  //       path: "/restaurant/:restaurantId",
  //       label: "Restaurant Details",
  //       icon: Utensils,
  //     },
  //   ],
  // },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside style={{ ...sb.aside, width: collapsed ? "84px" : "25%" }}>
      <div style={sb.brand}>
        <div style={sb.logoMark}>F</div>
        {!collapsed && (
          <div>
            <p style={sb.brandName}>Foodie AI</p>
            <p style={sb.brandSub}>Admin</p>
          </div>
        )}
        <button
          style={sb.collapseBtn}
          onClick={() => setCollapsed((c) => !c)}
          title={collapsed ? "Expand" : "Collapse"}
        >
          {collapsed ? <ChevronsLeft /> : <ChevronsRight />}
        </button>
      </div>

      <nav style={sb.nav}>
        {NAV.map((group) => (
          <div key={group.section} style={sb.group}>
            {!collapsed && <p style={sb.groupLabel}>{group.section}</p>}
            {group.items.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  style={({ isActive }) => ({
                    ...sb.link,
                    ...(isActive ? sb.linkActive : {}),
                    justifyContent: collapsed ? "center" : "flex-start",
                    padding: collapsed ? "10px 0" : "10px 14px",
                  })}
                  title={collapsed ? item.label : undefined}
                >
                  <span style={sb.linkIcon}>
                    <Icon />
                  </span>
                  {!collapsed && <span style={sb.linkLabel}>{item.label}</span>}
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      {!collapsed && (
        <div style={sb.userStrip}>
          <div style={sb.avatar}>A</div>
          <div style={{ minWidth: 0 }}>
            <p style={sb.userName}>Admin</p>
            <p style={sb.userEmail}>admin@foodieai.com</p>
          </div>
        </div>
      )}
    </aside>
  );
}

const sb = {
  aside: {
    flexShrink: 0,
    height: "100vh",
    position: "sticky",
    top: 0,
    background: "#ffffff",
    borderRight: "1px solid #e5e7eb",
    display: "flex",
    flexDirection: "column",
    transition: "width 0.2s ease",
    overflow: "hidden",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "20px 16px 16px",
    borderBottom: "1px solid #f3f4f6",
  },
  logoMark: {
    width: "32px",
    height: "32px",
    borderRadius: "8px",
    background: "#1d4ed8",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "15px",
    fontWeight: 700,
    flexShrink: 0,
  },
  brandName: {
    fontSize: "14px",
    fontWeight: 700,
    color: "#111827",
    lineHeight: 1,
  },
  brandSub: { fontSize: "11px", color: "#9ca3af", marginTop: "2px" },
  collapseBtn: {
    marginLeft: "auto",
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#9ca3af",
    padding: "4px",
    display: "flex",
    alignItems: "center",
    flexShrink: 0,
  },
  nav: { flex: 1, overflowY: "auto", padding: "12px 8px" },
  group: { marginBottom: "20px" },
  groupLabel: {
    fontSize: "10px",
    fontWeight: 600,
    color: "#9ca3af",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    padding: "0 8px",
    marginBottom: "4px",
  },
  link: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    borderRadius: "8px",
    color: "#6b7280",
    fontSize: "13px",
    fontWeight: 500,
    textDecoration: "none",
    transition: "all 0.15s",
    marginBottom: "2px",
    fontFamily: "'Inter', sans-serif",
  },
  linkActive: {
    background: "#eff6ff",
    color: "#1d4ed8",
  },
  linkIcon: { flexShrink: 0, display: "flex" },
  linkLabel: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  userStrip: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "14px 16px",
    borderTop: "1px solid #f3f4f6",
  },
  avatar: {
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    background: "#e0e7ff",
    color: "#3730a3",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    fontWeight: 700,
    flexShrink: 0,
  },
  userName: {
    fontSize: "13px",
    fontWeight: 600,
    color: "#111827",
    lineHeight: 1,
  },
  userEmail: {
    fontSize: "11px",
    color: "#9ca3af",
    marginTop: "2px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
};
