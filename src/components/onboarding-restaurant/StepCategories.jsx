import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import Button from "../ui/Button";
import { getAllCategories } from "../../api/categoryApi";
import { attachCategories } from "../../api/restaurantApi"

const StepCategories = ({ restaurantId, onNext, onBack }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState([]);
  const [attaching, setAttaching] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    const data = await getAllCategories();
    setCategories(data);
    setLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCategories();
  }, []);

  const toggle = (id) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const handleAttach = async () => {
    if (selected.length === 0) return;
    setAttaching(true);
    const result = await attachCategories(restaurantId, selected)
    console.log("result of categories", result)
    setAttaching(false);
    onNext({ categoryIds: selected });
  };

  return (
    <div>
      <p style={styles.sectionTitle}>Select Categories</p>
      <p style={styles.sectionHint}>
        Choose the categories that apply to this restaurant. You can always edit
        these later.
      </p>

      {loading ? (
        <div style={styles.loadingGrid}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} style={styles.skeleton} />
          ))}
        </div>
      ) : (
        <div style={styles.catGrid}>
          {categories.map((cat) => {
            const isSelected = selected.includes(cat._id);
            return (
              <button
                key={cat._id}
                type="button"
                onClick={() => toggle(cat._id)}
                style={{
                  ...styles.catCard,
                  ...(isSelected ? styles.catCardActive : {}),
                }}
              >
                <span style={styles.catIcon}>🍽️</span>
                <span style={styles.catName}>{cat.name}</span>
                {isSelected && <span style={styles.checkBadge}>✓</span>}
              </button>
            );
          })}
        </div>
      )}

      {selected.length > 0 && (
        <div style={styles.selectedBanner}>
          <span style={{ fontSize: "13px", color: "#1d4ed8", fontWeight: 500 }}>
            {selected.length} categor{selected.length === 1 ? "y" : "ies"}{" "}
            selected
          </span>
        </div>
      )}

      <div style={styles.footerRow}>
        <Button title="Back" icon={ArrowLeft} onClick={onBack} />

        <Button
          title={attaching ? "Attaching…" : "Attach Categories"}
          primary
          icon={ArrowRight}
          disabled={selected.length === 0 || attaching}
          onClick={handleAttach}
        />
      </div>
    </div>
  );
};

export default StepCategories;

const styles = {
  catGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
    gap: "10px",
    marginBottom: "16px",
  },
  selectedBanner: {
    background: "#eff6ff",
    border: "1px solid #bfdbfe",
    borderRadius: "8px",
    padding: "10px 14px",
    marginBottom: "4px",
  },
  footerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "32px",
    paddingTop: "20px",
    borderTop: "1px solid #f3f4f6",
  },

  sectionTitle: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#374151",
    marginBottom: "6px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  sectionHint: { fontSize: "12px", color: "#9ca3af", marginBottom: "16px" },
  loadingGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
    gap: "10px",
    marginBottom: "16px",
  },
  skeleton: {
    height: "80px",
    borderRadius: "10px",
    background: "linear-gradient(90deg, #f3f4f6 25%, #e9eaec 50%, #f3f4f6 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.4s infinite",
  },
  catCard: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    padding: "16px 10px",
    borderRadius: "10px",
    border: "1px solid #e5e7eb",
    background: "#ffffff",
    cursor: "pointer",
    fontFamily: "'Inter', sans-serif",
    transition: "all 0.15s",
  },
  catCardActive: {
    border: "1.5px solid #2563eb",
    background: "#eff6ff",
  },
  catIcon: { fontSize: "22px" },
  catName: {
    fontSize: "12px",
    fontWeight: "500",
    color: "#374151",
    textAlign: "center",
  },
  checkBadge: {
    position: "absolute",
    top: "6px",
    right: "8px",
    fontSize: "10px",
    color: "#2563eb",
    fontWeight: "700",
  },
};
