import { useState } from "react";

type PostThumbnailProps = {
  src?: string | null;
  title: string;
  tags: string[];
  className?: string;
};

export default function PostThumbnail({
  src,
  title,
  tags,
  className = "",
}: PostThumbnailProps) {
  const [hasError, setHasError] = useState(false);
  const shouldShowImage = Boolean(src) && !hasError;
  const label = tags[0] ?? title.slice(0, 12);

  if (shouldShowImage) {
    return (
      <img
        src={src ?? undefined}
        alt=""
        className={`h-full w-full object-cover ${className}`}
        onError={() => setHasError(true)}
      />
    );
  }

  return (
    <div
      className={`flex h-full w-full items-center justify-center bg-[#16201d] ${className}`}
      aria-label={`Imagem indisponível para ${title}`}
    >
      <div className="grid h-full w-full place-items-center bg-[linear-gradient(135deg,rgba(16,185,129,0.28),rgba(56,189,248,0.18)_48%,rgba(245,158,11,0.22))] px-4 text-center">
        <span className="rounded-lg border border-white/15 bg-black/25 px-3 py-2 text-sm font-semibold uppercase tracking-[0.16em] text-white">
          {label}
        </span>
      </div>
    </div>
  );
}
