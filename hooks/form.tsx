import { fieldContext, formContext } from "./formContext";
import { createFormHook } from "@tanstack/react-form";

import TextField from "@/components/form/TextField";
import FileUploadField from "@/components/form/FileUploadField";
import DateField from "@/components/form/DateField";
import TimeField from "@/components/form/TimeField";

export const { useAppForm, withForm, withFieldGroup } = createFormHook({
  fieldComponents: {
    TextField,
    FileUploadField,
    DateField,
    TimeField,
  },
  formComponents: {},
  fieldContext,
  formContext,
});
