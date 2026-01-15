"use client";

import { useEventWizard } from "../_hooks/event-wizard-context";
import EventWizardProgress from "./EventWizardProgress";

import { useAppForm } from "@/hooks/form";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AgendaSchema } from "@/types/events";
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

export default function AgendaForm() {
  const { step, data, prev, next } = useEventWizard();

  const form = useAppForm({
    defaultValues: data.agenda,
    validators: {
      onBlur: AgendaSchema,
    },
    onSubmit: async ({ value }) => {
      next({ agenda: value });
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
        <form.AppField name="agendaDates" mode="array">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field>
                <FieldContent>
                  <FieldLabel>Agenda</FieldLabel>
                  <FieldDescription>
                    Add entries to your event agenda. Times are based on your
                    local timezone.
                  </FieldDescription>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </FieldContent>
                <ScrollArea className="h-72 border rounded-md">
                  <div className="flex flex-col p-4 gap-4">
                    {field.state.value.map((_, i) => (
                      <FieldSet key={`agenda-date-${i}`}>
                        <FieldLegend
                          variant="label"
                          className="flex items-center w-full"
                        >
                          <span>Agenda Date {i + 1}</span>
                          {field.state.value.length > 1 && (
                            <span
                              className="ml-auto underline-offset-3 text-xs hover:underline cursor-pointer"
                              onClick={() => field.removeValue(i)}
                              aria-label={`Remove Agenda Item ${i + 1}`}
                            >
                              Remove
                            </span>
                          )}
                        </FieldLegend>
                        <form.AppField
                          name={`agendaDates[${i}].date`}
                          children={(subField) => <subField.DateField />}
                        />
                        <div className="flex items-center">
                          <div className="grow border-t border-border" />
                          <span className="mx-3 text-sm text-muted-foreground">
                            Items for agenda date {i + 1}
                          </span>
                          <div className="grow border-t border-border" />
                        </div>
                        <form.AppField
                          name={`agendaDates[${i}].items`}
                          mode="array"
                        >
                          {(subField) => (
                            <FieldSet>
                              {subField.state.value.map((_, j) => (
                                <FieldSet key={`item-${i}${j}`}>
                                  {/* TODO: Make this title thing its own component*/}
                                  <FieldLegend
                                    variant="label"
                                    className="flex items-center w-full"
                                  >
                                    <span>Item {j + 1}</span>
                                    {subField.state.value.length > 1 && (
                                      <span
                                        className="ml-auto underline-offset-3 text-xs hover:underline cursor-pointer"
                                        onClick={() => subField.removeValue(j)}
                                        aria-label={`Remove Agenda Item ${j + 1}`}
                                      >
                                        Remove
                                      </span>
                                    )}
                                  </FieldLegend>
                                  <FieldGroup className="gap-4">
                                    <form.AppField
                                      name={`agendaDates[${i}].items[${j}].title`}
                                      children={(subField_) => (
                                        <subField_.TextField placeholder="Title" />
                                      )}
                                    />
                                    <form.AppField
                                      name={`agendaDates[${i}].items[${j}].description`}
                                      children={(subField_) => (
                                        <subField_.TextField placeholder="Description (Optional)" />
                                      )}
                                    />
                                    <form.AppField
                                      name={`agendaDates[${i}].items[${j}].startTime`}
                                      children={(subField_) => (
                                        <subField_.TimeField label="Start Time" />
                                      )}
                                    />
                                    <form.AppField
                                      name={`agendaDates[${i}].items[${j}].endTime`}
                                      children={(subField_) => (
                                        <subField_.TimeField label="End Time" />
                                      )}
                                    />
                                  </FieldGroup>
                                </FieldSet>
                              ))}
                              <Button
                                variant="secondary"
                                onClick={() => {
                                  subField.pushValue({
                                    title: "",
                                    description: "",
                                    startTime: "",
                                    endTime: "",
                                  });
                                }}
                              >
                                Add Item
                              </Button>
                            </FieldSet>
                          )}
                        </form.AppField>
                        {i !== field.state.value.length - 1 && (
                          <FieldSeparator />
                        )}
                      </FieldSet>
                    ))}
                  </div>
                </ScrollArea>
                <Button
                  className="w-full"
                  type="button"
                  onClick={() =>
                    field.pushValue({
                      date: new Date(),
                      items: [
                        {
                          title: "",
                          description: "",
                          startTime: "",
                          endTime: "",
                        },
                      ],
                    })
                  }
                >
                  Add Agenda Date
                </Button>
              </Field>
            );
          }}
        </form.AppField>
      </form>
      <EventWizardProgress onPrev={() => prev({ agenda: form.state.values })} />
    </>
  );
}
