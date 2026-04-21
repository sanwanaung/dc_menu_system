import prisma from "@/lib/prisma";
import { eachDayOfInterval, format, startOfDay } from "date-fns";
import type { RoomServiceStatus } from "generated/prisma/client";

import type { AnalyticsRange } from "@/components/admin/analytics/analytics-range";

export type StatusBreakdownPoint = {
  status: RoomServiceStatus;
  label: string;
  count: number;
  color: string;
};

export type RoomServiceTrendPoint = {
  date: string;
  label: string;
  total: number;
  PENDING: number;
  ACCEPTED: number;
  CANCELED: number;
  FINISHED: number;
};

export type RatingsTrendPoint = {
  date: string;
  label: string;
  count: number;
  avg: number;
};

export type UsersTrendPoint = {
  date: string;
  label: string;
  signups: number;
  verified: number;
};

export type RoomsGroupPoint = {
  key: string;
  count: number;
};

export type TopMenuItem = {
  id: string;
  name: string;
  categoryName: string;
  price: number;
  isAvailable: boolean;
  ratingAverage: number;
  ratingCount: number;
  imageCount: number;
};

export type RoomActivity = {
  id: string;
  name: string;
  type: string;
  floor: string;
  orders: number;
};

export type RecentRoomServiceOrder = {
  id: string;
  roomName: string;
  date: string;
  startTime: string;
  endTime: string;
  status: RoomServiceStatus;
  createdAt: string;
};

export type RecentRating = {
  id: string;
  menuItemName: string;
  roomName: string;
  userName: string | null;
  rating: number;
  comment: string | null;
  createdAt: string;
};

export type NewUserRow = {
  id: string;
  name: string;
  email: string;
  role: string | null;
  emailVerified: boolean;
  banned: boolean | null;
  createdAt: string;
};

export type CategoryItemsPoint = {
  categoryId: string;
  categoryName: string;
  total: number;
  available: number;
  unavailable: number;
  avgPrice: number;
  avgRatingAverage: number;
};

const ROOM_SERVICE_STATUS_META: Record<
  RoomServiceStatus,
  { label: string; color: string }
> = {
  PENDING: { label: "Pending", color: "#f59e0b" },
  ACCEPTED: { label: "Accepted", color: "#3b82f6" },
  CANCELED: { label: "Canceled", color: "#ef4444" },
  FINISHED: { label: "Finished", color: "#22c55e" },
};

function dateKey(date: Date) {
  return format(date, "yyyy-MM-dd");
}

function buildDailyBuckets(range: AnalyticsRange) {
  const days = eachDayOfInterval({ start: range.from, end: range.to });
  return days.map((day) => ({
    day,
    key: dateKey(day),
    label: format(day, "MMM d"),
  }));
}

export type AnalyticsOverview = {
  kpis: {
    totalUsers: number;
    newUsers: number;
    verifiedUsers: number;
    activeSessions: number;
    totalRooms: number;
    totalMenuItems: number;
    availableMenuItems: number;
    ratingsCount: number;
    avgRating: number;
    roomServiceOrders: number;
    roomServicePending: number;
    addonsTotal: number;
    addonsPaid: number;
    variantOptionsTotal: number;
  };
  roomServiceStatus: StatusBreakdownPoint[];
  roomServiceTrend: RoomServiceTrendPoint[];
  ratingsTrend: RatingsTrendPoint[];
  usersTrend: UsersTrendPoint[];
  roomsByFloor: RoomsGroupPoint[];
  roomsByType: RoomsGroupPoint[];
  topMenuItems: TopMenuItem[];
  topRoomsByRoomService: RoomActivity[];
  recentRoomServiceOrders: RecentRoomServiceOrder[];
};

