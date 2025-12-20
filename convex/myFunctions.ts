import { v } from "convex/values";
import { query, mutation, action } from "./_generated/server";
import { api } from "./_generated/api";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getEvents = query({
    handler: async (ctx, _) => {
        const userId = await getAuthUserId(ctx);

        if (!userId) {
            throw "Not authenticated.";
        }

        const events = await ctx.db
            .query("events")
            .withIndex("by_user")
            .collect();

        return events;
    },
});
