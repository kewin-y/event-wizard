import { useStore } from "@tanstack/react-form";
import { useFieldContext } from "@/hooks/formContext";
import { Field, FieldError } from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { CalendarIcon, ChevronDownIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function DateField() {
  const field = useFieldContext<Date>();

  const errors = useStore(field.store, (state) => state.meta.errors);
  const isInvalid = useStore(
    field.store,
    (state) => state.meta.isTouched && !state.meta.isValid,
  );

  const [open, setOpen] = useState(false);
  return (
    <Field>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="justify-between font-normal">
            {field.state.value
              ? field.state.value.toLocaleString().slice(0, 10)
              : "Select Date"}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="end">
          <Calendar
            mode="single"
            captionLayout="dropdown"
            onSelect={(date) => {
              if (!date) return;
              field.handleChange(date);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
      {isInvalid && <FieldError errors={errors} />}
    </Field>
  );
}
