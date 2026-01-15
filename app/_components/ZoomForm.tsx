"use client";

import { useEventWizard } from "../_hooks/event-wizard-context";
import EventWizardProgress from "./EventWizardProgress";

import {
  FieldDescription,
  FieldGroup,
  FieldLegend,
  FieldSet,
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
        className="border-t border-b"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <div className="px-6 py-4 border-b">
          <FieldSet>
            <FieldLegend variant="label">Zoom</FieldLegend>
            <FieldDescription>Integrate Zoom with your event.</FieldDescription>
          </FieldSet>
        </div>
        <FieldGroup className="px-6 py-4">
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
