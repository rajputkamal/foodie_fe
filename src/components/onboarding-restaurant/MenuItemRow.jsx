import { useState } from "react";

const MenuItemRow = ({ item, categories }) => {
  const [open, setOpen] = useState(false);
  const catName =
    categories.find((c) => c.id === item.categoryId)?.name ?? item.categoryId;
  const vegColor = item.vegType === "veg" ? "#16a34a" : "#dc2626";
  const vegLabel = item.vegType === "veg" ? "Veg" : "Non-Veg";

  return (
    <div style={styles.itemCard}>
      <button
        type="button"
        style={styles.itemCardHeader}
        onClick={() => setOpen((o) => !o)}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            flex: 1,
            minWidth: 0,
          }}
        >
          <span style={{ ...styles.vegDot, background: vegColor }} />
          <span
            style={{
              fontSize: "14px",
              fontWeight: 500,
              color: "#111827",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {item.name}
          </span>
          <span style={{ fontSize: "12px", color: "#9ca3af", flexShrink: 0 }}>
            {catName}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            flexShrink: 0,
          }}
        >
          <span style={styles.priceTag}>Rs.{item.price}</span>
          <span style={{ fontSize: "11px", color: vegColor, fontWeight: 600 }}>
            {vegLabel}
          </span>
          <span style={{ fontSize: "12px", color: "#9ca3af" }}>
            {open ? "▲" : "▼"}
          </span>
        </div>
      </button>
      {open && (
        <div style={styles.itemCardBody}>
          <div style={styles.itemDetailGrid}>
            <div style={styles.itemDetailCell}>
              <span style={styles.detailLabel}>Category</span>
              <span style={styles.detailValue}>{catName}</span>
            </div>
            <div style={styles.itemDetailCell}>
              <span style={styles.detailLabel}>Price</span>
              <span style={styles.detailValue}>Rs.{item.price}</span>
            </div>
            <div style={styles.itemDetailCell}>
              <span style={styles.detailLabel}>Type</span>
              <span style={{ ...styles.detailValue, color: vegColor }}>
                {vegLabel}
              </span>
            </div>
          </div>
          {item.description && (
            <div style={{ marginTop: "10px" }}>
              <span style={styles.detailLabel}>Description</span>
              <p
                style={{
                  fontSize: "13px",
                  color: "#374151",
                  marginTop: "4px",
                  lineHeight: "1.5",
                }}
              >
                {item.description}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MenuItemRow;

const styles = {
  itemCard: {
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    overflow: "hidden",
  },
  itemCardHeader: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 16px",
    background: "#fafafa",
    border: "none",
    cursor: "pointer",
    fontFamily: "'Inter', sans-serif",
    gap: "12px",
  },
  itemCardBody: {
    padding: "14px 16px",
    borderTop: "1px solid #f3f4f6",
    background: "#ffffff",
  },
  vegDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    flexShrink: 0,
  },
  priceTag: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#374151",
    background: "#f3f4f6",
    borderRadius: "6px",
    padding: "3px 8px",
  },
  itemDetailGrid: {
    display: "flex",
    gap: "24px",
  },
  itemDetailCell: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  detailLabel: {
    fontSize: "11px",
    color: "#9ca3af",
    fontWeight: 500,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },
  detailValue: {
    fontSize: "13px",
    color: "#374151",
    fontWeight: 500,
  },
};
