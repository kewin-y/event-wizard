import { useStore } from "@tanstack/react-form";
import { useFieldContext } from "@/hooks/formContext";
import { Field, FieldError } from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function DateField() {
  const field = useFieldContext<string>();

  const errors = useStore(field.store, (state) => state.meta.errors);
  const isInvalid = useStore(
    field.store,
    (state) => state.meta.isTouched && !state.meta.isValid,
  );

  const [open, setOpen] = useState(false);
  return (
    <Field>
      <div className="relative flex gap-2">
        <Input
          id="date"
          value={field.state.value}
          onChange={(e) => field.handleChange(e.target.value)}
          onBlur={field.handleBlur}
          aria-invalid={isInvalid}
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              id="date-picker"
              variant="ghost"
              className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
            >
              <CalendarIcon className="size-3.5" />
              <span className="sr-only">Select date</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto overflow-hidden p-0"
            align="end"
            alignOffset={-8}
            sideOffset={10}
          >
            <Calendar
              mode="single"
              captionLayout="dropdown"
              onSelect={(date) => {
                if (!date) return;
                field.handleChange(date.toISOString().slice(0, 10));
                setOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
      {isInvalid && <FieldError errors={errors} />}
    </Field>
  );
}
