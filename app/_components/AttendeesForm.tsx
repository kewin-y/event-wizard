"use client";

import { useEventWizard } from "../_hooks/event-wizard-context";
import EventWizardProgress from "./EventWizardProgress";

import { useAppForm } from "@/hooks/form";
import { AttendeesSchema } from "@/types/events";

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function AttendeesForm() {
  const { step, data, prev, next } = useEventWizard();

  const form = useAppForm({
    defaultValues: data.attendees,
    validators: {
      onBlur: AttendeesSchema,
    },
    onSubmit: async ({ value }) => {
      next({ attendees: value });
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
        <form.AppField name="attendees" mode="array">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field>
                <FieldContent>
                  <FieldLabel> Attendees</FieldLabel>
                  <FieldDescription>
                    Add attendees to your event.
                  </FieldDescription>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </FieldContent>
                <ScrollArea className={`h-72 border rounded-md`}>
                  <div className="flex flex-col p-4 gap-4">
                    {field.state.value.map((_, i) => {
                      return (
                        <FieldSet key={`attendee-${i}`}>
                          <FieldLegend
                            variant="label"
                            className="flex items-center w-full"
                          >
                            <span>Attendee {i + 1}</span>
                            {field.state.value.length > 1 && (
                              <span
                                className="ml-auto underline-offset-3 text-xs hover:underline cursor-pointer"
                                onClick={() => field.removeValue(i)}
                                aria-label={`Remove attendee ${i + 1}`}
                              >
                                Remove
                              </span>
                            )}
                          </FieldLegend>
                          <FieldGroup className="gap-4">
                            <form.AppField
                              name={`attendees[${i}].name`}
                              children={(subField) => (
                                <subField.TextField placeholder="Name" />
                              )}
                            />
                            <form.AppField
                              name={`attendees[${i}].email`}
                              children={(subField) => (
                                <subField.TextField placeholder="Email" />
                              )}
                            />
                          </FieldGroup>
                          {i !== field.state.value.length - 1 && (
                            <FieldSeparator />
                          )}
                        </FieldSet>
                      );
                    })}
                  </div>
                </ScrollArea>
                <Button
                  type="button"
                  onClick={() => field.pushValue({ name: "", email: "" })}
                  className="w-full"
                >
                  Add Attendee
                </Button>
              </Field>
            );
          }}
        </form.AppField>
      </form>
      <EventWizardProgress
        onPrev={() => {
          prev({ attendees: form.state.values });
        }}
      />
    </>
  );
}
