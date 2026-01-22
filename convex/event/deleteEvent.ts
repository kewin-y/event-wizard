import { ConvexError, v } from "convex/values";
import { mutation } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Id } from "../_generated/dataModel";

const deleteEvent = mutation({
  args: { id: v.id("events") },
  handler: async (ctx, args) => {
    const event = await ctx.db
      .query("events")
      .withIndex("by_id", (q) => q.eq("_id", args.id))
      .unique();

    if (!event)
      throw new ConvexError(`Event with id ${args.id} could not be found.`);

    if (event.enabledFeatures.attendees) {
      // NOTE: Collecting everything all at once is dangerous if you have a lot of attendees!
      const attendees = await ctx.db
        .query("attendees")
        .withIndex("by_event", (q) => q.eq("eventId", event._id))
        .collect();

      await Promise.all(
        attendees.map((attendee) => ctx.db.delete("attendees", attendee._id)),
      );
    }

    if (event.enabledFeatures.questions) {
      const questions = await ctx.db
        .query("questions")
        .withIndex("by_event", (q) => q.eq("eventId", event._id))
        .collect();

      for (const question of questions) {
        const questionOptions = await ctx.db
          .query("questionOptions")
          .withIndex("by_question", (q) => q.eq("questionId", question._id))
          .collect();

        await Promise.all(
          questionOptions.map(async (opt) => {
            if (opt.imageStorageId)
              await ctx.storage.delete(opt.imageStorageId);

            await ctx.db.delete("questionOptions", opt._id);
          }),
        );
      }

      await Promise.all(
        questions.map(async (question) => {
          if (question.imageStorageId)
            await ctx.storage.delete(question.imageStorageId);

          await ctx.db.delete("questions", question._id);
        }),
      );
    }

    if (event.enabledFeatures.agenda) {
      const agendaDates = await ctx.db
        .query("agendaDates")
        .withIndex("by_event", (q) => q.eq("eventId", event._id))
        .collect();

      for (const agendaDate of agendaDates) {
        const agendaItems = await ctx.db
          .query("agendaItems")
          .withIndex("by_agendaDate", (q) =>
            q.eq("agendaDateId", agendaDate._id),
          )
          .collect();

        await Promise.all(
          agendaItems.map((agendaItem) =>
            ctx.db.delete("agendaItems", agendaItem._id),
          ),
        );
      }

      await Promise.all(
        agendaDates.map((agendaDate) =>
          ctx.db.delete("agendaDates", agendaDate._id),
        ),
      );
    }

    if (event.enabledFeatures.documents) {
      const documentItems = await ctx.db
        .query("documentItems")
        .withIndex("by_event_and_parent", (q) => q.eq("eventId", event._id))
        .collect();

      await Promise.all(
        documentItems.map(async (documentItem) => {
          if (documentItem.storageId)
            await ctx.storage.delete(documentItem.storageId);

          await ctx.db.delete("documentItems", documentItem._id);
        }),
      );
    }

    if (event.enabledFeatures.zoom) {
      const zoomMeetings = await ctx.db
        .query("zoomMeetings")
        .withIndex("by_event", (q) => q.eq("eventId", event._id))
        .collect();

      await Promise.all(
        zoomMeetings.map((zoomMeeting) =>
          ctx.db.delete("zoomMeetings", zoomMeeting._id),
        ),
      );
    }

    if (event.imageStorageId) await ctx.storage.delete(event.imageStorageId);

    await ctx.db.delete("events", event._id);
  },
});

export default deleteEvent;
