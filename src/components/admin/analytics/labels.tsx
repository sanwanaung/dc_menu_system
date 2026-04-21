import { cn } from "@/lib/utils";
import type { RoomServiceStatus } from "generated/prisma/client";

const roomServiceStatusStyles: Record<RoomServiceStatus, string> = {
  PENDING: "bg-amber-500/15 text-amber-700 ring-amber-500/20 dark:text-amber-300",
  ACCEPTED: "bg-blue-500/15 text-blue-700 ring-blue-500/20 dark:text-blue-300",
  CANCELED: "bg-red-500/15 text-red-700 ring-red-500/20 dark:text-red-300",
  FINISHED: "bg-emerald-500/15 text-emerald-700 ring-emerald-500/20 dark:text-emerald-300",
};

export function RoomServiceStatusPill({
  status,
  className,
}: {
  status: RoomServiceStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset",
        roomServiceStatusStyles[status],
        className,
      )}
    >
      {status}
    </span>
  );
}

export function AvailabilityPill({
  available,
  className,
}: {
  available: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset",
        available
          ? "bg-emerald-500/15 text-emerald-700 ring-emerald-500/20 dark:text-emerald-300"
          : "bg-zinc-500/15 text-zinc-700 ring-zinc-500/20 dark:text-zinc-300",
        className,
      )}
    >
      {available ? "Available" : "Unavailable"}
    </span>
  );
}

