import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  AgendaValues,
  AttendeesValues,
  Feature,
  FeatureName,
  QuestionsValues,
  SetupValues,
  ZoomValues,
} from "@/types/event-wizard-common";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

type WizardData = {
  setup: SetupValues;
  attendees: AttendeesValues;
  questions: QuestionsValues;
  agenda: AgendaValues;
  documents: DocumentItem[];
  zoom: ZoomValues;
};

const FORM_IDS = {
  Setup: "wizard-setup",
  Attendees: "wizard-attendees",
  Questions: "wizard-questions",
  Agenda: "wizard-agenda",
  Documents: "wizard-documents",
  Zoom: "wizard-zoom",
} as const;

type WizardContextValue = {
  step: {
    data: Feature | { readonly name: "Setup"; readonly enabled: true };
    idx: number;
    formId: (typeof FORM_IDS)[FeatureName | "Setup"];
  };

  totalSteps: number;
  data: WizardData;

  toggleFeature: (name: FeatureName) => void;
  next: () => void;
  prev: () => void;

  setSetupValues: (v: SetupValues) => void;
  setAttendeesValues: (v: AttendeesValues) => void;
  setQuestionsValues: (v: QuestionsValues) => void;
  setAgendaValues: (v: AgendaValues) => void;
  setDocuments: (v: DocumentItem[]) => void;
  setZoomValues: (v: ZoomValues) => void;

  wizardOpen: boolean;
  setWizardOpen: Dispatch<SetStateAction<boolean>>;
};

const WizardContext = createContext<WizardContextValue | null>(null);

// Default event values {
const defaultSetupValues: SetupValues = {
  name: "",
  slug: "",
  image: undefined,
  features: [],
};

const defaultAttendeesValues: AttendeesValues = {
  attendees: [{ name: "", email: "" }],
};

const defaultQuestionsValues: QuestionsValues = {
  questions: [
    {
      name: "",
      image: null,
      options: [
        { name: "Yes", image: null },
        { name: "No", image: null },
      ],
    },
  ],
};

const defaultAgendaValues: AgendaValues = {
  agendaDates: [
    {
      date: new Date(),
      items: [
        {
          title: "",
          description: "",
          startTime: "",
          endTime: "",
        },
      ],
    },
  ],
};

const defaultDocumentsValues: DocumentItem[] = [
  {
    id: "root",
    name: "/",
    type: "folder",
    children: [],
  },
];

const defaultZoomValues: ZoomValues = {
  meetingId: "",
  meetingPassword: "",
  url: "",
};
// }

export function WizardProvider({ children }: { children: React.ReactNode }) {
  const [wizardOpen, setWizardOpen] = useState(false);

  const [data, setData] = useState<WizardData>({
    setup: defaultSetupValues,
    attendees: defaultAttendeesValues,
    questions: defaultQuestionsValues,
    agenda: defaultAgendaValues,
    documents: defaultDocumentsValues,
    zoom: defaultZoomValues,
  });

  const SETUP = { name: "Setup", enabled: true } as const;
  const [features, setFeatures] = useState<Feature[]>([
    { name: "Attendees", enabled: false },
    { name: "Questions", enabled: false },
    { name: "Agenda", enabled: false },
    { name: "Documents", enabled: false },
    { name: "Zoom", enabled: false },
  ]);

  const steps = [SETUP, ...features];

  const [stepIdx, setStepIdx] = useState(0);

  const enabledSteps = steps.filter((step) => step.enabled);
  const currentStep = enabledSteps[stepIdx];

  const createEvent = useMutation(api.events.createEvent);
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);

  const dataRef = useRef(data);

  useEffect(() => {
    dataRef.current = data;
    console.log("DATA CHANGED");
  }, [data]);

  async function generateFile(file: File) {
    const postUrl = await generateUploadUrl();
    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": file.type },
      body: file,
    });
    const { storageId } = await result.json();
    return storageId;
  }

  function resetWizard() {
    setData({
      setup: defaultSetupValues,
      attendees: defaultAttendeesValues,
      questions: defaultQuestionsValues,
      agenda: defaultAgendaValues,
      documents: defaultDocumentsValues,
      zoom: defaultZoomValues,
    });
    setFeatures([
      { name: "Attendees", enabled: false },
      { name: "Questions", enabled: false },
      { name: "Agenda", enabled: false },
      { name: "Documents", enabled: false },
      { name: "Zoom", enabled: false },
    ]);
    setStepIdx(0);
    setWizardOpen(false);
  }

  async function onFinished() {
    const finalData = dataRef.current;

    console.log("Event creation finished. Adding to DB");
    console.log(JSON.stringify(finalData, null, 2));

    const imageStorageId = finalData.setup.image
      ? await generateFile(finalData.setup.image)
      : undefined;

    const newEventId = await createEvent({
      name: finalData.setup.name,
      slug: finalData.setup.slug,
      imageStorageId: imageStorageId,
      enabledFeatures: Object.fromEntries(
        features.map((feature) => [
          feature.name.toLowerCase(),
          feature.enabled,
        ]),
      ),
    });

    resetWizard();
  }

  const value: WizardContextValue = {
    step: {
      data: currentStep,
      idx: stepIdx,
      formId: FORM_IDS[currentStep.name],
    },
    totalSteps: enabledSteps.length,
    data: data,

    wizardOpen: wizardOpen,
    setWizardOpen: setWizardOpen,

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
      } else {
        onFinished();
      }
    },
    prev() {
      if (stepIdx > 0) {
        setStepIdx((s) => s - 1);
      }
    },
    setSetupValues(v) {
      setData((current) => ({ ...current, setup: v }));
    },
    setAttendeesValues(v) {
      setData((current) => ({ ...current, attendees: v }));
    },
    setQuestionsValues(v) {
      setData((current) => ({ ...current, questions: v }));
    },
    setAgendaValues(v) {
      setData((current) => ({ ...current, agenda: v }));
    },
    setDocuments(v) {
      setData((current) => ({ ...current, documents: v }));
    },
    setZoomValues(v) {
      setData((current) => ({ ...current, zoom: v }));
    },
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
