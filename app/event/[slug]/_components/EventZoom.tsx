import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEvent } from "../_hooks/event-context";
import Link from "next/link";

export default function EventZoom() {
  const { zoom } = useEvent();

  return zoom ? (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Zoom</CardTitle>
        <CardDescription>The Zoom integration for your event</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <CardTitle>Meeting ID</CardTitle>
          <CardDescription className="whitespace-nowrap overflow-hidden text-ellipsis w-160">
            {zoom.meetingId}
          </CardDescription>
        </div>
        <div className="flex flex-col gap-1">
          <CardTitle>Meeting Password</CardTitle>
          <CardDescription className="whitespace-nowrap overflow-hidden text-ellipsis w-160">
            {zoom.meetingPassword}
          </CardDescription>
        </div>
        <div className="flex flex-col gap-1">
          <CardTitle>URL</CardTitle>
          <Link href={zoom.url}>
            <CardDescription className="whitespace-nowrap overflow-hidden text-ellipsis w-160">
              {zoom.url}
            </CardDescription>
          </Link>
        </div>
      </CardContent>
    </Card>
  ) : null;
}
