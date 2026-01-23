import { cn } from "@/lib/utils";

export default function SectionHeader({
  className,
  children,
}: {
  className?: string,
  children?: React.ReactNode;
}) {
  return (
    <div className={cn("flex items-center", className)}>
      <div className="grow border-t border-border" />
      <span className="mx-3 text-sm text-muted-foreground">{children}</span>
      <div className="grow border-t border-border" />
    </div>
  );
}
