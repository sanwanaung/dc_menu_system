import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { KpiCard } from "@/components/admin/dashboard/kpi-card";
import { MessageSquareText, Star, StarHalf } from "lucide-react";

import { getAnalyticsAccess } from "@/components/admin/analytics/analytics-access";
import { AccessDeniedCard } from "@/components/admin/analytics/access-denied-card";
import { AnalyticsPageLayout } from "@/components/admin/analytics/analytics-page-layout";
import { analyticsNavItems } from "@/components/admin/analytics/analytics-nav-items";
import { parseAnalyticsRange, type AnalyticsSearchParams } from "@/components/admin/analytics/analytics-range";
import { getRatingsAnalytics } from "@/components/admin/analytics/analytics-queries";
import { RatingsTrendChart } from "@/components/admin/analytics/charts/ratings-trend-chart";
import { RatingsDistributionChart } from "@/components/admin/analytics/charts/ratings-distribution-chart";
import { RecentRatingsTable } from "@/components/admin/analytics/tables/recent-ratings-table";
import { TopRatedMenuItemsTable } from "@/components/admin/analytics/tables/top-rated-menu-items-table";
import { formatCompactNumber } from "@/components/admin/analytics/analytics-format";

export const dynamic = "force-dynamic";

export default async function AdminAnalyticsRatingsPage({
  searchParams,
}: {
  searchParams?: AnalyticsSearchParams | Promise<AnalyticsSearchParams>;
}) {
  const access = await getAnalyticsAccess();
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const range = parseAnalyticsRange(resolvedSearchParams);

  if (!access.allowed) {
    return <AccessDeniedCard title="Ratings analytics" reason={access.reason} />;
  }

  const data = await getRatingsAnalytics({ range });

  return (
    <AnalyticsPageLayout
      title="Ratings analytics"
      description="Rating volume, distribution, and recent reviews."
      range={range}
      navItems={analyticsNavItems}
    >
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <KpiCard
          title="Ratings"
          value={formatCompactNumber(data.kpis.count)}
          icon={Star}
          meta="In range"
        />
        <KpiCard
          title="Average"
          value={data.kpis.avg.toFixed(2)}
          icon={StarHalf}
          meta="In range"
        />
        <KpiCard
          title="With comment"
          value={formatCompactNumber(data.kpis.withComment)}
          icon={MessageSquareText}
          meta="Non-empty comment"
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="border-b">
            <CardTitle>Ratings trend</CardTitle>
            <CardDescription>Daily count and average rating</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[260px]">
              <RatingsTrendChart data={data.trend} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b">
            <CardTitle>Distribution</CardTitle>
            <CardDescription>1–5 star breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[260px]">
              <RatingsDistributionChart data={data.distribution} />
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="border-b">
            <CardTitle>Recent ratings</CardTitle>
            <CardDescription>Latest 20 in range</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentRatingsTable ratings={data.recent} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b">
            <CardTitle>Top rated items</CardTitle>
            <CardDescription>Stored aggregates on MenuItem</CardDescription>
          </CardHeader>
          <CardContent>
            <TopRatedMenuItemsTable items={data.topItems} />
          </CardContent>
        </Card>
      </section>
    </AnalyticsPageLayout>
  );
}
