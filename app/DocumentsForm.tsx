"use client";

import WizardProgress from "@/components/WizardProgress";
import { useWizard } from "@/components/wizard-context";
import { CornerLeftUp, FileIcon, FolderIcon, LinkIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FieldDescription, FieldLegend, FieldSet } from "@/components/ui/field";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  AddDocumentActions,
  FileActions,
  FolderActions,
  LinkActions,
} from "./DocumentsFormActions";
import Link from "next/link";
import { DocumentItem } from "@/types/documents";

function renameDocument(
  id: string,
  newName: string,
  tree: DocumentItem[],
): DocumentItem[] {
  return tree.map((documentItem) => {
    if (documentItem.id === id) {
      if (documentItem.type === "link") {
        return { ...documentItem, name: newName, value: newName };
      }

      return {
        ...documentItem,
        name: newName,
      };
    }
    if (documentItem.type === "folder") {
      return {
        ...documentItem,
        children: renameDocument(id, newName, documentItem.children),
      };
    }
    return documentItem;
  });
}

function _deleteDocument(
  id: string,
  tree: DocumentItem[],
): [boolean, DocumentItem][] {
  return tree.map((documentItem) => {
    if (documentItem.id === id) {
      return [true, documentItem];
    }
    if (documentItem.type === "folder") {
      return [
        false,
        {
          ...documentItem,
          children: _deleteDocument(id, documentItem.children)
            .filter(([deleted]) => !deleted)
            .map(([_, documentItem]) => documentItem),
        },
      ];
    }
    return [false, documentItem];
  });
}

function deleteDocument(id: string, tree: DocumentItem[]) {
  return _deleteDocument(id, tree)
    .filter(([deleted]) => !deleted)
    .map(([_, documentItem]) => documentItem);
}

function addDocument(
  name: string,
  parentId: string,
  data:
    | { type: "file"; value: File }
    | { type: "link"; value: string }
    | { type: "folder"; children: DocumentItem[] },
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
              // TODO: Find a better way to generate IDs
              id: crypto.randomUUID(),
              name: name,
              ...data,
            },
          ],
        };

      return {
        ...documentItem,
        children: addDocument(name, parentId, data, documentItem.children),
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

export default function DocumentsForm() {
  const { data, prev, next } = useWizard();

  const [tree, setTree] = useState<DocumentItem[]>(data.documents);

  const [visitStack, setVisitStack] = useState<string[]>(["root"]);
  const currentFolder =
    findDocument(visitStack[visitStack.length - 1], tree[0]) || tree[0];

  return (
    <>
      <div className="border-b border-t">
        <FieldSet className="gap-4">
          <div className="border-b px-6 py-4">
            <FieldLegend variant="label">Documents</FieldLegend>
            <FieldDescription>Add documents to your event.</FieldDescription>
          </div>
          <div className="flex gap-3 px-6 items-center">
            <Button
              variant="outline"
              size="icon-sm"
              disabled={currentFolder.id === "root"}
              onClick={(e) => {
                e.preventDefault();
                setVisitStack((current) => current.slice(0, -1));
              }}
            >
              <CornerLeftUp />
            </Button>

            <span>{currentFolder.name}</span>

            <AddDocumentActions
              addFolder={(name) => {
                setTree((current) =>
                  addDocument(
                    name,
                    currentFolder.id,
                    { type: "folder", children: [] },
                    current,
                  ),
                );
              }}
              addLink={(url) => {
                setTree((current) =>
                  addDocument(
                    url,
                    currentFolder.id,
                    { type: "link", value: url },
                    current,
                  ),
                );
              }}
              addFile={(file) =>
                setTree((current) =>
                  addDocument(
                    file.name,
                    currentFolder.id,
                    { type: "file", value: file },
                    current,
                  ),
                )
              }
            />
          </div>
          <ScrollArea className="h-72 border mx-6 mb-4 rounded-xl">
            {currentFolder.type === "folder" &&
            currentFolder.children.length > 0 ? (
              <div className="gap-0 flex flex-col">
                {currentFolder.children
                  .filter((child) => child.type === "folder")
                  .sort((a, b) =>
                    a.name < b.name ? -1 : a.name > b.name ? 1 : 0,
                  )
                  .map((folder) => (
                    <ButtonGroup key={folder.id} className="w-full">
                      <Button
                        variant="ghost"
                        className="flex-1 justify-start rounded-none hover:cursor-pointer font-normal"
                        onClick={() =>
                          setVisitStack((current) => [...current, folder.id])
                        }
                      >
                        <FolderIcon size={16} />
                        <span className="w-90 text-left whitespace-nowrap text-ellipsis overflow-hidden">
                          {folder.name}
                        </span>
                      </Button>
                      <FolderActions
                        defaultName={folder.name}
                        onRename={(name) => {
                          setTree((current) =>
                            renameDocument(folder.id, name, current),
                          );
                        }}
                        onDelete={() =>
                          setTree((current) =>
                            deleteDocument(folder.id, current),
                          )
                        }
                      />
                    </ButtonGroup>
                  ))}
                {currentFolder.children
                  .filter((child) => child.type === "link")
                  .sort((a, b) =>
                    a.name < b.name ? -1 : a.name > b.name ? 1 : 0,
                  )
                  .map((link) => (
                    <ButtonGroup key={link.id} className="w-full">
                      <Link
                        className="inline-flex items-center h-9 px-3 py-2 gap-2 text-sm flex-1 justify-start rounded-none hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 hover:cursor-pointer"
                        href={link.value}
                        target="_blank"
                      >
                        <LinkIcon size={16} />
                        <span className="w-90 text-left whitespace-nowrap text-ellipsis overflow-hidden">
                          {link.name}
                        </span>
                      </Link>
                      <LinkActions
                        defaultUrl={link.value}
                        onRename={(url) =>
                          setTree((current) =>
                            renameDocument(link.id, url, current),
                          )
                        }
                        onDelete={() =>
                          setTree((current) => deleteDocument(link.id, current))
                        }
                      />
                    </ButtonGroup>
                  ))}
                {currentFolder.children
                  .filter((child) => child.type === "file")
                  .sort((a, b) =>
                    a.name < b.name ? -1 : a.name > b.name ? 1 : 0,
                  )
                  .map((file) => (
                    <ButtonGroup key={file.id} className="w-full">
                      <div className="inline-flex items-center h-9 px-3 py-2 gap-2 text-sm flex-1 justify-start rounded-none">
                        <FileIcon size={16} />
                        <span className="w-90 text-left whitespace-nowrap text-ellipsis overflow-hidden">
                          {file.name}
                        </span>
                      </div>
                      <FileActions
                        onDelete={() =>
                          setTree((current) => deleteDocument(file.id, current))
                        }
                      />
                    </ButtonGroup>
                  ))}
              </div>
            ) : (
              <div className="p-4 w-full text-muted-foreground text-sm">
                <p>Folder is empty.</p>
                <br />
                <p>Click the "+" to add some documents.</p>
              </div>
            )}
          </ScrollArea>
        </FieldSet>
      </div>
      <WizardProgress
        onPrev={() => prev({ documents: tree })}
        onNext={() => next({ documents: tree })}
        dontUseForm
      />
    </>
  );
}
