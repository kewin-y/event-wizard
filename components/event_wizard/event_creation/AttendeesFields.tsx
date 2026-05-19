import { Button } from "@/components/ui/button";
import {
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { withFieldGroup } from "./form/AppForm";
import { EventSchemaValues } from "./types";

type AttendeesFieldsValues = Pick<EventSchemaValues, "attendees">;

const AttendeesFields = withFieldGroup({
  defaultValues: {} as AttendeesFieldsValues,
  render: function Render({ group }) {
    return (
      <group.AppField name="attendees" mode="array">
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
                      <group.AppField
                        name={`attendees[${idx}].name`}
                        children={(subField) => (
                          <subField.TextField placeholder="Name" />
                        )}
                      />
                      <group.AppField
                        name={`attendees[${idx}].email`}
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
      </group.AppField>
    );
  },
});

export default AttendeesFields;
