import * as z from "zod";
import { Id } from "../convex/_generated/dataModel";

export const featureNames = [
  "attendees",
  "questions",
  "agenda",
  "documents",
  "zoom",
] as const;

export type FeatureName = (typeof featureNames)[number];

export type Feature = {
  name: FeatureName;
  enabled: boolean;
};

const imageSchema = z
  .instanceof(File)
  .refine((file) => file.size <= 5 * 1024 * 1024, {
    message: "File size must be less than 5MB.",
  })
  .refine(
    (file) =>
      ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
        file.type,
      ),
    {
      message: "File must be a JPEG, PNG, or WebP image.",
    },
  )
  .nullish();

export const DetailsSchema = z.object({
  name: z.string().min(1, "Event name must be nonempty."),
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Enter a valid URL slug."),
  image: imageSchema,
  features: z.array(z.literal(featureNames)),
});

export const AttendeesSchema = z.object({
  attendees: z
    .array(
      z.object({
        name: z.string().min(1, "Attendee name must be nonempty."),
        email: z.email({ error: "Enter a valid email address." }),
      }),
    )
    .min(1, "Must have at least one attendee."),
});

export const QuestionsSchema = z.object({
  questions: z
    .array(
      z.object({
        name: z.string().min(1, "Question name must be nonempty."),
        image: imageSchema,
        options: z
          .array(
            z.object({
              name: z.string().min(1, "Option name must be nonempty."),
              image: imageSchema,
            }),
          )
          .min(2, "Question must have at least two options."),
      }),
    )
    .min(1, "Must have at least one question."),
});

const timeSchema = z
  .string()
  .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time.")
  .or(z.literal(""));

export const AgendaSchema = z.object({
  agendaDates: z
    .array(
      z.object({
        date: z.date(),
        items: z.array(
          z.object({
            title: z
              .string()
              .nonempty({ error: "Agenda item title must be nonempty." }),
            description: z.string(),
            startTime: timeSchema,
            endTime: timeSchema,
          }),
        ),
      }),
    )
    .min(1, "Must have at least one agenda date."),
});

export const ZoomSchema = z.object({
  meetingId: z.string().nonempty({ error: "Meeting ID must be nonempty." }),
  meetingPassword: z
    .string()
    .nonempty({ error: "Meeting password must be nonempty." }),
  url: z.url({ hostname: /^[.*\.]?zoom.us$/, error: "Enter a valid Zoom URL" }),
});

export type DetailsValues = z.infer<typeof DetailsSchema>;
export type AttendeesValues = z.infer<typeof AttendeesSchema>;
export type QuestionsValues = z.infer<typeof QuestionsSchema>;
export type AgendaValues = z.infer<typeof AgendaSchema>;
export type ZoomValues = z.infer<typeof ZoomSchema>;
export type DocumentItem =
  | {
      id: string;
      name: string;
      type: "folder";
      children: DocumentItem[];
    }
  | {
      id: string;
      name: string;
      type: "file";
      value: File;
    }
  | {
      id: string;
      name: string;
      type: "link";
      value: string;
    };

export type TransformedDocumentItem =
  | {
      id: string;
      name: string;
      type: "folder";
      children: TransformedDocumentItem[];
    }
  | {
      id: string;
      name: string;
      type: "file";
      value: Id<"_storage">;
    }
  | {
      id: string;
      name: string;
      type: "link";
      value: string;
    };
