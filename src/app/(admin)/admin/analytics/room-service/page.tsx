import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { KpiCard } from "@/components/admin/dashboard/kpi-card";
import { ClipboardList, Hourglass, CheckCircle2, XCircle, CircleOff } from "lucide-react";

import { getAnalyticsAccess } from "@/components/admin/analytics/analytics-access";
import { AccessDeniedCard } from "@/components/admin/analytics/access-denied-card";
import { AnalyticsPageLayout } from "@/components/admin/analytics/analytics-page-layout";
import { analyticsNavItems } from "@/components/admin/analytics/analytics-nav-items";
import { parseAnalyticsRange, type AnalyticsSearchParams } from "@/components/admin/analytics/analytics-range";
import { getRoomServiceAnalytics } from "@/components/admin/analytics/analytics-queries";
import { RoomServiceTrendChart } from "@/components/admin/analytics/charts/room-service-trend-chart";
import { StatusDonutChart } from "@/components/admin/analytics/charts/status-donut-chart";
import { RoomsActivityTable } from "@/components/admin/analytics/tables/rooms-activity-table";
import { RecentRoomServiceOrdersTable } from "@/components/admin/analytics/tables/recent-room-service-orders-table";
import { formatCompactNumber } from "@/components/admin/analytics/analytics-format";

export const dynamic = "force-dynamic";

export default async function AdminAnalyticsRoomServicePage({
  searchParams,
}: {
  searchParams?: AnalyticsSearchParams | Promise<AnalyticsSearchParams>;
}) {
  const access = await getAnalyticsAccess();
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const range = parseAnalyticsRange(resolvedSearchParams);

  if (!access.allowed) {
    return <AccessDeniedCard title="Room service analytics" reason={access.reason} />;
  }

  const data = await getRoomServiceAnalytics({ range });

  return (
    <AnalyticsPageLayout
      title="Room service analytics"
      description="Volume, status breakdown, and busiest rooms."
      range={range}
      navItems={analyticsNavItems}
    >
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <KpiCard
          title="Total"
          value={formatCompactNumber(data.kpis.total)}
          icon={ClipboardList}
          meta="Orders in range"
        />
        <KpiCard
          title="Pending"
          value={formatCompactNumber(data.kpis.pending)}
          icon={Hourglass}
          meta="All-time pending"
        />
        <KpiCard
          title="Accepted"
          value={formatCompactNumber(data.kpis.accepted)}
          icon={CheckCircle2}
          meta="All-time accepted"
        />
        <KpiCard
          title="Finished"
          value={formatCompactNumber(data.kpis.finished)}
          icon={CircleOff}
          meta="All-time finished"
        />
        <KpiCard
          title="Canceled"
          value={formatCompactNumber(data.kpis.canceled)}
          icon={XCircle}
          meta="All-time canceled"
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="border-b">
            <CardTitle>Room service volume</CardTitle>
            <CardDescription>Daily orders by status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <RoomServiceTrendChart data={data.trend} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b">
            <CardTitle>Status breakdown</CardTitle>
            <CardDescription>Orders in range</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-[220px]">
              <StatusDonutChart data={data.status} />
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-3">
              {data.status.map((row) => (
                <div key={row.status} className="flex items-center gap-2">
                  <span
                    className="size-2.5 rounded-full"
                    style={{ backgroundColor: row.color }}
                    aria-hidden="true"
                  />
                  <div className="min-w-0">
                    <div className="truncate text-xs text-muted-foreground">
                      {row.label}
                    </div>
                    <div className="text-sm font-medium">{row.count}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="border-b">
            <CardTitle>Top rooms</CardTitle>
            <CardDescription>Most room service in range</CardDescription>
          </CardHeader>
          <CardContent>
            <RoomsActivityTable rooms={data.topRooms} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b">
            <CardTitle>Recent orders</CardTitle>
            <CardDescription>Latest 20</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentRoomServiceOrdersTable orders={data.recent} />
          </CardContent>
        </Card>
      </section>
    </AnalyticsPageLayout>
  );
}
