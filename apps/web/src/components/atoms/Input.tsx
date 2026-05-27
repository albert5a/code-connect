import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export default function Input({ className = "", ...props }: InputProps) {
  return (
    <input
      {...props}
      className={`w-full rounded-2xl border border-neutral-border/30 bg-neutral-bg/90 px-4 py-3 text-sm text-neutral-text shadow-sm outline-none transition duration-200 placeholder:text-neutral-text-subtle focus:border-primary focus:ring-2 focus:ring-primary/20 ${className}`}
    />
  );
}
