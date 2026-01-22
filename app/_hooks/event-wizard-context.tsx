"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import {
  featureNames,
  AgendaValues,
  AttendeesValues,
  FeatureName,
  QuestionsValues,
  DetailsValues,
  ZoomValues,
  DocumentItem,
  TransformedDocumentItem,
} from "@/types/events";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

type WizardData = {
  details: DetailsValues;
  attendees: AttendeesValues;
  questions: QuestionsValues;
  agenda: AgendaValues;
  documents: DocumentItem[];
  zoom: ZoomValues;
};

const FORM_IDS = {
  details: "wizard-details",
  attendees: "wizard-attendees",
  questions: "wizard-questions",
  agenda: "wizard-agenda",
  documents: "wizard-documents", // Don't even need this lol
  zoom: "wizard-zoom",
} as const;

type EventWizardContextValue = {
  step: {
    name: FeatureName | "details";
    formId: (typeof FORM_IDS)[FeatureName | "details"];
    idx: number;
  };

  totalSteps: number;
  data: WizardData;

  setEnabledFeatures: (features: FeatureName[]) => void;
  next: (partial?: Partial<WizardData>) => void;
  prev: (parital?: Partial<WizardData>) => void;

  wizardOpen: boolean;
  toggleWizard: (open: boolean) => void;
  exitWizard: () => void;

  alertOpen: boolean;
  setAlertOpen: (open: boolean) => void;
};

const EventWizardContext = createContext<EventWizardContextValue | null>(null);

// Default event values {
const defaultDetailsValuese: DetailsValues = {
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

export function EventWizardProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [wizardOpen, setWizardOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);

  const [data, setData] = useState<WizardData>({
    details: defaultDetailsValuese,
    attendees: defaultAttendeesValues,
    questions: defaultQuestionsValues,
    agenda: defaultAgendaValues,
    documents: defaultDocumentsValues,
    zoom: defaultZoomValues,
  });

  const [stepIdx, setStepIdx] = useState(0);

  // Use filtering to retain order
  const enabledFeatures = featureNames.filter((feature) =>
    data.details.features.includes(feature),
  );

  const steps: ("details" | FeatureName)[] = ["details", ...enabledFeatures];
  const currentStep = steps[stepIdx];

  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);
  const createEvent = useMutation(api.event.createEvent.default);

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

  /*
   * Replaces every file value of questions with a convex storage Id
   */
  const transformQuestions = (questions: QuestionsValues["questions"]) =>
    Promise.all(
      questions.map(async (question) => ({
        name: question.name,
        imageStorageId: question.image
          ? await generateFile(question.image)
          : undefined,
        options: await Promise.all(
          question.options.map(async (option) => ({
            name: option.name,
            imageStorageId: option.image
              ? await generateFile(option.image)
              : undefined,
          })),
        ),
      })),
    );

  /*
   * Replaces every date value of agenda with a unix timestamp
   */
  const transformAgenda = (agenda: AgendaValues["agendaDates"]) =>
    agenda.map((agendaDate) => ({
      date: agendaDate.date.getTime(),
      items: agendaDate.items,
    }));

  /*
   * Replaces every file value of docs with a convex storage Id
   */
  const transformDocuments = (
    docs: DocumentItem[],
  ): Promise<TransformedDocumentItem[]> =>
    Promise.all(
      docs.map(async (doc) => {
        if (doc.type === "file")
          return {
            ...doc,
            value: await generateFile(doc.value),
          };

        if (doc.type === "folder") {
          return {
            ...doc,
            children: await transformDocuments(doc.children),
          };
        }

        return doc;
      }),
    );

  function resetWizard() {
    setData({
      details: defaultDetailsValuese,
      attendees: defaultAttendeesValues,
      questions: defaultQuestionsValues,
      agenda: defaultAgendaValues,
      documents: defaultDocumentsValues,
      zoom: defaultZoomValues,
    });
    setStepIdx(0);
    setAlertOpen(false);
    setWizardOpen(false);
  }

  async function onFinished(partial?: Partial<WizardData>) {
    const finalData = { ...dataRef.current, ...partial };

    const eventImageId = finalData.details.image
      ? await generateFile(finalData.details.image)
      : undefined;

    const enabledFeatures = Object.fromEntries(
      featureNames.map((feature) => [
        feature,
        finalData.details.features.includes(feature),
      ]),
    ) as Record<FeatureName, boolean>;

    await createEvent({
      details: {
        name: finalData.details.name,
        slug: finalData.details.slug,
        imageStorageId: eventImageId,
        enabledFeatures,
      },
      attendees: enabledFeatures.attendees ? finalData.attendees : undefined,
      questions: enabledFeatures.questions
        ? {
            questions: await transformQuestions(finalData.questions.questions),
          }
        : undefined,
      agenda: enabledFeatures.agenda
        ? {
            agendaDates: transformAgenda(finalData.agenda.agendaDates),
          }
        : undefined,
      documents: enabledFeatures.documents
        ? await transformDocuments(finalData.documents)
        : undefined,
      zoom: enabledFeatures.zoom ? finalData.zoom : undefined,
    });

    resetWizard();
  }

  const value: EventWizardContextValue = {
    step: {
      name: currentStep,
      idx: stepIdx,
      formId: FORM_IDS[currentStep],
    },
    totalSteps: steps.length,

    data,
    alertOpen,
    wizardOpen,

    setAlertOpen,
    exitWizard: resetWizard,

    toggleWizard(open) {
      if (open) {
        setWizardOpen(true);
      } else {
        setAlertOpen(true);
      }
    },
    setEnabledFeatures(features) {
      setData((current) => {
        const newData = {
          ...current,
          details: { ...current.details, features },
        } as WizardData;
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

  return (
    <EventWizardContext.Provider value={value}>
      {children}
    </EventWizardContext.Provider>
  );
}

export function useEventWizard() {
  const ctx = useContext(EventWizardContext);
  if (!ctx) {
    throw new Error("useWizard must be used inside WizardProvider");
  }
  return ctx;
}
