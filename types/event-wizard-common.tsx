import * as z from "zod";

export const featureNames = [
  "Attendees",
  "Questions",
  "Agenda",
  "Documents",
  "Zoom",
] as const;

export type FeatureName = (typeof featureNames)[number];

export type Feature = {
  name: FeatureName;
  enabled: boolean;
};

export const SetupSchema = z.object({
  name: z.string().min(1, "Event name must be nonempty."),
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Enter a valid URL slug."),
  image: z
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
    .nullish(),
  features: z
    .array(z.string())
    .refine(
      (value) =>
        value.every((feature) => featureNames.some((f) => f === feature)),
      {
        message: "Invalid feature selected.",
      },
    ),
});

export const AttendeesSchema = z.object({
  arr: z.array(
    z.object({
      name: z.string().min(1, "Attendee name must be nonempty."),
      email: z.email({ error: "Enter a valid email address." }),
    }),
  ),
});

export type SetupValues = z.infer<typeof SetupSchema>;
export type AttendeesValues = z.infer<typeof AttendeesSchema>;
