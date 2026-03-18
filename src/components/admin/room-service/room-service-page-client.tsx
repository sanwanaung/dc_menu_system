"use client";

import * as React from "react";
import { Plus, Search, SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tag } from "@/components/admin/shared/tag";

import type {
  DemoRoom,
  DemoRoomServiceOrder,
  DemoRoomServiceStatus,
} from "../../../../demo";
import { ROOM_SERVICE_STATUSES, toStatusLabel } from "@/components/admin/room-service/room-service-status";
import { OrderFormDrawer, toIsoFromLocal, type OrderDraft } from "@/components/admin/room-service/order-form-drawer";
import { OrdersTable } from "@/components/admin/room-service/orders-table";

function makeId(prefix: string) {
  return `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`;
}

function normalize(input: string) {
  return input.trim().toLowerCase();
}

export function RoomServicePageClient({
  initialOrders,
  rooms,
}: {
  initialOrders: DemoRoomServiceOrder[];
  rooms: DemoRoom[];
}) {
  const [orders, setOrders] = React.useState<DemoRoomServiceOrder[]>(() => initialOrders);
  const [query, setQuery] = React.useState("");
  const [status, setStatus] = React.useState<DemoRoomServiceStatus | "all">("all");
  const [roomId, setRoomId] = React.useState<string>("all");

  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [mode, setMode] = React.useState<"create" | "edit">("create");
  const [editing, setEditing] = React.useState<DemoRoomServiceOrder | null>(null);

  const reservedRoomDatePairs = React.useMemo(() => {
    return new Set(orders.map((o) => `${o.roomId}::${o.date}`));
  }, [orders]);

  const summary = React.useMemo(() => {
    const counts: Record<DemoRoomServiceStatus, number> = {
      PENDING: 0,
      ACCEPTED: 0,
      FINISHED: 0,
      CANCELED: 0,
    };
    for (const order of orders) counts[order.status] += 1;
    return counts;
  }, [orders]);

  const filteredOrders = React.useMemo(() => {
    const q = normalize(query);
    const roomNameById = new Map(rooms.map((r) => [r.id, r.name] as const));

    return orders
      .filter((o) => (status === "all" ? true : o.status === status))
      .filter((o) => (roomId === "all" ? true : o.roomId === roomId))
      .filter((o) => {
        if (!q) return true;
        const roomName = roomNameById.get(o.roomId) ?? "";
        return (
          normalize(o.id).includes(q) ||
          normalize(o.roomId).includes(q) ||
          normalize(roomName).includes(q) ||
          normalize(o.date).includes(q) ||
          normalize(o.status).includes(q)
        );
      })
      .sort((a, b) => {
        const ta = new Date(a.createdAt).getTime();
        const tb = new Date(b.createdAt).getTime();
        return tb - ta;
      });
  }, [orders, rooms, query, status, roomId]);

  function saveDraft(draft: OrderDraft) {
    if (mode === "create") {
      const nowIso = new Date().toISOString();
      const next: DemoRoomServiceOrder = {
        id: `RSO-${new Date().getFullYear()}-${makeId("000")}`,
        roomId: draft.roomId,
        date: draft.date,
        startTime: toIsoFromLocal(draft.date, draft.startTime),
        endTime: toIsoFromLocal(draft.date, draft.endTime),
        notes: draft.notes ? draft.notes : null,
        status: draft.status,
        createdAt: nowIso,
        updatedAt: nowIso,
      };
      setOrders((prev) => [next, ...prev]);
      return;
    }

    if (!editing) return;
    setOrders((prev) =>
      prev.map((o) =>
        o.id === editing.id
          ? {
              ...o,
              roomId: draft.roomId,
              date: draft.date,
              startTime: toIsoFromLocal(draft.date, draft.startTime),
              endTime: toIsoFromLocal(draft.date, draft.endTime),
              notes: draft.notes ? draft.notes : null,
              status: draft.status,
              updatedAt: new Date().toISOString(),
            }
          : o,
      ),
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Room Service Orders</CardTitle>
          <CardDescription>
            Create, edit, delete, and update statuses (Prisma model: `RoomServiceOrder`). Demo-only.
          </CardDescription>
          <CardAction>
            <Button
              type="button"
              size="sm"
              onClick={() => {
                setMode("create");
                setEditing(null);
                setDrawerOpen(true);
              }}
            >
              <Plus className="mr-1.5 size-4" />
              New order
            </Button>
          </CardAction>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative md:flex-1">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by order id, room, date, or status…"
                className="pl-9"
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button type="button" variant="outline" size="sm">
                  <SlidersHorizontal className="mr-1.5 size-4" />
                  Filters
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[320px]">
                <DropdownMenuLabel>Status</DropdownMenuLabel>
                <DropdownMenuRadioGroup
                  value={status}
                  onValueChange={(v) => setStatus(v as DemoRoomServiceStatus | "all")}
                >
                  <DropdownMenuRadioItem value="all">All statuses</DropdownMenuRadioItem>
                  {ROOM_SERVICE_STATUSES.map((s) => (
                    <DropdownMenuRadioItem key={s} value={s}>
                      {toStatusLabel(s)}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>

                <DropdownMenuSeparator />

                <DropdownMenuLabel>Room</DropdownMenuLabel>
                <DropdownMenuRadioGroup value={roomId} onValueChange={setRoomId}>
                  <DropdownMenuRadioItem value="all">All rooms</DropdownMenuRadioItem>
                  {rooms.map((r) => (
                    <DropdownMenuRadioItem key={r.id} value={r.id}>
                      {r.name}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            {(status !== "all" || roomId !== "all") && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setStatus("all");
                  setRoomId("all");
                }}
              >
                Reset
              </Button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Tag>{orders.length} total</Tag>
            <Tag variant="warning">{summary.PENDING} pending</Tag>
            <Tag variant="info">{summary.ACCEPTED} accepted</Tag>
            <Tag variant="success">{summary.FINISHED} finished</Tag>
            <Tag variant="danger">{summary.CANCELED} canceled</Tag>
            <span className="text-xs text-muted-foreground">
              Enforces `unique(roomId, date)` to match your Prisma schema.
            </span>
          </div>

          <OrdersTable
            orders={filteredOrders}
            rooms={rooms}
            onEdit={(order) => {
              setMode("edit");
              setEditing(order);
              setDrawerOpen(true);
            }}
            onDelete={(order) => {
              setOrders((prev) => prev.filter((o) => o.id !== order.id));
            }}
            onUpdateStatus={(order, nextStatus) => {
              setOrders((prev) =>
                prev.map((o) =>
                  o.id === order.id
                    ? { ...o, status: nextStatus, updatedAt: new Date().toISOString() }
                    : o,
                ),
              );
            }}
          />
        </CardContent>
      </Card>

      <OrderFormDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        rooms={rooms}
        order={editing}
        mode={mode}
        reservedRoomDatePairs={reservedRoomDatePairs}
        onSave={saveDraft}
      />
    </>
  );
}