export async function getAnalyticsOverview({
  range,
}: {
  range: AnalyticsRange;
}): Promise<AnalyticsOverview> {
  const [
    totalUsersAgg,
    newUsersAgg,
    verifiedUsersAgg,
    activeSessionsAgg,
    totalRoomsAgg,
    totalMenuItemsAgg,
    availableMenuItemsAgg,
    addonsTotalAgg,
    addonsPaidAgg,
    variantOptionsTotalAgg,
    ratingsAgg,
    roomServiceOrdersAgg,
    roomServicePendingAgg,
    roomsByFloorRaw,
    roomsByTypeRaw,
    topMenuItemsRaw,
    roomServiceOrdersForTrend,
    ratingsForTrend,
    usersForTrend,
    topRoomsRaw,
    recentRoomServiceOrdersRaw,
  ] = await prisma.$transaction([
    prisma.user.aggregate({ _count: { id: true } }),
    prisma.user.aggregate({
      where: { createdAt: { gte: range.from, lte: range.to } },
      _count: { id: true },
    }),
    prisma.user.aggregate({
      where: { emailVerified: true },
      _count: { id: true },
    }),
    prisma.session.aggregate({
      where: { expiresAt: { gt: new Date() } },
      _count: { id: true },
    }),
    prisma.room.aggregate({ _count: { id: true } }),
    prisma.menuItem.aggregate({ _count: { id: true } }),
    prisma.menuItem.aggregate({
      where: { isAvailable: true },
      _count: { id: true },
    }),
    prisma.addon.aggregate({ _count: { id: true } }),
    prisma.addon.aggregate({
      where: { status: "PAID" },
      _count: { id: true },
    }),
    prisma.variantOption.aggregate({ _count: { id: true } }),
    prisma.menuItemRating.aggregate({
      where: { createdAt: { gte: range.from, lte: range.to } },
      _count: { id: true },
      _avg: { rating: true },
    }),
    prisma.roomServiceOrder.aggregate({
      where: { date: { gte: range.from, lte: range.to } },
      _count: { id: true },
    }),
    prisma.roomServiceOrder.aggregate({
      where: { status: "PENDING" },
      _count: { id: true },
    }),
    prisma.room.groupBy({
      by: ["floor"],
      _count: { id: true },
    }),
    prisma.room.groupBy({
      by: ["type"],
      _count: { id: true },
    }),
    prisma.menuItem.findMany({
      take: 10,
      orderBy: [{ ratingAverage: "desc" }, { ratingCount: "desc" }],
      select: {
        id: true,
        name: true,
        price: true,
        isAvailable: true,
        ratingAverage: true,
        ratingCount: true,
        category: { select: { name: true } },
        _count: { select: { menuItemImages: true } },
      },
    }),
    prisma.roomServiceOrder.findMany({
      where: { date: { gte: range.from, lte: range.to } },
      select: { date: true, status: true },
    }),
    prisma.menuItemRating.findMany({
      where: { createdAt: { gte: range.from, lte: range.to } },
      select: { createdAt: true, rating: true },
    }),
    prisma.user.findMany({
      where: { createdAt: { gte: range.from, lte: range.to } },
      select: { createdAt: true, emailVerified: true },
    }),
    prisma.roomServiceOrder.groupBy({
      by: ["roomId"],
      where: { date: { gte: range.from, lte: range.to } },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 8,
    }),
    prisma.roomServiceOrder.findMany({
      take: 12,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        date: true,
        startTime: true,
        endTime: true,
        status: true,
        createdAt: true,
        room: { select: { name: true } },
      },
    }),
  ]);

  const ratingsCount = ratingsAgg._count.id;
  const avgRating = ratingsAgg._avg.rating ?? 0;

  const totalUsers = totalUsersAgg._count.id;
  const newUsers = newUsersAgg._count.id;
  const verifiedUsers = verifiedUsersAgg._count.id;
  const activeSessions = activeSessionsAgg._count.id;
  const totalRooms = totalRoomsAgg._count.id;
  const totalMenuItems = totalMenuItemsAgg._count.id;
  const availableMenuItems = availableMenuItemsAgg._count.id;
  const addonsTotal = addonsTotalAgg._count.id;
  const addonsPaid = addonsPaidAgg._count.id;
  const variantOptionsTotal = variantOptionsTotalAgg._count.id;
  const roomServiceOrders = roomServiceOrdersAgg._count.id;
  const roomServicePending = roomServicePendingAgg._count.id;

  const buckets = buildDailyBuckets(range);

  const roomServiceByDay = new Map<
    string,
    {
      PENDING: number;
      ACCEPTED: number;
      CANCELED: number;
      FINISHED: number;
    }
  >();

  for (const order of roomServiceOrdersForTrend) {
    const key = dateKey(startOfDay(order.date));
    const prev = roomServiceByDay.get(key) ?? {
      PENDING: 0,
      ACCEPTED: 0,
      CANCELED: 0,
      FINISHED: 0,
    };
    prev[order.status] += 1;
    roomServiceByDay.set(key, prev);
  }

  const roomServiceTrend: RoomServiceTrendPoint[] = buckets.map((b) => {
    const row =
      roomServiceByDay.get(b.key) ??
      ({
        PENDING: 0,
        ACCEPTED: 0,
        CANCELED: 0,
        FINISHED: 0,
      } as const);

    const total = row.PENDING + row.ACCEPTED + row.CANCELED + row.FINISHED;
    return {
      date: b.key,
      label: b.label,
      total,
      PENDING: row.PENDING,
      ACCEPTED: row.ACCEPTED,
      CANCELED: row.CANCELED,
      FINISHED: row.FINISHED,
    };
  });

  const ratingsByDay = new Map<string, { count: number; sum: number }>();
  for (const rating of ratingsForTrend) {
    const key = dateKey(startOfDay(rating.createdAt));
    const prev = ratingsByDay.get(key) ?? { count: 0, sum: 0 };
    prev.count += 1;
    prev.sum += rating.rating;
    ratingsByDay.set(key, prev);
  }

  const ratingsTrend: RatingsTrendPoint[] = buckets.map((b) => {
    const row = ratingsByDay.get(b.key);
    const count = row?.count ?? 0;
    const avg = count ? row!.sum / count : 0;
    return { date: b.key, label: b.label, count, avg };
  });

  const usersByDay = new Map<string, { signups: number; verified: number }>();
  for (const user of usersForTrend) {
    const key = dateKey(startOfDay(user.createdAt));
    const prev = usersByDay.get(key) ?? { signups: 0, verified: 0 };
    prev.signups += 1;
    if (user.emailVerified) prev.verified += 1;
    usersByDay.set(key, prev);
  }

  const usersTrend: UsersTrendPoint[] = buckets.map((b) => {
    const row = usersByDay.get(b.key) ?? { signups: 0, verified: 0 };
    return {
      date: b.key,
      label: b.label,
      signups: row.signups,
      verified: row.verified,
    };
  });

  const statusBreakdownMap = roomServiceOrdersForTrend.reduce(
    (acc, order) => {
      acc[order.status] = (acc[order.status] ?? 0) + 1;
      return acc;
    },
    {} as Record<RoomServiceStatus, number>,
  );

  const roomServiceStatus = (
    Object.keys(ROOM_SERVICE_STATUS_META) as RoomServiceStatus[]
  ).map((status) => ({
    status,
    label: ROOM_SERVICE_STATUS_META[status].label,
    count: statusBreakdownMap[status] ?? 0,
    color: ROOM_SERVICE_STATUS_META[status].color,
  }));

  const roomsByFloor: RoomsGroupPoint[] = roomsByFloorRaw
    .map((row) => ({ key: row.floor, count: row._count?.id ?? 0 }))
    .sort((a, b) => a.key.localeCompare(b.key, undefined, { numeric: true }));

  const roomsByType: RoomsGroupPoint[] = roomsByTypeRaw
    .map((row) => ({ key: row.type, count: row._count?.id ?? 0 }))
    .sort((a, b) => b.count - a.count || a.key.localeCompare(b.key));

  const topMenuItems: TopMenuItem[] = topMenuItemsRaw.map((row) => ({
    id: row.id,
    name: row.name,
    categoryName: row.category.name,
    price: Number(row.price),
    isAvailable: row.isAvailable,
    ratingAverage: row.ratingAverage,
    ratingCount: row.ratingCount,
    imageCount: row._count.menuItemImages,
  }));

  const topRoomIds = topRoomsRaw.map((row) => row.roomId);
  const roomsForTopRoomsResolved =
    topRoomIds.length > 0
      ? await prisma.room.findMany({
          where: { id: { in: topRoomIds } },
          select: { id: true, name: true, type: true, floor: true },
        })
      : [];

  const roomById = new Map(roomsForTopRoomsResolved.map((r) => [r.id, r]));
  const topRoomsByRoomService: RoomActivity[] = topRoomsRaw
    .map((row) => {
      const room = roomById.get(row.roomId);
      if (!room) return null;
      return {
        id: room.id,
        name: room.name,
        type: room.type,
        floor: room.floor,
        orders: row._count?.id ?? 0,
      };
    })
    .filter((v): v is RoomActivity => Boolean(v));

  const recentRoomServiceOrders: RecentRoomServiceOrder[] =
    recentRoomServiceOrdersRaw.map((row) => ({
      id: row.id,
      roomName: row.room.name,
      date: row.date.toISOString(),
      startTime: row.startTime,
      endTime: row.endTime,
      status: row.status,
      createdAt: row.createdAt.toISOString(),
    }));

  return {
    kpis: {
      totalUsers,
      newUsers,
      verifiedUsers,
      activeSessions,
      totalRooms,
      totalMenuItems,
      availableMenuItems,
      ratingsCount,
      avgRating,
      roomServiceOrders,
      roomServicePending,
      addonsTotal,
      addonsPaid,
      variantOptionsTotal,
    },
    roomServiceStatus,
    roomServiceTrend,
    ratingsTrend,
    usersTrend,
    roomsByFloor,
    roomsByType,
    topMenuItems,
    topRoomsByRoomService,
    recentRoomServiceOrders,
  };
}

