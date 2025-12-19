"use client";

import { useConvexAuth } from "convex/react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function AddEventButton() {
    const { isAuthenticated } = useConvexAuth();
    return (
        <>
            {isAuthenticated && (
                <Button className="fixed bottom-12 right-12 w-12 h-12 hover:cursor-pointer">
                    <Plus />
                </Button>
            )}
        </>
    );
}
