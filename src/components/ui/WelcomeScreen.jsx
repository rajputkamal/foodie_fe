import React from "react";
import { Coffee } from "lucide-react";

export default function WelcomeScreen({ cafeName = "Bloom Coffee" }) {
  return (
    <div style={styles.container}>
      <style>{`
        @keyframes float { 0%,100%{ transform: translateY(0px) rotate(-3deg);} 50%{ transform: translateY(-6px) rotate(3deg);} }
        @keyframes steam { 0%{ transform: translateY(0) scale(1); opacity:0 } 50%{ opacity:1 } 100%{ transform: translateY(-12px) scale(0.5); opacity:0 } }
        @keyframes ping { 0% { transform: scale(1); opacity: .6 } 70% { transform: scale(1.6); opacity: 0 } 100% { opacity: 0 } }
        @keyframes pulse { 0% { transform: scale(1); opacity: .85 } 50% { transform: scale(0.98); opacity: .95 } 100% { transform: scale(1); opacity:.85 } }
      `}</style>

      <div style={styles.logoWrapper}>
        <span style={styles.ringPulse} />
        <span style={styles.ringPing} />

        <div style={styles.logoCircle}>
          <Coffee style={styles.coffeeIcon} />
        </div>

        <div style={styles.steamRow}>
          <span style={{ ...styles.steamDot, animationDelay: "0s" }} />
          <span style={{ ...styles.steamDot, animationDelay: "0.4s" }} />
          <span style={{ ...styles.steamDot, animationDelay: "0.8s" }} />
        </div>
      </div>

      <h2 style={styles.title}>Welcome to {cafeName}</h2>
      <p style={styles.subtitle}>
        Ready to order? Browse the menu, add items to your cart, or ask for a
        recommendation.
      </p>
      <p style={styles.help}>
        Tap a category or type what you'd like — I'll add items to your order
        for you ✨
      </p>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: "1.5rem",
    pointerEvents: "auto",
  },

  logoWrapper: {
    position: "relative",
    width: 80,
    height: 80,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  ringPing: {
    position: "absolute",
    inset: 0,
    borderRadius: 999,
    background: "rgba(79,70,229,0.12)",
    animation: "ping 1.8s cubic-bezier(.4,0,.2,1) infinite",
  },

  ringPulse: {
    position: "absolute",
    inset: 0,
    borderRadius: 999,
    background: "rgba(79,70,229,0.08)",
    animation: "pulse 3s ease-in-out infinite",
  },

  logoCircle: {
    width: 60,
    height: 60,
    borderRadius: 999,
    background: "linear-gradient(135deg,#4f46e5,#2563eb)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 10px 30px rgba(37,99,235,0.14)",
    transformOrigin: "center center",
    animation: "float 3s ease-in-out infinite",
  },

  coffeeIcon: {
    width: 36,
    height: 36,
    color: "#ffffff",
  },

  steamRow: {
    position: "absolute",
    top: -12,
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    gap: 6,
  },

  steamDot: {
    width: 6,
    height: 6,
    borderRadius: 999,
    background: "rgba(99,102,241,0.5)",
    animation: "steam 2s ease-in-out infinite",
  },

  title: {
    fontFamily: "serif",
    fontSize: 16,
    fontWeight: 500,
    color: "#111827",
    margin: 6,
  },

  subtitle: {
    color: "#6b7280",
    fontSize: 12,
    margin: 0,
    lineHeight: 1.3,
  },

  help: {
    color: "rgba(107,114,128,0.8)",
    fontSize: 10,
    marginTop: 6,
  },
};
