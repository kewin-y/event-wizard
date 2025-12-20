import EventGrid from "@/components/event_wizard/EventGrid";
import EventCreationDialog from "@/components/event_wizard/event_creation/EventCreationDialog";
import SignOutButton from "@/components/SignOutButton";

export default function Home() {
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
                <EventGrid />
                <EventCreationDialog />
            </main>
        </>
    );
}
