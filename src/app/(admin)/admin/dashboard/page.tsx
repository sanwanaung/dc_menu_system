import {
  getDashboardTotals,
  getRoomServiceStatusChart,
} from "@/features/dashboard/actions";

import { KpiCard } from "@/components/admin/dashboard/kpi-card";
import { RoomServiceAreaChart } from "@/components/admin/dashboard/room-service-area-chart";
import { RoomServiceStatusPieChart } from "@/components/admin/dashboard/room-service-status-pie-chart";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

//@ts-ignore
import { format } from "date-fns";
import { ClipboardCheck, ClipboardList, Users } from "lucide-react";

import Link from "next/link";

const RANGE_PRESETS = [
  { key: "7d", days: 7, label: "7D" },
  { key: "10d", days: 10, label: "10D" },
  { key: "30d", days: 30, label: "30D" },
] as const;

type SearchParams = Promise<{
  dateRange?: string;
}>;

function parseDaysFromDateRange(input?: string) {
  const trimmed = input?.trim();
  const match = trimmed?.match(/^(\d+)d$/i);
  const parsed = match?.[1] ? Number(match[1]) : 7;
  if (!Number.isFinite(parsed)) {
    return 7;
  }
  return Math.min(Math.max(Math.floor(parsed), 1), 365);
}

function buildDateRange(days: number) {
  return `${days}d`;
}

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const params = await searchParams;
  const days = parseDaysFromDateRange(params?.dateRange);
  const normalizedDateRange = buildDateRange(days);
  const hasPreset = RANGE_PRESETS.some((preset) => preset.days === days);

  const [totalsResponse, chartResponse] = await Promise.all([
    getDashboardTotals(days),
    getRoomServiceStatusChart(days),
  ]);

  const now = new Date();

  if (totalsResponse.error || chartResponse.error) {
    return (
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Dashboard</CardTitle>

          <CardDescription>
            {format(now, "EEEE, MMM d, yyyy")} · Last {days} days
          </CardDescription>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-destructive">
            {totalsResponse.error || chartResponse.error}
          </p>
        </CardContent>
      </Card>
    );
  }

  const totals = totalsResponse.data;
  const chartData = chartResponse.data;

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            {format(now, "EEEE, MMM d, yyyy")}
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">Last {days} days</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center rounded-2xl border border-border/50 bg-muted/50 p-1 backdrop-blur">
            {RANGE_PRESETS.map((preset) => {
              const isActive = preset.days === days;

              return (
                <Link
                  key={preset.key}
                  href={`/admin/dashboard?dateRange=${preset.key}`}
                  className={cn(
                    "rounded-xl px-4 py-1 text-xs font-medium transition-all duration-200",
                    isActive
                      ? "bg-background text-foreground shadow"
                      : "text-muted-foreground hover:bg-background/50 hover:text-foreground",
                  )}
                >
                  {preset.label}
                </Link>
              );
            })}
          </div>
          {!hasPreset && (
            <Button variant="secondary" size="sm" asChild>
              <Link href={`/admin/dashboard?dateRange=${normalizedDateRange}`}>
                {normalizedDateRange.toUpperCase()}
              </Link>
            </Button>
          )}
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <KpiCard
          title="Total users"
          value={totals?.totalUsers.toLocaleString() ?? "0"}
          icon={Users}
          meta="All-time"
        />
        <KpiCard
          title="Total room service orders"
          value={totals?.totalRoomServiceOrders.toLocaleString() ?? "0"}
          icon={ClipboardList}
          meta="All-time"
        />
        <KpiCard
          title="Avg finished orders / day"
          value={
            totals?.averageFinishedRoomServiceOrders.toLocaleString(undefined, {
              maximumFractionDigits: 2,
            }) ?? "0"
          }
          icon={ClipboardCheck}
          meta={`Last ${days} days`}
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="border-b">
            <CardTitle>Room service status over time</CardTitle>
            <CardDescription>
              {days} day trend · Pending / Accepted / Finished / Canceled
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RoomServiceAreaChart data={chartData ?? []} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="border-b">
            <CardTitle>Status distribution</CardTitle>
            <CardDescription>Totals across last {days} days</CardDescription>
          </CardHeader>
          <CardContent>
            <RoomServiceStatusPieChart data={chartData ?? []} />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
