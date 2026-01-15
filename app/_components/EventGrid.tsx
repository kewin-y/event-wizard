"use client";

import { Preloaded, usePaginatedQuery, usePreloadedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";

export default function EventGrid({
  preloadedEvents,
  search,
}: {
  preloadedEvents: Preloaded<typeof api.events.getEvents>;
  search: string;
}) {
  const initialEvents = usePreloadedQuery(preloadedEvents);

  const { results, status, loadMore } = usePaginatedQuery(
    api.events.getEvents,
    { search },
    { initialNumItems: 10 },
  );

  const events = status === "LoadingFirstPage" ? initialEvents.page : results;

  return (
    <>
      <div>
        {events.map((event) => (
          <pre key={event._id}>{JSON.stringify(event, null, 2)}</pre>
        ))}
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
