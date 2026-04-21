"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { RoomServiceTrendPoint } from "@/components/admin/analytics/analytics-queries";

function TrendTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ dataKey?: string; value?: number }>;
  label?: string;
}) {
  if (!active) return null;

  const total = payload?.find((p) => p.dataKey === "total")?.value ?? 0;
  const pending = payload?.find((p) => p.dataKey === "PENDING")?.value ?? 0;
  const accepted = payload?.find((p) => p.dataKey === "ACCEPTED")?.value ?? 0;
  const finished = payload?.find((p) => p.dataKey === "FINISHED")?.value ?? 0;
  const canceled = payload?.find((p) => p.dataKey === "CANCELED")?.value ?? 0;

  return (
    <div className="rounded-xl border bg-background px-3 py-2 text-xs shadow-sm">
      <div className="font-medium">{label}</div>
      <div className="mt-1 space-y-1 text-muted-foreground">
        <div className="flex items-center justify-between gap-6">
          <span>Total</span>
          <span className="font-medium text-foreground">{total}</span>
        </div>
        <div className="flex items-center justify-between gap-6">
          <span>Pending</span>
          <span className="font-medium text-foreground">{pending}</span>
        </div>
        <div className="flex items-center justify-between gap-6">
          <span>Accepted</span>
          <span className="font-medium text-foreground">{accepted}</span>
        </div>
        <div className="flex items-center justify-between gap-6">
          <span>Finished</span>
          <span className="font-medium text-foreground">{finished}</span>
        </div>
        <div className="flex items-center justify-between gap-6">
          <span>Canceled</span>
          <span className="font-medium text-foreground">{canceled}</span>
        </div>
      </div>
    </div>
  );
}

export function RoomServiceTrendChart({ data }: { data: RoomServiceTrendPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
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
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          width={36}
          className="text-xs"
        />
        <Tooltip content={<TrendTooltip />} />
        <Legend verticalAlign="top" height={24} iconType="circle" />
        <Area
          type="monotone"
          dataKey="PENDING"
          stackId="1"
          stroke="#f59e0b"
          fill="#f59e0b"
          fillOpacity={0.25}
          name="Pending"
        />
        <Area
          type="monotone"
          dataKey="ACCEPTED"
          stackId="1"
          stroke="#3b82f6"
          fill="#3b82f6"
          fillOpacity={0.25}
          name="Accepted"
        />
        <Area
          type="monotone"
          dataKey="FINISHED"
          stackId="1"
          stroke="#22c55e"
          fill="#22c55e"
          fillOpacity={0.25}
          name="Finished"
        />
        <Area
          type="monotone"
          dataKey="CANCELED"
          stackId="1"
          stroke="#ef4444"
          fill="#ef4444"
          fillOpacity={0.25}
          name="Canceled"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

