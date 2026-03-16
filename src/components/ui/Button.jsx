const Button = ({
  title,
  onClick,
  primary = false,
  icon: Icon,
  disabled = false,
  style = {},
  type = "button"
}) => {
  const baseStyle = primary ? styles.primaryBtn : styles.ghostBtn;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        ...baseStyle,
        opacity: disabled ? 0.5 : 1,
        ...styles.btnLayout,
        ...style,
      }}
    >
      {Icon && <Icon size={16} />}
      {title}
    </button>
  );
};

export default Button;

const styles = {
  btnLayout: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },

  primaryBtn: {
    background: "#1d4ed8",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    padding: "11px 24px",
    fontSize: "14px",
    fontWeight: "600",
    fontFamily: "'Inter', sans-serif",
    cursor: "pointer",
    transition: "background 0.15s",
    letterSpacing: "0.01em",
  },

  ghostBtn: {
    background: "none",
    color: "#6b7280",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    padding: "11px 20px",
    fontSize: "14px",
    fontWeight: "500",
    fontFamily: "'Inter', sans-serif",
    cursor: "pointer",
  },
};
