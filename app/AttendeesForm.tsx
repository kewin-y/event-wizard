import { useWizard } from "@/components/wizard-context";
import WizardProgress from "@/components/WizardProgress";
import { useAppForm } from "@/hooks/form";
import { AttendeesSchema } from "@/types/event-wizard-common";

import {
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function AttendeesForm() {
  const { step, data, prev, next } = useWizard();

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
        className="border-t border-b"
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
              <FieldSet>
                <div className="px-6 py-4 border-b">
                  <FieldSet>
                    <FieldLegend variant="label">Attendees</FieldLegend>
                    <FieldDescription>
                      Add attendees to your event.
                    </FieldDescription>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </FieldSet>
                </div>
                <ScrollArea className={`h-56`}>
                  <div className="flex flex-col gap-4 px-6 pb-4">
                    {field.state.value.map((_, i) => {
                      return (
                        <FieldSet key={`attende-${i}`}>
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
                          <FieldGroup className="gap-2">
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
                        </FieldSet>
                      );
                    })}
                  </div>
                </ScrollArea>
                <div className="px-6 py-4 border-t">
                  <Button
                    type="button"
                    onClick={() => field.pushValue({ name: "", email: "" })}
                    className="w-full"
                  >
                    Add Attendee
                  </Button>
                </div>
              </FieldSet>
            );
          }}
        </form.AppField>
      </form>
      <WizardProgress
        onPrev={() => {
          prev({ attendees: form.state.values });
        }}
      />
    </>
  );
}