export type MenuAnalytics = {
  kpis: {
    categoriesTotal: number;
    categoriesAvailable: number;
    menuItemsTotal: number;
    menuItemsAvailable: number;
    menuItemsMissingImages: number;
    addonsTotal: number;
    addonsPaid: number;
    variantOptionsTotal: number;
  };
  categories: CategoryItemsPoint[];
  missingImages: Array<{
    id: string;
    name: string;
    categoryName: string;
    price: number;
    ratingAverage: number;
    ratingCount: number;
  }>;
};

export async function getMenuAnalytics({
  range: _range,
}: {
  range: AnalyticsRange;
}): Promise<MenuAnalytics> {
  const [
    categoriesTotalAgg,
    categoriesAvailableAgg,
    menuItemsTotalAgg,
    menuItemsAvailableAgg,
    menuItemsMissingImagesAgg,
    addonsTotalAgg,
    addonsPaidAgg,
    variantOptionsTotalAgg,
    categoriesRaw,
    itemsByCategoryAvailability,
    itemsByCategoryAvg,
    missingImagesRaw,
  ] = await prisma.$transaction([
    prisma.menuCategory.aggregate({ _count: { id: true } }),
    prisma.menuCategory.aggregate({
      where: { isAvailable: true },
      _count: { id: true },
    }),
    prisma.menuItem.aggregate({ _count: { id: true } }),
    prisma.menuItem.aggregate({
      where: { isAvailable: true },
      _count: { id: true },
    }),
    prisma.menuItem.aggregate({
      where: { menuItemImages: { none: {} } },
      _count: { id: true },
    }),
    prisma.addon.aggregate({ _count: { id: true } }),
    prisma.addon.aggregate({
      where: { status: "PAID" },
      _count: { id: true },
    }),
    prisma.variantOption.aggregate({ _count: { id: true } }),
    prisma.menuCategory.findMany({
      orderBy: { displayOrder: "asc" },
      select: { id: true, name: true, isAvailable: true },
    }),
    prisma.menuItem.groupBy({
      by: ["categoryId", "isAvailable"],
      _count: { id: true },
    }),
    prisma.menuItem.groupBy({
      by: ["categoryId"],
      _count: { id: true },
      _avg: { price: true, ratingAverage: true },
    }),
    prisma.menuItem.findMany({
      where: { menuItemImages: { none: {} } },
      take: 20,
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        name: true,
        isAvailable: true,
        price: true,
        ratingAverage: true,
        ratingCount: true,
        category: { select: { name: true } },
      },
    }),
  ]);

  const availabilityByCategory = new Map<
    string,
    { available: number; unavailable: number }
  >();

  for (const row of itemsByCategoryAvailability) {
    const prev = availabilityByCategory.get(row.categoryId) ?? {
      available: 0,
      unavailable: 0,
    };
    if (row.isAvailable) prev.available = row._count?.id ?? 0;
    else prev.unavailable = row._count?.id ?? 0;
    availabilityByCategory.set(row.categoryId, prev);
  }

  const avgByCategory = new Map<
    string,
    { total: number; avgPrice: number; avgRatingAverage: number }
  >();
  for (const row of itemsByCategoryAvg) {
    avgByCategory.set(row.categoryId, {
      total: row._count?.id ?? 0,
      avgPrice: Number(row._avg.price ?? 0),
      avgRatingAverage: row._avg.ratingAverage ?? 0,
    });
  }

  const categories: CategoryItemsPoint[] = categoriesRaw.map((c) => {
    const availability = availabilityByCategory.get(c.id) ?? {
      available: 0,
      unavailable: 0,
    };
    const avg = avgByCategory.get(c.id) ?? {
      total: availability.available + availability.unavailable,
      avgPrice: 0,
      avgRatingAverage: 0,
    };
    return {
      categoryId: c.id,
      categoryName: c.name,
      total: avg.total,
      available: availability.available,
      unavailable: availability.unavailable,
      avgPrice: avg.avgPrice,
      avgRatingAverage: avg.avgRatingAverage,
    };
  });

  const missingImages = missingImagesRaw.map((row) => ({
    id: row.id,
    name: row.name,
    categoryName: row.category.name,
    isAvailable: row.isAvailable,
    price: Number(row.price),
    ratingAverage: row.ratingAverage,
    ratingCount: row.ratingCount,
  }));

  return {
    kpis: {
      categoriesTotal: categoriesTotalAgg._count.id,
      categoriesAvailable: categoriesAvailableAgg._count.id,
      menuItemsTotal: menuItemsTotalAgg._count.id,
      menuItemsAvailable: menuItemsAvailableAgg._count.id,
      menuItemsMissingImages: menuItemsMissingImagesAgg._count.id,
      addonsTotal: addonsTotalAgg._count.id,
      addonsPaid: addonsPaidAgg._count.id,
      variantOptionsTotal: variantOptionsTotalAgg._count.id,
    },
    categories,
    missingImages,
  };
}

