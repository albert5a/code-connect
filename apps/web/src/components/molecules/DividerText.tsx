interface DividerTextProps {
  text: string
}

export default function DividerText({ text }: DividerTextProps) {
  return (
    <div className="flex items-center gap-4 text-sm text-slate-400">
      <span className="h-px flex-1 bg-white/10" />
      <span>{text}</span>
      <span className="h-px flex-1 bg-white/10" />
    </div>
  )
}
