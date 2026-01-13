import { useWizard } from "@/components/wizard-context";
import { useAppForm } from "@/hooks/form";
import WizardProgress from "@/components/WizardProgress";
import { QuestionsSchema } from "@/types/event-wizard-common";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";

export default function QuestionsForm() {
  const { step, data, prev, next } = useWizard();

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
        className="border-t border-b"
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
              <FieldSet>
                <div className="border-b px-6 py-4">
                  <FieldLegend variant="label">Questions</FieldLegend>
                  <FieldDescription>
                    Add questions for your event.
                  </FieldDescription>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </div>
                <ScrollArea className={`h-96`}>
                  <FieldGroup>
                    {field.state.value.map((_, i) => (
                      <FieldSet
                        key={`question-${i}`}
                        className="border-b px-6 pb-4 last:border-b-0 last:pb-0"
                      >
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
                        <FieldGroup className="gap-2">
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
                            Options
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
                                  <FieldGroup className="gap-2">
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
                            </FieldSet>
                          )}
                        </form.AppField>
                      </FieldSet>
                    ))}
                  </FieldGroup>
                </ScrollArea>
                <div className="px-6 py-4 border-t">
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
                </div>
              </FieldSet>
            );
          }}
        </form.AppField>
      </form>
      <WizardProgress
        onPrev={() => {
          prev({ questions: form.state.values });
        }}
      />
    </>
  );
}