export type RoomServiceAnalytics = {
  kpis: {
    total: number;
    pending: number;
    accepted: number;
    finished: number;
    canceled: number;
  };
  status: StatusBreakdownPoint[];
  trend: RoomServiceTrendPoint[];
  topRooms: RoomActivity[];
  recent: RecentRoomServiceOrder[];
};

export async function getRoomServiceAnalytics({
  range,
}: {
  range: AnalyticsRange;
}): Promise<RoomServiceAnalytics> {
  const [
    ordersForTrend,
    pendingAgg,
    acceptedAgg,
    finishedAgg,
    canceledAgg,
    recentRaw,
    topRoomsRaw,
  ] = await prisma.$transaction([
    prisma.roomServiceOrder.findMany({
      where: { date: { gte: range.from, lte: range.to } },
      select: { date: true, status: true, roomId: true },
    }),
    prisma.roomServiceOrder.aggregate({
      where: { status: "PENDING" },
      _count: { id: true },
    }),
    prisma.roomServiceOrder.aggregate({
      where: { status: "ACCEPTED" },
      _count: { id: true },
    }),
    prisma.roomServiceOrder.aggregate({
      where: { status: "FINISHED" },
      _count: { id: true },
    }),
    prisma.roomServiceOrder.aggregate({
      where: { status: "CANCELED" },
      _count: { id: true },
    }),
    prisma.roomServiceOrder.findMany({
      take: 20,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        date: true,
        startTime: true,
        endTime: true,
        status: true,
        createdAt: true,
        room: { select: { name: true } },
      },
    }),
    prisma.roomServiceOrder.groupBy({
      by: ["roomId"],
      where: { date: { gte: range.from, lte: range.to } },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 10,
    }),
  ]);

  const total = ordersForTrend.length;
  const buckets = buildDailyBuckets(range);

  const roomServiceByDay = new Map<
    string,
    {
      PENDING: number;
      ACCEPTED: number;
      CANCELED: number;
      FINISHED: number;
    }
  >();

  const statusCounts = ordersForTrend.reduce(
    (acc, order) => {
      acc[order.status] = (acc[order.status] ?? 0) + 1;
      return acc;
    },
    {} as Record<RoomServiceStatus, number>,
  );

  for (const order of ordersForTrend) {
    const key = dateKey(startOfDay(order.date));
    const prev = roomServiceByDay.get(key) ?? {
      PENDING: 0,
      ACCEPTED: 0,
      CANCELED: 0,
      FINISHED: 0,
    };
    prev[order.status] += 1;
    roomServiceByDay.set(key, prev);
  }

  const trend: RoomServiceTrendPoint[] = buckets.map((b) => {
    const row =
      roomServiceByDay.get(b.key) ??
      ({
        PENDING: 0,
        ACCEPTED: 0,
        CANCELED: 0,
        FINISHED: 0,
      } as const);
    const dayTotal = row.PENDING + row.ACCEPTED + row.CANCELED + row.FINISHED;
    return {
      date: b.key,
      label: b.label,
      total: dayTotal,
      PENDING: row.PENDING,
      ACCEPTED: row.ACCEPTED,
      CANCELED: row.CANCELED,
      FINISHED: row.FINISHED,
    };
  });

  const status: StatusBreakdownPoint[] = (
    Object.keys(ROOM_SERVICE_STATUS_META) as RoomServiceStatus[]
  ).map((key) => ({
    status: key,
    label: ROOM_SERVICE_STATUS_META[key].label,
    color: ROOM_SERVICE_STATUS_META[key].color,
    count: statusCounts[key] ?? 0,
  }));

  const topRoomIds = topRoomsRaw.map((row) => row.roomId);
  const rooms =
    topRoomIds.length > 0
      ? await prisma.room.findMany({
          where: { id: { in: topRoomIds } },
          select: { id: true, name: true, type: true, floor: true },
        })
      : [];

  const roomById = new Map(rooms.map((r) => [r.id, r]));
  const topRooms: RoomActivity[] = topRoomsRaw
    .map((row) => {
      const room = roomById.get(row.roomId);
      if (!room) return null;
      return {
        id: room.id,
        name: room.name,
        type: room.type,
        floor: room.floor,
        orders: row._count?.id ?? 0,
      };
    })
    .filter((v): v is RoomActivity => Boolean(v));

  const recent: RecentRoomServiceOrder[] = recentRaw.map((row) => ({
    id: row.id,
    roomName: row.room.name,
    date: row.date.toISOString(),
    startTime: row.startTime,
    endTime: row.endTime,
    status: row.status,
    createdAt: row.createdAt.toISOString(),
  }));

  return {
    kpis: {
      total,
      pending: pendingAgg._count.id,
      accepted: acceptedAgg._count.id,
      finished: finishedAgg._count.id,
      canceled: canceledAgg._count.id,
    },
    status,
    trend,
    topRooms,
    recent,
  };
}

