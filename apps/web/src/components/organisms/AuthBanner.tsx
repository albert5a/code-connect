interface AuthBannerProps {
  bannerSrc: string;
}

export default function AuthBanner({ bannerSrc }: AuthBannerProps) {
  return (
    <div className="relative hidden h-full min-h-[500px] w-full basis-1/2 overflow-hidden bg-neutral-bg sm:block lg:basis-[45%]">
      <img
        src={bannerSrc}
        alt="Banner de login"
        className="h-full w-full object-cover"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-neutral-bg/95 via-transparent to-neutral-bg/30" />
      <div className="absolute bottom-6 left-6 text-sm text-neutral-text-muted">
        <span className="inline-flex items-center gap-2 rounded-full bg-overlay-subtle px-3 py-2 text-xs uppercase tracking-[0.2em] text-primary-light/90">
          code connect
        </span>
      </div>
    </div>
  );
}
