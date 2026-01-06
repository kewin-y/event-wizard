import { useWizard } from "@/components/wizard-context";
import WizardProgress from "@/components/WizardProgress";
import { useAppForm } from "@/hooks/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AgendaSchema } from "@/types/event-wizard-common";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";

export default function AgendaForm() {
  const { step, data, next, setAgendaValues } = useWizard();

  const form = useAppForm({
    defaultValues: data.agenda,
    validators: {
      onBlur: AgendaSchema,
    },
    onSubmit: async ({ value }) => {
      next();
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
        <form.AppField name="agendaDates" mode="array">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <FieldSet>
                <div className="border-b px-6 py-4">
                  <FieldLegend variant="label">Agenda</FieldLegend>
                  <FieldDescription>
                    Add entries to your event agenda
                  </FieldDescription>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </div>
                <ScrollArea>
                  <FieldGroup>
                    {field.state.value.map((_, i) => (
                      <FieldSet
                        key={`agenda-date-${i}`}
                        className="px-6 pb-4 last:pb-0"
                      >
                        <FieldLegend
                          variant="label"
                          className="flex items-center w-full"
                        >
                          <span>Agenda Date {i + 1}</span>
                          {field.state.value.length > 1 && (
                            <span
                              className="ml-auto underline-offset-3 text-xs hover:underline cursor-pointer"
                              onClick={() => field.removeValue(i)}
                              aria-label={`Remove Agenda Item ${i + 1}`}
                            >
                              Remove
                            </span>
                          )}
                        </FieldLegend>
                        <form.AppField
                          name={`agendaDates[${i}].date`}
                          children={(subField) => <subField.DateField />}
                        />
                        <div className="flex items-center">
                          <div className="grow border-t border-border" />
                          <span className="mx-3 text-sm text-muted-foreground">
                            Items
                          </span>
                          <div className="grow border-t border-border" />
                        </div>
                        <form.AppField
                          name={`agendaDates[${i}].items`}
                          mode="array"
                        >
                          {(subField) => (
                            <FieldSet>
                              {subField.state.value.map((_, j) => (
                                <FieldSet key={`item-${i}${j}`}>
                                  {/* TODO: Make this title thing its own component*/}
                                  <FieldLegend
                                    variant="label"
                                    className="flex items-center w-full"
                                  >
                                    <span className="font-extrabold">
                                      Item {j + 1}
                                    </span>
                                    {subField.state.value.length > 1 && (
                                      <span
                                        className="ml-auto underline-offset-3 text-xs hover:underline cursor-pointer"
                                        onClick={() => subField.removeValue(j)}
                                        aria-label={`Remove Agenda Item ${j + 1}`}
                                      >
                                        Remove
                                      </span>
                                    )}
                                  </FieldLegend>
                                  <FieldGroup className="gap-2">
                                    <form.AppField
                                      name={`agendaDates[${i}].items[${j}].title`}
                                      children={(subField_) => (
                                        <subField_.TextField placeholder="Title" />
                                      )}
                                    />
                                    <form.AppField
                                      name={`agendaDates[${i}].items[${j}].description`}
                                      children={(subField_) => (
                                        <subField_.TextField placeholder="Description (Optional)" />
                                      )}
                                    />
                                  </FieldGroup>
                                </FieldSet>
                              ))}
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
                        date: new Date().toISOString().slice(0, 10),
                        items: [
                          {
                            title: "",
                            description: "",
                            startTime: "",
                            endTime: "",
                          },
                        ],
                      })
                    }
                  >
                    Add Agenda Date
                  </Button>
                </div>
              </FieldSet>
            );
          }}
        </form.AppField>
      </form>
      <WizardProgress
        onPrev={() => {
          setAgendaValues(form.state.values);
        }}
      />
    </>
  );
}
