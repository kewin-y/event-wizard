import { useStore } from "@tanstack/react-form";
import { useFieldContext } from "@/hooks/formContext";
import { GenericFieldProps } from "@/hooks/form";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export default function TextField({ label, description }: GenericFieldProps) {
  const field = useFieldContext<string>();

  const errors = useStore(field.store, (state) => state.meta.errors);
  const isInvalid = useStore(
    field.store,
    (state) => state.meta.isTouched && !state.meta.isValid,
  );

  return (
    <Field>
      <FieldLabel htmlFor={`field-${label}`}>{label}</FieldLabel>
      <FieldDescription>{description}</FieldDescription>
      <Input
        id={`field-${label}`}
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        aria-invalid={isInvalid}
      />
      {isInvalid && <FieldError errors={errors} />}
    </Field>
  );
}
