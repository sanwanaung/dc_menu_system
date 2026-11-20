"use client";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Label, Pie, PieChart } from "recharts";
import type { RoomServiceStatusChartPoint } from "@/features/dashboard/actions";

const chartConfig = {
  pending: { label: "Pending", color: "#f59e0b" },
  accepted: { label: "Accepted", color: "#3b82f6" },
  canceled: { label: "Canceled", color: "#f43f5e" },
  finished: { label: "Finished", color: "#10b981" },
} satisfies ChartConfig;

type PieRow = {
  status: keyof typeof chartConfig;
  count: number;
  fill: string;
};

function summarize(data: RoomServiceStatusChartPoint[]) {
  return data.reduce(
    (acc, row) => ({
      pending: acc.pending + row.pending,
      accepted: acc.accepted + row.accepted,
      canceled: acc.canceled + row.canceled,
      finished: acc.finished + row.finished,
    }),
    { pending: 0, accepted: 0, canceled: 0, finished: 0 },
  );
}

export function RoomServiceStatusPieChart({
  data,
}: {
  data: RoomServiceStatusChartPoint[];
}) {
  const totals = summarize(data);
  const totalOrders =
    totals.pending + totals.accepted + totals.canceled + totals.finished;

  const pieData: PieRow[] = [
    { status: "pending", count: totals.pending, fill: "var(--color-pending)" },
    {
      status: "accepted",
      count: totals.accepted,
      fill: "var(--color-accepted)",
    },
    {
      status: "canceled",
      count: totals.canceled,
      fill: "var(--color-canceled)",
    },
    {
      status: "finished",
      count: totals.finished,
      fill: "var(--color-finished)",
    },
  ];

  return (
    <ChartContainer
      config={chartConfig}
      className="aspect-auto h-72 w-full [&_.recharts-pie-label-text]:fill-foreground"
    >
      <PieChart>
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
        <Pie
          data={pieData}
          dataKey="count"
          nameKey="status"
          innerRadius={60}
          strokeWidth={5}
        >
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                const cx = viewBox.cx as number;
                const cy = viewBox.cy as number;
                return (
                  <text
                    x={cx}
                    y={cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={cx}
                      y={cy}
                      className="fill-foreground text-2xl font-semibold"
                    >
                      {totalOrders.toLocaleString()}
                    </tspan>
                    <tspan
                      x={cx}
                      y={cy + 22}
                      className="fill-muted-foreground text-xs"
                    >
                      Orders
                    </tspan>
                  </text>
                );
              }
              return null;
            }}
          />
        </Pie>
        <ChartLegend content={<ChartLegendContent nameKey="status" />} />
      </PieChart>
    </ChartContainer>
  );
}

