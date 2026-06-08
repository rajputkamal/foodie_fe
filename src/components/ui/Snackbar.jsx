import React, { useEffect } from "react";
import { Check } from "lucide-react";

export default function Snackbar({ message, isVisible, onClose, duration = 2000, type = "success" }) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const bgColor = type === "success" ? "#16A34A" : type === "error" ? "#DC2626" : "#3B82F6";
  
  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        background: bgColor,
        color: "white",
        padding: "12px 16px",
        borderRadius: "10px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        fontSize: "0.95rem",
        fontWeight: 600,
        fontFamily: "Inter, sans-serif",
        boxShadow: "0 6px 16px rgba(0, 0, 0, 0.2)",
        zIndex: 9999,
        animation: "slideIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
        maxWidth: "calc(100vw - 40px)",
        backdropFilter: "blur(8px)",
      }}
    >
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
      {type === "success" && (
        <div style={{
          background: "rgba(255, 255, 255, 0.3)",
          borderRadius: "50%",
          width: 24,
          height: 24,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}>
          <Check size={16} strokeWidth={3} />
        </div>
      )}
      <span style={{ flex: 1, lineHeight: 1.3 }}>{message}</span>
    </div>
  );
}
