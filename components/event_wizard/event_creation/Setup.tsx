import { Dispatch, SetStateAction, useRef, useState } from "react";
import { SetupOpts, Step } from "./types";

import * as z from "zod";
import { useForm } from "@tanstack/react-form";

import { Button } from "@/components/ui/button";
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface SetupProps {
    featureSteps: Step[];
    setFeatureSteps: Dispatch<SetStateAction<Step[]>>;

    setupOpts: SetupOpts;
    setSetupOpts: Dispatch<SetStateAction<SetupOpts>>;
}

const features = ["Attendees", "Questions", "Documents", "Zoom"] as const;

const setupSchema = z.object({
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
                ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
                    file.type,
                ),
            {
                message: "File must be a JPEG, PNG, or WebP image",
            },
        )
        .nullish(),
    features: z
        .array(z.string())
        .refine(
            (value) =>
                value.every((feature) => features.some((f) => f === feature)),
            {
                message: "Invalid feature selected.",
            },
        ),
});

type SetupSchemaType = z.infer<typeof setupSchema>;

export default function Setup({
    featureSteps,
    setFeatureSteps,
    setupOpts,
    setSetupOpts,
}: SetupProps) {
    const imageInputRef = useRef<HTMLInputElement>(null);
    const form = useForm({
        defaultValues: {
            name: "",
            slug: "",
            image: null,
            features: [],
        } as SetupSchemaType,
        validators: {
            onChange: setupSchema,
        },
        onSubmit: ({ value }) => {},
    });

    return (
        <form
            id="setup-form"
            onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
            }}
        >
            <FieldGroup>
                <form.Field
                    name="name"
                    children={(field) => {
                        const isInvalid =
                            field.state.meta.isTouched &&
                            !field.state.meta.isValid;
                        return (
                            <Field>
                                <FieldLabel htmlFor="name">
                                    Event Name*
                                </FieldLabel>
                                <Input
                                    id="name"
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) =>
                                        field.handleChange(e.target.value)
                                    }
                                    aria-invalid={isInvalid}
                                />
                                {isInvalid && (
                                    <FieldError
                                        errors={field.state.meta.errors}
                                    />
                                )}
                            </Field>
                        );
                    }}
                />
                <form.Field
                    name="slug"
                    children={(field) => {
                        const isInvalid =
                            field.state.meta.isTouched &&
                            !field.state.meta.isValid;
                        return (
                            <Field>
                                <FieldLabel htmlFor="slug">
                                    Event Slug*
                                </FieldLabel>
                                <FieldDescription>
                                    Will be used in the event URL
                                </FieldDescription>
                                <Input
                                    id="slug"
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) =>
                                        field.handleChange(e.target.value)
                                    }
                                    aria-invalid={isInvalid}
                                />
                                {isInvalid && (
                                    <FieldError
                                        errors={field.state.meta.errors}
                                    />
                                )}
                            </Field>
                        );
                    }}
                />
                <form.Field
                    name="image"
                    children={(field) => {
                        const isInvalid =
                            field.state.meta.isTouched &&
                            !field.state.meta.isValid;
                        return (
                            <Field>
                                <FieldLabel htmlFor="image">Image</FieldLabel>
                                <FieldDescription>
                                    Add profile image for your event
                                </FieldDescription>
                                <div className="flex gap-2">
                                    <Input
                                        ref={imageInputRef}
                                        id="image"
                                        type="file"
                                        accept="image/png, image/jpeg, image/webp, image/jpg"
                                        onBlur={field.handleBlur}
                                        onChange={(e) => {
                                            const files =
                                                e.target.files?.[0] || null;
                                            field.handleChange(files);
                                        }}
                                        aria-invalid={isInvalid}
                                    />
                                    {field.state.value && (
                                        <Button
                                            variant="destructive"
                                            onClick={() => {
                                                field.handleChange(null);
                                                if (imageInputRef.current) {
                                                    imageInputRef.current.value =
                                                        "";
                                                }
                                            }}
                                        >
                                            Clear
                                        </Button>
                                    )}
                                </div>
                                {isInvalid && (
                                    <FieldError
                                        errors={field.state.meta.errors}
                                    />
                                )}
                            </Field>
                        );
                    }}
                />
                <form.Field
                    name="features"
                    mode="array"
                    children={(field) => {
                        const isInvalid =
                            field.state.meta.isTouched &&
                            !field.state.meta.isValid;
                        return (
                            <>
                                <FieldSet>
                                    <FieldLegend variant="label">
                                        Features
                                    </FieldLegend>
                                    <FieldDescription>
                                        Select features to enable for your event
                                    </FieldDescription>
                                    <FieldGroup data-slot="checkbox-group">
                                        {features.map((feature) => (
                                            <Field
                                                key={feature}
                                                orientation="horizontal"
                                            >
                                                <Checkbox
                                                    id={`features-${feature}`}
                                                    aria-invalid={isInvalid}
                                                    checked={field.state.value.includes(
                                                        feature,
                                                    )}
                                                    name={feature}
                                                    onCheckedChange={(
                                                        checked,
                                                    ) => {
                                                        if (checked) {
                                                            field.pushValue(
                                                                feature,
                                                            );
                                                        } else {
                                                            const index =
                                                                field.state.value.indexOf(
                                                                    feature,
                                                                );
                                                            if (index > -1) {
                                                                field.removeValue(
                                                                    index,
                                                                );
                                                            }
                                                        }
                                                    }}
                                                />
                                                <FieldLabel
                                                    htmlFor={`features-${feature}`}
                                                    className="font-normal"
                                                >
                                                    {feature}
                                                </FieldLabel>
                                            </Field>
                                        ))}
                                    </FieldGroup>
                                </FieldSet>
                            </>
                        );
                    }}
                />
            </FieldGroup>
        </form>
    );
}
