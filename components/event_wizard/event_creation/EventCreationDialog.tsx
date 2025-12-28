"use client";

import {
  Dialog,
  // DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { Step, EventSchema, EventSchemaValues } from "./types";
import { useAppForm } from "./form/AppForm";
import SetupFields from "./SetupFields";
import { AnyFormApi, useStore, ValidationCause } from "@tanstack/react-form";

const defaultEventValues: EventSchemaValues = {
  setup: {
    name: "Dinner",
    slug: "dinner",
    image: null,
    features: [],
  },
  attendees: [],
};

function useIsGroupValid(form: AnyFormApi, group: string) {
  return useStore(form.store, (state) => {
    return Object.entries(state.fieldMeta).every(
      ([name, meta]) =>
        !name.startsWith(`${group}.`) ||
        (meta?.errors.length === 0 && !meta?.isValidating),
    );
  });
}

async function validateGroup(
  form: AnyFormApi,
  group: string,
  cause: ValidationCause,
) {
  await Promise.all(
    Object.keys(form.state.fieldMeta)
      .filter((name) => name.startsWith(`${group}.`))
      .map((name) => form.validateField(name, cause)),
  );
}

export default function EventCreationDialog() {
  const form = useAppForm({
    defaultValues: defaultEventValues,
    validators: {
      onChange: EventSchema,
    },
    onSubmit: async ({ value }) => {},
  });

  const SETUP_STEP = { name: "Setup", enabled: true } as const;
  const REVIEW_STEP = { name: "Review", enabled: true } as const;

  const [featureSteps, setFeatureSteps] = useState<Step[]>([
    { name: "Attendees", enabled: false },
    { name: "Questions", enabled: false },
    { name: "Agenda", enabled: false },
    { name: "Documents", enabled: false },
    { name: "Zoom", enabled: false },
  ]);

  const steps = [SETUP_STEP, ...featureSteps, REVIEW_STEP];
  const enabledSteps = steps.filter((step) => step.enabled);

  // Index of the current step according to `enabledSteps`
  const [currentStepIndex, setCurrentStep] = useState(0);
  const currentStep = enabledSteps[currentStepIndex].name;

  // Used to access the field group
  const currentGroup = currentStep.toLowerCase();
  const isCurrentGroupValid = useIsGroupValid(form, currentGroup);

  const toggleFeatureByName = (name: string) => {
    setFeatureSteps((prev) =>
      prev.map((step) =>
        step.name === name ? { ...step, enabled: !step.enabled } : step,
      ),
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="fixed bottom-12 right-12 w-12 h-12 hover:cursor-pointer">
          <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Event</DialogTitle>
          <DialogDescription>
            Fill out the following wizard to create your event.
          </DialogDescription>
        </DialogHeader>
        <div className="px-6 py-4 border-b border-t">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            {(() => {
              switch (currentStep) {
                case "Setup":
                  return (
                    <SetupFields
                      form={form}
                      fields={"setup"}
                      toggleFeatureByName={toggleFeatureByName}
                      featureSteps={featureSteps}
                    />
                  );
                case "Attendees":
                  return <></>;
                default:
                  return null;
              }
            })()}
          </form>
        </div>
        <DialogFooter>
          <div className="flex flex-col gap-4 w-full">
            <div className="flex justify-between text-muted-foreground text-sm">
              <span>
                Step {currentStepIndex + 1} out of {enabledSteps.length}
              </span>
              <span>{enabledSteps[currentStepIndex].name}</span>
            </div>
            <Progress
              value={((currentStepIndex + 1) / enabledSteps.length) * 100}
            />
            <div className="flex justify-between">
              <Button
                variant="outline"
                disabled={currentStepIndex === 0}
                onClick={() => {
                  if (currentStepIndex !== 0) {
                    setCurrentStep((prev) => prev - 1);
                  }
                }}
              >
                Previous
              </Button>
              <Button
                disabled={
                  !isCurrentGroupValid ||
                  currentStepIndex === enabledSteps.length - 1
                }
                onClick={async () => {
                  await validateGroup(form, currentGroup, "submit");

                  if (
                    isCurrentGroupValid &&
                    currentStepIndex <= enabledSteps.length - 1
                  ) {
                    setCurrentStep((prev) => prev + 1);
                  }
                }}
              >
                Next
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
