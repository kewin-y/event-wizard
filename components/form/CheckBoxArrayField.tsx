// NOTE: Probably won't need this component anymore
import { useFieldContext } from "@/hooks/formContext";
import { GenericFieldProps } from "@/hooks/form";

import { useStore } from "@tanstack/react-form";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";

export default function CheckboxArrayField({
  label,
  description,
  arr,
}: GenericFieldProps & {
  arr: string[];
}) {
  const field = useFieldContext<string[]>();

  const errors = useStore(field.store, (state) => state.meta.errors);
  const isInvalid = useStore(
    field.store,
    (state) => state.meta.isTouched && !state.meta.isValid,
  );

  return (
    <Field>
      <FieldSet>
        <FieldLegend variant="label">{label}</FieldLegend>
        <FieldDescription>{description}</FieldDescription>
        <FieldGroup data-slot="checkbox-group">
          {arr.map((name) => (
            <Field
              key={`checkbox-array-field-${name}`}
              orientation="horizontal"
            >
              <Checkbox
                id={`checkbox-array-field-${name}`}
                aria-invalid={isInvalid}
                checked={field.state.value.includes(name)}
                name={name}
                onCheckedChange={(checked) => {
                  if (checked) {
                    field.pushValue(name);
                  } else {
                    const index = field.state.value.indexOf(name);
                    if (index > -1) {
                      field.removeValue(index);
                    }
                  }
                }}
              />
              <FieldLabel
                htmlFor={`checkbox-array-field-${name}`}
                className="font-normal"
              >
                {name}
              </FieldLabel>
            </Field>
          ))}
        </FieldGroup>
      </FieldSet>
      {isInvalid && <FieldError errors={errors} />}
    </Field>
  );
}
