import { useState, useEffect, useMemo } from "react";
import QRCode from "react-qr-code";
import { Store, QrCode, Printer, RotateCcw, Table2 } from "lucide-react";

import { getAllRestaurants } from "../api/restaurantApi";
import Button from "../components/ui/Button";

const short_url = "https://foodie-fe-puce.vercel.app/restaurant";

export default function QRGenerator() {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState("");
  const [tableNo, setTableNo] = useState("");
  const [qrValue, setQrValue] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const res = await getAllRestaurants();
      setRestaurants(res?.data || []);
    } catch (error) {
      console.error("Failed to fetch restaurants", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const selectedRestaurant = useMemo(() => {
    return restaurants.find((r) => r._id === selectedRestaurantId) || null;
  }, [restaurants, selectedRestaurantId]);

  const handleGenerate = () => {
    if (!selectedRestaurantId || !tableNo.trim()) return;

    const value = `${short_url}/${selectedRestaurantId}/${tableNo.trim()}`;
    setQrValue(value);
  };

  const handleReset = () => {
    setSelectedRestaurantId("");
    setTableNo("");
    setQrValue("");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={styles.page}>
      <div style={styles.wrapper}>
        {/* Left Form Card */}
        <div style={styles.formCard}>
          <div style={styles.headerRow}>
            <div style={styles.iconWrap}>
              <QrCode size={24} />
            </div>
            <div>
              <h2 style={styles.heading}>Generate Table QR</h2>
              <p style={styles.subheading}>
                Create a QR code for restaurant tables so customers can scan and
                order instantly.
              </p>
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Restaurant</label>
            <div style={styles.inputWrap}>
              <Store size={18} style={styles.inputIcon} />
              <select
                value={selectedRestaurantId}
                onChange={(e) => setSelectedRestaurantId(e.target.value)}
                style={styles.select}
              >
                <option value="">
                  {loading ? "Loading restaurants..." : "Select Restaurant"}
                </option>
                {restaurants.map((r) => (
                  <option key={r._id} value={r._id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Table Number</label>
            <div style={styles.inputWrap}>
              <Table2 size={18} style={styles.inputIcon} />
              <input
                type="number"
                placeholder="Enter Table No"
                value={tableNo}
                onChange={(e) => setTableNo(e.target.value)}
                style={styles.input}
                min="1"
              />
            </div>
          </div>

          <div style={styles.buttonRow}>
            <Button
              primary
              title="  Generate QR"
              onClick={handleGenerate}
              Icon={QrCode}
            />

            <Button title="Reset" onClick={handleReset} Icon={QrCode} />
          </div>
        </div>

        {/* Right Preview Card */}
        <div style={styles.previewCard}>
          <h3 style={styles.previewHeading}>QR Preview</h3>

          {!qrValue ? (
            <div style={styles.emptyState}>
              <QrCode size={56} strokeWidth={1.5} />
              <p style={styles.emptyTitle}>No QR Generated Yet</p>
              <p style={styles.emptyText}>
                Select a restaurant and enter a table number to generate your QR
                code.
              </p>
            </div>
          ) : (
            <div style={styles.qrCard}>
              <div style={styles.restaurantBadge}>
                <Store size={14} />
                <span>{selectedRestaurant?.name || "Restaurant"}</span>
              </div>

              <h3 style={styles.restaurantName}>
                {selectedRestaurant?.name || "Restaurant"}
              </h3>

              <p style={styles.tableText}>Table No: {tableNo}</p>

              <div style={styles.qrBox}>
                <QRCode value={qrValue} size={190} />
              </div>

              <div style={styles.footer}>
                <img
                  src="/logo.png"
                  alt="Foodie AI"
                  style={styles.logo}
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
                <p style={styles.footerText}>Powered by Foodie AI</p>
              </div>

              <div style={styles.printButtonWrapper}>
                <Button primary title="  Print QR" onClick={handlePrint} />
              </div>

              <div style={styles.urlPreview}>
                <span style={styles.urlLabel}>QR URL:</span>
                <span style={styles.urlValue}>{qrValue}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)",
    padding: "32px 20px",
    fontFamily: "Inter, sans-serif",
  },

  wrapper: {
    maxWidth: 1100,
    margin: "0 auto",
    display: "grid",
    // gridTemplateColumns: "1fr 1fr",
    gap: 24,
  },

  formCard: {
    background: "#ffffff",
    borderRadius: 24,
    padding: 28,
    boxShadow: "0 12px 32px rgba(15, 23, 42, 0.08)",
    border: "1px solid rgba(226,232,240,0.8)",
    display: "flex",
    flexDirection: "column",
    gap: 22,
  },

  previewCard: {
    background: "#ffffff",
    borderRadius: 24,
    padding: 28,
    boxShadow: "0 12px 32px rgba(15, 23, 42, 0.08)",
    border: "1px solid rgba(226,232,240,0.8)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 580,
  },

  headerRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: 16,
  },

  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    background: "linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    flexShrink: 0,
    boxShadow: "0 10px 24px rgba(37,99,235,0.25)",
  },

  heading: {
    margin: 0,
    fontSize: "1.75rem",
    fontWeight: 700,
    color: "#0f172a",
  },

  subheading: {
    marginTop: 8,
    marginBottom: 0,
    fontSize: "0.98rem",
    color: "#64748b",
    lineHeight: 1.6,
  },

  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },

  label: {
    fontSize: "0.95rem",
    fontWeight: 600,
    color: "#334155",
  },

  inputWrap: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },

  inputIcon: {
    position: "absolute",
    left: 14,
    color: "#64748b",
    zIndex: 1,
  },

  select: {
    width: "100%",
    padding: "14px 14px 14px 44px",
    borderRadius: 14,
    border: "1px solid #dbe3ee",
    background: "#f8fafc",
    fontSize: "1rem",
    color: "#0f172a",
    outline: "none",
    appearance: "none",
    cursor: "pointer",
  },

  input: {
    width: "100%",
    padding: "14px 14px 14px 44px",
    borderRadius: 14,
    border: "1px solid #dbe3ee",
    background: "#f8fafc",
    fontSize: "1rem",
    color: "#0f172a",
    outline: "none",
  },

  buttonRow: {
    display: "flex",
    gap: 12,
    marginTop: 8,
    flexWrap: "wrap",
  },

  primaryBtn: {
    flex: 1,
    minWidth: 180,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: "14px 18px",
    borderRadius: 14,
    border: "none",
    background: "linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)",
    color: "#fff",
    fontSize: "1rem",
    fontWeight: 600,
    cursor: "pointer",
    boxShadow: "0 10px 20px rgba(37,99,235,0.2)",
  },

  secondaryBtn: {
    minWidth: 140,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: "14px 18px",
    borderRadius: 14,
    border: "1px solid #dbe3ee",
    background: "#fff",
    color: "#334155",
    fontSize: "1rem",
    fontWeight: 600,
    cursor: "pointer",
  },

  previewHeading: {
    marginTop: 0,
    marginBottom: 18,
    fontSize: "1.4rem",
    fontWeight: 700,
    color: "#0f172a",
  },

  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    color: "#94a3b8",
    padding: "24px",
  },

  emptyTitle: {
    marginTop: 16,
    marginBottom: 8,
    fontSize: "1.1rem",
    fontWeight: 600,
    color: "#475569",
  },

  emptyText: {
    margin: 0,
    maxWidth: 320,
    lineHeight: 1.6,
    fontSize: "0.95rem",
  },

  qrCard: {
    width: "100%",
    maxWidth: 360,
    padding: 28,
    borderRadius: 24,
    background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
    border: "1px solid #e2e8f0",
    textAlign: "center",
    boxShadow: "0 16px 32px rgba(15,23,42,0.08)",
  },

  restaurantBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "6px 12px",
    borderRadius: 999,
    background: "#eff6ff",
    color: "#2563eb",
    fontSize: "0.82rem",
    fontWeight: 600,
    marginBottom: 14,
  },

  restaurantName: {
    margin: 0,
    fontSize: "1.45rem",
    fontWeight: 700,
    color: "#0f172a",
  },

  tableText: {
    marginTop: 8,
    marginBottom: 20,
    color: "#64748b",
    fontSize: "1rem",
    fontWeight: 500,
  },

  qrBox: {
    background: "#fff",
    padding: 18,
    borderRadius: 20,
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
    border: "1px solid #e2e8f0",
    boxShadow: "inset 0 1px 2px rgba(15,23,42,0.04)",
  },

  footer: {
    marginTop: 20,
    marginBottom: 20,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  logo: {
    width: 44,
    height: 44,
    objectFit: "contain",
    marginBottom: 8,
  },

  footerText: {
    fontSize: "0.88rem",
    color: "#64748b",
    margin: 0,
  },

  printButtonWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  urlPreview: {
    marginTop: 16,
    padding: 12,
    borderRadius: 14,
    background: "#f8fafc",
    border: "1px dashed #cbd5e1",
    textAlign: "left",
    wordBreak: "break-word",
  },

  urlLabel: {
    display: "block",
    fontSize: "0.8rem",
    fontWeight: 700,
    color: "#64748b",
    marginBottom: 6,
  },

  urlValue: {
    fontSize: "0.85rem",
    color: "#0f172a",
    lineHeight: 1.5,
  },
};
