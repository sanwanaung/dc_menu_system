import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type React from "react";

export function KpiCard({
  title,
  value,
  icon: Icon,
  meta,
}: {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  meta?: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold tracking-tight">{value}</div>
        {meta ? (
          <CardDescription className="mt-1 text-xs">{meta}</CardDescription>
        ) : null}
      </CardContent>
    </Card>
  );
}
