"use client";

import { Card, CardContent } from "@/components/ui/card";

export function MenuTotalCard({
  title,
  count,
}: {
  title: string;
  count: number | string;
}) {
  return (
    <Card>
      <CardContent className="px-4 py-1">
        <div className="text-sm text-muted-foreground">{title}</div>
        <div className="mt-1 text-2xl font-semibold tabular-nums">
          {count ?? 0}
        </div>
      </CardContent>
    </Card>
  );
}
