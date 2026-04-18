import { cn } from "@/lib/utils";
import type * as React from "react";

export function Pill({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border bg-background px-2 py-0.5 text-xs font-medium text-foreground",
        className,
      )}
      {...props}
    />
  );
}

