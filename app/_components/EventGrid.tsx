"use client";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Preloaded,
  useConvexAuth,
  usePaginatedQuery,
  usePreloadedQuery,
} from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import EventImage from "@/components/EventImage";

export default function EventGrid({
  preloadedEvents,
  search,
}: {
  preloadedEvents: Preloaded<typeof api.events.list>;
  search: string;
}) {
  const { isAuthenticated, isLoading } = useConvexAuth();

  const initialEvents = usePreloadedQuery(preloadedEvents);

  const { results, status, loadMore } = usePaginatedQuery(
    api.events.list,
    isAuthenticated ? { search } : "skip",
    { initialNumItems: 10 },
  );

  const events = status === "LoadingFirstPage" ? initialEvents.page : results;

  return (
    <>
      <div className="grid grid-cols-3 gap-8">
        {events.map((event) => {
          return (
            <Card
              className="relative mx-auto w-full pt-0"
              key={`event-${event._id}`}
            >
              <EventImage name={event.name} imageUrl={event.imageUrl} />
              <CardHeader>
                <CardTitle>{event.name}</CardTitle>
                <CardDescription>
                  Event created on{" "}
                  {new Date(event._creationTime).toISOString().slice(0, 10)}
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href={`event/${event.slug}`}>View Event</Link>
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
      {status === "LoadingMore" && (
        <div className="flex items-center">
          <div className="grow border-t border-border" />
          <span className="mx-3 text-sm text-muted-foreground">Loading...</span>
          <div className="grow border-t border-border" />
        </div>
      )}
      {status === "CanLoadMore" && (
        <div className="flex w-full items-center">
          <Button className="mx-auto" onClick={() => loadMore(10)}>
            Load More
          </Button>
        </div>
      )}
    </>
  );
}
