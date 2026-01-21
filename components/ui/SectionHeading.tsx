export default function SectionHeading({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-center">
      <div className="grow border-t border-border" />
      <span className="mx-3 text-sm text-muted-foreground">{children}</span>
      <div className="grow border-t border-border" />
    </div>
  );
}
