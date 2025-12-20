"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function EventGrid() {
    const events = useQuery(api.myFunctions.getEvents, {}) ?? [];
    return (
        <>
            <div>
                {events.map((event, i) => (
                    <pre key={i}>{JSON.stringify(event, null, 2)}</pre>
                ))}
            </div>
        </>
    );
}
