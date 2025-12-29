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
import { Step } from "./types";

export default function EventCreationDialog() {
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
            }}
          ></form>
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
              <Button>Next</Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
