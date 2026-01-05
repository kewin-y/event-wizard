import { useFieldContext } from "@/hooks/formContext";
import { GenericFieldProps } from "@/hooks/form";
import { useStore } from "@tanstack/react-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { useRef } from "react";

type FileUploadFieldProps = {
  label?: string | undefined;
  description?: string | undefined;
  accept: string;
};

// TODO: Change this to a dropzone instead of relying on default input behaviour
export default function FileUploadField({
  label,
  description,
  accept,
}: FileUploadFieldProps) {
  const field = useFieldContext<File | null | undefined>();

  const errors = useStore(field.store, (state) => state.meta.errors);
  const isInvalid = useStore(
    field.store,
    (state) => state.meta.isTouched && !state.meta.isValid,
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <Field>
      {label && <FieldLabel htmlFor={`field-${label}`}>{label}</FieldLabel>}
      {description && <FieldDescription>{description}</FieldDescription>}
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
