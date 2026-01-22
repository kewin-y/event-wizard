import EventImage from "@/components/EventImage";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEvent } from "../_hooks/event-context";

export default function EventDetails() {
  const { details } = useEvent();

  return details ? (
    <Card className="mx-auto w-full pt-0 overflow-hidden">
      <EventImage name={details.name} imageUrl={details.imageUrl} />
      <CardHeader>
        <CardTitle>{details.name}</CardTitle>
        <CardDescription>
          Event created on{" "}
          {new Date(details._creationTime).toISOString().slice(0, 10)}
        </CardDescription>
      </CardHeader>
    </Card>
  ) : null;
}
