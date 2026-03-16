import { useState } from "react";

import Stepper from "../components/onboarding-restaurant/Stepper";
import StepRestaurant from "../components/onboarding-restaurant/StepRestaurant";
import StepCategories from "../components/onboarding-restaurant/StepCategories";
import StepMenuItems from "../components/onboarding-restaurant/StepMenuItems";

export default function OnboardingFlow() {
  const [step, setStep] = useState(2);
  const [done, setDone] = useState(false);
  const [collectedData, setCollectedData] = useState({});

  const handleNext = (data) => {
    setCollectedData((prev) => ({ ...prev, ...data }));
    setStep((s) => s + 1);
  };

  const handleBack = () => setStep((s) => s - 1);

  const resetFlow = () => {
    setDone(false);
    setStep(1);
    setCollectedData({});
  };

  if (done) {
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

          <button
            style={{
              ...styles.primaryBtn,
              marginTop: "32px",
              width: "auto",
              padding: "11px 28px",
            }}
            onClick={resetFlow}
          >
            Onboard another restaurant
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.pageHeader}>
          <span style={styles.pagePill}>Admin</span>

          <h1 style={styles.pageTitle}>New Restaurant</h1>

          <p style={styles.pageSubtitle}>
            Complete all three steps to onboard a restaurant.
          </p>
        </div>

        <Stepper current={step} />

        <div style={styles.divider} />

        {step === 1 && <StepRestaurant onNext={handleNext} />}

        {step === 2 && (
          <StepCategories onNext={handleNext} onBack={handleBack} />
        )}

        {step === 3 && (
          <StepMenuItems onBack={handleBack} onFinish={() => setDone(true)} />
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f9fafb",
    display: "flex",
    justifyContent: "center",
    padding: "16px",
  },

  container: {
    background: "#ffffff",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    padding: "40px 44px",
    width: "100%",
    height: "fit-content",
  },

  pageHeader: {
    marginBottom: "28px",
  },

  pagePill: {
    display: "inline-block",
    background: "#eff6ff",
    color: "#2563eb",
    border: "1px solid #bfdbfe",
    borderRadius: "100px",
    padding: "3px 10px",
    fontSize: "11px",
    fontWeight: "600",
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    marginBottom: "12px",
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

  divider: {
    height: "1px",
    background: "#f3f4f6",
    margin: "24px 0",
  },

  primaryBtn: {
    background: "#1d4ed8",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    padding: "11px 24px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    letterSpacing: "0.01em",
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
};
