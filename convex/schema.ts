import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

// The schema is normally optional, but Convex Auth
// requires indexes defined on `authTables`.
// The schema provides more precise TypeScript types.
export default defineSchema({
    ...authTables,
    // TODO: Get rid of this numbers table
    numbers: defineTable({
        value: v.number(),
    }),
    events: defineTable({
        name: v.string(),
        slug: v.string(),
        imageStorageId: v.optional(v.id("_storage")),
        userId: v.id("users"),
        featuresEnabled: v.object({
            attendees: v.boolean(),
            questions: v.boolean(),
            agenda: v.boolean(),
            documents: v.boolean(),
            zoom: v.boolean(),
        }),
    }).index("by_user", ["userId"]),
    attendees: defineTable({
        eventId: v.id("events"),
        name: v.string(),
        email: v.string(),
    }).index("by_event", ["eventId"]),
    questions: defineTable({
        eventId: v.id("events"),
        title: v.string(),
        // NOTE: Since this is a small project, I won't add the abiltiy to answer questions
        options: v.array(
            v.object({
                title: v.string(),
                order: v.number(),
            }),
        ),
        imageStorageId: v.id("_storage"),
    }).index("by_event", ["eventId"]),
    agendaDates: defineTable({
        eventId: v.id("events"),
        value: v.number(),
        items: v.array(
            v.object({
                title: v.string(),
                description: v.optional(v.string()),
                startTime: v.optional(v.number()),
                endTime: v.optional(v.number()),
            }),
        ),
    }),
    documentItems: defineTable({
        eventId: v.id("events"),
        parentId: v.optional(v.id("documentItems")), // null = root level, otherwise parent folder
        type: v.union(
            v.literal("folder"),
            v.literal("file"),
            v.literal("link"),
        ),

        // Common
        name: v.string(),
        createdAt: v.number(),
        updatedAt: v.number(),

        // Files
        storageId: v.optional(v.id("_storage")),
        fileSize: v.optional(v.number()),
        mimeType: v.optional(v.string()),

        // Links
        url: v.optional(v.string()),
    })
        .index("by_event", ["eventId"])
        .index("by_parent", ["parentId"])
        .index("by_event_and_parent", ["eventId", "parentId"]),
    zoomMeetings: defineTable({
        eventId: v.id("events"),
        password: v.optional(v.string()),
        url: v.string(),
    }).index("by_event", ["eventId"]),
});
