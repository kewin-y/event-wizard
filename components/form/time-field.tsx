import { useStore } from "@tanstack/react-form";
import { useFieldContext } from "@/hooks/formContext";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export default function TimeField({ label }: { label: string }) {
  const field = useFieldContext<string>();
  const errors = useStore(field.store, (state) => state.meta.errors);
  const isInvalid = useStore(
    field.store,
    (state) => state.meta.isTouched && !state.meta.isValid,
  );

  return (
    <Field orientation="responsive">
      <FieldLabel>{label}</FieldLabel>
      <Input
        id={`field-${label}`}
        type="time"
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        aria-invalid={isInvalid}
      />
      {isInvalid && <FieldError errors={errors} className="min-h-4" />}
    </Field>
  );
}
