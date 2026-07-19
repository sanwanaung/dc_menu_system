import { formatInTimeZone, fromZonedTime } from "date-fns-tz";
import { parse } from "date-fns";

export const ROOM_SERVICE_TIMEZONE = "Asia/Yangon";

export const getRoomServiceDateKey = (date: Date) =>
  formatInTimeZone(date, ROOM_SERVICE_TIMEZONE, "yyyy-MM-dd");

export const getRoomServiceDisplayDate = (date: Date) =>
  formatInTimeZone(date, ROOM_SERVICE_TIMEZONE, "PPP");

export const getRoomServiceWindow = (dateKey: string) => {
  const start = fromZonedTime(`${dateKey}T00:00:00`, ROOM_SERVICE_TIMEZONE);
  const end = fromZonedTime(`${dateKey}T23:59:59.999`, ROOM_SERVICE_TIMEZONE);

  return { start, end };
};

export const getTodayRoomServiceWindow = () => {
  const dateKey = getRoomServiceDateKey(new Date());
  return getRoomServiceWindow(dateKey);
};

export const getRoomServiceCalendarFloorDate = () => {
  const todayKey = getRoomServiceDateKey(new Date());

  return parse(todayKey, "yyyy-MM-dd", new Date());
};
