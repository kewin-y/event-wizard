"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { capitalizeFirstLetter } from "@/lib/utils";
import { EditIcon } from "lucide-react";
import { EventResult } from "../_types";
import { Dialog } from "@/components/ui/dialog";
import { useState } from "react";
import EditDetails from "./form/EditDetails";

export default function EditEventButton({
  event,
  className,
}: {
  event: EventResult;
  className?: string;
}) {
  const [editDetailsOpen, setEditDetailsOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className={className} variant="outline">
            <EditIcon />
            Edit Event
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {[
            "details",
            ...Object.entries(event.details.enabledFeatures).flatMap(
              ([feature, enabled]) => (enabled ? [feature] : []),
            ),
          ].map((name) => (
            <DropdownMenuItem
              key={`edit-event-${name}`}
              onSelect={() => {
                switch (name) {
                  case "details":
                    setEditDetailsOpen(true);
                    return;
                  default:
                    return;
                }
              }}
            >
              {capitalizeFirstLetter(name)}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
        <Dialog open={editDetailsOpen} onOpenChange={setEditDetailsOpen}>
          <EditDetails />
        </Dialog>
      </DropdownMenu>
    </>
  );
}
