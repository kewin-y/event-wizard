import WizardProgress from "@/components/WizardProgress";
import { useWizard } from "@/components/wizard-context";
import {
  CigaretteIcon,
  CornerLeftUp,
  FolderIcon,
  LinkIcon,
  Paperclip,
  Plus,
  PlusIcon,
} from "lucide-react";

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
import { useRef, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { AddItemDropdown } from "@/components/AddItemDropdown";
import { useAppForm } from "@/hooks/form";
import * as z from "zod";

function addDocument(
  name: string,
  parentId: string,
  data: { type: "file"; value: File } | { type: "link"; value: string },
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
              id: crypto.randomUUID(),
              name: name,
              ...data,
            },
          ],
        };

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
              id: crypto.randomUUID(),
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

function findDocument(
  id: string,
  root: DocumentItem,
): DocumentItem | undefined {
  if (id === root.id) return root;

  const children = root.type === "folder" ? root.children : [];

  for (const child of children) {
    const found = findDocument(id, child);
    if (found) return found;
  }

  return undefined;
}

const FOLDER_FORM_ID = "add-item-folder";
const LINK_FORM_ID = "add-item-link";
const FILE_FORM_ID = "add-file";

const folderFormSchema = z.object({
  name: z.string().nonempty({ error: "Folder name must be nonempty" }),
});

export default function DocumentsForm() {
  const { step } = useWizard();

  const [tree, setTree] = useState<DocumentItem[]>([
    {
      id: "root",
      name: "/",
      type: "folder",
      children: [],
    },
  ]);

  const [addDocumentMode, setAddDocumentMode] = useState<
    "none" | "folder" | "file" | "link"
  >("none");

  const [visitStack, setVisitStack] = useState<string[]>(["root"]);
  const currentFolder = findDocument(
    visitStack[visitStack.length - 1],
    tree[0],
  );

  const folderForm = useAppForm({
    defaultValues: {
      name: "",
    },
    validators: {
      onSubmit: folderFormSchema,
    },
    onSubmit: async ({ value }) => {
      if (currentFolder)
        setTree((current) => addFolder(value.name, currentFolder.id, current));
    },
  });

  return (
    <>
      <form className="border-b border-t" id={step.formId}>
        <FieldSet>
          <div className="border-b px-6 py-4">
            <FieldLegend variant="label">Documents</FieldLegend>
            <FieldDescription>Add documents to your event.</FieldDescription>
          </div>
          <div className="flex gap-3 px-6 items-center">
            <Button
              variant="outline"
              size="icon-sm"
              disabled={currentFolder && currentFolder.id === "root"}
            >
              <CornerLeftUp />
            </Button>

            {currentFolder && <span>{currentFolder.name}</span>}

            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button size="icon-sm" className="ml-auto">
                  <PlusIcon />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-72">
                {addDocumentMode === "none" && (
                  <>
                    <DropdownMenuItem
                      onSelect={(e) => {
                        e.preventDefault();
                        setAddDocumentMode("folder");
                      }}
                    >
                      <FolderIcon />
                      Folder
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={(e) => {
                        e.preventDefault();
                        setAddDocumentMode("link");
                      }}
                    >
                      <LinkIcon />
                      Link
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={(e) => {
                        e.preventDefault();
                        setAddDocumentMode("file");
                      }}
                    >
                      <Paperclip />
                      File
                    </DropdownMenuItem>
                  </>
                )}
                {addDocumentMode === "folder" && (
                  <form
                    className="space-y-3 px-2 py-2"
                    id={FOLDER_FORM_ID}
                    onSubmit={(e) => {
                      e.preventDefault();
                      folderForm.handleSubmit();
                    }}
                  >
                    <folderForm.AppField
                      name="name"
                      children={(field) => (
                        <field.TextField label="Folder Name" />
                      )}
                    />
                    <Actions
                      formId={FOLDER_FORM_ID}
                      onCancel={() => setAddDocumentMode("none")}
                    />
                  </form>
                )}
                {addDocumentMode === "link" && (
                  <form className="space-y-3 px-2 py-2" id={LINK_FORM_ID}>
                    <Field>
                      <FieldLabel>Link URL</FieldLabel>
                      <Input placeholder="https://example.com" />
                    </Field>
                    <Actions
                      formId={LINK_FORM_ID}
                      onCancel={() => setAddDocumentMode("none")}
                    />
                  </form>
                )}
                {addDocumentMode === "file" && (
                  <form className="space-y-3 px-2 py-2" id={FILE_FORM_ID}>
                    <Field>
                      <FieldLabel>Upload File</FieldLabel>
                      <Input type="file" />
                    </Field>
                    <Actions
                      formId={FILE_FORM_ID}
                      onCancel={() => setAddDocumentMode("none")}
                    />
                  </form>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <ScrollArea className="h-72">
            {currentFolder.type === "folder" &&
            currentFolder.children.length > 0 ? (
              <FieldSet className="px-6 pb-4"></FieldSet>
            ) : (
              <div className="px-6 w-full text-muted-foreground text-sm">
                <p>Folder is empty.</p>
                <br />
                <p>Click the "+" to add some documents.</p>
              </div>
            )}
          </ScrollArea>
        </FieldSet>
      </form>
      <WizardProgress />
    </>
  );
}

function Actions({
  onCancel,
  formId,
}: {
  onCancel: () => void;
  formId: string;
}) {
  return (
    <div className="flex justify-end gap-2">
      <Button size="sm" variant="ghost" onClick={onCancel}>
        Back
      </Button>
      <Button size="sm" form={formId}>
        Add
      </Button>
    </div>
  );
}
