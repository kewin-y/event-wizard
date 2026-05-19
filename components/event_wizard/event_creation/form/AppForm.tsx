import { createFormHookContexts, createFormHook } from "@tanstack/react-form";
import { TextField } from "./TextField";
import { FileUploadField } from "./FileUploadField";
import { CheckboxArrayField } from "./CheckBoxArrayField";

export type GenericFieldProps = {
  label?: string;
  description?: string;
  placeholder?: string;
};

export const { fieldContext, useFieldContext, formContext, useFormContext } =
  createFormHookContexts();

export const { useAppForm, withForm, withFieldGroup } = createFormHook({
  fieldComponents: {
    TextField,
    FileUploadField,
    CheckboxArrayField,
  },
  formComponents: {},
  fieldContext,
  formContext,
});
