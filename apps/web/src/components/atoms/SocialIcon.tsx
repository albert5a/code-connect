interface SocialIconProps {
  src: string
  alt: string
}

export default function SocialIcon({ src, alt }: SocialIconProps) {
  return <img src={src} alt={alt} className="h-5 w-5" />
}
