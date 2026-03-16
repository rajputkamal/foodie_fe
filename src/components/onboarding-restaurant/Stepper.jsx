import { STEPS } from "../../constants";

const Stepper = ({ current }) => {
  return (
    <div style={styles.stepperWrap}>
      {STEPS.map((step, i) => {
        const done = current > step.number;
        const active = current === step.number;

        return (
          <div key={step.number} style={styles.stepBlock}>
            <div style={styles.stepItem}>
              <div
                style={{
                  ...styles.stepCircle,
                  background: done ? "#2563eb" : active ? "#eff6ff" : "#f3f4f6",
                  border: done || active
                    ? "2px solid #2563eb"
                    : "2px solid #e5e7eb",
                  color: done ? "#fff" : active ? "#2563eb" : "#9ca3af",
                }}
              >
                {done ? "✓" : step.number}
              </div>

              <span
                style={{
                  ...styles.stepLabel,
                  color: active ? "#1d4ed8" : done ? "#374151" : "#9ca3af",
                  fontWeight: active ? "600" : "400",
                }}
              >
                {step.label}
              </span>
            </div>

            {/* connector */}
            {i !== STEPS.length - 1 && (
              <div
                style={{
                  ...styles.connector,
                  background: current > step.number ? "#2563eb" : "#e5e7eb",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Stepper;

const styles = {
  stepperWrap: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    marginBottom: "8px",
  },

  stepBlock: {
    display: "flex",
    alignItems: "center",
    flex: 1,
  },

  stepItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "6px",
    minWidth: "120px",
  },

  connector: {
    height: "2px",
    flex: 1,
    margin: "0 12px",
    background: "#e5e7eb",
    transition: "background 0.3s",
  },

  stepCircle: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "13px",
    fontWeight: "600",
  },

  stepLabel: {
    fontSize: "12px",
    whiteSpace: "nowrap",
  },
};
