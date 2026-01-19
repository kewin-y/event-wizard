"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export default function DeleteEventButton() {
  return (
    <Button variant="destructive">
      <Trash2 />
      Delete Event
    </Button>
  );
}
