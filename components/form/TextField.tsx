import { useStore } from "@tanstack/react-form";
import { useFieldContext } from "@/hooks/formContext";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type TextFieldProps = {
  label?: string | undefined;
  description?: string | undefined;
} & React.InputHTMLAttributes<HTMLInputElement>;

export default function TextField({
  label,
  description,
  ...props
}: TextFieldProps) {
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
        {...props}
      />
      {isInvalid && <FieldError errors={errors} className="min-h-4" />}
    </Field>
  );
}
