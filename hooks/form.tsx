import { fieldContext, formContext } from "./formContext";
import { createFormHook } from "@tanstack/react-form";

import TextField from "@/components/form/TextField";
import FileUploadField from "@/components/form/FileUploadField";
import CheckboxArrayField from "@/components/form/CheckBoxArrayField";
import DateField from "@/components/form/DateField";

export type GenericFieldProps = {
  label: string;
  description: string;
};

export const { useAppForm, withForm, withFieldGroup } = createFormHook({
  fieldComponents: {
    TextField,
    FileUploadField,
    CheckboxArrayField,
    DateField,
  },
  formComponents: {},
  fieldContext,
  formContext,
});
