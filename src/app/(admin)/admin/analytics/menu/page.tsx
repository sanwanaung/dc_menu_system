import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { KpiCard } from "@/components/admin/dashboard/kpi-card";
import { ImageOff, Layers, Tags, UtensilsCrossed } from "lucide-react";

import { getAnalyticsAccess } from "@/components/admin/analytics/analytics-access";
import { AccessDeniedCard } from "@/components/admin/analytics/access-denied-card";
import { AnalyticsPageLayout } from "@/components/admin/analytics/analytics-page-layout";
import { analyticsNavItems } from "@/components/admin/analytics/analytics-nav-items";
import { parseAnalyticsRange, type AnalyticsSearchParams } from "@/components/admin/analytics/analytics-range";
import { getMenuAnalytics } from "@/components/admin/analytics/analytics-queries";
import { CategoryItemsChart } from "@/components/admin/analytics/charts/category-items-chart";
import { MenuCategoryMetricsTable } from "@/components/admin/analytics/tables/menu-category-metrics-table";
import { MissingImagesTable } from "@/components/admin/analytics/tables/missing-images-table";
import { formatCompactNumber } from "@/components/admin/analytics/analytics-format";

export const dynamic = "force-dynamic";

export default async function AdminAnalyticsMenuPage({
  searchParams,
}: {
  searchParams?: AnalyticsSearchParams | Promise<AnalyticsSearchParams>;
}) {
  const access = await getAnalyticsAccess();
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const range = parseAnalyticsRange(resolvedSearchParams);

  if (!access.allowed) {
    return <AccessDeniedCard title="Menu analytics" reason={access.reason} />;
  }

  const data = await getMenuAnalytics({ range });

  return (
    <AnalyticsPageLayout
      title="Menu analytics"
      description="Menu health, category coverage, and items missing images."
      range={range}
      navItems={analyticsNavItems}
    >
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
        <KpiCard
          title="Categories"
          value={formatCompactNumber(data.kpis.categoriesTotal)}
          icon={Layers}
          meta={`${formatCompactNumber(data.kpis.categoriesAvailable)} available`}
        />
        <KpiCard
          title="Menu items"
          value={formatCompactNumber(data.kpis.menuItemsTotal)}
          icon={UtensilsCrossed}
          meta={`${formatCompactNumber(data.kpis.menuItemsAvailable)} available`}
        />
        <KpiCard
          title="Missing images"
          value={formatCompactNumber(data.kpis.menuItemsMissingImages)}
          icon={ImageOff}
          meta="Items with no images"
        />
        <KpiCard
          title="Addons"
          value={formatCompactNumber(data.kpis.addonsTotal)}
          icon={Tags}
          meta={`${formatCompactNumber(data.kpis.addonsPaid)} paid`}
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="border-b">
            <CardTitle>Items by category</CardTitle>
            <CardDescription>Available vs unavailable</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[260px]">
              <CategoryItemsChart data={data.categories} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b">
            <CardTitle>Category metrics</CardTitle>
            <CardDescription>Counts + average price/rating</CardDescription>
          </CardHeader>
          <CardContent>
            <MenuCategoryMetricsTable categories={data.categories} />
          </CardContent>
        </Card>
      </section>

      <section>
        <Card>
          <CardHeader className="border-b">
            <CardTitle>Items missing images</CardTitle>
            <CardDescription>Top 20 most recently updated</CardDescription>
          </CardHeader>
          <CardContent>
            <MissingImagesTable items={data.missingImages} />
          </CardContent>
        </Card>
      </section>
    </AnalyticsPageLayout>
  );
}
