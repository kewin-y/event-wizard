import { api } from "@/convex/_generated/api";

export type EventResult = NonNullable<
  Awaited<typeof api.events.getBySlug._returnType>
>;
