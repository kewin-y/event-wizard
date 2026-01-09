import WizardProgress from "@/components/WizardProgress";
import { useWizard } from "@/components/wizard-context";
import { CornerLeftUp, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";

function addDocument(
  name: string,
  parentId: string,
  data: { type: "file"; value: File } | { type: "link"; value: string },
  tree: DocumentItem[],
): DocumentItem[] {
  return tree.map((documentItem) => {
    if (documentItem.type === "folder") {
      if (documentItem.id === parentId) {
        return {
          ...documentItem,
          children: [
            ...documentItem.children,
            {
              id: new Crypto().randomUUID(),
              name: name,
              ...data,
            },
          ],
        };
      }

      return {
        ...documentItem,
        children: addDocument(name, parentId, data, tree),
      };
    }

    return documentItem;
  });
}

function addFolder(
  name: string,
  parentId: string,
  tree: DocumentItem[],
): DocumentItem[] {
  return tree.map((documentItem) => {
    if (documentItem.type === "folder") {
      if (documentItem.id === parentId)
        return {
          ...documentItem,
          children: [
            ...documentItem.children,
            {
              id: new Crypto().randomUUID(),
              name: name,
              type: "folder",
              children: [],
            },
          ],
        };

      return {
        ...documentItem,
        children: addFolder(name, parentId, documentItem.children),
      };
    }

    return documentItem;
  });
}

export default function DocumentsForm() {
  const { step } = useWizard();

  const [tree, setTree] = useState<DocumentItem[]>([]);

  return (
    <>
      <form className="border-b border-t" id={step.formId}>
        <FieldSet>
          <div className="border-b px-6 py-4">
            <FieldLegend variant="label">Documents</FieldLegend>
            <FieldDescription>Add documents to your event.</FieldDescription>
          </div>
          <ScrollArea>
            <FieldSet className="px-6 pb-4">
              <FieldLegend
                variant="label"
                className="flex gap-3 items-center w-full"
              >
                <Button variant="outline" size="icon-sm">
                  <CornerLeftUp />
                </Button>
                <span>Folder Name</span>
                <Button size="icon-sm" className="ml-auto">
                  <Plus />
                </Button>
              </FieldLegend>
            </FieldSet>
          </ScrollArea>
        </FieldSet>
      </form>
      <WizardProgress />
    </>
  );
}
