"use client";

import { Card, CardContent } from "@/components/ui/card";

export function MenuTotalCard({
  title,
  value,
}: {
  title: string;
  value?: number | string;
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="text-sm text-muted-foreground">{title}</div>
        <div className="mt-1 text-2xl font-semibold tabular-nums">
          {value ?? 0}
        </div>
      </CardContent>
    </Card>
  );
}

