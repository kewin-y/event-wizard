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
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useConvexAuth, usePaginatedQuery, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { Id } from "@/convex/_generated/dataModel";

export default function EventDocuments() {
  const { isAuthenticated } = useConvexAuth();

  const [currentFolderId, setCurrentFolderId] = useState<
    Id<"documentItems"> | undefined
  >(undefined);

  const { details: event, documents: initialDocuments } = useEvent();

  const currentFolder = useQuery(
    api.event.getEventBySlug.getEventDocument,
    currentFolderId && event
      ? { eventId: event._id, documentId: currentFolderId }
      : "skip",
  );
  const { results, status, loadMore } = usePaginatedQuery(
    api.event.getEventBySlug.getEventDocuments,
    isAuthenticated && event
      ? { eventId: event._id, parentId: currentFolderId }
      : "skip",
    { initialNumItems: 10 },
  );

  const documents =
    status === "LoadingFirstPage" && !currentFolderId
      ? initialDocuments.page
      : results;

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Documents</CardTitle>
        <CardDescription>
          The following documents are attached to your event
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div>
          <Button
            size="icon-sm"
            variant="outline"
            onClick={() => setCurrentFolderId(currentFolder?.parentId)}
            disabled={
              currentFolderId === undefined || currentFolder === undefined
            }
          >
            <CornerLeftUp />
          </Button>
          <span className="ml-2">
            {currentFolder ? currentFolder.name : ""}
          </span>
        </div>
        <div className="border overflow-hidden rounded-md h-72">
          <ScrollArea>
            {documents.length > 0 && (
              <>
                {documents
                  .filter((child) => child.type === "folder")
                  .sort((a, b) =>
                    a.name < b.name ? -1 : a.name > b.name ? 1 : 0,
                  )
                  .map((document) => (
                    <Button
                      key={document._id}
                      variant="ghost"
                      className="rounded-none w-full justify-start"
                      onClick={() => setCurrentFolderId(document._id)}
                    >
                      <FolderIcon />
                      {document.name}
                    </Button>
                  ))}
                {documents
                  .filter((child) => child.type === "link")
                  .sort((a, b) =>
                    a.name < b.name ? -1 : a.name > b.name ? 1 : 0,
                  )
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
                {documents
                  .filter((child) => child.type === "file")
                  .sort((a, b) =>
                    a.name < b.name ? -1 : a.name > b.name ? 1 : 0,
                  )
                  .map((document) => (
                    <div
                      key={document._id}
                      className="inline-flex items-center h-9 px-3 py-2 gap-2 text-sm flex-1 justify-start rounded-none"
                    >
                      <FileIcon size={16} />
                      <span className="w-90 text-left whitespace-nowrap text-ellipsis overflow-hidden">
                        {document.name}
                      </span>
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
