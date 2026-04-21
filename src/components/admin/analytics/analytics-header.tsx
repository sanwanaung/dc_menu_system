"use client";

import * as React from "react";
import { Download } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { usePathname, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateRangePicker } from "@/components/admin/analytics/date-range-picker";
import type { AnalyticsRange, AnalyticsRangePreset } from "@/components/admin/analytics/analytics-range";
import { buildRangeQueryString } from "@/components/admin/analytics/analytics-range";
import { AnalyticsNav, type AnalyticsNavItem } from "@/components/admin/analytics/analytics-nav";

function toDateRange(value: AnalyticsRange): DateRange {
  return { from: value.from, to: value.to };
}

function safePreset(value: string): AnalyticsRangePreset {
  if (value === "7d" || value === "30d" || value === "90d" || value === "ytd") {
    return value;
  }
  return "custom";
}

export function AnalyticsHeader({
  title,
  description,
  range,
  navItems,
}: {
  title: string;
  description?: string;
  range: AnalyticsRange;
  navItems: AnalyticsNavItem[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [draftRange, setDraftRange] = React.useState<DateRange>(() =>
    toDateRange(range),
  );

  React.useEffect(() => {
    setDraftRange(toDateRange(range));
  }, [range.from, range.to]);

  const queryString = React.useMemo(() => buildRangeQueryString(range), [range]);

  const applyRange = React.useCallback(
    (next: DateRange | undefined) => {
      setDraftRange(next);
      if (!next?.from || !next?.to) return;

      const params = new URLSearchParams();
      const yyyyMmDd = (date: Date) => {
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const dd = String(date.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}`;
      };
      params.set("from", yyyyMmDd(next.from));
      params.set("to", yyyyMmDd(next.to));
      params.set("preset", "custom");
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname],
  );

  const applyPreset = React.useCallback(
    (next: string) => {
      const params = new URLSearchParams();
      params.set("preset", safePreset(next));
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname],
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
          {description ? (
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select value={range.preset} onValueChange={applyPreset}>
            <SelectTrigger size="sm" className="min-w-[124px]">
              <SelectValue placeholder="Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="ytd">Year to date</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>

          <DateRangePicker value={draftRange} onChange={applyRange} />

          <Button type="button" variant="outline" size="sm" disabled>
            <Download className="mr-1.5 size-4" />
            Export
          </Button>
        </div>
      </div>

      <AnalyticsNav items={navItems} queryString={queryString} />
    </div>
  );
}
