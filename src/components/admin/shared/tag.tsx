"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type TagVariant =
  | "neutral"
  | "info"
  | "warning"
  | "success"
  | "danger";

const VARIANT_STYLES: Record<TagVariant, string> = {
  neutral: "bg-muted text-foreground ring-foreground/10",
  info: "bg-blue-500/10 text-blue-700 ring-blue-500/20 dark:text-blue-300",
  warning:
    "bg-amber-500/10 text-amber-700 ring-amber-500/20 dark:text-amber-300",
  success:
    "bg-emerald-500/10 text-emerald-700 ring-emerald-500/20 dark:text-emerald-300",
  danger: "bg-rose-500/10 text-rose-700 ring-rose-500/20 dark:text-rose-300",
};

export function Tag({
  children,
  variant = "neutral",
  className,
  ...props
}: React.ComponentProps<"span"> & {
  variant?: TagVariant;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
        VARIANT_STYLES[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}

