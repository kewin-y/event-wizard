import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Fragment } from "react/jsx-runtime";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ImageIcon } from "lucide-react";
import ImageTooltip from "./ImageTooltip";
import SectionHeader from "@/components/ui/SectionHeader";
import { api } from "@/convex/_generated/api";
import { useConvexAuth, usePaginatedQuery } from "convex/react";
import { useEvent } from "../_hooks/event-context";
import LoadingHeader from "@/components/LoadingHeader";
import { Button } from "@/components/ui/button";

function QuestionContent({
  title,
  description,
  imageUrl,
  separator,
}: {
  title: string;
  description: string;
  imageUrl: string | undefined | null;
  separator: boolean;
}) {
  return (
    <Fragment>
      <div className="grid grid-cols-[1fr_auto] gap-3 items-stretch">
        <div className="flex flex-col gap-1">
          <CardTitle>{title}</CardTitle>
          <CardDescription className="whitespace-nowrap overflow-hidden text-ellipsis w-160">
            {description}
          </CardDescription>
        </div>

        <Tooltip>
          <TooltipTrigger asChild>
            <div className="bg-accent aspect-square h-full w-auto rounded-md flex flex-col items-center justify-center text-muted-foreground">
              <ImageIcon />
            </div>
          </TooltipTrigger>
          {imageUrl ? (
            <ImageTooltip
              src={imageUrl}
              alt={`image for ${title}`}
              side="right"
            />
          ) : (
            <TooltipContent>
              <p>No image</p>
            </TooltipContent>
          )}
        </Tooltip>
      </div>
      {separator && <Separator />}
    </Fragment>
  );
}

export default function EventQuestions() {
  const { isAuthenticated } = useConvexAuth();

  const { details: event, questions: initialQuestions } = useEvent();

  const { results, status, loadMore } = usePaginatedQuery(
    api.event.getEventBySlug.getEventQuestions,
    isAuthenticated && event ? { eventId: event._id } : "skip",
    { initialNumItems: 10 },
  );

  const questions =
    status === "LoadingFirstPage" ? initialQuestions.page : results;

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Questions</CardTitle>
        <CardDescription>
          The following questions are attached to your event
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {questions.map((question, i) => (
          <div key={question._id}>
            <QuestionContent
              title="Question"
              description={question.name}
              imageUrl={question.imageUrl}
              separator={i < questions.length - 1}
            />
            <SectionHeader className="py-4">Options</SectionHeader>
            <div className="flex flex-col gap-6">
              {question.options.map((opt) => (
                <QuestionContent
                  title="Option"
                  description={opt.name}
                  imageUrl={opt.imageUrl}
                  separator={false}
                  key={opt._id}
                />
              ))}
            </div>
          </div>
        ))}
        {status === "LoadingMore" && <LoadingHeader />}
        {status === "CanLoadMore" && (
          <>
            <Separator />
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => loadMore(10)}
            >
              Load More
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
