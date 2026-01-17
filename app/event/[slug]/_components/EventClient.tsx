"use client";

import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { api } from "@/convex/_generated/api";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { ImageOffIcon } from "lucide-react";

export default function EventClient({
  preloadedEvent,
}: {
  preloadedEvent: Preloaded<typeof api.events.getBySlug>;
}) {
  const event = usePreloadedQuery(preloadedEvent);

  // TODO: this is copy-pasted from EventGrid.tsx. Maybe split into reusable component?
  return event ? (
    <div className="w-5/12 mx-auto flex flex-col gap-6">
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
      </div>
    </div>
  ) : null;
}
