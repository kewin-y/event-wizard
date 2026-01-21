import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EventResult } from "../_types";
import { Fragment } from "react/jsx-runtime";
import { Separator } from "@/components/ui/separator";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ImageIcon } from "lucide-react";
import Image from "next/image";
import ImageTooltip from "./ImageTooltip";
import SectionHeader from "@/components/ui/SectionHeader";

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

export default function EventQuestions({
  questions,
}: {
  questions: EventResult["questions"];
}) {
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
      </CardContent>
    </Card>
  );
}
