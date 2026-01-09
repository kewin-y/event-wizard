import EventGrid from "./EventGrid";
import EventWizardDialog from "./EventWizardDialog";
import SignOutButton from "@/components/SignOutButton";
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";

export default async function Home() {
  const token = await convexAuthNextjsToken();

  if (!token) return null;

  const preloadedEvents = await preloadQuery(
    api.events.getEvents,
    {},
    { token },
  );

  console.log(preloadedEvents);

  return (
    <>
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b p-4 flex flex-row justify-between items-center shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4"></div>
          <h1 className="font-bold">Event Wizard</h1>
        </div>
        <SignOutButton />
      </header>
      <main className="p-12 flex flex-col gap-12">
        <EventGrid preloadedEvents={preloadedEvents}/>
        <EventWizardDialog />
      </main>
    </>
  );
}
