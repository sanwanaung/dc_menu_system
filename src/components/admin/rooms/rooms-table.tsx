"use client";

import * as React from "react";
import { toast } from "sonner";
import { MoreHorizontal, Pencil, QrCode, Trash2, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tag } from "@/components/admin/shared/tag";

import type { DemoRoom } from "../../../../demo";

export function RoomsTable({
  rooms,
  onEdit,
  onDelete,
}: {
  rooms: DemoRoom[];
  onEdit: (room: DemoRoom) => void;
  onDelete: (room: DemoRoom) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Room</TableHead>
            <TableHead className="hidden md:table-cell">Floor</TableHead>
            <TableHead className="hidden lg:table-cell">Type</TableHead>
            <TableHead>QR</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rooms.map((room) => (
            <TableRow key={room.id}>
              <TableCell className="font-medium">{room.name}</TableCell>
              <TableCell className="hidden md:table-cell text-muted-foreground">
                {room.floor}
              </TableCell>
              <TableCell className="hidden lg:table-cell text-muted-foreground">
                {room.type}
              </TableCell>
              <TableCell>
                <Tag className="gap-1.5">
                  <QrCode className="size-3.5" />
                  {room.roomQR}
                </Tag>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button type="button" variant="ghost" size="icon-sm" aria-label="Open actions">
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(room)}>
                      <Pencil className="mr-2 size-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(room.roomQR);
                          toast.success("QR code copied.");
                        } catch {
                          toast.error("Could not copy. Your browser may block clipboard access.");
                        }
                      }}
                    >
                      <Copy className="mr-2 size-4" />
                      Copy QR code
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() => {
                        const ok = window.confirm(`Delete ${room.name}? This is demo-only, but the action is destructive.`);
                        if (!ok) return;
                        onDelete(room);
                      }}
                    >
                      <Trash2 className="mr-2 size-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
          {rooms.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">
                No rooms found.
              </TableCell>
            </TableRow>
          ) : null}
        </TableBody>
      </Table>
    </div>
  );
}

