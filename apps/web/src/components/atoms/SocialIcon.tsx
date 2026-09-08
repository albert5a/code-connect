import { cva, cx, type VariantProps } from "class-variance-authority";

const socialIconVariants = cva("", {
  variants: {
    size: {
      md: "h-5 w-5",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

interface SocialIconProps {
  src: string;
  alt: string;
  className?: string;
}

export default function SocialIcon({
  src,
  alt,
  size,
  className = "",
}: SocialIconProps & VariantProps<typeof socialIconVariants>) {
  return (
    <img
      src={src}
      alt={alt}
      className={cx(socialIconVariants({ size }), className)}
    />
  );
}
