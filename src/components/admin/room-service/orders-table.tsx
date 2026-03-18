"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  ClipboardCheck,
  MoreHorizontal,
  Pencil,
  Trash2,
  XCircle,
  CheckCircle2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tag } from "@/components/admin/shared/tag";
import { toStatusLabel } from "@/components/admin/room-service/room-service-status";

import type {
  DemoRoom,
  DemoRoomServiceOrder,
  DemoRoomServiceStatus,
} from "../../../../demo";

function statusVariant(status: DemoRoomServiceStatus) {
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

function formatTimeWindow(startIso: string, endIso: string) {
  const start = new Date(startIso);
  const end = new Date(endIso);
  const fmt = (d: Date) =>
    `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  return `${fmt(start)}–${fmt(end)}`;
}

export function OrdersTable({
  orders,
  rooms,
  onEdit,
  onDelete,
  onUpdateStatus,
}: {
  orders: DemoRoomServiceOrder[];
  rooms: DemoRoom[];
  onEdit: (order: DemoRoomServiceOrder) => void;
  onDelete: (order: DemoRoomServiceOrder) => void;
  onUpdateStatus: (order: DemoRoomServiceOrder, status: DemoRoomServiceStatus) => void;
}) {
  const roomNameById = React.useMemo(() => {
    return new Map(rooms.map((r) => [r.id, r.name] as const));
  }, [rooms]);

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead>Room</TableHead>
            <TableHead className="hidden md:table-cell">Date</TableHead>
            <TableHead className="hidden lg:table-cell">Window</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => {
            const roomName = roomNameById.get(order.roomId) ?? order.roomId;
            return (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell className="text-muted-foreground">{roomName}</TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">
                  {order.date}
                </TableCell>
                <TableCell className="hidden lg:table-cell text-muted-foreground">
                  {formatTimeWindow(order.startTime, order.endTime)}
                </TableCell>
                <TableCell>
                  <Tag variant={statusVariant(order.status)}>{toStatusLabel(order.status)}</Tag>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button type="button" variant="ghost" size="icon-sm" aria-label="Open actions">
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(order)}>
                        <Pencil className="mr-2 size-4" />
                        Edit
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>Status</DropdownMenuLabel>

                      <DropdownMenuItem
                        onClick={() => {
                          onUpdateStatus(order, "ACCEPTED");
                          toast.success("Marked as accepted.");
                        }}
                        disabled={order.status !== "PENDING"}
                      >
                        <ClipboardCheck className="mr-2 size-4" />
                        Accept
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => {
                          onUpdateStatus(order, "FINISHED");
                          toast.success("Marked as finished.");
                        }}
                        disabled={order.status !== "ACCEPTED"}
                      >
                        <CheckCircle2 className="mr-2 size-4" />
                        Finish
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => {
                          onUpdateStatus(order, "CANCELED");
                          toast.message("Marked as canceled.");
                        }}
                        disabled={order.status === "FINISHED" || order.status === "CANCELED"}
                      >
                        <XCircle className="mr-2 size-4" />
                        Cancel
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => {
                          const ok = window.confirm(
                            `Delete ${order.id}? This is demo-only, but the action is destructive.`,
                          );
                          if (!ok) return;
                          onDelete(order);
                        }}
                      >
                        <Trash2 className="mr-2 size-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}

          {orders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                No room service orders found.
              </TableCell>
            </TableRow>
          ) : null}
        </TableBody>
      </Table>
    </div>
  );
}

