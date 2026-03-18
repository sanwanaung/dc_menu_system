import { demoDashboard } from "../../../../../demo";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { KpiCard } from "@/components/admin/dashboard/kpi-card";
import { OrdersRevenueChart } from "@/components/admin/dashboard/orders-revenue-chart";
import { OrderStatusChart } from "@/components/admin/dashboard/order-status-chart";
import { PopularItemsTable } from "@/components/admin/dashboard/popular-items-table";
import { RecentOrdersTable } from "@/components/admin/dashboard/recent-orders-table";
import {
  buildOrdersTimeseries,
  getOrderStatusBreakdown,
  summarizeRecentOrders,
} from "@/components/admin/dashboard/dashboard-data";
import { format } from "date-fns";
import {
  CircleDollarSign,
  Download,
  ShoppingBag,
  Star,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  const now = new Date();
  const { stats, popularItems, recentOrders } = demoDashboard;

  const statusBreakdown = getOrderStatusBreakdown(recentOrders);
  const recentOrdersSummary = summarizeRecentOrders(recentOrders);
  const ordersTimeseries = buildOrdersTimeseries({
    endDate: now,
    days: 14,
    ordersToday: stats.ordersToday,
    avgTicketUsd: recentOrdersSummary.avgOrderValue || 16.5,
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-sm text-muted-foreground">
            {format(now, "EEEE, MMM d, yyyy")}
          </div>
          <h1 className="text-xl font-semibold tracking-tight">Dashboard</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Operational snapshot for hotel QR ordering. Demo data only — backend
            integration comes later.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled
            title="Coming soon"
          >
            <Download className="mr-1.5 size-4" />
            Export
          </Button>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            disabled
            title="Coming soon"
          >
            <Zap className="mr-1.5 size-4" />
            Run checks
          </Button>
        </div>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <KpiCard
          title="Total users"
          value={stats.totalUsers.toLocaleString()}
          icon={Users}
          meta="All-time registrations"
        />
        <KpiCard
          title="Active users"
          value={stats.activeUsers.toLocaleString()}
          icon={Users}
          meta="Active sessions (demo)"
        />
        <KpiCard
          title="Orders today"
          value={stats.ordersToday.toLocaleString()}
          icon={ShoppingBag}
          meta="Room + table orders"
        />
        <KpiCard
          title="Revenue today"
          value={`$${recentOrdersSummary.revenue.toFixed(2)}`}
          icon={CircleDollarSign}
          meta="From recent orders"
        />
        <KpiCard
          title="Avg rating"
          value={stats.averageRating.toFixed(2)}
          icon={Star}
          meta="Menu item ratings"
        />
        <KpiCard
          title="Completion rate"
          value={`${Math.round(recentOrdersSummary.completionRate * 100)}%`}
          icon={ShoppingBag}
          meta="Completed / non-cancelled"
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="border-b">
            <CardTitle>Orders & revenue</CardTitle>
            <CardDescription>Last 14 days (demo trend)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <OrdersRevenueChart data={ordersTimeseries} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b">
            <CardTitle>Order status</CardTitle>
            <CardDescription>Recent distribution</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-[220px]">
              <OrderStatusChart data={statusBreakdown} />
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-3">
              {statusBreakdown.map((row) => (
                <div key={row.status} className="flex items-center gap-2">
                  <span
                    className="size-2.5 rounded-full"
                    style={{ backgroundColor: row.color }}
                    aria-hidden="true"
                  />
                  <div className="min-w-0">
                    <div className="truncate text-xs text-muted-foreground">
                      {row.status}
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
            <CardTitle>Popular menu items</CardTitle>
            <CardDescription>Based on ratings (demo)</CardDescription>
          </CardHeader>
          <CardContent>
            <PopularItemsTable items={popularItems} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b">
            <CardTitle>Recent orders</CardTitle>
            <CardDescription>Latest activity (demo)</CardDescription>
            <CardAction>
              <Button type="button" variant="outline" size="sm" asChild>
                <Link href="/admin/orders">View all</Link>
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <RecentOrdersTable orders={recentOrders} />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
