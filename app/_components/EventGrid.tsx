"use client";

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

  if (!isAuthenticated) return <div>NOT AUTHENTICATED</div>;
  if (isLoading) return <div>LOADING</div>;

  return (
    <>
      <div className="grid grid-cols-3 gap-8">
        {events.map((event) => {
          return (
            <div
              key={event._id}
              className="rounded-xl p-6 flex flex-col gap-4 border"
            >
              <EventImage name={event.name} imageUrl={event.imageUrl} />
              <div className="flex items-center gap-4">
                <div>
                  <h4 className="font-bold">{event.name}</h4>
                  <p className="text-muted-foreground">
                    Event created on{" "}
                    {new Date(event._creationTime).toISOString().slice(0, 10)}
                  </p>
                </div>
                <Button asChild size="icon" className="ml-auto">
                  <Link href={`/event/${event.slug}`}>
                    <ArrowRight />
                  </Link>
                </Button>
              </div>
            </div>
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
