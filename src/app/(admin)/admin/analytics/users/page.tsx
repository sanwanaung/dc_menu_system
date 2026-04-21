import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { KpiCard } from "@/components/admin/dashboard/kpi-card";
import { BadgeCheck, Shield, UserPlus, Users } from "lucide-react";

import { getAnalyticsAccess } from "@/components/admin/analytics/analytics-access";
import { AccessDeniedCard } from "@/components/admin/analytics/access-denied-card";
import { AnalyticsPageLayout } from "@/components/admin/analytics/analytics-page-layout";
import { analyticsNavItems } from "@/components/admin/analytics/analytics-nav-items";
import { parseAnalyticsRange, type AnalyticsSearchParams } from "@/components/admin/analytics/analytics-range";
import { getUsersAnalytics } from "@/components/admin/analytics/analytics-queries";
import { UsersTrendChart } from "@/components/admin/analytics/charts/users-trend-chart";
import { RolesBreakdownTable } from "@/components/admin/analytics/tables/roles-breakdown-table";
import { NewUsersTable } from "@/components/admin/analytics/tables/new-users-table";
import { formatCompactNumber } from "@/components/admin/analytics/analytics-format";

export const dynamic = "force-dynamic";

export default async function AdminAnalyticsUsersPage({
  searchParams,
}: {
  searchParams?: AnalyticsSearchParams | Promise<AnalyticsSearchParams>;
}) {
  const access = await getAnalyticsAccess();
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const range = parseAnalyticsRange(resolvedSearchParams);

  if (!access.allowed) {
    return <AccessDeniedCard title="Users analytics" reason={access.reason} />;
  }

  const data = await getUsersAnalytics({ range });

  return (
    <AnalyticsPageLayout
      title="Users analytics"
      description="Signup trend, roles, and recent users."
      range={range}
      navItems={analyticsNavItems}
    >
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
          meta="In range"
        />
        <KpiCard
          title="Verified"
          value={formatCompactNumber(data.kpis.verifiedUsers)}
          icon={BadgeCheck}
          meta="Email verified"
        />
        <KpiCard
          title="Admins"
          value={formatCompactNumber(data.kpis.admins)}
          icon={Shield}
          meta={`${formatCompactNumber(data.kpis.subadmins)} subadmins`}
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="border-b">
            <CardTitle>Signups trend</CardTitle>
            <CardDescription>Daily signups vs. verified</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[260px]">
              <UsersTrendChart data={data.trend} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b">
            <CardTitle>Roles</CardTitle>
            <CardDescription>User role distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <RolesBreakdownTable roles={data.roles} />
          </CardContent>
        </Card>
      </section>

      <section>
        <Card>
          <CardHeader className="border-b">
            <CardTitle>Recent users</CardTitle>
            <CardDescription>Latest 20</CardDescription>
          </CardHeader>
          <CardContent>
            <NewUsersTable users={data.recent} />
          </CardContent>
        </Card>
      </section>
    </AnalyticsPageLayout>
  );
}
