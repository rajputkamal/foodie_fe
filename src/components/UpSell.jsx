import React, { useState } from "react";
import AddItemButton from "./ui/AddItemButton";

export default function UpSell({ selectedItem, recommendations, onAdd, onDismiss }) {
  const [addedItems, setAddedItems] = useState(new Set());

  if (!recommendations || recommendations.length === 0) return null;

  const title = `Great choice adding ${selectedItem ? selectedItem.name : "that"}! 😋 Customers often pair it with:`;

  const handleAdd = (rec) => {
    const itemId = rec._id || rec.name;
    setAddedItems((prev) => new Set(prev).add(itemId));
    onAdd(rec);
  };

  return (
    <div style={styles.container}>
      <div style={styles.title}>{title}</div>

      <div style={styles.buttons}>
        {recommendations.map((rec, idx) => {
          const itemId = rec._id || rec.name;
          const isAdded = addedItems.has(itemId);

          return (
            <div key={idx} style={{ ...styles.card, ...(isAdded ? styles.addedCard : {}) }}>
              <div style={styles.cardLeftAccent} />

              <div style={styles.cardContent} onClick={() => !isAdded && handleAdd(rec)}>
                {rec.image ? (
                  <img src={rec.image} alt={rec.name} style={styles.cardImage} />
                ) : (
                  <div style={styles.cardImagePlaceholder}>{rec.name?.charAt(0) || "•"}</div>
                )}

                <div style={styles.cardInfo}>
                  <div style={styles.cardHeader}>
                    <div style={styles.badge}>Recommended</div>
                    <div style={styles.cardPrice}>+₹{rec.price}</div>
                  </div>

                  <div style={styles.cardTitleRow}>
                    <span style={styles.vegBadge}>{rec.vegType === "veg" ? "🌱" : "🍗"}</span>
                    <div style={styles.cardTitle}>{rec.name}</div>
                  </div>

                  {rec.description && <div style={styles.cardDesc}>{rec.description}</div>}
                </div>
              </div>

              <div style={styles.cardAction}>
                <AddItemButton isAdded={isAdded} onClick={() => handleAdd(rec)} disabled={isAdded} size="sm" />
              </div>
            </div>
          );
        })}

        <button style={styles.dismissBtn} onClick={onDismiss}>
          I'm Good 👍
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: "100%",
    boxSizing: "border-box",
    fontFamily: '"Inter", sans-serif',
  },

  title: {
    fontSize: "1.25rem",
    color: "#374151",
    marginBottom: "12px",
    lineHeight: 1.4,
    fontWeight: 600,
    wordBreak: "break-word",
  },

  buttons: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  card: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    width: "100%",
    background: "linear-gradient(180deg, #FBFDFF 0%, #F8FAFF 100%)",
    border: "1px solid #E6EEF9",
    borderRadius: 12,
    padding: "10px",
    boxSizing: "border-box",
    boxShadow: "0 4px 10px rgba(15, 23, 42, 0.04)",
    overflow: "hidden",
  },

  addedCard: {
    opacity: 0.8,
  },

  cardLeftAccent: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 6,
    background: "linear-gradient(180deg, rgb(79,70,229), rgb(99,102,241))",
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },

  cardContent: {
    display: "flex",
    alignItems: "flex-start",
    gap: 12,
    paddingLeft: 12,
    paddingRight: 12,
    flex: 1,
    cursor: "pointer",
  },

  cardImage: {
    width: 52,
    height: 52,
    borderRadius: 8,
    objectFit: "cover",
    flexShrink: 0,
  },

  cardImagePlaceholder: {
    width: 52,
    height: 52,
    borderRadius: 8,
    background: "#eef2ff",
    color: "#4f46e5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    flexShrink: 0,
  },

  cardInfo: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    flex: 1,
    minWidth: 0,
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },

  badge: {
    background: "rgba(79,70,229,0.08)",
    color: "rgb(79,70,229)",
    padding: "4px 8px",
    borderRadius: 999,
    fontSize: "0.75rem",
    fontWeight: 700,
  },

  cardPrice: {
    fontSize: "1rem",
    color: "#374151",
    fontWeight: 700,
    whiteSpace: "nowrap",
    flexShrink: 0,
  },

  cardTitleRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },

  vegBadge: {
    fontSize: "1rem",
    lineHeight: 1,
    flexShrink: 0,
    display: "inline-flex",
    alignItems: "center",
  },

  cardTitle: {
    fontSize: "1.05rem",
    fontWeight: 700,
    color: "#111827",
    lineHeight: 1.3,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    flex: 1,
  },

  cardDesc: {
    fontSize: "0.9rem",
    color: "#6b7280",
    lineHeight: 1.3,
    marginTop: 2,
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },

  cardAction: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 8,
    paddingRight: 8,
  },

  dismissBtn: {
    background: "#ffffff",
    border: "1.5px solid rgb(37, 99, 235)",
    color: "rgb(37, 99, 235)",
    padding: "12px 24px",
    borderRadius: "20px",
    fontSize: "1.1rem",
    fontWeight: 600,
    cursor: "pointer",
    width: "100%",
    marginTop: "12px",
    transition: "all 0.15s ease",
    WebkitTapHighlightColor: "transparent",
    outline: "none",
    userSelect: "none",
    boxShadow: "0 2px 4px rgba(37, 99, 235, 0.15)",
  },
};
