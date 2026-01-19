"use client";

import { api } from "@/convex/_generated/api";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import EventDetails from "./EventDetails";
import { capitalizeFirstLetter } from "@/lib/utils";
import EditEventButton from "./EditEventButton";
import DeleteEventButton from "./DeleteEventButton";
import { ButtonGroup } from "@/components/ui/button-group";

export default function EventClient({
  preloadedEvent,
}: {
  preloadedEvent: Preloaded<typeof api.events.getBySlug>;
}) {
  const event = usePreloadedQuery(preloadedEvent);

  const [activeTab, setActiveTab] = useState("details");

  return event ? (
    <div className="w-7/12 mx-auto flex flex-col gap-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="gap-4">
        <div className="w-full flex items-center gap-2">
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            {Object.entries(event.enabledFeatures)
              .filter(([_, enabled]) => enabled)
              .map(([feature]) => (
                <TabsTrigger value={feature} key={`tab-${feature}`}>
                  {capitalizeFirstLetter(feature)}
                </TabsTrigger>
              ))}
          </TabsList>
          <EditEventButton className="ml-auto" />
          <DeleteEventButton />
        </div>
        <TabsContent value="details">
          <EventDetails event={event} />
        </TabsContent>
        {event.enabledFeatures.attendees && (
          <TabsContent value="attendees">hey</TabsContent>
        )}
      </Tabs>
    </div>
  ) : null;
}
