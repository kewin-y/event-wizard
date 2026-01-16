"use client";

import Image from "next/image";
import { Preloaded, usePaginatedQuery, usePreloadedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ArrowRight, ImageOffIcon } from "lucide-react";

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
      <div className="grid grid-cols-3 gap-4">
        {events.map((event) => {
          return (
            <div
              key={event._id}
              className="rounded-xl p-6 flex flex-col gap-4 border"
            >
              <AspectRatio
                ratio={16 / 9}
                className="bg-accent rounded-lg overflow-hidden"
              >
                {event.imageUrl ? (
                  <Image
                    src={event.imageUrl}
                    alt={`Image for event ${event.name}`}
                    fill
                  />
                ) : (
                  <div className="size-full flex">
                    <div className="m-auto flex flex-col items-center gap-2 text-muted-foreground">
                      <ImageOffIcon size={32} />
                      <p>No image</p>
                    </div>
                  </div>
                )}
              </AspectRatio>
              <div className="flex items-center gap-4">
                <div>
                  <h4 className="font-bold">{event.name}</h4>
                  <p className="text-muted-foreground">
                    Event created on{" "}
                    {new Date(event._creationTime).toISOString().slice(0, 10)}
                  </p>
                </div>
                <Button className="ml-auto" size="icon-lg">
                  <ArrowRight />
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
