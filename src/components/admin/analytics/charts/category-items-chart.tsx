"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { CategoryItemsPoint } from "@/components/admin/analytics/analytics-queries";

function CategoryTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ dataKey?: string; value?: number }>;
  label?: string;
}) {
  if (!active) return null;
  const available = payload?.find((p) => p.dataKey === "available")?.value ?? 0;
  const unavailable =
    payload?.find((p) => p.dataKey === "unavailable")?.value ?? 0;
  const total = available + unavailable;

  return (
    <div className="rounded-xl border bg-background px-3 py-2 text-xs shadow-sm">
      <div className="font-medium">{label}</div>
      <div className="mt-1 space-y-1 text-muted-foreground">
        <div className="flex items-center justify-between gap-6">
          <span>Total</span>
          <span className="font-medium text-foreground">{total}</span>
        </div>
        <div className="flex items-center justify-between gap-6">
          <span>Available</span>
          <span className="font-medium text-foreground">{available}</span>
        </div>
        <div className="flex items-center justify-between gap-6">
          <span>Unavailable</span>
          <span className="font-medium text-foreground">{unavailable}</span>
        </div>
      </div>
    </div>
  );
}

export function CategoryItemsChart({ data }: { data: CategoryItemsPoint[] }) {
  const chartData = data.map((row) => ({
    categoryName: row.categoryName,
    available: row.available,
    unavailable: row.unavailable,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
        margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" className="opacity-40" />
        <XAxis
          dataKey="categoryName"
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          interval="preserveStartEnd"
          angle={-24}
          textAnchor="end"
          className="text-xs"
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          width={36}
          className="text-xs"
        />
        <Tooltip content={<CategoryTooltip />} />
        <Legend verticalAlign="top" height={24} iconType="circle" />
        <Bar
          dataKey="available"
          stackId="a"
          fill="#22c55e"
          fillOpacity={0.25}
          name="Available"
        />
        <Bar
          dataKey="unavailable"
          stackId="a"
          fill="#a1a1aa"
          fillOpacity={0.25}
          name="Unavailable"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
