"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { RoomsGroupPoint } from "@/components/admin/analytics/analytics-queries";

function GroupTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value?: number }>;
  label?: string;
}) {
  if (!active) return null;
  const count = payload?.[0]?.value ?? 0;

  return (
    <div className="rounded-xl border bg-background px-3 py-2 text-xs shadow-sm">
      <div className="font-medium">{label}</div>
      <div className="text-muted-foreground">{count} rooms</div>
    </div>
  );
}

export function RoomsGroupBarChart({
  data,
  labelKey = "key",
}: {
  data: RoomsGroupPoint[];
  labelKey?: keyof RoomsGroupPoint;
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" className="opacity-40" />
        <XAxis
          dataKey={labelKey}
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          minTickGap={14}
          className="text-xs"
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          width={36}
          className="text-xs"
        />
        <Tooltip content={<GroupTooltip />} />
        <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

