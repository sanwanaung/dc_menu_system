import type { DemoRoomServiceStatus } from "../../../../demo";

export const ROOM_SERVICE_STATUSES: DemoRoomServiceStatus[] = [
  "PENDING",
  "ACCEPTED",
  "FINISHED",
  "CANCELED",
];

export function toStatusLabel(status: DemoRoomServiceStatus) {
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

