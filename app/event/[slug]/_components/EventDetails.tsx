import EventImage from "@/components/EventImage";
import { EventType } from "../_types";

export default function EventDetails({ event }: { event: EventType }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="w-full">
        <h4 className="font-bold">{event.name}</h4>
        <div className="flex">
          <p className="text-muted-foreground">
            Event created on{" "}
            {new Date(event._creationTime).toISOString().slice(0, 10)}
          </p>
        </div>
      </div>
      <EventImage name={event.name} imageUrl={event.imageUrl} />
    </div>
  );
}
