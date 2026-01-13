import { v } from "convex/values";
import { query, mutation, action } from "./_generated/server";
import { api } from "./_generated/api";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getEvents = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) throw new Error("Not authenticated.");

    // collect has upper limit (4000 documents)
    // TODO: rewrite and figure out a way to paginate instead
    const events = await ctx.db
      .query("events")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    return events;
  },
});

export const createEvent = mutation({
  args: {
    setup: v.object({
      name: v.string(),
      slug: v.string(),
      imageStorageId: v.optional(v.id("_storage")),
    }),
    features: v.object({
      attendees: v.optional(v.boolean()),
      questions: v.optional(v.boolean()),
      agenda: v.optional(v.boolean()),
      documents: v.optional(v.boolean()),
      zoom: v.optional(v.boolean()),
    }),
    attendees: v.optional(
      v.object({
        attendees: v.array(
          v.object({
            name: v.string(),
            email: v.string(),
          }),
        ),
      }),
    ),
    questions: v.optional(
      v.object({
        questions: v.array(
          v.object({
            name: v.string(),
            imageStorageId: v.optional(v.id("_storage")),
            options: v.array(
              v.object({
                name: v.string(),
                imageStorageId: v.optional(v.id("_storage")),
              }),
            ),
          }),
        ),
      }),
    ),
    agenda: v.optional(
      v.object({
        agendaDates: v.array(
          v.object({
            date: v.number(),
            items: v.array(
              v.object({
                title: v.string(),
                description: v.string(),
                startTime: v.string(),
                endTime: v.string(),
              }),
            ),
          }),
        ),
      }),
    ),
    documents: v.optional(
      v.array(
        v.object({
          id: v.string(),
          name: v.string(),
          type: v.union(
            v.literal("folder"),
            v.literal("file"),
            v.literal("link"),
          ),
          children: v.optional(v.array(v.any())),
          value: v.optional(v.union(v.string(), v.id("_storage"))),
        }),
      ),
    ),
    zoom: v.optional(
      v.object({
        meetingId: v.string(),
        meetingPassword: v.string(),
        url: v.string(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) throw new Error("Not authenticated.");
  },
});
