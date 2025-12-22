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
import { useState } from "react";
import { SetupOpts, Step } from "./types";
import Setup from "./Setup";

export default function EventCreationDialog() {
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

    const [setupOpts, setSetupOpts] = useState<SetupOpts>({
        name: "",
        slug: "",
    });

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
                <Setup
                    featureSteps={featureSteps}
                    setFeatureSteps={setFeatureSteps}
                    setupOpts={setupOpts}
                    setSetupOpts={setSetupOpts}
                />
            </DialogContent>
        </Dialog>
    );
}
