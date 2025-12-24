"use client";

import {
  Dialog,
  DialogClose,
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
import { Dispatch, SetStateAction, useState } from "react";
import { SetupOpts, Step, EventSchema, EventSchemaValues } from "./types";
import { Checkbox } from "@/components/ui/checkbox";
import { useAppForm } from "./form";
import SetupFields from "./SetupFields";
import {
  Field,
  FieldLabel,
  FieldSet,
  FieldLegend,
  FieldDescription,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";

const defaultEventValues: EventSchemaValues = {
  setup: {
    name: "",
    slug: "",
    image: null,
    features: [],
  },
};

export default function EventCreationDialog() {
  const form = useAppForm({
    defaultValues: defaultEventValues,
    validators: {
      onChange: EventSchema,
    },
    onSubmit: async ({ value }) => {},
  });

  const SETUP_STEP = { name: "Setup", enabled: true } as const;
  const REVIEW_STEP = { name: "Setup", enabled: true } as const;

  const [featureSteps, setFeatureSteps] = useState<Step[]>([
    { name: "Attendees", enabled: false },
    { name: "Questions", enabled: false },
    { name: "Agenda", enabled: false },
    { name: "Documents", enabled: false },
    { name: "Zoom", enabled: false },
  ]);

  const steps = [SETUP_STEP, ...featureSteps, REVIEW_STEP];

  // Sum up the number of enabled steps
  const totalSteps = steps.reduce((a, b) => a + (b.enabled ? 1 : 0), 0);

  const [currentStep, setCurrentStep] = useState(1);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

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
        </DialogHeader>
        <DialogDescription>
          Fill out the following wizard to create your event.
        </DialogDescription>
        <div className="border-b" />
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            <SetupFields form={form} fields={"setup"} />
            <form.AppField
              name="setup.features"
              mode="array"
              children={(field) => (
                <field.CheckboxArrayField
                  label="poop"
                  description="Select features to enable for your event"
                  arr={featureSteps.map((feature) => feature.name)}
                  onCheckedChange={toggleFeatureByName}
                />
              )}
            />
          </FieldGroup>
        </form>
        <div className="border-b" />
        <DialogFooter>
          <div className="flex flex-col gap-4 w-full">
            <div className="flex justify-between text-muted-foreground text-sm">
              <span>
                Step {currentStep} out of {totalSteps}
              </span>
              <span>{steps[currentStepIndex].name}</span>
            </div>
            <Progress value={(currentStep / totalSteps) * 100} />
            <div className="flex justify-between">
              <Button variant="outline">Previous</Button>
              <Button>Next</Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
