import { createFormHookContexts, createFormHook } from "@tanstack/react-form";

import { useStore } from "@tanstack/react-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { useRef } from "react";

export const { fieldContext, useFieldContext, formContext, useFormContext } =
  createFormHookContexts();

type GenericFieldProps = {
  label: string;
  description: string;
};

export function TextField({ label, description }: GenericFieldProps) {
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

export function FileUploadField({
  label,
  description,
  accept,
}: GenericFieldProps & { accept: string }) {
  const field = useFieldContext<File | null | undefined>();

  const errors = useStore(field.store, (state) => state.meta.errors);
  const isInvalid = useStore(
    field.store,
    (state) => state.meta.isTouched && !state.meta.isValid,
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <Field>
      <FieldLabel htmlFor={`field-${label}`}>{label}</FieldLabel>
      <FieldDescription>{description}</FieldDescription>

      <div className="flex gap-2">
        <Input
          ref={fileInputRef}
          id="image"
          type="file"
          accept={accept}
          onBlur={field.handleBlur}
          onChange={(e) => {
            const files = e.target.files?.[0] || null;
            field.handleChange(files);
          }}
          aria-invalid={isInvalid}
        />
        <Button
          variant="outline"
          disabled={!field.state.value}
          aria-disabled={!field.state.value}
          onClick={() => {
            field.handleChange(null);
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
          }}
        >
          Clear
        </Button>
      </div>
      {isInvalid && <FieldError errors={errors} />}
    </Field>
  );
}

export const { useAppForm, withForm, withFieldGroup } = createFormHook({
  fieldComponents: {
    TextField,
    FileUploadField,
  },
  formComponents: {},
  fieldContext,
  formContext,
});
