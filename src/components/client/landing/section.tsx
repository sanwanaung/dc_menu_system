import * as React from "react";

import { cn } from "@/lib/utils";

type LandingSectionProps = {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
};

export function LandingSection({
  id,
  eyebrow,
  title,
  description,
  children,
  className,
}: LandingSectionProps) {
  return (
    <section id={id} className={cn("scroll-mt-24", className)}>
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          {eyebrow ? (
            <p className="text-xs font-medium tracking-[0.28em] text-foreground/60 uppercase">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            {title}
          </h2>
          {description ? (
            <p className="mt-3 text-pretty text-base leading-relaxed text-muted-foreground sm:text-[1.05rem]">
              {description}
            </p>
          ) : null}
        </div>

        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}

