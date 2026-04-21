"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

export type AnalyticsNavItem = { label: string; href: string };

export function AnalyticsNav({
  items,
  queryString,
}: {
  items: AnalyticsNavItem[];
  queryString: string;
}) {
  const pathname = usePathname();

  return (
    <div className="overflow-x-auto">
      <div className="inline-flex items-center gap-1 rounded-xl bg-muted p-1 ring-1 ring-border">
        {items.map((item) => {
          const active = pathname === item.href;
          const href = queryString ? `${item.href}?${queryString}` : item.href;
          return (
            <Link
              key={item.href}
              href={href}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground",
                active && "bg-background text-foreground ring-1 ring-border",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

