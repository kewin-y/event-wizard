import { Id } from "@/convex/_generated/dataModel";
import * as z from "zod";

export type Step = {
    name: string;
    enabled: boolean;
};

export type SetupOpts = {
    name: string;
    slug: string;
    imageStorageId?: Id<"_storage">;
};

const features = ["Attendees", "Questions", "Agenda", "Documents", "Zoom"] as const;

export const EventSchema = z.object({
    setup: z.object({
        name: z
            .string()
            .min(3, "Event name must be at least 3 characters")
            .max(48, "Event name must be no more than 48 characters"),
        slug: z
            .string()
            .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Enter a valid URL slug"),
        image: z
            .instanceof(File)
            .refine((file) => file.size <= 5 * 1024 * 1024, {
                message: "File size must be less than 5MB",
            })
            .refine(
                (file) =>
                    [
                        "image/jpeg",
                        "image/jpg",
                        "image/png",
                        "image/webp",
                    ].includes(file.type),
                {
                    message: "File must be a JPEG, PNG, or WebP image",
                },
            )
            .nullish(),
        features: z
            .array(z.string())
            .refine(
                (value) =>
                    value.every((feature) =>
                        features.some((f) => f === feature),
                    ),
                {
                    message: "Invalid feature selected.",
                },
            ),
    }),
});

export type EventSchemaValues = z.infer<typeof EventSchema>;
