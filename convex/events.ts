import { v } from "convex/values";
import { query, mutation, action } from "./_generated/server";
import { api } from "./_generated/api";
import { getAuthUserId } from "@convex-dev/auth/server";
import { TransformedDocumentItem } from "../types/documents";
import { Id } from "./_generated/dataModel";

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
      enabledFeatures: v.object({
        attendees: v.optional(v.boolean()),
        questions: v.optional(v.boolean()),
        agenda: v.optional(v.boolean()),
        documents: v.optional(v.boolean()),
        zoom: v.optional(v.boolean()),
      }),
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

    const eventId = await ctx.db.insert("events", {
      ...args.setup,
      userId: userId,
    });

    const insertDocuments = (
      parentId: Id<"documentItems"> | undefined,
      docs: TransformedDocumentItem[],
    ): Promise<void[]> =>
      Promise.all(
        docs.map(async (doc) => {
          const docId = await ctx.db.insert("documentItems", {
            type: doc.type,
            name: doc.name,
            storageId: doc.type === "file" ? doc.value : undefined,
            url: doc.type === "link" ? doc.value : undefined,
            eventId,
            parentId,
          });

          if (doc.type === "folder") {
            await insertDocuments(docId, doc.children);
          }
        }),
      );

    if (args.setup.enabledFeatures.attendees && args.attendees) {
      for (const attendee of args.attendees.attendees) {
        await ctx.db.insert("attendees", {
          ...attendee,
          eventId,
        });
      }
    }

    if (args.setup.enabledFeatures.questions && args.questions) {
      for (const question of args.questions.questions) {
        const questionId = await ctx.db.insert("questions", {
          eventId,
          ...question,
        });

        for (const questionOption of question.options) {
          await ctx.db.insert("questionOptions", {
            ...questionOption,
            eventId,
            questionId,
          });
        }
      }
    }

    if (args.setup.enabledFeatures.agenda && args.agenda) {
      for (const agendaDate of args.agenda.agendaDates) {
        const agendaDateId = await ctx.db.insert("agendaDates", {
          eventId,
          ...agendaDate,
        });

        for (const agendaItem of agendaDate.items) {
          await ctx.db.insert("agendaItems", {
            eventId,
            agendaDateId,
            ...agendaItem,
          });
        }
      }
    }

    if (args.setup.enabledFeatures.documents && args.documents) {
      await insertDocuments(
        undefined,
        args.documents as TransformedDocumentItem[],
      );
    }

    if (args.setup.enabledFeatures.zoom && args.zoom) {
      await ctx.db.insert("zoomMeetings", {
        ...args.zoom,
        eventId,
      });
    }
  },
});
