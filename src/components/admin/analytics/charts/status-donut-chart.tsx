"use client";

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import type { StatusBreakdownPoint } from "@/components/admin/analytics/analytics-queries";

function StatusTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload?: StatusBreakdownPoint }>;
}) {
  if (!active) return null;
  const row = payload?.[0]?.payload;
  if (!row) return null;

  return (
    <div className="rounded-xl border bg-background px-3 py-2 text-xs shadow-sm">
      <div className="font-medium">{row.label}</div>
      <div className="text-muted-foreground">{row.count} orders</div>
    </div>
  );
}

export function StatusDonutChart({ data }: { data: StatusBreakdownPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Tooltip content={<StatusTooltip />} />
        <Pie
          data={data}
          dataKey="count"
          nameKey="label"
          innerRadius={58}
          outerRadius={80}
          paddingAngle={2}
          stroke="transparent"
        >
          {data.map((row) => (
            <Cell key={row.status} fill={row.color} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}

