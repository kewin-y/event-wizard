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
import DocumentsForm from "./DocumentsForm";
import ZoomForm from "./ZoomForm";

function EventWizardDialogInner() {
  const { step, wizardOpen, setWizardOpen } = useWizard();

  return (
    <Dialog open={wizardOpen} onOpenChange={setWizardOpen}>
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
        {step.name === "setup" && <SetupForm />}
        {step.name === "attendees" && <AttendeesForm />}
        {step.name === "questions" && <QuestionsForm />}
        {step.name === "agenda" && <AgendaForm />}
        {step.name === "documents" && <DocumentsForm />}
        {step.name === "zoom" && <ZoomForm />}
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
