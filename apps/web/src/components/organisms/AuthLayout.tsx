import AuthBanner from "./AuthBanner";
import type { ReactNode } from "react";

interface AuthLayoutProps {
  bannerSrc: string;
  title: string;
  subtitle: string;
  form: ReactNode;
  footerLink: {
    label: string;
    href: string;
  };
  topLabel?: string;
}

export default function AuthLayout({
  bannerSrc,
  title,
  subtitle,
  form,
  footerLink,
  topLabel,
}: AuthLayoutProps) {
  return (
    <main className="min-h-screen px-4 py-10 sm:px-6 sm:py-14 bg-neutral-bg text-neutral-text">
      <div className="mx-auto flex w-full max-w-6xl flex-col rounded-[32px] bg-neutral-bg-alt/95 shadow-[0_30px_80px_rgba(15,23,42,0.65)] ring-1 ring-overlay-lighter backdrop-blur-xl overflow-hidden lg:flex-row lg:items-stretch">
        <AuthBanner bannerSrc={bannerSrc} />
        <section className="flex flex-1 flex-col justify-center px-6 py-8 sm:px-10 lg:px-12 xl:px-14">
          <div className="max-w-xl">
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-light/80">
                {topLabel ?? title}
              </p>
              <h1 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
                {title}
              </h1>
              <p className="mt-3 text-sm leading-7 text-neutral-text-muted sm:text-base">
                {subtitle}
              </p>
            </div>
            <div className="space-y-8">{form}</div>
            <div className="mt-10 flex items-center justify-between border-t border-overlay-lighter pt-6 text-sm text-neutral-text-subtle">
              <span>Ainda não tem conta?</span>
              <a
                href={footerLink.href}
                className="font-semibold text-primary-light transition hover:text-primary"
              >
                {footerLink.label}
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
