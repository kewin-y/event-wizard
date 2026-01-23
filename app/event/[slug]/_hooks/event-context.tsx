"use client";
import { api } from "@/convex/_generated/api";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { createContext, useContext, ReactNode } from "react";

type EventContextValue = {
  preloadedDetails: Preloaded<typeof api.event.getEventBySlug.getEventDetails>;
  preloadedAttendees: Preloaded<
    typeof api.event.getEventBySlug.getEventAttendees
  >;
  preloadedQuestions: Preloaded<
    typeof api.event.getEventBySlug.getEventQuestions
  >;
  preloadedAgenda: Preloaded<typeof api.event.getEventBySlug.getEventAgenda>;
  preloadedDocuments: Preloaded<
    typeof api.event.getEventBySlug.getEventDocuments
  >;
  preloadedZoom: Preloaded<typeof api.event.getEventBySlug.getEventZoom>;
};

const EventContext = createContext<EventContextValue | null>(null);

type EventProviderProps = EventContextValue & {
  children: ReactNode;
};

export function EventProvider({
  preloadedDetails,
  preloadedAttendees,
  preloadedQuestions,
  preloadedAgenda,
  preloadedDocuments,
  preloadedZoom,
  children,
}: EventProviderProps) {
  return (
    <EventContext.Provider
      value={{
        preloadedDetails,
        preloadedAttendees,
        preloadedQuestions,
        preloadedAgenda,
        preloadedDocuments,
        preloadedZoom,
      }}
    >
      {children}
    </EventContext.Provider>
  );
}

export function useEvent() {
  const context = useContext(EventContext);

  if (!context) {
    throw new Error("useEvent must be used within an EventProvider");
  }

  const details = usePreloadedQuery(context.preloadedDetails);
  const attendees = usePreloadedQuery(context.preloadedAttendees);
  const questions = usePreloadedQuery(context.preloadedQuestions);
  const agenda = usePreloadedQuery(context.preloadedAgenda);
  const documents = usePreloadedQuery(context.preloadedDocuments);
  const zoom = usePreloadedQuery(context.preloadedZoom);

  return {
    details,
    attendees,
    questions,
    agenda,
    documents,
    zoom,
  };
}
