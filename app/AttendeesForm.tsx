import { useWizard } from "@/components/wizard-context";
import WizardProgress from "@/components/WizardProgress";
import { useAppForm } from "@/hooks/form";
import { AttendeesSchema } from "@/types/event-wizard-common";

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";

export default function AttendeesForm() {
  const { step, data, next, setAttendeesValues } = useWizard();

  const form = useAppForm({
    defaultValues: data.attendees,
    validators: {
      onBlur: AttendeesSchema,
    },
    onSubmit: async ({ value }) => {
      setAttendeesValues(value);
      next();
    },
  });

  return (
    <>
      <form
        id={step.formId}
        className="px-6 py-4 border-b border-t"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <form.AppField name="arr" mode="array">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <FieldSet>
                {field.state.value.map((_, idx) => {
                  return (
                    <FieldSet key={idx}>
                      <FieldLegend
                        variant="label"
                        className="flex items-center w-full"
                      >
                        <span>Attendee {idx + 1}</span>
                        {field.state.value.length > 1 && (
                          <span
                            className="ml-auto underline-offset-3 text-xs hover:underline cursor-pointer"
                            onClick={() => field.removeValue(idx)}
                            aria-label={`Remove email ${idx + 1}`}
                          >
                            Remove
                          </span>
                        )}
                      </FieldLegend>
                      <FieldGroup className="gap-2">
                        <form.AppField
                          name={`arr[${idx}].name`}
                          children={(subField) => (
                            <subField.TextField placeholder="Name" />
                          )}
                        />
                        <form.AppField
                          name={`arr[${idx}].email`}
                          children={(subField) => (
                            <subField.TextField placeholder="Email" />
                          )}
                        />
                      </FieldGroup>
                    </FieldSet>
                  );
                })}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => field.pushValue({ name: "", email: "" })}
                >
                  Add Attendee
                </Button>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </FieldSet>
            );
          }}
        </form.AppField>
      </form>
      <WizardProgress
        onPrev={() => {
          setAttendeesValues(form.state.values);
        }}
      />
    </>
  );
}
