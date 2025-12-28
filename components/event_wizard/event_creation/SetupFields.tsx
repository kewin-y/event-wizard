import { withFieldGroup } from "./form/AppForm";
import { Step } from "./types";
import { FieldGroup } from "@/components/ui/field";

const SetupFields = withFieldGroup({
  defaultValues: {},
  props: {
    toggleFeatureByName: (() => {}) as (arg0: string) => void,
    featureSteps: [] as Step[],
  },
  render: function Render({ group, toggleFeatureByName, featureSteps }) {
    return (
      <FieldGroup>
        <group.AppField
          name="name"
          children={(field) => (
            <field.TextField
              label="Name"
              description="Enter the name for your event"
            />
          )}
        />
        <group.AppField
          name="slug"
          children={(field) => (
            <field.TextField
              label="Slug"
              description="Will be used in the URL"
            />
          )}
        />
        <group.AppField
          name="image"
          children={(field) => (
            <field.FileUploadField
              label="Image"
              accept="image/png, image/jpeg, image/webp, image/jpg"
              description="Add profile image for your event."
            />
          )}
        />
        <group.AppField
          name="features"
          mode="array"
          children={(field) => (
            <field.CheckboxArrayField
              label="Features"
              description="Select features to enable for your event"
              arr={featureSteps.map((feature) => feature.name)}
              onCheckedChange={toggleFeatureByName}
            />
          )}
        />
      </FieldGroup>
    );
  },
});

export default SetupFields;
