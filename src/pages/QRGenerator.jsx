import { useState, useEffect } from "react";
import QRCode from "react-qr-code";

import { getAllRestaurants } from "../api/restaurantApi";

export default function QRGenerator() {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState("");
  const [tableNo, setTableNo] = useState("");
  const [qrValue, setQrValue] = useState("");

  const fetchRestaurants = async () => {
    try {
      const res = await getAllRestaurants();
      setRestaurants(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchRestaurants();
  }, []);

  const handleGenerate = () => {
    if (!selectedRestaurant || !tableNo) return;

    const value = `${selectedRestaurant}|table-${tableNo}`;
    setQrValue(value);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={styles.container}>
      <h2>Generate Table QR</h2>

      {/* Restaurant Dropdown */}
      <select
        value={selectedRestaurant}
        onChange={(e) => setSelectedRestaurant(e.target.value)}
        style={styles.select}
      >
        <option value="">Select Restaurant</option>
        {restaurants.map((r) => (
          <option key={r._id} value={r.name}>
            {r.name}
          </option>
        ))}
      </select>

      {/* Table Input */}
      <input
        type="number"
        placeholder="Enter Table No"
        value={tableNo}
        onChange={(e) => setTableNo(e.target.value)}
        style={styles.input}
      />

      <button onClick={handleGenerate} style={styles.button}>
        Generate QR
      </button>

      {/* QR Preview */}
      {qrValue && (
        <div style={styles.qrCard}>
          <h3>{selectedRestaurant}</h3>
          <p>Table No: {tableNo}</p>

          <QRCode value={qrValue} size={180} />

          <div style={styles.footer}>
            <img
              src="/logo.png"
              alt="logo"
              style={{ width: 40, marginBottom: 6 }}
            />
            <p style={{ fontSize: 12 }}>Powered by Foodie AI</p>
          </div>

          <button onClick={handlePrint} style={styles.printBtn}>
            Print
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: 20,
    maxWidth: 400,
    margin: "auto",
    display: "flex",
    flexDirection: "column",
    gap: 12,
    color: "black"
  },
  select: {
    padding: 10,
    borderRadius: 6,
    border: "1px solid #ccc",
  },
  input: {
    padding: 10,
    borderRadius: 6,
    border: "1px solid #ccc",
  },
  button: {
    padding: 12,
    background: "#111",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
  qrCard: {
    marginTop: 20,
    padding: 20,
    border: "1px solid #ddd",
    borderRadius: 10,
    textAlign: "center",
  },
  footer: {
    marginTop: 10,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  printBtn: {
    marginTop: 12,
    padding: 10,
    background: "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
};