export type RatingsAnalytics = {
  kpis: {
    count: number;
    avg: number;
    withComment: number;
  };
  distribution: Array<{ stars: number; count: number; color: string }>;
  trend: RatingsTrendPoint[];
  recent: RecentRating[];
  topItems: TopMenuItem[];
};

export async function getRatingsAnalytics({
  range,
}: {
  range: AnalyticsRange;
}): Promise<RatingsAnalytics> {
  const [
    ratingsAgg,
    withCommentAgg,
    ratingsRaw,
    distributionRaw,
    recentRaw,
    topItemsRaw,
  ] = await prisma.$transaction([
    prisma.menuItemRating.aggregate({
      where: { createdAt: { gte: range.from, lte: range.to } },
      _count: { id: true },
      _avg: { rating: true },
    }),
    prisma.menuItemRating.aggregate({
      where: {
        createdAt: { gte: range.from, lte: range.to },
        comment: { not: null },
      },
      _count: { id: true },
    }),
    prisma.menuItemRating.findMany({
      where: { createdAt: { gte: range.from, lte: range.to } },
      select: { createdAt: true, rating: true },
    }),
    prisma.menuItemRating.groupBy({
      by: ["rating"],
      where: { createdAt: { gte: range.from, lte: range.to } },
      _count: { id: true },
    }),
    prisma.menuItemRating.findMany({
      take: 20,
      orderBy: { createdAt: "desc" },
      where: { createdAt: { gte: range.from, lte: range.to } },
      select: {
        id: true,
        rating: true,
        comment: true,
        createdAt: true,
        menuItem: { select: { name: true } },
        room: { select: { name: true } },
        user: { select: { name: true } },
      },
    }),
    prisma.menuItem.findMany({
      take: 10,
      orderBy: [{ ratingAverage: "desc" }, { ratingCount: "desc" }],
      select: {
        id: true,
        name: true,
        price: true,
        isAvailable: true,
        ratingAverage: true,
        ratingCount: true,
        category: { select: { name: true } },
        _count: { select: { menuItemImages: true } },
      },
    }),
  ]);

  const buckets = buildDailyBuckets(range);
  const byDay = new Map<string, { count: number; sum: number }>();
  for (const row of ratingsRaw) {
    const key = dateKey(startOfDay(row.createdAt));
    const prev = byDay.get(key) ?? { count: 0, sum: 0 };
    prev.count += 1;
    prev.sum += row.rating;
    byDay.set(key, prev);
  }

  const trend: RatingsTrendPoint[] = buckets.map((b) => {
    const row = byDay.get(b.key);
    const count = row?.count ?? 0;
    const avg = count ? row!.sum / count : 0;
    return { date: b.key, label: b.label, count, avg };
  });

  const colors: Record<number, string> = {
    1: "#ef4444",
    2: "#f97316",
    3: "#f59e0b",
    4: "#84cc16",
    5: "#22c55e",
  };

  const distributionMap = new Map<number, number>();
  for (const row of distributionRaw)
    distributionMap.set(row.rating, row._count?.id ?? 0);
  const distribution = [1, 2, 3, 4, 5].map((stars) => ({
    stars,
    count: distributionMap.get(stars) ?? 0,
    color: colors[stars],
  }));

  const recent: RecentRating[] = recentRaw.map((row) => ({
    id: row.id,
    menuItemName: row.menuItem.name,
    roomName: row.room.name,
    userName: row.user?.name ?? null,
    rating: row.rating,
    comment: row.comment,
    createdAt: row.createdAt.toISOString(),
  }));

  const topItems: TopMenuItem[] = topItemsRaw.map((row) => ({
    id: row.id,
    name: row.name,
    categoryName: row.category.name,
    price: Number(row.price),
    isAvailable: row.isAvailable,
    ratingAverage: row.ratingAverage,
    ratingCount: row.ratingCount,
    imageCount: row._count.menuItemImages,
  }));

  return {
    kpis: {
      count: ratingsAgg._count.id,
      avg: ratingsAgg._avg.rating ?? 0,
      withComment: withCommentAgg._count.id,
    },
    distribution,
    trend,
    recent,
    topItems,
  };
}

