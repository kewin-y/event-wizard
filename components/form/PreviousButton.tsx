import { useFormContext } from "@/hooks/formContext";

function PreviousButton() {
  const form = useFormContext();
  return (
    <form.Subscribe selector={(state) => [state.isSubmitting]}>
      {([isSubmitting]) => <button disabled={isSubmitting}>Previous</button>}
    </form.Subscribe>
  );
}
