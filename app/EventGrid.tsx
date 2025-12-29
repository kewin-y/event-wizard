"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function EventGrid() {
  const events = useQuery(api.events.getEvents, {}) ?? [];
  return (
    <div>
      {events.map((event) => (
        <pre key={event._id}>{JSON.stringify(event, null, 2)}</pre>
      ))}
    </div>
  );
}
