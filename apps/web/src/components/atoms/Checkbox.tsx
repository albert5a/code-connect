import type { InputHTMLAttributes } from "react";
import { cva, cx, type VariantProps } from "class-variance-authority";

const checkboxVariants = cva(
  "rounded-lg border border-neutral-border bg-neutral-bg text-primary focus:ring-primary disabled:cursor-not-allowed disabled:opacity-60",
  {
    variants: {
      checkboxSize: {
        md: "h-5 w-5",
      },
    },
    defaultVariants: {
      checkboxSize: "md",
    },
  },
);

interface CheckboxProps
  extends InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof checkboxVariants> {}

export default function Checkbox({
  checkboxSize,
  className = "",
  ...props
}: CheckboxProps) {
  return (
    <input
      {...props}
      type="checkbox"
      className={cx(checkboxVariants({ checkboxSize }), className)}
    />
  );
}
