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
import { Dialog } from "@/components/ui/dialog";
import { useState } from "react";
import EditDetails from "./form/EditDetails";
import { api } from "@/convex/_generated/api";

export default function EditEventButton({
  details,
  className,
}: {
  details: NonNullable<
    Awaited<typeof api.event.getEventBySlug.getEventDetails._returnType>
  >;
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
            ...Object.entries(details.enabledFeatures).flatMap(
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
