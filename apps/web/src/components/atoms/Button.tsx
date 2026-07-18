import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cva, cx, type VariantProps } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-60",
  {
    variants: {
      variant: {
        primary:
          "rounded-3xl bg-primary text-neutral-bg hover:bg-primary-light focus-visible:outline-primary-light",
        secondary:
          "rounded-3xl border border-neutral-border/30 bg-neutral-bg/90 text-neutral-text hover:border-primary/50 hover:bg-neutral-bg-alt focus-visible:outline-primary-light",
        ghost:
          "rounded-lg border border-white/10 text-neutral-text-muted hover:border-primary/60 hover:text-primary-light focus-visible:outline-primary-light",
      },
      size: {
        sm: "px-3 py-2 text-sm",
        md: "px-4 py-3 text-sm",
        lg: "px-4 py-4 text-sm",
      },
      fullWidth: {
        true: "w-full",
        false: null,
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      fullWidth: false,
    },
  },
);

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: ReactNode;
}

export default function Button({
  children,
  variant,
  size,
  fullWidth,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={cx(buttonVariants({ variant, size, fullWidth }), className)}
    >
      {children}
    </button>
  );
}
