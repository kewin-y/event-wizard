"use client";

import { useState } from "react";

import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";

import * as z from "zod";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAppForm } from "@/hooks/form";

const formSchema = z.object({
  email: z.email({ error: "Enter a valid email address." }),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export default function SignIn() {
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const router = useRouter();
  const { signIn } = useAuthActions();
  const form = useAppForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      await signIn("password", { ...value, flow: flow }).catch((error) => {
        toast("Error", {
          description: error.message,
        });
      });

      router.push("/");
    },
  });
  return (
    <div className="flex flex-col h-screen mx-auto justify-center items-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>{flow === "signIn" ? "Sign In" : "Sign Up"}</CardTitle>
          <CardDescription>
            {flow === "signIn"
              ? "Sign in to access your events"
              : "Create your account"}
          </CardDescription>
        </CardHeader>
        <div className="px-4">
          <Separator />
        </div>
        <CardContent>
          <form
            id="user-info-form"
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <FieldGroup>
              <form.AppField
                name="email"
                children={(field) => <field.TextField label="Email" />}
              />
              <form.AppField
                name="password"
                children={(field) => (
                  <field.TextField
                    label="Password"
                    type="password"
                    description={
                      flow === "signUp"
                        ? "Must be at least 8 characters long"
                        : ""
                    }
                  />
                )}
              />
            </FieldGroup>
          </form>
        </CardContent>
        <div className="px-4">
          <Separator />
        </div>
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
              className="p-0"
              onClick={() => {
                if (flow === "signIn") setFlow("signUp");
                else setFlow("signIn");
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
