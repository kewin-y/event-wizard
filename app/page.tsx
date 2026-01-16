import EventGrid from "./_components/EventGrid";
import EventWizardDialog from "./_components/EventWizardDialog";
import SignOutButton from "@/components/SignOutButton";
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import SearchEvents from "./_components/SearchEvents";

export default async function Home(props: {
  searchParams?: Promise<{
    search?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const search = searchParams?.search || "";

  const token = await convexAuthNextjsToken();

  if (!token) return null;

  const preloadedEvents = await preloadQuery(
    api.events.list,
    {
      paginationOpts: { numItems: 10, cursor: null },
      search,
    },
    { token },
  );

  return (
    <>
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b p-4 flex flex-row justify-between items-center shadow-sm">
        <div className="flex items-center gap-8">
          <h1 className="font-bold whitespace-nowrap shrink-0">Event Wizard</h1>
          <SearchEvents />
        </div>
        <SignOutButton />
      </header>
      <main className="p-12 flex flex-col gap-12">
        <EventGrid preloadedEvents={preloadedEvents} search={search} />
        <EventWizardDialog />
      </main>
    </>
  );
}
