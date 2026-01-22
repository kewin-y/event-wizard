import { api } from "@/convex/_generated/api";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchQuery, preloadQuery } from "convex/nextjs";
import { ConvexError } from "convex/values";
import EventClient from "./_components/EventClient";
import SignOutButton from "@/components/SignOutButton";
import { redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import EditEventButton from "./_components/EditEventButton";
import DeleteEventButton from "./_components/DeleteEventButton";

export default async function EventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const token = await convexAuthNextjsToken();

  if (!token) redirect("signin");

  try {
    const preloadedEvent = await preloadQuery(
      api.event.getEventBySlug.default,
      { slug },
      { token },
    );

    const event = await fetchQuery(
      api.event.getEventBySlug.default,
      { slug },
      { token },
    );

    return event ? (
      <>
        <header className="sticky flex items-center gap-3 top-0 z-10 bg-background/80 backdrop-blur-md border-b p-4 shadow-sm">
          <Button asChild variant="outline">
            <Link href="/">
              <ArrowLeft />
              Back
            </Link>
          </Button>
          <h1 className="whitespace-nowrap shrink-0 muted-foreground ml-auto font-bold">
            {event.details.name}
          </h1>
          <SignOutButton className="ml-auto" />
        </header>
        <main className="p-12 flex flex-col gap-12">
          <EventClient preloadedEvent={preloadedEvent} />
        </main>
      </>
    ) : null;
  } catch (e) {
    if (e instanceof ConvexError) {
      return <div>{e.message}</div>;
    }
  }
}
