"use client";

import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { RatingsTrendPoint } from "@/components/admin/analytics/analytics-queries";

function RatingsTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ dataKey?: string; value?: number }>;
  label?: string;
}) {
  if (!active) return null;
  const count = payload?.find((p) => p.dataKey === "count")?.value ?? 0;
  const avg = payload?.find((p) => p.dataKey === "avg")?.value ?? 0;

  return (
    <div className="rounded-xl border bg-background px-3 py-2 text-xs shadow-sm">
      <div className="font-medium">{label}</div>
      <div className="mt-1 flex items-center justify-between gap-6 text-muted-foreground">
        <span>Ratings</span>
        <span className="font-medium text-foreground">{count}</span>
      </div>
      <div className="flex items-center justify-between gap-6 text-muted-foreground">
        <span>Avg</span>
        <span className="font-medium text-foreground">
          {Number(avg).toFixed(2)}
        </span>
      </div>
    </div>
  );
}

export function RatingsTrendChart({ data }: { data: RatingsTrendPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
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
          domain={[0, 5]}
          className="text-xs"
        />
        <Tooltip content={<RatingsTooltip />} />
        <Legend verticalAlign="top" height={24} iconType="circle" />
        <Bar
          yAxisId="left"
          dataKey="count"
          fill="#a1a1aa"
          fillOpacity={0.4}
          name="Ratings"
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="avg"
          stroke="#6366f1"
          strokeWidth={2}
          dot={false}
          name="Average"
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

