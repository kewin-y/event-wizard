import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EventResult } from "../_types";

import { Fragment } from "react/jsx-runtime";
import { Separator } from "@/components/ui/separator";

export default function EventAttendees({
  attendees,
}: {
  attendees: EventResult["attendees"];
}) {
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Attendees</CardTitle>
        <CardDescription>
          The following individuals are attending your event
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {attendees.map((attendee, i) => (
          <Fragment key={attendee._id}>
            <div className="flex flex-col gap-1">
              <CardTitle>Name</CardTitle>
              <CardDescription>{attendee.name}</CardDescription>
            </div>
            <div className="flex flex-col gap-1">
              <CardTitle>Email</CardTitle>
              <CardDescription>{attendee.email}</CardDescription>
            </div>
            {i < attendees.length - 1 && <Separator />}
          </Fragment>
        ))}
      </CardContent>
    </Card>
  );
}
