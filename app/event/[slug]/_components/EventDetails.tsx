import EventImage from "@/components/EventImage";
import { EventType } from "../_types";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function EventDetails({
  details,
}: {
  details: EventType["details"];
}) {
  return (
    <Card className="relative mx-auto w-full pt-0 overflow-hidden">
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
