import type { InputHTMLAttributes } from "react";
import { cva, cx, type VariantProps } from "class-variance-authority";

const inputVariants = cva(
  "w-full border bg-neutral-bg/90 text-neutral-text shadow-sm outline-none transition duration-200 placeholder:text-neutral-text-subtle disabled:cursor-not-allowed disabled:opacity-60",
  {
    variants: {
      tone: {
        default:
          "border-neutral-border/30 focus:border-primary focus:ring-2 focus:ring-primary/20",
        error:
          "border-error/50 focus:border-error focus:ring-2 focus:ring-error/20",
      },
      inputSize: {
        md: "rounded-2xl px-4 py-3 text-sm",
      },
    },
    defaultVariants: {
      tone: "default",
      inputSize: "md",
    },
  },
);

interface InputProps
  extends InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {}

export default function Input({
  tone,
  inputSize,
  className = "",
  ...props
}: InputProps) {
  return (
    <input
      {...props}
      className={cx(inputVariants({ tone, inputSize }), className)}
    />
  );
}
