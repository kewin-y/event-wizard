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
import { useEvent } from "../_hooks/event-context";
import EventDocuments from "./EventDocuments";

export default function EventClient() {
  const { details } = useEvent();

  const [activeTab, setActiveTab] = useState("details");

  return details ? (
    <div className="w-7/12 mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="w-full flex items-center gap-2">
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            {featureNames.map((feature) =>
              details.enabledFeatures[feature] ? (
                <TabsTrigger value={feature} key={`tab-${feature}`}>
                  {capitalizeFirstLetter(feature)}
                </TabsTrigger>
              ) : null,
            )}
          </TabsList>
          <EditEventButton details={details} className="ml-auto" />
          <DeleteEventButton eventId={details._id} />
        </div>
        <TabsContent value="details">
          <EventDetails />
        </TabsContent>
        {details.enabledFeatures.attendees && (
          <TabsContent value="attendees">
            <EventAttendees />
          </TabsContent>
        )}
        {details.enabledFeatures.questions && (
          <TabsContent value="questions">
            <EventQuestions />
          </TabsContent>
        )}
        {details.enabledFeatures.agenda && (
          <TabsContent value="agenda">
            <EventAgenda />
          </TabsContent>
        )}
        {details.enabledFeatures.documents && (
          <TabsContent value="documents">
            <EventDocuments />
          </TabsContent>
        )}
      </Tabs>
    </div>
  ) : null;
}
