import Button from "../ui/Button";

const OnboardSuccess = ({ collectedData, resetFlow }) => {
  return (
    <div style={styles.page}>
      <div
        style={{
          ...styles.container,
          textAlign: "center",
          padding: "72px 40px",
        }}
      >
        <div style={styles.successCheck}>✓</div>

        <h2 style={{ ...styles.pageTitle, marginBottom: "8px" }}>
          Restaurant is live!
        </h2>

        <p style={styles.pageSubtitle}>
          <strong>{collectedData.restaurant?.name}</strong> has been fully
          onboarded.
        </p>

        <Button
          primary
          title=" Onboard another restaurant"
          onClick={resetFlow}
        />
      </div>
    </div>
  );
};

export default OnboardSuccess;

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f9fafb",
    display: "flex",
    justifyContent: "center",
    padding: "16px",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "16px",
    background: "#ffffff",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    padding: "40px 44px",
    width: "100%",
    height: "fit-content",
  },
  successCheck: {
    width: "52px",
    height: "52px",
    background: "#dcfce7",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "22px",
    color: "#16a34a",
    fontWeight: "700",
    margin: "0 auto 20px",
  },
  pageTitle: {
    fontSize: "22px",
    fontWeight: "600",
    color: "#111827",
    marginBottom: "6px",
    letterSpacing: "-0.01em",
  },

  pageSubtitle: {
    fontSize: "14px",
    color: "#6b7280",
    lineHeight: "1.5",
  },
};
