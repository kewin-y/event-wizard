import { ConvexError, v } from "convex/values";
import { query, mutation, action } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { paginationOptsValidator } from "convex/server";

const getEvents = query({
  args: {
    paginationOpts: paginationOptsValidator,
    search: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) throw new ConvexError("Not authenticated.");

    let results;

    if (args.search) {
      results = await ctx.db
        .query("events")
        .withSearchIndex("search_name", (q) =>
          q.search("name", args.search).eq("userId", userId),
        )
        .paginate(args.paginationOpts);
    } else {
      results = await ctx.db
        .query("events")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .order("desc")
        .paginate(args.paginationOpts);
    }

    const page = await Promise.all(
      results.page.map(async (event) => ({
        ...event,
        imageUrl: event.imageStorageId
          ? await ctx.storage.getUrl(event.imageStorageId)
          : undefined,
      })),
    );

    return { ...results, page };
  },
});

export default getEvents;