export type RoomsAnalytics = {
  kpis: {
    totalRooms: number;
    floors: number;
    types: number;
  };
  roomsByFloor: RoomsGroupPoint[];
  roomsByType: RoomsGroupPoint[];
  topRoomsByRatings: Array<{
    id: string;
    name: string;
    floor: string;
    type: string;
    ratings: number;
    avgRating: number;
  }>;
  topRoomsByRoomService: RoomActivity[];
};

export async function getRoomsAnalytics({
  range,
}: {
  range: AnalyticsRange;
}): Promise<RoomsAnalytics> {
  const [
    totalRoomsAgg,
    roomsByFloorRaw,
    roomsByTypeRaw,
    topRoomsByRatingsRaw,
    topRoomsByRoomServiceRaw,
  ] = await prisma.$transaction([
    prisma.room.aggregate({ _count: { id: true } }),
    prisma.room.groupBy({ by: ["floor"], _count: { id: true } }),
    prisma.room.groupBy({ by: ["type"], _count: { id: true } }),
    prisma.menuItemRating.groupBy({
      by: ["roomId"],
      where: { createdAt: { gte: range.from, lte: range.to } },
      _count: { id: true },
      _avg: { rating: true },
      orderBy: { _count: { id: "desc" } },
      take: 10,
    }),
    prisma.roomServiceOrder.groupBy({
      by: ["roomId"],
      where: { date: { gte: range.from, lte: range.to } },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 10,
    }),
  ]);

  const roomsByFloor: RoomsGroupPoint[] = roomsByFloorRaw
    .map((row) => ({ key: row.floor, count: row._count?.id ?? 0 }))
    .sort((a, b) => a.key.localeCompare(b.key, undefined, { numeric: true }));

  const roomsByType: RoomsGroupPoint[] = roomsByTypeRaw
    .map((row) => ({ key: row.type, count: row._count?.id ?? 0 }))
    .sort((a, b) => b.count - a.count || a.key.localeCompare(b.key));

  const ratingRoomIds = topRoomsByRatingsRaw.map((row) => row.roomId);
  const serviceRoomIds = topRoomsByRoomServiceRaw.map((row) => row.roomId);
  const roomIds = Array.from(new Set([...ratingRoomIds, ...serviceRoomIds]));

  const rooms =
    roomIds.length > 0
      ? await prisma.room.findMany({
          where: { id: { in: roomIds } },
          select: { id: true, name: true, floor: true, type: true },
        })
      : [];

  const roomById = new Map(rooms.map((r) => [r.id, r]));

  const topRoomsByRatings = topRoomsByRatingsRaw
    .map((row) => {
      const room = roomById.get(row.roomId);
      if (!room) return null;
      return {
        id: room.id,
        name: room.name,
        floor: room.floor,
        type: room.type,
        ratings: row._count?.id ?? 0,
        avgRating: row._avg.rating ?? 0,
      };
    })
    .filter((v): v is NonNullable<typeof v> => Boolean(v));

  const topRoomsByRoomService = topRoomsByRoomServiceRaw
    .map((row) => {
      const room = roomById.get(row.roomId);
      if (!room) return null;
      return {
        id: room.id,
        name: room.name,
        floor: room.floor,
        type: room.type,
        orders: row._count?.id ?? 0,
      };
    })
    .filter((v): v is RoomActivity => Boolean(v));

  return {
    kpis: {
      totalRooms: totalRoomsAgg._count.id,
      floors: roomsByFloor.length,
      types: roomsByType.length,
    },
    roomsByFloor,
    roomsByType,
    topRoomsByRatings,
    topRoomsByRoomService,
  };
}

