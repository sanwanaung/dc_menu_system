"use server";

import { allowedUserRole } from "@/lib";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import type { ApiResponse } from "@/types/shared/api-response";
import { RoomServiceStatus } from "generated/prisma/client";
import {
  eachDayOfInterval,
  endOfDay,
  format,
  startOfDay,
  subDays,
} from "date-fns";
import { headers } from "next/headers";

export type RoomServiceStatusChartPoint = {
  date: string;
  pending: number;
  accepted: number;
  canceled: number;
  finished: number;
};

export type DashboardTotals = {
  totalUsers: number;
  totalRoomServiceOrders: number;
  averageFinishedRoomServiceOrders: number; // avg FINISHED per day for the range
};

function clampInt(value: number, min: number, max: number) {
  const asInt = Number.isFinite(value) ? Math.floor(value) : min;
  return Math.max(min, Math.min(max, asInt));
}

async function requireAdminOrSubadmin(): Promise<
  ApiResponse<{ userId: string }>
> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session)
    return { error: "No Authorization!", data: null, message: null };
  const isAllowed =
    session.user.role === allowedUserRole.ADMIN ||
    session.user.role === allowedUserRole.SUBADMIN;
  if (!isAllowed)
    return { error: "You don't have permission!", data: null, message: null };
  return { data: { userId: session.user.id }, error: null, message: null };
}

function getInclusiveDateRange(days: number) {
  const safeDays = clampInt(days, 1, 365);
  const now = new Date();
  const end = endOfDay(now);
  const start = startOfDay(subDays(end, safeDays - 1));
  return { start, end, safeDays };
}

export const getDashboardTotals = async (
  days: number = 7,
): Promise<ApiResponse<DashboardTotals>> => {
  try {
    const authResult = await requireAdminOrSubadmin();
    if (authResult.error) return authResult;

    const { start, end, safeDays } = getInclusiveDateRange(days);

    const [totalUsers, totalRoomServiceOrders, finishedInRange] =
      await Promise.all([
        prisma.user.count(),
        prisma.roomServiceOrder.count(),
        prisma.roomServiceOrder.count({
          where: {
            status: RoomServiceStatus.FINISHED,
            date: {
              gte: start,
              lte: end,
            },
          },
        }),
      ]);

    const averageFinishedRoomServiceOrders = Number(
      (finishedInRange / safeDays).toFixed(2),
    );

    return {
      data: {
        totalUsers,
        totalRoomServiceOrders,
        averageFinishedRoomServiceOrders,
      },
      error: null,
      message: "Fetched Successfully!",
    };
  } catch {
    return {
      error: "Failed to fetch dashboard totals!",
      data: null,
      message: null,
    };
  }
};

export const getRoomServiceStatusChart = async (
  days: number = 7,
): Promise<ApiResponse<RoomServiceStatusChartPoint[]>> => {
  try {
    const authResult = await requireAdminOrSubadmin();
    if (authResult.error) return authResult;

    const { start, end } = getInclusiveDateRange(days);

    const allDates = eachDayOfInterval({ start, end });
    const points: RoomServiceStatusChartPoint[] = allDates.map((d) => ({
      date: format(d, "yyyy-MM-dd"),
      pending: 0,
      accepted: 0,
      canceled: 0,
      finished: 0,
    }));

    const byDate = new Map<string, RoomServiceStatusChartPoint>();
    for (const point of points) byDate.set(point.date, point);

    const orders = await prisma.roomServiceOrder.findMany({
      where: {
        date: {
          gte: start,
          lte: end,
        },
      },
      select: {
        date: true,
        status: true,
      },
    });

    for (const order of orders) {
      const key = format(order.date, "yyyy-MM-dd");
      const bucket = byDate.get(key);
      if (!bucket) continue;

      switch (order.status) {
        case RoomServiceStatus.PENDING:
          bucket.pending += 1;
          break;
        case RoomServiceStatus.ACCEPTED:
          bucket.accepted += 1;
          break;
        case RoomServiceStatus.CANCELED:
          bucket.canceled += 1;
          break;
        case RoomServiceStatus.FINISHED:
          bucket.finished += 1;
          break;
        default:
          break;
      }
    }

    return { data: points, error: null, message: "Fetched Successfully!" };
  } catch {
    return { error: "Failed to fetch chart data!", data: null, message: null };
  }
};
