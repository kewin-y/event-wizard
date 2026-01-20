import { ConvexError, v } from "convex/values";
import { query, mutation, action } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Id } from "./_generated/dataModel";
import { TransformedDocumentItem } from "../types/events";
import { paginationOptsValidator } from "convex/server";

export const getBySlug = query({
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
      ...(event.imageStorageId
        ? {
            imageUrl: await ctx.storage.getUrl(event.imageStorageId),
          }
        : {}),
    };
  },
});

export const isSlugUnique = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const event = await ctx.db
      .query("events")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    return event === null;
  },
});

export const list = query({
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
        ...(event.imageStorageId
          ? {
              imageUrl: await ctx.storage.getUrl(event.imageStorageId),
            }
          : {}),
      })),
    );

    return { ...results, page };
  },
});

export const create = mutation({
  args: {
    details: v.object({
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

    if (!userId) throw new ConvexError("Not authenticated.");

    const existing = await ctx.db
      .query("events")
      .withIndex("by_slug", (q) => q.eq("slug", args.details.slug))
      .unique();

    if (existing) {
      throw new Error("Event with same slug already exists");
    }

    const eventId = await ctx.db.insert("events", {
      ...args.details,
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

    if (args.details.enabledFeatures.attendees && args.attendees) {
      for (const attendee of args.attendees.attendees) {
        await ctx.db.insert("attendees", {
          ...attendee,
          eventId,
        });
      }
    }

    if (args.details.enabledFeatures.questions && args.questions) {
      for (const question of args.questions.questions) {
        const { options: _, ...q } = question;

        const questionId = await ctx.db.insert("questions", {
          eventId,
          ...q,
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

    if (args.details.enabledFeatures.agenda && args.agenda) {
      for (const agendaDate of args.agenda.agendaDates) {
        const agendaDateId = await ctx.db.insert("agendaDates", {
          eventId,
          date: agendaDate.date,
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

    if (args.details.enabledFeatures.documents && args.documents) {
      await insertDocuments(
        undefined,
        args.documents as TransformedDocumentItem[],
      );
    }

    if (args.details.enabledFeatures.zoom && args.zoom) {
      await ctx.db.insert("zoomMeetings", {
        ...args.zoom,
        eventId,
      });
    }
  },
});
