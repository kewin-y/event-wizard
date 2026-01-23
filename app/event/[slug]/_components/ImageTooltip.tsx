import Image from "next/image";
import * as Tooltip from "@radix-ui/react-tooltip";

export default function ImageTooltip({
  className,
  sideOffset = 0,
  children,
  src,
  alt,
  ...props
}: { src: string; alt: string } & React.ComponentProps<
  typeof Tooltip.Content
>) {
  return (
    <Tooltip.Portal>
      <Tooltip.Content
        className="border bg-background text-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md p-2 text-xs text-balance"
        sideOffset={5}
        {...props}
      >
        <Image
          src={src}
          alt={alt}
          width={132}
          height={132}
          className="object-contain rounded-sm"
        />
      </Tooltip.Content>
    </Tooltip.Portal>
  );
}
