import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ImageOffIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function EventImage({
  name,
  imageUrl,
  className,
}: {
  name: string;
  imageUrl: string | null | undefined;
  className?: string;
}) {
  return (
    <AspectRatio
      ratio={16 / 9}
      className={cn(className, "bg-accent rounded-t overflow-hidden")}
    >
      {imageUrl ? (
        <Image src={imageUrl} alt={`Image for event: ${name}`} fill />
      ) : (
        <div className="size-full flex">
          <div className="m-auto flex flex-col items-center gap-2 text-muted-foreground">
            <ImageOffIcon size={32} />
            <p>No image</p>
          </div>
        </div>
      )}
    </AspectRatio>
  );
}
