"use client";

import { useEventWizard } from "../_hooks/event-wizard-context";
import EventWizardProgress from "./EventWizardProgress";
import { useAppForm } from "@/hooks/form";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";

import { QuestionsSchema } from "@/types/events";

export default function QuestionsForm() {
  const { step, data, prev, next } = useEventWizard();

  const form = useAppForm({
    defaultValues: data.questions,
    validators: {
      onBlur: QuestionsSchema,
    },
    onSubmit: async ({ value }) => {
      next({ questions: value });
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
        <form.AppField name="questions" mode="array">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field>
                <FieldContent>
                  <FieldLabel>Questions</FieldLabel>
                  <FieldDescription>
                    Add questions for your event.
                  </FieldDescription>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </FieldContent>
                <ScrollArea className={`h-96 border rounded-md`}>
                  <div className="flex flex-col p-4 gap-4">
                    {field.state.value.map((_, i) => (
                      <FieldSet key={`question-${i}`}>
                        <FieldLegend
                          variant="label"
                          className="flex items-center w-full"
                        >
                          <span>Question {i + 1}</span>
                          {field.state.value.length > 1 && (
                            <span
                              className="ml-auto underline-offset-3 text-xs hover:underline cursor-pointer"
                              onClick={() => field.removeValue(i)}
                              aria-label={`Remove email ${i + 1}`}
                            >
                              Remove
                            </span>
                          )}
                        </FieldLegend>
                        <FieldGroup className="gap-4">
                          <form.AppField
                            name={`questions[${i}].name`}
                            children={(subField) => (
                              <subField.TextField placeholder="Name" />
                            )}
                          />
                          <form.AppField
                            name={`questions[${i}].image`}
                            children={(subField) => (
                              <subField.FileUploadField accept="image/webp, image/png, image/jpeg, image/jpg" />
                            )}
                          />
                        </FieldGroup>
                        <div className="flex items-center">
                          <div className="grow border-t border-border" />
                          <span className="mx-3 text-sm text-muted-foreground">
                            Options for Question {i + 1}
                          </span>
                          <div className="grow border-t border-border" />
                        </div>
                        <form.AppField
                          name={`questions[${i}].options`}
                          mode="array"
                        >
                          {(subField) => (
                            <FieldSet>
                              {subField.state.value.map((_, j) => (
                                <FieldSet key={`option-${i}${j}`}>
                                  <FieldLegend
                                    variant="label"
                                    className="flex items-center w-full"
                                  >
                                    <span>Option {j + 1}</span>
                                    {subField.state.value.length > 2 && (
                                      <span
                                        className="ml-auto underline-offset-3 text-xs hover:underline cursor-pointer"
                                        onClick={() => subField.removeValue(j)}
                                        aria-label={`Remove Option ${j + 1}`}
                                      >
                                        Remove
                                      </span>
                                    )}
                                  </FieldLegend>
                                  <FieldGroup className="gap-4">
                                    <form.AppField
                                      name={`questions[${i}].options[${j}].name`}
                                      children={(subField_) => (
                                        <subField_.TextField placeholder="Name" />
                                      )}
                                    />
                                    <form.AppField
                                      name={`questions[${i}].options[${j}].image`}
                                      children={(subField_) => (
                                        <subField_.FileUploadField accept="image/webp, image/png, image/jpeg, image/jpg" />
                                      )}
                                    />
                                  </FieldGroup>
                                </FieldSet>
                              ))}
                              <Button
                                variant="secondary"
                                onClick={() => {
                                  subField.pushValue({
                                    name: "",
                                    image: null,
                                  });
                                }}
                              >
                                Add Option
                              </Button>
                              {i !== field.state.value.length - 1 && (
                                <FieldSeparator />
                              )}
                            </FieldSet>
                          )}
                        </form.AppField>
                      </FieldSet>
                    ))}
                  </div>
                </ScrollArea>
                <Button
                  className="w-full"
                  type="button"
                  onClick={() =>
                    field.pushValue({
                      name: "",
                      image: null,
                      options: [
                        { name: "Yes", image: null },
                        { name: "No", image: null },
                      ],
                    })
                  }
                >
                  Add Question
                </Button>
              </Field>
            );
          }}
        </form.AppField>
      </form>
      <EventWizardProgress
        onPrev={() => {
          prev({ questions: form.state.values });
        }}
      />
    </>
  );
}
