import { format, subDays } from "date-fns";
import type { RecentOrder } from "../../../../demo";

export type OrdersTimeseriesPoint = {
  day: string; // yyyy-MM-dd
  label: string; // e.g. "Mar 18"
  orders: number;
  revenue: number; // USD, demo
};

export type StatusBreakdownPoint = {
  status: RecentOrder["status"];
  count: number;
  color: string;
};

const STATUS_COLORS: Record<RecentOrder["status"], string> = {
  Pending: "#f59e0b",
  Preparing: "#3b82f6",
  Completed: "#10b981",
  Cancelled: "#f43f5e",
};

function parseMoneyUsd(input: string) {
  // Supports "$12.34" and "12.34".
  const numeric = Number(input.replace(/[^0-9.]/g, ""));
  return Number.isFinite(numeric) ? numeric : 0;
}

export function summarizeRecentOrders(orders: RecentOrder[]) {
  let revenue = 0;
  let completed = 0;
  let nonCancelled = 0;

  for (const order of orders) {
    if (order.status !== "Cancelled") {
      nonCancelled += 1;
      revenue += parseMoneyUsd(order.totalPrice);
    }
    if (order.status === "Completed") completed += 1;
  }

  const completionRate = nonCancelled === 0 ? 0 : completed / nonCancelled;
  const avgOrderValue = nonCancelled === 0 ? 0 : revenue / nonCancelled;

  return {
    revenue,
    completionRate,
    avgOrderValue,
  };
}

export function getOrderStatusBreakdown(
  orders: RecentOrder[],
): StatusBreakdownPoint[] {
  const counts: Record<RecentOrder["status"], number> = {
    Pending: 0,
    Preparing: 0,
    Completed: 0,
    Cancelled: 0,
  };

  for (const order of orders) {
    counts[order.status] += 1;
  }

  const rows: StatusBreakdownPoint[] = (Object.keys(counts) as Array<
    RecentOrder["status"]
  >).map((status) => ({
    status,
    count: counts[status],
    color: STATUS_COLORS[status],
  }));

  rows.sort((a, b) => b.count - a.count);
  return rows;
}

export function buildOrdersTimeseries({
  endDate,
  days,
  ordersToday,
  avgTicketUsd,
}: {
  endDate: Date;
  days: number;
  ordersToday: number;
  avgTicketUsd: number;
}): OrdersTimeseriesPoint[] {
  const safeDays = Math.max(7, Math.min(60, Math.floor(days)));
  const safeOrdersToday = Math.max(0, Math.floor(ordersToday));
  const safeAvgTicket = Number.isFinite(avgTicketUsd) ? avgTicketUsd : 16.5;

  const points: OrdersTimeseriesPoint[] = [];

  for (let offset = safeDays - 1; offset >= 0; offset -= 1) {
    const date = subDays(endDate, offset);
    const t = safeDays - 1 - offset;

    // Deterministic "businessy" pattern (weekday-ish waves) without randomness.
    const wave =
      0.82 +
      0.22 * Math.sin(t / 2.4) +
      0.16 * Math.cos(t / 3.7) +
      0.08 * Math.sin(t / 1.3);

    const impliedOrders =
      offset === 0
        ? safeOrdersToday
        : Math.max(0, Math.round(safeOrdersToday * wave));

    const revenue = Number(
      (
        impliedOrders *
        safeAvgTicket *
        (0.92 + 0.08 * Math.cos(t / 5))
      ).toFixed(2),
    );

    points.push({
      day: format(date, "yyyy-MM-dd"),
      label: format(date, "MMM d"),
      orders: impliedOrders,
      revenue,
    });
  }

  return points;
}
