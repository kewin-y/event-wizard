"use client";

import { useAppForm } from "@/hooks/form";
import { featureNames, SetupSchema } from "@/types/event-wizard-common";
import { useWizard } from "@/components/wizard-context";
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

import WizardProgress from "@/components/WizardProgress";

export default function SetupForm() {
  const { step, data, setSetupValues, toggleFeature, next } = useWizard();

  const form = useAppForm({
    defaultValues: data.setup,
    validators: {
      onChange: SetupSchema,
    },
    onSubmit: async ({ value }) => {
      console.log(value)
      setSetupValues(value);
      next();
    },
  });

  return (
    <>
      <form
        id={step.formId}
        className="px-6 py-4 border-b border-t"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <FieldSet>
          <form.AppField
            name="name"
            children={(field) => (
              <field.TextField
                label="Name"
                description="The name for your event."
              />
            )}
          />
          <form.AppField
            name="slug"
            children={(field) => (
              <field.TextField
                label="Slug"
                description="The slug for your event. Will be used in the URL."
              />
            )}
          />
          <form.AppField
            name="image"
            children={(field) => (
              <field.FileUploadField
                label="Image"
                description="The image for your event."
                accept="image/webp, image/png, image/jpeg, image/jpg"
              />
            )}
          />
          <form.AppField
            name="features"
            children={(field) => {
              const isInvalid =
                !field.state.meta.isValid && field.state.meta.isTouched;
              return (
                <Field>
                  <FieldSet>
                    <FieldLegend variant="label">Features</FieldLegend>
                    <FieldDescription>
                      The features enabled for your event.
                    </FieldDescription>
                    <FieldGroup data-slot="checkbox-group">
                      {featureNames.map((name) => (
                        <Field
                          key={`checkbox-${name}`}
                          orientation="horizontal"
                        >
                          <Checkbox
                            id={`checkbox-${name}`}
                            name={`checkbox-${name}`}
                            aria-invalid={isInvalid}
                            checked={field.state.value.includes(name)}
                            onCheckedChange={(checked) => {
                              toggleFeature(name);

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
                            htmlFor={`checkbox-${name}`}
                            className="font-normal"
                          >
                            {name}
                          </FieldLabel>
                        </Field>
                      ))}
                    </FieldGroup>
                  </FieldSet>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
        </FieldSet>
      </form>
      <WizardProgress />
    </>
  );
}
