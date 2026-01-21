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
import SectionHeader from "@/components/ui/SectionHeader";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function EventAgenda({
  agenda,
}: {
  agenda: EventResult["agenda"];
}) {
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
            <CardTitle>
              {new Date(agendaDate.date).toISOString().slice(0, 10)}
            </CardTitle>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px]">Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Start</TableHead>
                  <TableHead className="text-right">End</TableHead>
                </TableRow>
              </TableHeader>
              {agendaDate.items.map((itm) => (
                <TableBody key={itm._id}>
                  <TableRow>
                    <TableCell className="font-medium">{itm.title}</TableCell>
                    <TableCell>{itm.description || "N/A"}</TableCell>
                    <TableCell className="text-right">
                      {itm.startTime || "N/A"}
                    </TableCell>
                    <TableCell className="text-right">
                      {itm.endTime || "N/A"}
                    </TableCell>
                  </TableRow>
                </TableBody>
              ))}
            </Table>
            {i < agenda.length - 1 && <Separator />}
          </Fragment>
        ))}
      </CardContent>
    </Card>
  );
}
