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
import DetailsForm from "./DetailsForm";
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
import { Separator } from "@/components/ui/separator";

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
          <Button>
            <Plus />
            Create Event
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Event</DialogTitle>
            <DialogDescription>
              Fill out the following wizard to create your event.
            </DialogDescription>
          </DialogHeader>
          <Separator />
          {step.name === "details" && <DetailsForm />}
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
