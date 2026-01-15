"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import SetupForm from "./SetupForm";
import AttendeesForm from "./AttendeesForm";
import QuestionsForm from "./QuestionsForm";
import AgendaForm from "./AgendaForm";
import DocumentsForm from "./DocumentsForm";
import ZoomForm from "./ZoomForm";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
  useEventWizard,
  EventWizardProvider,
} from "../_hooks/event-wizard-context";

function EventWizardDialogInner() {
  const {
    step,
    wizardOpen,
    alertOpen,
    setAlertOpen,
    exitWizard,
    toggleWizard,
  } = useEventWizard();

  return (
    <>
      <Dialog open={wizardOpen} onOpenChange={toggleWizard}>
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
      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent className="w-100">
          <AlertDialogHeader>
            <AlertDialogTitle>Exit Wizard</AlertDialogTitle>
            <AlertDialogDescription>
              This will discard all your progress. Are you sure you want to
              exit?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => exitWizard()}>
              Exit
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default function EventWizardDialog() {
  return (
    <EventWizardProvider>
      <EventWizardDialogInner />
    </EventWizardProvider>
  );
}
