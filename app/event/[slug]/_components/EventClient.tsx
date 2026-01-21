"use client";

import { api } from "@/convex/_generated/api";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import EventDetails from "./EventDetails";
import { capitalizeFirstLetter } from "@/lib/utils";
import EditEventButton from "./EditEventButton";
import DeleteEventButton from "./DeleteEventButton";
import { featureNames } from "@/types/events";
import EventAttendees from "./EventAttendees";
import EventQuestions from "./EventQuestions";
import EventAgenda from "./EventAgenda";

export default function EventClient({
  preloadedEvent,
}: {
  preloadedEvent: Preloaded<typeof api.events.getBySlug>;
}) {
  const event = usePreloadedQuery(preloadedEvent);

  const [activeTab, setActiveTab] = useState("details");

  return event ? (
    <div className="w-7/12 mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="w-full flex items-center gap-2">
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            {featureNames.map((feature) =>
              event.details.enabledFeatures[feature] ? (
                <TabsTrigger value={feature} key={`tab-${feature}`}>
                  {capitalizeFirstLetter(feature)}
                </TabsTrigger>
              ) : null,
            )}
          </TabsList>
          <EditEventButton event={event} className="ml-auto" />
          <DeleteEventButton eventId={event.details._id} />
        </div>
        <TabsContent value="details">
          <EventDetails details={event.details} />
        </TabsContent>
        {event.details.enabledFeatures.attendees && (
          <TabsContent value="attendees">
            <EventAttendees attendees={event.attendees} />
          </TabsContent>
        )}
        {event.details.enabledFeatures.questions && (
          <TabsContent value="questions">
            <EventQuestions questions={event.questions}/>
          </TabsContent>
        )}
        {event.details.enabledFeatures.agenda && (
          <TabsContent value="agenda">
            <EventAgenda agenda={event.agenda}/>
          </TabsContent>
        )}
      </Tabs>
    </div>
  ) : null;
}
