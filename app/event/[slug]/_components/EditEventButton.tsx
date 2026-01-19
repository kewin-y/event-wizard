"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { capitalizeFirstLetter } from "@/lib/utils";
import { featureNames } from "@/types/events";
import { EditIcon } from "lucide-react";

export default function EditEventButton({ className }: { className?: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className={className} variant="outline">
          <EditIcon />
          Edit Event
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {["details", ...featureNames].map((name) => (
          <DropdownMenuItem key={`edit-event-${name}`}>
            {capitalizeFirstLetter(name)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
