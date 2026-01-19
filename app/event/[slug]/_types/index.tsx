import { api } from "@/convex/_generated/api";
import { FeatureName } from "@/types/events";

export type EventType = NonNullable<
  Awaited<typeof api.events.getBySlug._returnType>
>;
