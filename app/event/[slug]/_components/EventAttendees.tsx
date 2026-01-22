import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEvent } from "../_hooks/event-context";
import { useConvexAuth, usePaginatedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import LoadingHeader from "@/components/LoadingHeader";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export default function EventAttendees() {
  const { isAuthenticated } = useConvexAuth();

  const { details: event, attendees: initialAttendees } = useEvent();

  const { results, status, loadMore } = usePaginatedQuery(
    api.event.getEventBySlug.getEventAttendees,
    isAuthenticated && event ? { eventId: event._id } : "skip",
    { initialNumItems: 10 },
  );

  const attendees =
    status === "LoadingFirstPage" ? initialAttendees.page : results;

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Attendees</CardTitle>
        <CardDescription>
          The following individuals are attending your event
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attendees.map((attendee) => (
              <TableRow key={attendee._id}>
                <TableCell>{attendee.name}</TableCell>
                <TableCell>{attendee.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {status === "LoadingMore" && <LoadingHeader />}
        {status === "CanLoadMore" && (
          <>
            <Separator />
            <Button
              className="w-full"
              variant="secondary"
              onClick={() => loadMore(10)}
            >
              Load More
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
