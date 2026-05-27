interface DividerTextProps {
  text: string;
}

export default function DividerText({ text }: DividerTextProps) {
  return (
    <div className="flex items-center gap-4 text-sm text-neutral-text-subtle">
      <span className="h-px flex-1 bg-neutral-border/30" />
      <span>{text}</span>
      <span className="h-px flex-1 bg-neutral-border/30" />
    </div>
  );
}
