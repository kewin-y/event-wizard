import Link from "next/link";
import { CornerLeftUp, FileIcon, FolderIcon, LinkIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEvent } from "../_hooks/event-context";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useConvexAuth, usePaginatedQuery, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect, useState } from "react";
import { Id } from "@/convex/_generated/dataModel";

export default function EventDocuments() {
  const { isAuthenticated } = useConvexAuth();

  const [committedFolderName, setCommittedFolderName] = useState<string>("");

  const [currentFolderId, setCurrentFolderId] = useState<
    Id<"documentItems"> | undefined
  >(undefined);

  /**
   * Pending navigation:
   * null      -> no navigation happening
   * undefined -> navigating to root
   * Id        -> navigating to folder
   */
  const [pendingFolderId, setPendingFolderId] = useState<
    Id<"documentItems"> | undefined | null
  >(null);

  const { details: event, documents: initialDocuments } = useEvent();

  useEffect(() => {
    if (!currentFolderId) setCommittedFolderName("");
  }, [currentFolderId]);

  // Which folder the query should use
  const folderIdForQuery =
    pendingFolderId !== null ? pendingFolderId : currentFolderId;

  const currentFolder = useQuery(
    api.event.getEventBySlug.getEventDocument,
    folderIdForQuery && event
      ? { eventId: event._id, documentId: folderIdForQuery }
      : "skip",
  );

  const { results, status } = usePaginatedQuery(
    api.event.getEventBySlug.getEventDocuments,
    isAuthenticated && event
      ? { eventId: event._id, parentId: folderIdForQuery }
      : "skip",
    { initialNumItems: 10 },
  );

  // Commit navigation only after loading finishes
  useEffect(() => {
    if (pendingFolderId !== null && status === "Exhausted") {
      setCurrentFolderId(pendingFolderId ?? undefined);
      setCommittedFolderName(currentFolder?.name ?? "");
      setPendingFolderId(null);
    }
  }, [pendingFolderId, status]);

  const documents =
    status === "LoadingFirstPage" && !currentFolderId
      ? initialDocuments.page
      : results;

  const isLoading = status === "LoadingFirstPage";

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Documents</CardTitle>
        <CardDescription>
          The following documents are attached to your event
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center gap-2 min-h-[32px]">
          <Button
            size="icon-sm"
            variant="outline"
            disabled={currentFolderId === undefined}
            onClick={() => {
              if (isLoading) return;
              setPendingFolderId(currentFolder?.parentId ?? undefined);
            }}
          >
            <CornerLeftUp />
          </Button>

          <span className="ml-1 text-sm">{committedFolderName}</span>
        </div>

        {/* Document list */}
        <div className="border overflow-hidden rounded-md h-72">
          <ScrollArea>
            {documents.length > 0 && (
              <>
                {/* Folders */}
                {documents
                  .filter((child) => child.type === "folder")
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((document) => (
                    <Button
                      key={document._id}
                      variant="ghost"
                      className="rounded-none w-full justify-start"
                      disabled={isLoading}
                      onClick={() => setPendingFolderId(document._id)}
                    >
                      <FolderIcon />
                      {document.name}
                    </Button>
                  ))}

                {/* Links */}
                {documents
                  .filter((child) => child.type === "link")
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((document) => (
                    <Button
                      key={document._id}
                      variant="ghost"
                      className="rounded-none w-full justify-start"
                      asChild
                    >
                      <Link href={document.url!} target="_blank">
                        <LinkIcon />
                        {document.name}
                      </Link>
                    </Button>
                  ))}

                {/* Files */}
                {documents
                  .filter((child) => child.type === "file")
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((document) => (
                    <div
                      key={document._id}
                      className="inline-flex items-center h-9 px-3 py-2 gap-2 text-sm w-full [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0"
                    >
                      <FileIcon />
                      <span className="truncate">{document.name}</span>
                    </div>
                  ))}
              </>
            )}
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}
