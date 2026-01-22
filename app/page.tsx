import EventGrid from "./_components/EventGrid";
import EventWizardDialog from "./_components/EventWizardDialog";
import SignOutButton from "@/components/SignOutButton";
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import SearchEvents from "./_components/SearchEvents";
import { redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";

export default async function Home(props: {
  searchParams?: Promise<{
    search?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const search = searchParams?.search || "";

  const token = await convexAuthNextjsToken();

  if (!token) redirect("/signin");

  const preloadedEvents = await preloadQuery(
    api.event.getEvents.default,
    {
      paginationOpts: { numItems: 10, cursor: null },
      search,
    },
    { token },
  );

  return (
    <>
      <header className="sticky min-h-12 top-0 z-10 bg-background/80 backdrop-blur-md border-b p-4 shadow-sm flex items-center gap-4">
        <h1 className="font-bold whitespace-nowrap shrink-0">Event Wizard</h1>
        <div className="ml-auto">
          <SearchEvents />
        </div>
        <EventWizardDialog />
        <SignOutButton className="ml-auto" />
      </header>
      <main className="p-8">
        <EventGrid preloadedEvents={preloadedEvents} search={search} />
      </main>
    </>
  );
}
