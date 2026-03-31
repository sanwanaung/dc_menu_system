import { format, set } from "date-fns";

export function generateFilterOptions<T>(data: T[], key: keyof T) {
  const values = new Set<string>();

  for (const item of data) {
    const v = item[key];
    if (v !== undefined && v !== null) {
      values.add(String(v));
    }
  }

  return Array.from(values);
}

// haven't use yet!
export function getFormatedData<T, K extends keyof T>(data: T[], keys: K[]) {
  return data.map((item) => {
    const result: Record<string, string> = {};

    keys.forEach((k) => {
      const value = item[k];

      if (value instanceof Date) {
        const date = format(value, "dd/MM/yyyy");
        result[k as string] = date;
      } else if (value && typeof value === "object" && !Array.isArray(value)) {
        result[k as string] = Object.values(value)[0];
      } else {
        result[k as string] = value as string;
      }
    });

    return result;
  });
}

export function formatTime(time: string, d: Date) {
  const [hours, minutes, seconds] = time.split(":").map(Number);

  const date = set(d, {
    hours,
    minutes,
    seconds,
  });

  return format(date, "hh:mm a");
}

export const floors = [
  { label: "Floor 1", value: "1" },
  { label: "Floor 2", value: "2" },
  { label: "Floor 3", value: "3" },
  { label: "Floor 4", value: "4" },
  { label: "Floor 5", value: "5" },
  { label: "Floor 6", value: "6" },
  { label: "Floor 7", value: "7" },
  { label: "Floor 8", value: "8" },
];

export function normalize(input: string) {
  return input.trim().toLowerCase();
}

export type RoomServiceStatus =
  | "PENDING"
  | "ACCEPTED"
  | "CANCELED"
  | "FINISHED";

export const ROOM_SERVICE_STATUSES: RoomServiceStatus[] = [
  "PENDING",
  "ACCEPTED",
  "CANCELED",
  "FINISHED",
];

export function toStatusLabel(status: RoomServiceStatus) {
  switch (status) {
    case "PENDING":
      return "Pending";
    case "ACCEPTED":
      return "Accepted";
    case "FINISHED":
      return "Finished";
    case "CANCELED":
      return "Canceled";
    default:
      return status;
  }
}
export function statusVariant(status: RoomServiceStatus) {
  switch (status) {
    case "PENDING":
      return "warning";
    case "ACCEPTED":
      return "info";
    case "FINISHED":
      return "success";
    case "CANCELED":
      return "danger";
    default:
      return "neutral";
  }
}

export const USER_ROLES = ["admin", "subadmin", "user"] as const;

export type UserRoles = (typeof USER_ROLES)[number];

export const USER_ROLE_VALUES: readonly UserRoles[] = [
  "admin",
  "subadmin",
  "user",
] as const;
