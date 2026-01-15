"use client";

import { Preloaded, usePreloadedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function EventGrid({
  preloadedEvents,
}: {
  preloadedEvents: Preloaded<typeof api.events.getEvents>;
}) {
  const events = usePreloadedQuery(preloadedEvents);
  return (
    <div>
      {events.map((event) => (
        <pre key={event._id}>{JSON.stringify(event, null, 2)}</pre>
      ))}
    </div>
  );
}
