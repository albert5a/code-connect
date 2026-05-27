import type { InputHTMLAttributes } from "react";

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {}

export default function Checkbox({ className = "", ...props }: CheckboxProps) {
  return (
    <input
      {...props}
      type="checkbox"
      className={`h-5 w-5 rounded-lg border border-neutral-border bg-neutral-bg text-primary focus:ring-primary ${className}`}
    />
  );
}
