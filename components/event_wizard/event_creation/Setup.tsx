import { Dispatch, SetStateAction } from "react";
import { SetupOpts, Step } from "./types";

import * as z from "zod";
import { useForm } from "@tanstack/react-form";

import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

interface SetupProps {
    steps: Step[];
    setSteps: Dispatch<SetStateAction<Step[]>>;

    setupOpts: SetupOpts;
    setSetupOpts: Dispatch<SetStateAction<SetupOpts>>;
}

const setupSchema = z.object({
    name: z
        .string()
        .min(3, "Event name must be at least 3 characters")
        .max(48, "Event name must be no more than 48 characters"),
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Enter a valid URL slug")
});

export default function Setup({
    steps,
    setSteps,
    setupOpts,
    setSetupOpts,
}: SetupProps) {
    const form = useForm({
        defaultValues: {
            name: "",
            slug: "",
        },
        validators: {
            onChange: setupSchema,
        },
        onSubmit: ({ value }) => {
            setSetupOpts({ ...setupOpts, ...value });
        },
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
                                    Event Name
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
                                    Event Slug
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
            </FieldGroup>
        </form>
    );
}
