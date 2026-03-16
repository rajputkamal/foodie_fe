import { useState } from "react";

import Stepper from "../components/onboarding-restaurant/Stepper";
import StepRestaurant from "../components/onboarding-restaurant/StepRestaurant";
import StepCategories from "../components/onboarding-restaurant/StepCategories";
import StepMenuItems from "../components/onboarding-restaurant/StepMenuItems";
import OnboardSuccess from "../components/onboarding-restaurant/OnboardSuccess";

export default function OnboardingFlow() {
  const [step, setStep] = useState(1);
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
      <OnboardSuccess collectedData={collectedData} resetFlow={resetFlow} />
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

        {collectedData && step === 2 && (
          <StepCategories
            restaurantId={collectedData?.restaurantId}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}

        {collectedData && step === 3 && (
          <StepMenuItems
            restaurantId={collectedData?.restaurantId}
            restaurantName={collectedData?.restaurantName}
            onBack={handleBack}
            onFinish={() => setDone(true)}
          />
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
};
