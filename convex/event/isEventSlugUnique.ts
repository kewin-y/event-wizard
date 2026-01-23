import { v } from "convex/values";
import { query } from "../_generated/server";

const isSlugUnique = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const event = await ctx.db
      .query("events")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    return event === null;
  },
});

export default isSlugUnique;
