import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { KpiCard } from "@/components/admin/dashboard/kpi-card";
import {
  Activity,
  AlertCircle,
  BadgeCheck,
  BedDouble,
  ClipboardList,
  UserPlus,
  Users,
  UtensilsCrossed,
} from "lucide-react";
import { format } from "date-fns";

import { getAnalyticsAccess } from "@/components/admin/analytics/analytics-access";
import { AccessDeniedCard } from "@/components/admin/analytics/access-denied-card";
import { AnalyticsPageLayout } from "@/components/admin/analytics/analytics-page-layout";
import { analyticsNavItems } from "@/components/admin/analytics/analytics-nav-items";
import { parseAnalyticsRange, type AnalyticsSearchParams } from "@/components/admin/analytics/analytics-range";
import { getAnalyticsOverview } from "@/components/admin/analytics/analytics-queries";
import { RoomServiceTrendChart } from "@/components/admin/analytics/charts/room-service-trend-chart";
import { StatusDonutChart } from "@/components/admin/analytics/charts/status-donut-chart";
import { RatingsTrendChart } from "@/components/admin/analytics/charts/ratings-trend-chart";
import { UsersTrendChart } from "@/components/admin/analytics/charts/users-trend-chart";
import { RoomsGroupBarChart } from "@/components/admin/analytics/charts/rooms-group-bar-chart";
import { TopRatedMenuItemsTable } from "@/components/admin/analytics/tables/top-rated-menu-items-table";
import { RoomsActivityTable } from "@/components/admin/analytics/tables/rooms-activity-table";
import { RecentRoomServiceOrdersTable } from "@/components/admin/analytics/tables/recent-room-service-orders-table";
import { formatCompactNumber, formatPercent } from "@/components/admin/analytics/analytics-format";

export const dynamic = "force-dynamic";

export default async function AdminAnalyticsPage({
  searchParams,
}: {
  searchParams?: AnalyticsSearchParams | Promise<AnalyticsSearchParams>;
}) {
  const access = await getAnalyticsAccess();
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const range = parseAnalyticsRange(resolvedSearchParams);

  if (!access.allowed) {
    return <AccessDeniedCard title="Analytics" reason={access.reason} />;
  }

  const data = await getAnalyticsOverview({ range });

  const availabilityRate =
    data.kpis.totalMenuItems > 0
      ? data.kpis.availableMenuItems / data.kpis.totalMenuItems
      : 0;

  return (
    <AnalyticsPageLayout
      title="Analytics"
      description="Operational analytics from your live Prisma data (Users, Rooms, Menu, Ratings, and Room Service Orders)."
      range={range}
      navItems={analyticsNavItems}
    >
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
        <KpiCard
          title="Total users"
          value={formatCompactNumber(data.kpis.totalUsers)}
          icon={Users}
          meta="All-time"
        />
        <KpiCard
          title="New users"
          value={formatCompactNumber(data.kpis.newUsers)}
          icon={UserPlus}
          meta={`${format(range.from, "MMM d")} – ${format(range.to, "MMM d")}`}
        />
        <KpiCard
          title="Verified users"
          value={formatCompactNumber(data.kpis.verifiedUsers)}
          icon={BadgeCheck}
          meta="Email verified"
        />
        <KpiCard
          title="Active sessions"
          value={formatCompactNumber(data.kpis.activeSessions)}
          icon={Activity}
          meta="Expires in the future"
        />
        <KpiCard
          title="Rooms"
          value={formatCompactNumber(data.kpis.totalRooms)}
          icon={BedDouble}
          meta="All rooms"
        />
        <KpiCard
          title="Menu items"
          value={formatCompactNumber(data.kpis.totalMenuItems)}
          icon={UtensilsCrossed}
          meta={`${formatPercent(availabilityRate)} available`}
        />
        <KpiCard
          title="Room service"
          value={formatCompactNumber(data.kpis.roomServiceOrders)}
          icon={ClipboardList}
          meta="Orders in range"
        />
        <KpiCard
          title="Pending"
          value={formatCompactNumber(data.kpis.roomServicePending)}
          icon={AlertCircle}
          meta="All-time pending"
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
              <RoomServiceTrendChart data={data.roomServiceTrend} />
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
              <StatusDonutChart data={data.roomServiceStatus} />
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-3">
              {data.roomServiceStatus.map((row) => (
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
            <CardTitle>Ratings trend</CardTitle>
            <CardDescription>Daily count and average rating</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[260px]">
              <RatingsTrendChart data={data.ratingsTrend} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b">
            <CardTitle>User signups</CardTitle>
            <CardDescription>Daily signups vs. verified</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[260px]">
              <UsersTrendChart data={data.usersTrend} />
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="border-b">
            <CardTitle>Rooms by floor</CardTitle>
            <CardDescription>Distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[240px]">
              <RoomsGroupBarChart data={data.roomsByFloor} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b">
            <CardTitle>Rooms by type</CardTitle>
            <CardDescription>Distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[240px]">
              <RoomsGroupBarChart data={data.roomsByType} />
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="border-b">
            <CardTitle>Top rated menu items</CardTitle>
            <CardDescription>
              Based on stored `ratingAverage` + `ratingCount`
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TopRatedMenuItemsTable items={data.topMenuItems} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b">
            <CardTitle>Top rooms (room service)</CardTitle>
            <CardDescription>Most service orders in range</CardDescription>
          </CardHeader>
          <CardContent>
            <RoomsActivityTable rooms={data.topRoomsByRoomService} />
          </CardContent>
        </Card>
      </section>

      <section>
        <Card>
          <CardHeader className="border-b">
            <CardTitle>Recent room service orders</CardTitle>
            <CardDescription>Latest 12</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentRoomServiceOrdersTable orders={data.recentRoomServiceOrders} />
          </CardContent>
        </Card>
      </section>
    </AnalyticsPageLayout>
  );
}
