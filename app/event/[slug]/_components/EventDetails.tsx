import EventImage from "@/components/EventImage";
import { EventResult } from "../_types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function EventDetails({
  details,
}: {
  details: EventResult["details"];
}) {
  return (
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
  );
}
