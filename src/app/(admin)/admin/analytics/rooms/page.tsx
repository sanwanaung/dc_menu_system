import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { KpiCard } from "@/components/admin/dashboard/kpi-card";
import { BedDouble, Layers, SlidersHorizontal } from "lucide-react";

import { getAnalyticsAccess } from "@/components/admin/analytics/analytics-access";
import { AccessDeniedCard } from "@/components/admin/analytics/access-denied-card";
import { AnalyticsPageLayout } from "@/components/admin/analytics/analytics-page-layout";
import { analyticsNavItems } from "@/components/admin/analytics/analytics-nav-items";
import { parseAnalyticsRange, type AnalyticsSearchParams } from "@/components/admin/analytics/analytics-range";
import { getRoomsAnalytics } from "@/components/admin/analytics/analytics-queries";
import { RoomsGroupBarChart } from "@/components/admin/analytics/charts/rooms-group-bar-chart";
import { RoomsRatingsTable } from "@/components/admin/analytics/tables/rooms-ratings-table";
import { RoomsActivityTable } from "@/components/admin/analytics/tables/rooms-activity-table";
import { formatCompactNumber } from "@/components/admin/analytics/analytics-format";

export const dynamic = "force-dynamic";

export default async function AdminAnalyticsRoomsPage({
  searchParams,
}: {
  searchParams?: AnalyticsSearchParams | Promise<AnalyticsSearchParams>;
}) {
  const access = await getAnalyticsAccess();
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const range = parseAnalyticsRange(resolvedSearchParams);

  if (!access.allowed) {
    return <AccessDeniedCard title="Rooms analytics" reason={access.reason} />;
  }

  const data = await getRoomsAnalytics({ range });

  return (
    <AnalyticsPageLayout
      title="Rooms analytics"
      description="Room distribution, ratings activity, and room service hotspots."
      range={range}
      navItems={analyticsNavItems}
    >
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <KpiCard
          title="Rooms"
          value={formatCompactNumber(data.kpis.totalRooms)}
          icon={BedDouble}
          meta="All rooms"
        />
        <KpiCard
          title="Floors"
          value={formatCompactNumber(data.kpis.floors)}
          icon={Layers}
          meta="Distinct floors"
        />
        <KpiCard
          title="Types"
          value={formatCompactNumber(data.kpis.types)}
          icon={SlidersHorizontal}
          meta="Distinct room types"
        />
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
            <CardTitle>Top rooms (ratings)</CardTitle>
            <CardDescription>Most ratings in range</CardDescription>
          </CardHeader>
          <CardContent>
            <RoomsRatingsTable rooms={data.topRoomsByRatings} />
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
    </AnalyticsPageLayout>
  );
}
