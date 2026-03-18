"use client";

import * as React from "react";
import { z } from "zod";
import { toast } from "sonner";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { cn } from "@/lib/utils";

import type {
  DemoRoom,
  DemoRoomServiceOrder,
  DemoRoomServiceStatus,
} from "../../../../demo";
import { ROOM_SERVICE_STATUSES, toStatusLabel } from "@/components/admin/room-service/room-service-status";

const orderSchema = z.object({
  roomId: z.string().min(1, "Room is required."),
  date: z.string().min(10, "Date is required."), // yyyy-MM-dd
  startTime: z.string().min(1, "Start time is required."), // HH:mm
  endTime: z.string().min(1, "End time is required."), // HH:mm
  notes: z.string().trim().optional(),
  status: z.custom<DemoRoomServiceStatus>(),
});

type OrderDraft = z.infer<typeof orderSchema>;

function toTimeInputValue(iso: string) {
  const d = new Date(iso);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

function toDraft(order?: DemoRoomServiceOrder | null): OrderDraft {
  const date = order?.date ?? new Date().toISOString().slice(0, 10);
  return {
    roomId: order?.roomId ?? "",
    date,
    startTime: order?.startTime ? toTimeInputValue(order.startTime) : "11:30",
    endTime: order?.endTime ? toTimeInputValue(order.endTime) : "12:00",
    notes: order?.notes ?? "",
    status: order?.status ?? "PENDING",
  };
}

function toIsoFromLocal(dateYmd: string, timeHm: string) {
  // Local time -> ISO
  const [hh, mm] = timeHm.split(":").map((v) => Number(v));
  const [yy, mo, dd] = dateYmd.split("-").map((v) => Number(v));
  const local = new Date(yy, mo - 1, dd, hh, mm, 0, 0);
  return local.toISOString();
}

function SelectLike({
  className,
  ...props
}: React.ComponentProps<"select">) {
  return (
    <select
      className={cn(
        "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm dark:bg-input/30",
        className,
      )}
      {...props}
    />
  );
}

export function OrderFormDrawer({
  open,
  onOpenChange,
  rooms,
  order,
  mode,
  reservedRoomDatePairs,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rooms: DemoRoom[];
  order?: DemoRoomServiceOrder | null;
  mode: "create" | "edit";
  reservedRoomDatePairs: Set<string>; // `${roomId}::${date}`
  onSave: (draft: OrderDraft) => void;
}) {
  const [draft, setDraft] = React.useState<OrderDraft>(() => toDraft(order));
  const [errors, setErrors] = React.useState<Partial<Record<keyof OrderDraft, string>>>(
    {},
  );

  React.useEffect(() => {
    if (open) {
      setDraft(toDraft(order));
      setErrors({});
    }
  }, [open, order]);

  function validate(next: OrderDraft) {
    const parsed = orderSchema.safeParse(next);
    const nextErrors: Partial<Record<keyof OrderDraft, string>> = {};

    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof OrderDraft | undefined;
        if (key && !nextErrors[key]) nextErrors[key] = issue.message;
      }
    }

    const pairKey = `${next.roomId}::${next.date}`;
    const currentPairKey = order ? `${order.roomId}::${order.date}` : null;
    if (pairKey && pairKey !== currentPairKey && reservedRoomDatePairs.has(pairKey)) {
      nextErrors.date =
        "This room already has a RoomServiceOrder for that date (matches Prisma unique(roomId, date)).";
    }

    const startIso = toIsoFromLocal(next.date, next.startTime);
    const endIso = toIsoFromLocal(next.date, next.endTime);
    if (new Date(endIso).getTime() <= new Date(startIso).getTime()) {
      nextErrors.endTime = "End time must be after start time.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="h-dvh p-0">
        <DrawerHeader className="border-b">
          <DrawerTitle>
            {mode === "create" ? "Create room service order" : "Edit room service order"}
          </DrawerTitle>
          <DrawerDescription>
            Prisma model: `RoomServiceOrder` (demo-only UI).
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto p-4">
          <FieldGroup>
            <Field>
              <FieldLabel>
                <FieldTitle>Room</FieldTitle>
                <FieldContent>
                  <SelectLike
                    value={draft.roomId}
                    onChange={(e) =>
                      setDraft((v) => ({ ...v, roomId: e.target.value }))
                    }
                  >
                    <option value="" disabled>
                      Select a room…
                    </option>
                    {rooms.map((room) => (
                      <option key={room.id} value={room.id}>
                        {room.name} (Floor {room.floor})
                      </option>
                    ))}
                  </SelectLike>
                </FieldContent>
              </FieldLabel>
              <FieldError>{errors.roomId}</FieldError>
            </Field>

            <Field orientation="responsive">
              <FieldLabel>
                <FieldTitle>Date</FieldTitle>
                <FieldContent>
                  <Input
                    type="date"
                    value={draft.date}
                    onChange={(e) => setDraft((v) => ({ ...v, date: e.target.value }))}
                  />
                </FieldContent>
              </FieldLabel>
              <FieldError>{errors.date}</FieldError>

              <FieldLabel>
                <FieldTitle>Status</FieldTitle>
                <FieldContent>
                  <SelectLike
                    value={draft.status}
                    onChange={(e) =>
                      setDraft((v) => ({ ...v, status: e.target.value as DemoRoomServiceStatus }))
                    }
                  >
                    {ROOM_SERVICE_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {toStatusLabel(s)}
                      </option>
                    ))}
                  </SelectLike>
                </FieldContent>
              </FieldLabel>
              <FieldError>{errors.status}</FieldError>
            </Field>

            <Field orientation="responsive">
              <FieldLabel>
                <FieldTitle>Start time</FieldTitle>
                <FieldContent>
                  <Input
                    type="time"
                    value={draft.startTime}
                    onChange={(e) =>
                      setDraft((v) => ({ ...v, startTime: e.target.value }))
                    }
                  />
                </FieldContent>
              </FieldLabel>
              <FieldError>{errors.startTime}</FieldError>

              <FieldLabel>
                <FieldTitle>End time</FieldTitle>
                <FieldContent>
                  <Input
                    type="time"
                    value={draft.endTime}
                    onChange={(e) =>
                      setDraft((v) => ({ ...v, endTime: e.target.value }))
                    }
                  />
                </FieldContent>
              </FieldLabel>
              <FieldError>{errors.endTime}</FieldError>
            </Field>

            <Field>
              <FieldLabel>
                <FieldTitle>Notes (optional)</FieldTitle>
                <FieldContent>
                  <Input
                    value={draft.notes ?? ""}
                    onChange={(e) => setDraft((v) => ({ ...v, notes: e.target.value }))}
                    placeholder="Dietary requests, delivery instructions…"
                  />
                </FieldContent>
              </FieldLabel>
              <FieldError>{errors.notes}</FieldError>
            </Field>
          </FieldGroup>
        </div>

        <DrawerFooter className="border-t bg-background">
          <div className="flex items-center justify-end gap-2">
            <DrawerClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DrawerClose>
            <Button
              type="button"
              onClick={() => {
                const next: OrderDraft = {
                  roomId: draft.roomId,
                  date: draft.date,
                  startTime: draft.startTime,
                  endTime: draft.endTime,
                  notes: (draft.notes ?? "").trim(),
                  status: draft.status,
                };

                if (!validate(next)) {
                  toast.error("Fix the highlighted fields.");
                  return;
                }

                onSave(next);
                onOpenChange(false);
                toast.success(mode === "create" ? "Order created." : "Order updated.");
              }}
            >
              {mode === "create" ? "Create order" : "Save changes"}
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export type { OrderDraft };
export { toIsoFromLocal };

