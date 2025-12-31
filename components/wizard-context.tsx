import { createContext, useContext, useState } from "react";
import {
  AttendeesValues,
  Feature,
  FeatureName,
  SetupValues,
} from "@/types/event-wizard-common";

const defaultSetupValues: SetupValues = {
  name: "",
  slug: "",
  image: null,
  features: [],
};

export const defaultAttendeesValues: AttendeesValues = {
  arr: [{ name: "", email: "" }],
};

type WizardData = {
  setup: SetupValues;
  attendees: AttendeesValues;
};

const FORM_IDS = {
  Setup: "wizard-setup",
  Attendees: "wizard-attendees",
  Questions: "wizard-questions",
  Agenda: "wizard-agenda",
  Documents: "wizard-documents",
  Zoom: "wizard-zoom",
  Review: "wizard-review",
} as const;

type WizardContextValue = {
  step: {
    data:
      | Feature
      | { readonly name: "Setup"; readonly enabled: true }
      | { readonly name: "Review"; readonly enabled: true };
    idx: number;
    formId: string;
  };

  totalSteps: number;
  toggleFeature: (name: FeatureName) => void;
  next: () => void;
  prev: () => void;

  data: WizardData;
  setSetupValues: (v: SetupValues) => void;
  setAttendeesValues: (v: AttendeesValues) => void;
};

const WizardContext = createContext<WizardContextValue | null>(null);

export function WizardProvider({ children }: { children: React.ReactNode }) {
  const SETUP = { name: "Setup", enabled: true } as const;
  const REVIEW = { name: "Review", enabled: true } as const;

  const [data, setData] = useState<WizardData>({
    setup: defaultSetupValues,
    attendees: defaultAttendeesValues,
  });

  const [features, setFeatures] = useState<Feature[]>([
    { name: "Attendees", enabled: false },
    { name: "Questions", enabled: false },
    { name: "Agenda", enabled: false },
    { name: "Documents", enabled: false },
    { name: "Zoom", enabled: false },
  ]);

  const steps = [SETUP, ...features, REVIEW];
  const enabledSteps = steps.filter((step) => step.enabled);

  const [stepIdx, setStepIdx] = useState(0);
  const currentStep = enabledSteps[stepIdx];

  const value: WizardContextValue = {
    step: {
      data: currentStep,
      idx: stepIdx,
      formId: FORM_IDS[currentStep.name],
    },
    toggleFeature(name: FeatureName) {
      setFeatures((current) =>
        current.map((step) =>
          step.name === name ? { ...step, enabled: !step.enabled } : step,
        ),
      );
    },
    next() {
      if (stepIdx < enabledSteps.length - 1) {
        setStepIdx((s) => s + 1);
      }
    },
    prev() {
      if (stepIdx > 0) {
        setStepIdx((s) => s - 1);
      }
    },
    data: data,
    setSetupValues(v: SetupValues) {
      setData((current) => ({ ...current, setup: v }));
    },
    setAttendeesValues(v: AttendeesValues) {
      setData((current) => ({ ...current, attendees: v }));
    },
    totalSteps: enabledSteps.length,
  };

  return <WizardContext value={value}>{children}</WizardContext>;
}

export function useWizard() {
  const ctx = useContext(WizardContext);
  if (!ctx) {
    throw new Error("useWizard must be used inside WizardProvider");
  }
  return ctx;
}
