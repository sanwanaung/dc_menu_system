"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
};

export function Reveal({ children, className, delayMs = 0 }: RevealProps) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "40px 0px -10% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "motion-reduce:transition-none motion-reduce:transform-none",
        "transition duration-700 ease-out will-change-transform",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
        className,
      )}
      style={{ transitionDelay: `${delayMs}ms` }}
    >
      {children}
    </div>
  );
}

