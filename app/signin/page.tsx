"use client";

import { useState } from "react";

import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";

import * as z from "zod";
import { useForm } from "@tanstack/react-form";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

const formSchema = z.object({
    email: z.email({ error: "Enter a valid email address." }),
    password: z.string().min(8, "Password must be at least 8 characters."),
});

export default function SignIn() {
    const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
    const router = useRouter();
    const { signIn } = useAuthActions();
    const form = useForm({
        defaultValues: {
            email: "",
            password: "",
        },
        validators: {
            onSubmit: formSchema,
        },
        onSubmit: async ({ value }) => {
            await signIn("password", { ...value, flow: flow }).catch(
                (error) => {
                    toast("Error", {
                        description: error.message,
                    });
                },
            );

            router.push("/");
        },
    });
    return (
        <div className="flex flex-col h-screen mx-auto justify-center items-center">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>
                        {flow === "signIn" ? "Sign In" : "Sign Up"}
                    </CardTitle>
                    <CardDescription>
                        {flow === "signIn"
                            ? "Sign in to access your events"
                            : "Create your account"}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form
                        id="user-info-form"
                        onSubmit={(e) => {
                            e.preventDefault();
                            form.handleSubmit();
                        }}
                    >
                        <FieldGroup>
                            <form.Field
                                name="email"
                                children={(field) => {
                                    const isInvalid =
                                        field.state.meta.isTouched &&
                                        !field.state.meta.isValid;
                                    return (
                                        <Field data-invalid={isInvalid}>
                                            <FieldLabel htmlFor="email">
                                                Email
                                            </FieldLabel>
                                            <Input
                                                id="email"
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={(e) =>
                                                    field.handleChange(
                                                        e.target.value,
                                                    )
                                                }
                                                aria-invalid={isInvalid}
                                            />
                                            {isInvalid && (
                                                <FieldError
                                                    errors={
                                                        field.state.meta.errors
                                                    }
                                                />
                                            )}
                                        </Field>
                                    );
                                }}
                            />
                            <form.Field
                                name="password"
                                children={(field) => {
                                    const isInvalid =
                                        field.state.meta.isTouched &&
                                        !field.state.meta.isValid;
                                    return (
                                        <Field data-invalid={isInvalid}>
                                            <FieldLabel htmlFor="password">
                                                Password
                                            </FieldLabel>
                                            {flow === "signUp" && (
                                                <FieldDescription>
                                                    Must be at least 8
                                                    characters long
                                                </FieldDescription>
                                            )}
                                            <Input
                                                id="password"
                                                type="password"
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={(e) =>
                                                    field.handleChange(
                                                        e.target.value,
                                                    )
                                                }
                                                aria-invalid={isInvalid}
                                            />
                                            {isInvalid && (
                                                <FieldError
                                                    errors={
                                                        field.state.meta.errors
                                                    }
                                                />
                                            )}
                                        </Field>
                                    );
                                }}
                            />
                        </FieldGroup>
                    </form>
                </CardContent>
                <CardFooter className="flex-col gap-2">
                    <Button className="w-full" form="user-info-form">
                        {flow === "signIn" ? "Sign In" : "Sign Up"}
                    </Button>
                    <div className="flex gap-2 items-center self-start">
                        <CardDescription>
                            {flow === "signIn"
                                ? "Don't have an account?"
                                : "Already have an account?"}
                        </CardDescription>
                        <Button
                            variant="link"
                            className="p-0 hover:cursor-pointer"
                            onClick={() => {
                                if (flow === "signIn") {
                                    setFlow("signUp");
                                    console.log(flow);
                                } else {
                                    setFlow("signIn");
                                }
                            }}
                        >
                            {flow === "signIn" ? "Sign Up" : "Sign In"}
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
