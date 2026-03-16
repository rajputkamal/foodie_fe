import { useLocation } from "react-router-dom";

export function Topbar() {
  const location = useLocation();

  const segment = location.pathname.split("/").filter(Boolean).pop() ?? "";
  const pageTitle =
    segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ") ||
    "Dashboard";

  return (
    <header style={tb.bar}>
      <div>
        <p style={tb.title}>{pageTitle}</p>
      </div>
      <div style={tb.right}>
        <div style={tb.dot} />
        <span style={tb.liveLabel}>Live</span>
      </div>
    </header>
  );
}

const tb = {
  bar: {
    height: "56px",
    borderBottom: "1px solid #f3f4f6",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 28px",
    background: "#ffffff",
    position: "sticky",
    top: 0,
    zIndex: 10,
    flexShrink: 0,
  },
  title: { fontSize: "15px", fontWeight: 600, color: "#111827" },
  right: { display: "flex", alignItems: "center", gap: "6px" },
  dot: {
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    background: "#22c55e",
  },
  liveLabel: { fontSize: "12px", color: "#6b7280", fontWeight: 500 },
};
