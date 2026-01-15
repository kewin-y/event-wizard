import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

// The schema is normally optional, but Convex Auth
// requires indexes defined on `authTables`.
// The schema provides more precise TypeScript types.
export default defineSchema({
  ...authTables,
  events: defineTable({
    name: v.string(),
    slug: v.string(),
    imageStorageId: v.optional(v.id("_storage")),
    userId: v.id("users"),
    enabledFeatures: v.object({
      attendees: v.optional(v.boolean()),
      questions: v.optional(v.boolean()),
      agenda: v.optional(v.boolean()),
      documents: v.optional(v.boolean()),
      zoom: v.optional(v.boolean()),
    }),
  }).index("by_user", ["userId"]),
  attendees: defineTable({
    eventId: v.id("events"),
    name: v.string(),
    email: v.string(),
  }).index("by_event", ["eventId"]),
  questions: defineTable({
    eventId: v.id("events"),
    name: v.string(),
    imageStorageId: v.optional(v.id("_storage")),
  }).index("by_event", ["eventId"]),
  questionOptions: defineTable({
    eventId: v.id("events"),
    questionId: v.id("questions"),
    name: v.string(),
    imageStorageId: v.optional(v.id("_storage")),
  }).index("by_question", ["questionId"]),
  agendaDates: defineTable({
    eventId: v.id("events"),
    date: v.number(),
  }).index("by_event", ["eventId"]),
  agendaItems: defineTable({
    eventId: v.id("events"),
    agendaDateId: v.id("agendaDates"),
    title: v.string(),
    description: v.optional(v.string()),
    startTime: v.optional(v.string()),
    endTime: v.optional(v.string()),
  }).index("by_agendaDate", ["agendaDateId"]),
  documentItems: defineTable({
    eventId: v.id("events"),
    parentId: v.optional(v.id("documentItems")), // null = root level, otherwise parent folder
    type: v.union(v.literal("folder"), v.literal("file"), v.literal("link")),

    // Common
    name: v.string(),

    // Files
    storageId: v.optional(v.id("_storage")),

    // Links
    url: v.optional(v.string()),
  }).index("by_event_and_parent", ["eventId", "parentId"]),
  zoomMeetings: defineTable({
    eventId: v.id("events"),
    password: v.optional(v.string()),
    url: v.string(),
  }).index("by_event", ["eventId"]),
});
