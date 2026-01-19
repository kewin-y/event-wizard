"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FileIcon,
  FolderIcon,
  LinkIcon,
  PlusIcon,
  MoreHorizontalIcon,
} from "lucide-react";

import * as z from "zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAppForm } from "@/hooks/form";

const FOLDER_FORM_ID = "add-folder";
const LINK_FORM_ID = "add-link";
const FILE_FORM_ID = "add-file";
const FOLDER_RENAME_FORM_ID = "rename-folder";

const folderFormSchema = z.object({
  name: z.string().nonempty({ error: "Folder name must be nonempty" }),
});

const linkFormSchema = z.object({
  url: z.url({ error: "Please enter a valid URL." }),
});

const fileFormSchema = z.object({
  file: z
    .file({ error: "File is required." })
    .refine((f) => f.size > 0, "File is required."),
});

type AddDocumentActionsProps = {
  addFolderAction: (name: string) => void;
  addLinkAction: (url: string) => void;
  addFileAction: (file: File) => void;
};

export function AddDocumentActions({
  addFolderAction: addFolder,
  addLinkAction: addLink,
  addFileAction: addFile,
}: AddDocumentActionsProps) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"none" | "folder" | "file" | "link">("none");

  const folderForm = useAppForm({
    defaultValues: {
      name: "",
    },
    validators: {
      onSubmit: folderFormSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      addFolder(value.name);
      formApi.reset();
      setOpen(false);
      setMode("none");
    },
  });

  const linkForm = useAppForm({
    defaultValues: {
      url: "",
    },
    validators: {
      onSubmit: linkFormSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      addLink(value.url);
      formApi.reset();
      setOpen(false);
      setMode("none");
    },
  });

  const fileForm = useAppForm({
    defaultValues: {
      // ???
      file: null as unknown as File,
    },
    validators: {
      onSubmit: fileFormSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      addFile(value.file);
      formApi.reset();
      setOpen(false);
      setMode("none");
    },
  });

  return (
    <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
      <DropdownMenuTrigger asChild>
        <Button size="icon-sm" className="ml-auto">
          <PlusIcon />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-82">
        {mode === "none" && (
          <>
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                setMode("folder");
              }}
            >
              <FolderIcon />
              Folder
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                setMode("link");
              }}
            >
              <LinkIcon />
              Link
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                setMode("file");
              }}
            >
              <FileIcon />
              File
            </DropdownMenuItem>
          </>
        )}
        {mode === "folder" && (
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
              children={(field) => <field.TextField label="Folder Name" />}
            />
            <Actions formId={FOLDER_FORM_ID} onCancel={() => setMode("none")} />
          </form>
        )}
        {mode === "link" && (
          <form
            className="space-y-3 px-2 py-2"
            id={LINK_FORM_ID}
            onSubmit={(e) => {
              e.preventDefault();
              linkForm.handleSubmit();
            }}
          >
            <linkForm.AppField
              name="url"
              children={(field) => (
                <field.TextField
                  label="URL"
                  placeholder="https://example.com"
                />
              )}
            />
            <Actions formId={LINK_FORM_ID} onCancel={() => setMode("none")} />
          </form>
        )}
        {mode === "file" && (
          <form
            className="space-y-3 px-2 py-2"
            id={FILE_FORM_ID}
            onSubmit={(e) => {
              e.preventDefault();
              fileForm.handleSubmit();
            }}
          >
            <fileForm.AppField
              name="file"
              children={(field) => <field.FileUploadField label="File" />}
            />
            <Actions formId={FILE_FORM_ID} onCancel={() => setMode("none")} />
          </form>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function FolderActions({
  defaultName,
  onRenameAction: onRename,
  onDeleteAction: onDelete,
}: {
  defaultName: string;
  onRenameAction: (name: string) => void;
  onDeleteAction: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"none" | "rename">("none");

  const folderRenameForm = useAppForm({
    defaultValues: {
      name: defaultName,
    },
    validators: {
      onSubmit: folderFormSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      onRename(value.name);
      formApi.reset();
      setMode("none");
      setOpen(false);
    },
  });

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="shrink-0 rounded-none">
          <MoreHorizontalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-62">
        {mode === "none" && (
          <>
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                setMode("rename");
              }}
            >
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                onDelete();
                setOpen(false);
              }}
            >
              Delete
            </DropdownMenuItem>
          </>
        )}
        {mode === "rename" && (
          <form
            className="space-y-3 px-2 py-2"
            id={FOLDER_RENAME_FORM_ID}
            onSubmit={(e) => {
              e.preventDefault();
              folderRenameForm.handleSubmit();
            }}
          >
            <folderRenameForm.AppField
              name="name"
              children={(field) => <field.TextField label="Rename" />}
            />
            <Actions
              onCancel={() => setMode("none")}
              formId={FOLDER_RENAME_FORM_ID}
              actionNames={["Back", "Rename"]}
            />
          </form>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function LinkActions({
  defaultUrl,
  onRenameAction: onRename,
  onDeleteAction: onDelete,
}: {
  defaultUrl: string;
  onRenameAction: (url: string) => void;
  onDeleteAction: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"none" | "rename">("none");

  const linkRenameForm = useAppForm({
    defaultValues: {
      url: defaultUrl,
    },
    validators: {
      onSubmit: linkFormSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      onRename(value.url);
      formApi.reset();
      setOpen(false);
      setMode("none");
    },
  });

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="shrink-0 rounded-none">
          <MoreHorizontalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-62">
        {mode === "none" && (
          <>
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                setMode("rename");
              }}
            >
              Edit URL
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                onDelete();
              }}
            >
              Delete
            </DropdownMenuItem>
          </>
        )}
        {mode === "rename" && (
          <form
            className="space-y-3 px-2 py-2"
            id={FOLDER_RENAME_FORM_ID}
            onSubmit={(e) => {
              e.preventDefault();
              linkRenameForm.handleSubmit();
            }}
          >
            <linkRenameForm.AppField
              name="url"
              children={(field) => <field.TextField label="Edit URL" />}
            />
            <Actions
              onCancel={() => setMode("none")}
              formId={FOLDER_RENAME_FORM_ID}
              actionNames={["Back", "Done"]}
            />
          </form>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function FileActions({
  onDeleteAction: onDelete,
}: {
  onDeleteAction: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="shrink-0 rounded-none">
          <MoreHorizontalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            onDelete();
            setOpen(false);
          }}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function Actions({
  actionNames = ["Back", "Add"],
  onCancel,
  formId,
}: {
  actionNames?: [string, string];
  onCancel: () => void;
  formId: string;
}) {
  return (
    <div className="flex justify-end gap-2">
      <Button size="sm" variant="ghost" onClick={onCancel}>
        {actionNames[0]}
      </Button>
      <Button size="sm" form={formId}>
        {actionNames[1]}
      </Button>
    </div>
  );
}
