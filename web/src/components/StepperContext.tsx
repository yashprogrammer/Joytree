"use client";
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { STEPS, type Step } from "@/lib/steps";

type StepperContextValue = {
  currentStep: Step;
  canGoNext: boolean;
  canGoPrev: boolean;
  goNext: () => void;
  goPrev: () => void;
  // guards state
  formValid: boolean;
  setFormValid: (v: boolean) => void;
  videoWatched: boolean;
  setVideoWatched: (v: boolean) => void;
  selectedGiftId: string | null;
  setSelectedGiftId: (id: string | null) => void;
  selectedGiftType: "physical" | "digital" | null;
  setSelectedGiftType: (t: "physical" | "digital" | null) => void;
  addressProvided: boolean;
  setAddressProvided: (v: boolean) => void;
  orderPlaced: boolean;
  setOrderPlaced: (v: boolean) => void;
};

const StepperContext = createContext<StepperContextValue | null>(null);

export function useStepper() {
  const ctx = useContext(StepperContext);
  if (!ctx) throw new Error("useStepper must be used within StepperProvider");
  return ctx;
}

export function StepperProvider({ children }: { children: React.ReactNode }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formValid, setFormValid] = useState(false);
  const [videoWatched, setVideoWatched] = useState(false);
  const [selectedGiftId, setSelectedGiftId] = useState<string | null>(null);
  const [selectedGiftType, setSelectedGiftType] = useState<"physical" | "digital" | null>(null);
  const [addressProvided, setAddressProvided] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const currentStep = STEPS[currentStepIndex];

  const canAdvance = useMemo(() => {
    switch (currentStep) {
      case "AUTH":
        return true; // after OTP & email in real flow
      case "FORM":
        return formValid;
      case "VIDEO":
        return videoWatched;
      case "GIFTS":
        if (!selectedGiftId) return false;
        if (selectedGiftType === "physical") return addressProvided;
        return true;
      case "CONFIRM":
        return true;
      case "PLACE":
        return !orderPlaced;
      case "SUMMARY":
        return false;
      default:
        return false;
    }
  }, [currentStep, formValid, videoWatched, selectedGiftId, selectedGiftType, addressProvided, orderPlaced]);

  const goNext = useCallback(() => {
    if (!canAdvance) return;
    setCurrentStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
  }, [canAdvance]);

  const goPrev = useCallback(() => {
    setCurrentStepIndex((i) => Math.max(i - 1, 0));
  }, []);

  const value: StepperContextValue = {
    currentStep,
    canGoNext: canAdvance,
    canGoPrev: currentStepIndex > 0,
    goNext,
    goPrev,
    formValid,
    setFormValid,
    videoWatched,
    setVideoWatched,
    selectedGiftId,
    setSelectedGiftId,
    selectedGiftType,
    setSelectedGiftType,
    addressProvided,
    setAddressProvided,
    orderPlaced,
    setOrderPlaced,
  };

  return <StepperContext.Provider value={value}>{children}</StepperContext.Provider>;
}


