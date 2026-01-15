"use client";

import { useEventWizard } from "../_hooks/event-wizard-context";
import EventWizardProgress from "./EventWizardProgress";

import { useAppForm } from "@/hooks/form";
import { featureNames, FeatureName, SetupSchema } from "@/types/events";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";

import { capitalizeFirstLetter } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

export default function SetupForm() {
  const { step, data, next, setSetupFeatures } = useEventWizard();

  const form = useAppForm({
    defaultValues: data.setup,
    validators: {
      onChange: SetupSchema,
    },
    onSubmit: async ({ value }) => {
      next({ setup: value });
    },
  });

  return (
    <>
      <form
        id={step.formId}
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
          />{" "}
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
                              let nextFeatures: FeatureName[];

                              if (checked) {
                                field.pushValue(name);

                                nextFeatures = [...field.state.value, name];
                              } else {
                                const index = field.state.value.indexOf(name);

                                if (index > -1) field.removeValue(index);

                                nextFeatures = field.state.value.filter(
                                  (f) => f !== name,
                                );
                              }

                              setSetupFeatures(nextFeatures);
                            }}
                          />
                          <FieldLabel
                            htmlFor={`checkbox-${name}`}
                            className="font-normal"
                          >
                            {capitalizeFirstLetter(name)}
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
      <EventWizardProgress />
    </>
  );
}
