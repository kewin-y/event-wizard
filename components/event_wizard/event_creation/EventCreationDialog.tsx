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

export default function EventCreationDialog() {
    const [steps, setSteps] = useState([
        {
            name: "Setup",
            enabled: true,
        },
        {
            name: "Attendees",
            enabled: false,
        },
        {
            name: "Questions",
            enabled: false,
        },
        {
            name: "Agenda",
            enabled: false,
        },
        {
            name: "Documents",
            enabled: false,
        },
        {
            name: "Zoom",
            enabled: false,
        },
        {
            name: "Review",
            enabled: true,
        },
    ]);

    const [currentStep, setCurrentStep] = useState(0);
    const totalSteps = steps.reduce((a, b) => a + (b.enabled ? 1 : 0), 0);

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
            </DialogContent>
        </Dialog>
    );
}
