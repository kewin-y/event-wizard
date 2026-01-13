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
  featureNames,
  QuestionsValues,
  SetupValues,
  ZoomValues,
} from "@/types/event-wizard-common";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

type WizardData = {
  setup: SetupValues;
  attendees: AttendeesValues;
  questions: QuestionsValues;
  agenda: AgendaValues;
  documents: DocumentItem[];
  zoom: ZoomValues;
};

const FORM_IDS = {
  setup: "wizard-setup",
  attendees: "wizard-attendees",
  questions: "wizard-questions",
  agenda: "wizard-agenda",
  documents: "wizard-documents", // Don't even need this lol
  zoom: "wizard-zoom",
} as const;

type WizardContextValue = {
  step: {
    name: FeatureName | "setup";
    formId: (typeof FORM_IDS)[FeatureName | "setup"];
    idx: number;
  };

  totalSteps: number;
  data: WizardData;

  setSetupFeatures: (features: FeatureName[]) => void;
  next: (partial?: Partial<WizardData>) => void;
  prev: (parital?: Partial<WizardData>) => void;

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

  const [stepIdx, setStepIdx] = useState(0);

  // Use filtering to retain order
  const enabledFeatures = featureNames.filter((feature) =>
    data.setup.features.includes(feature),
  );

  const steps: ("setup" | FeatureName)[] = ["setup", ...enabledFeatures];
  const currentStep = steps[stepIdx];

  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);
  const createEvent = useMutation(api.events.createEvent);

  const dataRef = useRef(data);

  useEffect(() => {
    dataRef.current = data;
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
    setStepIdx(0);
    setWizardOpen(false);
  }

  async function onFinished(partial?: Partial<WizardData>) {
    const finalData = { ...dataRef.current, ...partial };
    console.log(finalData);

    const eventImageId = finalData.setup.image
      ? await generateFile(finalData.setup.image)
      : undefined;

    const enabledFeatures = Object.fromEntries(
      featureNames.map((feature) => [
        feature,
        finalData.setup.features.includes(feature),
      ]),
    ) as Record<FeatureName, boolean>;

    resetWizard();
  }

  const value: WizardContextValue = {
    step: {
      name: currentStep,
      idx: stepIdx,
      formId: FORM_IDS[currentStep],
    },
    totalSteps: steps.length,
    data: data,

    wizardOpen: wizardOpen,
    setWizardOpen: setWizardOpen,

    setSetupFeatures(features) {
      setData((current) => {
        const newData = {
          ...current,
          setup: { ...current.setup, features },
        };
        dataRef.current = newData;
        return newData;
      });
    },
    next(partial) {
      if (partial) {
        setData((current) => {
          const newData = { ...current, ...partial };
          dataRef.current = newData;
          return newData;
        });

        if (stepIdx < steps.length - 1) {
          setStepIdx((s) => s + 1);
        } else {
          onFinished(partial);
        }
      }
    },
    prev(partial) {
      if (partial) {
        setData((current) => {
          const newData = { ...current, ...partial };
          dataRef.current = newData;
          return newData;
        });
      }

      if (stepIdx > 0) {
        setStepIdx((s) => s - 1);
      }
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
