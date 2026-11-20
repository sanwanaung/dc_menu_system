"use client";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import type { RoomServiceStatusChartPoint } from "@/features/dashboard/actions";

const chartConfig = {
  pending: { label: "Pending", color: "#f59e0b" },
  accepted: { label: "Accepted", color: "#3b82f6" },
  canceled: { label: "Canceled", color: "#f43f5e" },
  finished: { label: "Finished", color: "#10b981" },
} satisfies ChartConfig;

export function RoomServiceAreaChart({
  data,
}: {
  data: RoomServiceStatusChartPoint[];
}) {
  return (
    <ChartContainer config={chartConfig} className="aspect-auto h-72 w-full">
      <AreaChart data={data}>
        <defs>
          <linearGradient id="fillPending" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1} />
          </linearGradient>
          <linearGradient id="fillAccepted" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
          </linearGradient>
          <linearGradient id="fillCanceled" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.1} />
          </linearGradient>
          <linearGradient id="fillFinished" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={32}
          tickFormatter={(value) => {
            const date = new Date(value);
            return date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });
          }}
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              labelFormatter={(value) => {
                return new Date(value).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
              indicator="dot"
            />
          }
        />
        <Area
          dataKey="pending"
          type="natural"
          fill="url(#fillPending)"
          stroke="#f59e0b"
          stackId="a"
        />
        <Area
          dataKey="accepted"
          type="natural"
          fill="url(#fillAccepted)"
          stroke="#3b82f6"
          stackId="a"
        />
        <Area
          dataKey="canceled"
          type="natural"
          fill="url(#fillCanceled)"
          stroke="#f43f5e"
          stackId="a"
        />
        <Area
          dataKey="finished"
          type="natural"
          fill="url(#fillFinished)"
          stroke="#10b981"
          stackId="a"
        />
        <ChartLegend content={<ChartLegendContent />} />
      </AreaChart>
    </ChartContainer>
  );
}
