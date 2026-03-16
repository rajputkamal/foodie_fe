const Field = ({ name, label, type = "text", placeholder, textarea, formik }) => {
  const hasError = formik.touched[name] && formik.errors[name];

  return (
    <div style={s.fieldGroup}>
      <label style={s.label} htmlFor={name}>{label}</label>
      {textarea ? (
        <textarea
          id={name}
          name={name}
          value={formik.values[name]}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder={placeholder}
          rows={3}
          style={{
            ...s.input,
            resize: "vertical",
            minHeight: "88px",
            ...(hasError ? s.inputError : {}),
          }}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={formik.values[name]}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder={placeholder}
          style={{
            ...s.input,
            ...(hasError ? s.inputError : {}),
          }}
        />
      )}
      {/* Always in DOM — visibility controls show/hide without layout shift */}
      <span style={{ ...s.errorText, visibility: hasError ? "visible" : "hidden" }}>
        {formik.errors[name] || " "}
      </span>
    </div>
  );
};

export default Field;

const s = {
  fieldGroup: { marginBottom: "18px" },
  label: {
    display: "block",
    fontSize: "13px",
    fontWeight: "500",
    color: "#374151",
    marginBottom: "6px",
  },
  input: {
    width: "100%",
    background: "#ffffff",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    padding: "10px 14px",
    color: "#111827",
    fontSize: "14px",
    fontFamily: "'Inter', sans-serif",
    transition: "border-color 0.15s, box-shadow 0.15s",
  },
  inputError: {
    borderColor: "#ef4444",
    boxShadow: "0 0 0 3px rgba(239,68,68,0.08)",
  },
  errorText: { color: "#ef4444", fontSize: "12px", marginTop: "5px",  display: "block",      // ← this is the missing piece
  minHeight: "16px",},
  row: { display: "flex", gap: "16px" },
  vegRow: { display: "flex", gap: "10px" },
  vegBtn: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    padding: "9px 18px",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    background: "#ffffff",
    color: "#374151",
    fontSize: "13px",
    fontWeight: "500",
    cursor: "pointer",
    fontFamily: "'Inter', sans-serif",
    transition: "all 0.15s",
  },
};
