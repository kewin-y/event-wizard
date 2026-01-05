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
import { useWizard, WizardProvider } from "@/components/wizard-context";
import SetupForm from "./SetupForm";
import WizardProgress from "@/components/WizardProgress";
import AttendeesForm from "./AttendeesForm";
import QuestionsForm from "./QuestionsForm";
import AgendaForm from "./AgendaForm";

function EventWizardDialogInner() {
  const { step } = useWizard();

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
        {(() => {
          switch (step.data.name) {
            case "Setup":
              return <SetupForm />;
            case "Attendees":
              return <AttendeesForm />;
            case "Questions":
              return <QuestionsForm />;
            case "Agenda":
              return <AgendaForm />;
            default:
              return null;
          }
        })()}
      </DialogContent>
    </Dialog>
  );
}

export default function EventWizardDialog() {
  return (
    <WizardProvider>
      <EventWizardDialogInner />
    </WizardProvider>
  );
}
