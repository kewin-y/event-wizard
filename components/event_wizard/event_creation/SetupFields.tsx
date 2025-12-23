import { withFieldGroup } from "./form";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { SetupOpts, Step } from "./types";

import * as z from "zod";
import { useForm } from "@tanstack/react-form";

import { Button } from "@/components/ui/button";
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

const SetupFields = withFieldGroup({
    defaultValues: {},
    render: function Render({ group }) {
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
            </FieldGroup>
        );
    },
});

export default SetupFields;

//                 <form.Field
//                     name="features"
//                     mode="array"
//                     children={(field) => {
//                         const isInvalid =
//                             field.state.meta.isTouched &&
//                             !field.state.meta.isValid;
//                         return (
//                             <>
//                                 <FieldSet>
//                                     <FieldLegend variant="label">
//                                         Features
//                                     </FieldLegend>
//                                     <FieldDescription>
//                                         Select features to enable for your event
//                                     </FieldDescription>
//                                     <FieldGroup data-slot="checkbox-group">
//                                         {features.map((feature) => (
//                                             <Field
//                                                 key={feature}
//                                                 orientation="horizontal"
//                                             >
//                                                 <Checkbox
//                                                     id={`features-${feature}`}
//                                                     aria-invalid={isInvalid}
//                                                     checked={field.state.value.includes(
//                                                         feature,
//                                                     )}
//                                                     name={feature}
//                                                     onCheckedChange={(
//                                                         checked,
//                                                     ) => {
//                                                         if (checked) {
//                                                             field.pushValue(
//                                                                 feature,
//                                                             );
//                                                         } else {
//                                                             const index =
//                                                                 field.state.value.indexOf(
//                                                                     feature,
//                                                                 );
//                                                             if (index > -1) {
//                                                                 field.removeValue(
//                                                                     index,
//                                                                 );
//                                                             }
//                                                         }
//                                                     }}
//                                                 />
//                                                 <FieldLabel
//                                                     htmlFor={`features-${feature}`}
//                                                     className="font-normal"
//                                                 >
//                                                     {feature}
//                                                 </FieldLabel>
//                                             </Field>
//                                         ))}
//                                     </FieldGroup>
//                                 </FieldSet>
//                             </>
//                         );
//                     }}
//                 />
//             </FieldGroup>
//         </form>
//     );
// }
