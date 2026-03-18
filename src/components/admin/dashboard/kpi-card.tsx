import type { LucideIcon } from "lucide-react";
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function KpiCard({
  title,
  value,
  meta,
  icon: Icon,
  className,
}: {
  title: string;
  value: string;
  meta?: string;
  icon: LucideIcon;
  className?: string;
}) {
  return (
    <Card size="sm" className={cn("min-w-0", className)}>
      <CardHeader className="gap-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <CardAction>
          <div className="grid size-9 place-items-center rounded-xl bg-muted/60 ring-1 ring-border">
            <Icon className="size-4 text-foreground" />
          </div>
        </CardAction>
        <div className="mt-2 text-2xl font-semibold tracking-tight">
          {value}
        </div>
        {meta ? <CardDescription className="mt-1 text-xs">{meta}</CardDescription> : null}
      </CardHeader>
    </Card>
  );
}
