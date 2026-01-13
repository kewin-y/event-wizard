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
    name: v.string(),
    slug: v.string(),
    imageStorageId: v.optional(v.id("_storage")),
    enabledFeatures: v.object({
      attendees: v.optional(v.boolean()),
      questions: v.optional(v.boolean()),
      agenda: v.optional(v.boolean()),
      documents: v.optional(v.boolean()),
      zoom: v.optional(v.boolean()),
    }),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) throw new Error("Not authenticated.");

    const newEventId = await ctx.db.insert("events", {
      name: args.name,
      slug: args.slug,
      imageStorageId: args.imageStorageId,
      userId: userId,
      enabledFeatures: args.enabledFeatures,
    });

    return newEventId;
  },
});
