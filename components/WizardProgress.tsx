import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useWizard } from "./wizard-context";

// HACK: This onPrev function feels really awkward. I don't really know how to make it better
// It's needed because we must lift the state to the wizard context on step changes
// This state depends on the current form (step)
export default function WizardProgress({
  dontUseForm = false,
  onPrev = () => {},
  onNext = () => {},
}: {
  dontUseForm?: boolean;
  onPrev?: () => void;
  onNext?: () => void;
}) {
  const { step, totalSteps } = useWizard();
  return (
    <DialogFooter>
      <div className="flex flex-col gap-4 w-full">
        <div className="flex justify-between text-muted-foreground text-sm">
          <span>
            Step {step.idx + 1} out of {totalSteps}
          </span>
          <span>{step.data.name}</span>
        </div>
        <Progress value={((step.idx + 1) / totalSteps) * 100} />
        <div className="flex justify-between">
          <Button variant="outline" disabled={step.idx <= 0} onClick={onPrev}>
            Previous
          </Button>
          {!dontUseForm && (
            <Button type="submit" form={step.formId}>
              {step.idx === totalSteps - 1 ? "Finish" : "Next"}
            </Button>
          )}
          {/* Why */}
          {dontUseForm && (
            <Button type="submit" onClick={onNext}>
              {step.idx === totalSteps - 1 ? "Finish" : "Next"}
            </Button>
          )}
        </div>
      </div>
    </DialogFooter>
  );
}
