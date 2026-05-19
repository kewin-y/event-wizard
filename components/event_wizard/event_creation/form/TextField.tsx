import { useStore } from "@tanstack/react-form";
import { GenericFieldProps, useFieldContext } from "./AppForm";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function TextField({
  label,
  description,
  placeholder,
}: GenericFieldProps) {
  const field = useFieldContext<string>();

  const errors = useStore(field.store, (state) => state.meta.errors);
  const isInvalid = useStore(
    field.store,
    (state) => state.meta.isTouched && !state.meta.isValid,
  );

  return (
    <Field>
      {label && <FieldLabel htmlFor={`field-${label}`}>{label}</FieldLabel>}
      {description && <FieldDescription>{description}</FieldDescription>}
      <Input
        id={`field-${label}`}
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        aria-invalid={isInvalid}
        placeholder={placeholder}
      />
      {isInvalid && <FieldError errors={errors} />}
    </Field>
  );
}
