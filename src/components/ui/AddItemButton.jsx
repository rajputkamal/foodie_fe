import React from "react";
import { Plus, Check } from "lucide-react";

export default function AddItemButton({ isAdded = false, onClick, disabled = false, size = "md" }) {
  const sizeConfig = {
    sm: { width: 28, height: 28, iconSize: 16 },
    md: { width: 36, height: 36, iconSize: 18 },
    lg: { width: 42, height: 42, iconSize: 20 },
  };

  const config = sizeConfig[size] || sizeConfig.md;

  return (
    <button
      onClick={onClick}
      disabled={disabled || isAdded}
      style={{
        width: config.width,
        height: config.height,
        minWidth: config.width,
        borderRadius: "50%",
        border: "none",
        background: isAdded
          ? "#16A34A"
          : "linear-gradient(135deg, rgb(37, 99, 235) 0%, rgb(79, 70, 229) 100%)",
        color: "#fff",
        cursor: disabled || isAdded ? "not-allowed" : "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "transform 0.15s ease, box-shadow 0.15s ease",
        boxShadow:
          isAdded
            ? "0 2px 4px rgba(22, 163, 74, 0.2)"
            : "0 2px 4px rgba(79, 70, 229, 0.15)",
        opacity: disabled || isAdded ? 0.7 : 1,
        WebkitTapHighlightColor: "transparent",
        outline: "none",
      }}
      onTouchStart={(e) => {
        if (!disabled && !isAdded) {
          e.target.style.transform = "scale(0.92)";
          e.target.style.boxShadow =
            "0 4px 8px rgba(79, 70, 229, 0.3), inset 0 1px 2px rgba(0,0,0,0.1)";
        }
      }}
      onTouchEnd={(e) => {
        if (!disabled && !isAdded) {
          e.target.style.transform = "scale(1)";
          e.target.style.boxShadow = "0 2px 4px rgba(79, 70, 229, 0.15)";
        }
      }}
      onMouseDown={(e) => {
        if (!disabled && !isAdded) {
          e.target.style.transform = "scale(0.92)";
          e.target.style.boxShadow =
            "0 4px 8px rgba(79, 70, 229, 0.3), inset 0 1px 2px rgba(0,0,0,0.1)";
        }
      }}
      onMouseUp={(e) => {
        if (!disabled && !isAdded) {
          e.target.style.transform = "scale(1)";
          e.target.style.boxShadow = "0 2px 4px rgba(79, 70, 229, 0.15)";
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && !isAdded) {
          e.target.style.transform = "scale(1)";
          e.target.style.boxShadow = "0 2px 4px rgba(79, 70, 229, 0.15)";
        }
      }}
    >
      {isAdded ? (
        <Check size={config.iconSize} strokeWidth={3} style={{ animation: "popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)" }} />
      ) : (
        <Plus size={config.iconSize} strokeWidth={3} />
      )}
      <style>{`
        @keyframes popIn {
          0% { transform: scale(0.5); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </button>
  );
}
