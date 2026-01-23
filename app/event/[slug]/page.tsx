import { api } from "@/convex/_generated/api";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchQuery, preloadQuery } from "convex/nextjs";
import EventClient from "./_components/EventClient";
import SignOutButton from "@/components/SignOutButton";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { EventProvider } from "./_hooks/event-context";

export default async function EventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const token = await convexAuthNextjsToken();

  if (!token) redirect("signin");

  const preloadedDetails = await preloadQuery(
    api.event.getEventBySlug.getEventDetails,
    { slug },
    { token },
  );

  const eventDetails = await fetchQuery(
    api.event.getEventBySlug.getEventDetails,
    { slug },
    { token },
  );

  if (!eventDetails) return <div>Event not Found</div>;

  const preloadedAttendees = await preloadQuery(
    api.event.getEventBySlug.getEventAttendees,
    {
      paginationOpts: { numItems: 10, cursor: null },
      eventId: eventDetails._id,
    },
    { token },
  );

  const preloadedQuestions = await preloadQuery(
    api.event.getEventBySlug.getEventQuestions,
    {
      paginationOpts: { numItems: 10, cursor: null },
      eventId: eventDetails._id,
    },
    { token },
  );

  const preloadedAgenda = await preloadQuery(
    api.event.getEventBySlug.getEventAgenda,
    {
      paginationOpts: { numItems: 10, cursor: null },
      eventId: eventDetails._id,
    },
    { token },
  );

  const preloadedDocuments = await preloadQuery(
    api.event.getEventBySlug.getEventDocuments,
    {
      paginationOpts: { numItems: 10, cursor: null },
      eventId: eventDetails._id,
    },
    { token },
  );

  const preloadedZoom = await preloadQuery(
    api.event.getEventBySlug.getEventZoom,
    {
      eventId: eventDetails._id,
    },
    { token },
  );

  return (
    <>
      <header className="sticky flex justify-between items-center gap-3 top-0 z-10 bg-background/80 backdrop-blur-md border-b p-4 shadow-sm">
        <Button asChild variant="outline">
          <Link href="/">
            <ArrowLeft />
            Back
          </Link>
        </Button>
        <h1 className="whitespace-nowrap shrink-0 muted-foreground font-bold">
          {eventDetails.name}
        </h1>
        <SignOutButton />
      </header>
      <main className="p-12 flex flex-col gap-12">
        <EventProvider
          preloadedDetails={preloadedDetails}
          preloadedAttendees={preloadedAttendees}
          preloadedQuestions={preloadedQuestions}
          preloadedAgenda={preloadedAgenda}
          preloadedDocuments={preloadedDocuments}
          preloadedZoom={preloadedZoom}
        >
          <EventClient />
        </EventProvider>
      </main>
    </>
  );
}
