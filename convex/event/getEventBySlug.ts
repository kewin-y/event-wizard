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
    if (!event) throw new ConvexError("Event not found.");
    if (event.userId !== userId) throw new ConvexError("Not authorized.");

    return await ctx.db
      .query("attendees")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .paginate(args.paginationOpts);
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
    if (!event) throw new ConvexError("Event not found.");
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
          }))
        );

        return {
          ...question,
          imageUrl: question.imageStorageId
            ? await ctx.storage.getUrl(question.imageStorageId)
            : undefined,
          options: transformedOptions,
        };
      })
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
    if (!event) throw new ConvexError("Event not found.");
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
            q.eq("agendaDateId", agendaDate._id)
          )
          .collect(),
      }))
    );

    return {
      ...result,
      page
    };
  },
});

// Original query kept for backward compatibility (optional)
export const getEventBySlug = query({
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

    const attendees = await ctx.db
      .query("attendees")
      .withIndex("by_event", (q) => q.eq("eventId", event._id))
      .collect();

    const questions = await ctx.db
      .query("questions")
      .withIndex("by_event", (q) => q.eq("eventId", event._id))
      .collect();

    const transformedQuestions = await Promise.all(
      questions.map(async (question) => {
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
          }))
        );

        return {
          ...question,
          imageUrl: question.imageStorageId
            ? await ctx.storage.getUrl(question.imageStorageId)
            : undefined,
          options: transformedOptions,
        };
      })
    );

    const agenda = await ctx.db
      .query("agendaDates")
      .withIndex("by_event", (q) => q.eq("eventId", event._id))
      .collect();

    const transformedAgenda = await Promise.all(
      agenda.map(async (agendaDate) => ({
        ...agendaDate,
        items: await ctx.db
          .query("agendaItems")
          .withIndex("by_agendaDate", (q) =>
            q.eq("agendaDateId", agendaDate._id)
          )
          .collect(),
      }))
    );

    return {
      details: {
        ...event,
        imageUrl: event.imageStorageId
          ? await ctx.storage.getUrl(event.imageStorageId)
          : undefined,
      },
      attendees: attendees,
      questions: transformedQuestions,
      agenda: transformedAgenda,
    };
  },
});

export default getEventBySlug;
