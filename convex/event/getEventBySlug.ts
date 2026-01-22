import { ConvexError, v } from "convex/values";
import { query } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { paginationOptsValidator } from "convex/server";

// Get event details only
export const getEventDetails = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated.");

    const event = await ctx.db
      .query("events")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    if (!event) return null;

    if (event.userId !== userId) throw new ConvexError("Not authorized.");

    return {
      ...event,
      imageUrl: event.imageStorageId
        ? await ctx.storage.getUrl(event.imageStorageId)
        : undefined,
    };
  },
});

// Get attendees with pagination
export const getEventAttendees = query({
  args: {
    eventId: v.id("events"),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated.");

    // Verify user owns the event
    const event = await ctx.db.get(args.eventId);

    if (!event) {
      return {
        page: [],
        isDone: true,
        continueCursor: "",
      };
    }

    if (event.userId !== userId) throw new ConvexError("Not authorized.");

    const foo = await ctx.db
      .query("attendees")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .paginate(args.paginationOpts);

    return foo;
  },
});

// Get questions with pagination
export const getEventQuestions = query({
  args: {
    eventId: v.id("events"),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated.");

    // Verify user owns the event
    const event = await ctx.db.get(args.eventId);
    if (!event) {
      return {
        page: [],
        isDone: true,
        continueCursor: "",
      };
    }
    if (event.userId !== userId) throw new ConvexError("Not authorized.");

    const result = await ctx.db
      .query("questions")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .paginate(args.paginationOpts);

    const transformedQuestions = await Promise.all(
      result.page.map(async (question) => {
        const options = await ctx.db
          .query("questionOptions")
          .withIndex("by_question", (q) => q.eq("questionId", question._id))
          .collect();

        const transformedOptions = await Promise.all(
          options.map(async (option) => ({
            ...option,
            imageUrl: option.imageStorageId
              ? await ctx.storage.getUrl(option.imageStorageId)
              : undefined,
          })),
        );

        return {
          ...question,
          imageUrl: question.imageStorageId
            ? await ctx.storage.getUrl(question.imageStorageId)
            : undefined,
          options: transformedOptions,
        };
      }),
    );

    return {
      ...result,
      page: transformedQuestions,
    };
  },
});

// Get agenda with pagination
export const getEventAgenda = query({
  args: {
    eventId: v.id("events"),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated.");

    // Verify user owns the event
    const event = await ctx.db.get(args.eventId);
    if (!event) {
      return {
        page: [],
        isDone: true,
        continueCursor: "",
      };
    }
    if (event.userId !== userId) throw new ConvexError("Not authorized.");

    const result = await ctx.db
      .query("agendaDates")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .paginate(args.paginationOpts);

    const page = await Promise.all(
      result.page.map(async (agendaDate) => ({
        ...agendaDate,
        items: await ctx.db
          .query("agendaItems")
          .withIndex("by_agendaDate", (q) =>
            q.eq("agendaDateId", agendaDate._id),
          )
          .collect(),
      })),
    );

    return {
      ...result,
      page,
    };
  },
});

export const getEventRootDocument = query({
  args: {
    eventId: v.id("events"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated.");

    // Verify user owns the event
    const event = await ctx.db.get(args.eventId);
    if (!event) {
      return {
        page: [],
        isDone: true,
        continueCursor: "",
      };
    }
    if (event.userId !== userId) throw new ConvexError("Not authorized.");

    const rootDocument = await ctx.db
      .query("documentItems")
      .withIndex("by_event_and_parent", (q) =>
        q.eq("eventId", args.eventId).eq("parentId", undefined),
      )
      .unique();

    return rootDocument;
  },
});

export const getEventDocuments = query({
  args: {
    paginationOpts: paginationOptsValidator,
    eventId: v.id("events"),
    parentId: v.optional(v.id("documentItems")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated.");

    // Verify user owns the event
    const event = await ctx.db.get(args.eventId);
    if (!event) {
      return {
        page: [],
        isDone: true,
        continueCursor: "",
      };
    }
    if (event.userId !== userId) throw new ConvexError("Not authorized.");

    const documentItems = await ctx.db
      .query("documentItems")
      .withIndex("by_event_and_parent", (q) =>
        q.eq("eventId", args.eventId).eq("parentId", args.parentId),
      )
      .paginate(args.paginationOpts);

    return documentItems;
  },
});
