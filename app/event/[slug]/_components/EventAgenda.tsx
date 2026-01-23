import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Fragment } from "react/jsx-runtime";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/convex/_generated/api";
import { useConvexAuth, usePaginatedQuery } from "convex/react";
import { useEvent } from "../_hooks/event-context";
import { Button } from "@/components/ui/button";
import LoadingHeader from "@/components/LoadingHeader";

export default function EventAgenda() {
  const { isAuthenticated } = useConvexAuth();

  const { details: event, agenda: initialAgenda } = useEvent();

  const { results, status, loadMore } = usePaginatedQuery(
    api.event.getEventBySlug.getEventAgenda,
    isAuthenticated && event ? { eventId: event._id } : "skip",
    { initialNumItems: 10 },
  );

  const agenda = status === "LoadingFirstPage" ? initialAgenda.page : results;

  console.log(status);

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Agenda</CardTitle>
        <CardDescription>
          The following items are attached to your event agenda
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {agenda.map((agendaDate, i) => (
          <Fragment key={agendaDate._id}>
            {" "}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px]">Item</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Start</TableHead>
                  <TableHead className="text-right">End</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {agendaDate.items.map((itm) => (
                  <TableRow key={itm._id}>
                    <TableCell className="font-medium">{itm.title}</TableCell>
                    <TableCell>{itm.description || "N/A"}</TableCell>
                    <TableCell className="text-right">
                      {itm.startTime || "N/A"}
                    </TableCell>
                    <TableCell className="text-right">
                      {itm.endTime || "N/A"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center text-muted-foreground font-normal"
                  >
                    Agenda items for{" "}
                    {new Date(agendaDate.date).toISOString().slice(0, 10)}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
            {i < agenda.length - 1 && <Separator />}
          </Fragment>
        ))}
        {status === "LoadingMore" && <LoadingHeader />}
        {status === "CanLoadMore" && (
          <>
            <Separator />
            <Button
              variant="secondary"
              className="w-full"
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
