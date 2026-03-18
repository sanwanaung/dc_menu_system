"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { OrdersTimeseriesPoint } from "@/components/admin/dashboard/dashboard-data";

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ dataKey?: string; value?: number }>;
  label?: string;
}) {
  if (!active) return null;

  const orders = payload?.find((p) => p.dataKey === "orders")?.value ?? 0;
  const revenue = payload?.find((p) => p.dataKey === "revenue")?.value ?? 0;

  return (
    <div className="rounded-xl border bg-background px-3 py-2 text-xs shadow-sm">
      <div className="font-medium">{label}</div>
      <div className="mt-1 flex items-center justify-between gap-6 text-muted-foreground">
        <span>Orders</span>
        <span className="font-medium text-foreground">{orders}</span>
      </div>
      <div className="flex items-center justify-between gap-6 text-muted-foreground">
        <span>Revenue</span>
        <span className="font-medium text-foreground">
          ${Number(revenue).toFixed(0)}
        </span>
      </div>
    </div>
  );
}

export function OrdersRevenueChart({ data }: { data: OrdersTimeseriesPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" className="opacity-40" />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          minTickGap={18}
          className="text-xs"
        />
        <YAxis
          yAxisId="left"
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          width={36}
          className="text-xs"
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          width={44}
          className="text-xs"
        />
        <Tooltip content={<ChartTooltip />} />
        <Legend verticalAlign="top" height={24} iconType="circle" />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="orders"
          stroke="#6366f1"
          strokeWidth={2}
          dot={false}
          name="Orders"
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="revenue"
          stroke="#22c55e"
          strokeWidth={2}
          dot={false}
          name="Revenue"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
