import React, { useState } from "react";
import { Plus, Sparkles } from "lucide-react";
import AddItemButton from "../ui/AddItemButton";

export default function UpsellDialog({
  open,
  upsellFor,
  items = [],
  onAdd,
  onDismiss,
  orders = [],
}) {
  const [addedItems, setAddedItems] = useState(new Set());

  if (!open || !items || items.length === 0) return null;

  // compute set of item ids already in cart to hide them from recommendations
  const inCartSet = new Set((orders || []).map((o) => o._id || o.id || o.name));

  const visibleItems = items.filter((item) => {
    const itemId = item._id || item.id || item.name;
    return !inCartSet.has(itemId) && !addedItems.has(itemId);
  });

  if (visibleItems.length === 0) return null;

  const title = `Great choice adding ${upsellFor ? upsellFor.name : "that"}! 😋 Customers often pair it with:`;

  const handleAdd = (rec) => {
    const itemId = rec._id || rec.id || rec.name;
    setAddedItems((prev) => new Set(prev).add(itemId));
    onAdd(rec);
  };

  return (
    <div style={overlayStyles.backdrop} onClick={onDismiss}>
      <div style={overlayStyles.panel} onClick={(e) => e.stopPropagation()}>
        <div style={overlayStyles.header}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Sparkles size={16} color="#6366f1" />
            <div style={overlayStyles.title}>Make it a combo?</div>
          </div>
          <div style={overlayStyles.desc}>{title}</div>
        </div>

        <div style={overlayStyles.list}>
          {visibleItems.map((item) => {
            const itemId = item._id || item.id || item.name;
            const isAdded = addedItems.has(itemId);

            return (
              <div
                key={itemId}
                style={{
                  ...overlayStyles.item,
                  ...(isAdded ? overlayStyles.addedItem : {}),
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={overlayStyles.itemTop}>
                    <div style={overlayStyles.badge}>Recommended</div>
                    <div style={overlayStyles.itemPrice}>+₹{item.price}</div>
                  </div>

                  <div style={overlayStyles.cardTitleRow}>
                    <span style={overlayStyles.vegBadge}>
                      {item.vegType === "veg" ? "🌱" : "🍗"}
                    </span>
                    <div style={overlayStyles.itemName}>{item.name}</div>
                  </div>

                  {item.description && (
                    <div style={overlayStyles.itemDesc}>{item.description}</div>
                  )}
                </div>

                <div style={overlayStyles.cardAction}>
                  <AddItemButton
                    isAdded={isAdded}
                    onClick={() => handleAdd(item)}
                    disabled={isAdded}
                    size="sm"
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div style={overlayStyles.footer}>
          <button onClick={onDismiss} style={overlayStyles.ghostBtn}>
            No thanks
          </button>
        </div>
      </div>
    </div>
  );
}

const overlayStyles = {
  backdrop: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.35)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    padding: 20,
  },
  panel: {
    width: "100%",
    maxWidth: 420,
    background: "#fff",
    borderRadius: 12,
    padding: 16,
    boxSizing: "border-box",
    boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
  },
  header: {
    marginBottom: 8,
  },
  title: {
    fontSize: "1.5rem",
    fontWeight: 700,
    color: "#111827",
  },
  desc: {
    fontSize: "1.25rem",
    color: "#6b7280",
    marginTop: 6,
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    marginTop: 8,
    maxHeight: 320,
    overflowY: "auto",
    paddingRight: 6,
  },
  item: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: 10,
    borderRadius: 12,
    background: "linear-gradient(180deg, #FBFDFF 0%, #F8FAFF 100%)",
    border: "1px solid #E6EEF9",
    boxSizing: "border-box",
  },
  addedItem: { opacity: 0.8 },
  itemTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
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
  itemPrice: {
    fontSize: "1.25rem",
    color: "#374151",
    fontWeight: 700,
  },
  cardTitleRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginTop: 6,
  },
  vegBadge: {
    fontSize: "1.25rem",
    lineHeight: 1,
    flexShrink: 0,
    display: "inline-flex",
    alignItems: "center",
  },
  itemName: {
    fontWeight: 700,
    color: "#111827",
    fontSize: "1.25rem",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  itemDesc: {
    fontSize: "1rem",
    color: "#6b7280",
    marginTop: 6,
  },
  cardAction: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 8,
    paddingRight: 8,
    flexShrink: 0,
  },
  footer: {
    marginTop: 12,
    display: "flex",
    justifyContent: "flex-end",
  },
  ghostBtn: {
    border: "1px solid #e5e7eb",
    background: "#fff",
    padding: "8px 12px",
    borderRadius: 8,
    cursor: "pointer",
  },
};