export type UsersAnalytics = {
  kpis: {
    totalUsers: number;
    newUsers: number;
    verifiedUsers: number;
    bannedUsers: number;
    admins: number;
    subadmins: number;
  };
  trend: UsersTrendPoint[];
  roles: Array<{ role: string; count: number }>;
  recent: NewUserRow[];
};

export async function getUsersAnalytics({
  range,
}: {
  range: AnalyticsRange;
}): Promise<UsersAnalytics> {
  const [
    totalUsersAgg,
    newUsersAgg,
    verifiedUsersAgg,
    bannedUsersAgg,
    adminsAgg,
    subadminsAgg,
    usersForTrend,
    roleRaw,
    recentRaw,
  ] = await prisma.$transaction([
    prisma.user.aggregate({ _count: { id: true } }),
    prisma.user.aggregate({
      where: { createdAt: { gte: range.from, lte: range.to } },
      _count: { id: true },
    }),
    prisma.user.aggregate({
      where: { emailVerified: true },
      _count: { id: true },
    }),
    prisma.user.aggregate({
      where: { banned: true },
      _count: { id: true },
    }),
    prisma.user.aggregate({
      where: { role: { in: ["admin", "ADMIN"] } },
      _count: { id: true },
    }),
    prisma.user.aggregate({
      where: { role: { in: ["subadmin", "SUBADMIN"] } },
      _count: { id: true },
    }),
    prisma.user.findMany({
      where: { createdAt: { gte: range.from, lte: range.to } },
      select: { createdAt: true, emailVerified: true },
    }),
    prisma.user.groupBy({
      by: ["role"],
      _count: { id: true },
    }),
    prisma.user.findMany({
      take: 20,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        emailVerified: true,
        banned: true,
        createdAt: true,
      },
    }),
  ]);

  const buckets = buildDailyBuckets(range);
  const byDay = new Map<string, { signups: number; verified: number }>();
  for (const row of usersForTrend) {
    const key = dateKey(startOfDay(row.createdAt));
    const prev = byDay.get(key) ?? { signups: 0, verified: 0 };
    prev.signups += 1;
    if (row.emailVerified) prev.verified += 1;
    byDay.set(key, prev);
  }
  const trend: UsersTrendPoint[] = buckets.map((b) => {
    const row = byDay.get(b.key) ?? { signups: 0, verified: 0 };
    return {
      date: b.key,
      label: b.label,
      signups: row.signups,
      verified: row.verified,
    };
  });

  const roles = roleRaw
    .map((row) => ({ role: row.role ?? "unknown", count: row._count?.id ?? 0 }))
    .sort((a, b) => b.count - a.count || a.role.localeCompare(b.role));

  const recent: NewUserRow[] = recentRaw.map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    emailVerified: row.emailVerified,
    banned: row.banned,
    createdAt: row.createdAt.toISOString(),
  }));

  return {
    kpis: {
      totalUsers: totalUsersAgg._count.id,
      newUsers: newUsersAgg._count.id,
      verifiedUsers: verifiedUsersAgg._count.id,
      bannedUsers: bannedUsersAgg._count.id,
      admins: adminsAgg._count.id,
      subadmins: subadminsAgg._count.id,
    },
    trend,
    roles,
    recent,
  };
}
