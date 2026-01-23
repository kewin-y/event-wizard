"use client";

import { useEventWizard } from "../_hooks/event-wizard-context";
import EventWizardProgress from "./EventWizardProgress";

import {
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";

import { useAppForm } from "@/hooks/form";
import { ZoomSchema } from "@/types/events";

export default function ZoomForm() {
  const { step, prev, next, data } = useEventWizard();
  const form = useAppForm({
    defaultValues: data.zoom,
    validators: {
      onChange: ZoomSchema,
    },
    onSubmit: async ({ value }) => {
      next({ zoom: value });
    },
  });
  return (
    <>
      <form
        id={step.formId}
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <FieldGroup className="gap-4">
          <FieldContent>
            <FieldLabel>Zoom</FieldLabel>
            <FieldDescription>Integrate Zoom with your event</FieldDescription>
          </FieldContent>
          <FieldSeparator />
          <form.AppField
            name="meetingId"
            children={(field) => (
              <field.TextField
                label="Meeting ID"
                placeholder="e.g., 123 456 7890"
              />
            )}
          />
          <form.AppField
            name="meetingPassword"
            children={(field) => (
              <field.TextField
                label="Meeting Password"
                placeholder="e.g., 123456"
              />
            )}
          />
          <form.AppField
            name="url"
            children={(field) => (
              <field.TextField
                label="Meeting URL"
                placeholder="e.g., https://zoom.us/j/9876543210"
              />
            )}
          />
        </FieldGroup>
      </form>
      <EventWizardProgress onPrev={() => prev({ zoom: form.state.values })} />
    </>
  );
}
