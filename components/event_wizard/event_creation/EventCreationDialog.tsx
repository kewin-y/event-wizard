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
import { useForm, FormApi } from "@tanstack/react-form";
import * as z from "zod";
import { useAppForm } from "./form";
import SetupFields from "./SetupFields";

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
    const totalSteps = steps.reduce((a, b) => a + (b.enabled ? 1 : 0), 0);

    const [currentStep, setCurrentStep] = useState(0);

    const SetupFieldsWrapper = () => (
        <>
            <SetupFields form={form} fields={"setup"} />
        </>
    );

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
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        form.handleSubmit();
                    }}
                >
                    <SetupFieldsWrapper />
                </form>
            </DialogContent>
        </Dialog>
    );
}
