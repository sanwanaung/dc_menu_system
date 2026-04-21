"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type RatingsDistributionPoint = {
  stars: number;
  count: number;
  color: string;
};

function DistributionTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload?: RatingsDistributionPoint }>;
}) {
  if (!active) return null;
  const row = payload?.[0]?.payload;
  if (!row) return null;

  return (
    <div className="rounded-xl border bg-background px-3 py-2 text-xs shadow-sm">
      <div className="font-medium">{row.stars} star</div>
      <div className="text-muted-foreground">{row.count} ratings</div>
    </div>
  );
}

export function RatingsDistributionChart({
  data,
}: {
  data: RatingsDistributionPoint[];
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" className="opacity-40" />
        <XAxis
          dataKey="stars"
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          className="text-xs"
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          width={36}
          className="text-xs"
        />
        <Tooltip content={<DistributionTooltip />} />
        <Bar dataKey="count" radius={[6, 6, 0, 0]}>
          {data.map((row) => (
            <Cell key={row.stars} fill={row.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
