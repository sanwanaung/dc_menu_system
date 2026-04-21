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

import type { UsersTrendPoint } from "@/components/admin/analytics/analytics-queries";

function UsersTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ dataKey?: string; value?: number }>;
  label?: string;
}) {
  if (!active) return null;
  const signups = payload?.find((p) => p.dataKey === "signups")?.value ?? 0;
  const verified = payload?.find((p) => p.dataKey === "verified")?.value ?? 0;

  return (
    <div className="rounded-xl border bg-background px-3 py-2 text-xs shadow-sm">
      <div className="font-medium">{label}</div>
      <div className="mt-1 flex items-center justify-between gap-6 text-muted-foreground">
        <span>Signups</span>
        <span className="font-medium text-foreground">{signups}</span>
      </div>
      <div className="flex items-center justify-between gap-6 text-muted-foreground">
        <span>Verified</span>
        <span className="font-medium text-foreground">{verified}</span>
      </div>
    </div>
  );
}

export function UsersTrendChart({ data }: { data: UsersTrendPoint[] }) {
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
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          width={36}
          className="text-xs"
        />
        <Tooltip content={<UsersTooltip />} />
        <Legend verticalAlign="top" height={24} iconType="circle" />
        <Line
          type="monotone"
          dataKey="signups"
          stroke="#6366f1"
          strokeWidth={2}
          dot={false}
          name="Signups"
        />
        <Line
          type="monotone"
          dataKey="verified"
          stroke="#22c55e"
          strokeWidth={2}
          dot={false}
          name="Verified"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

