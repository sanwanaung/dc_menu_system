"use client";

import * as React from "react";
import { Plus, Search, SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

import type { DemoRoom } from "../../../../demo";
import { RoomFormDrawer } from "@/components/admin/rooms/room-form-drawer";
import { RoomsTable } from "@/components/admin/rooms/rooms-table";

import { AdminLayout } from "./../admin-layout";
import { DataTable } from "../data-table";
import { columns } from "./columns";

function makeId(prefix: string) {
  return `${prefix}_${Math.random().toString(16).slice(2, 10)}`;
}

function normalize(input: string) {
  return input.trim().toLowerCase();
}

export function RoomsPage({ initialRooms }: { initialRooms: DemoRoom[] }) {
  // const [rooms, setRooms] = React.useState<DemoRoom[]>(() => initialRooms);
  // const [query, setQuery] = React.useState("");
  // const [floor, setFloor] = React.useState<string>("all");
  // const [type, setType] = React.useState<string>("all");

  // const [drawerOpen, setDrawerOpen] = React.useState(false);
  // const [mode, setMode] = React.useState<"create" | "edit">("create");
  // const [editing, setEditing] = React.useState<DemoRoom | null>(null);

  // const floors = React.useMemo(() => {
  //   const values = Array.from(new Set(rooms.map((r) => r.floor))).sort((a, b) =>
  //     a.localeCompare(b, undefined, { numeric: true }),
  //   );
  //   return values;
  // }, [rooms]);

  // const types = React.useMemo(() => {
  //   return Array.from(new Set(rooms.map((r) => r.type))).sort((a, b) =>
  //     a.localeCompare(b),
  //   );
  // }, [rooms]);

  // const reservedQrCodes = React.useMemo(() => {
  //   return new Set(rooms.map((r) => r.roomQR));
  // }, [rooms]);

  // const filteredRooms = React.useMemo(() => {
  //   const q = normalize(query);
  //   return rooms
  //     .filter((r) => (floor === "all" ? true : r.floor === floor))
  //     .filter((r) => (type === "all" ? true : r.type === type))
  //     .filter((r) => {
  //       if (!q) return true;
  //       return (
  //         normalize(r.name).includes(q) ||
  //         normalize(r.roomQR).includes(q) ||
  //         normalize(r.floor).includes(q) ||
  //         normalize(r.type).includes(q)
  //       );
  //     })
  //     .sort((a, b) =>
  //       a.name.localeCompare(b.name, undefined, { numeric: true }),
  //     );
  // }, [rooms, floor, type, query]);

  return (
    <>
      <DataTable data={initialRooms} columns={columns} />
    </>
  );
}

{
  /* <>
  <div className="flex flex-col gap-3 md:flex-row md:items-center">
    <div className="relative md:flex-1">
      <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search rooms by name, floor, type, or QR…"
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
      <DropdownMenuContent align="end" className="w-[280px]">
        <DropdownMenuLabel>Floor</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={floor} onValueChange={setFloor}>
          <DropdownMenuRadioItem value="all">All floors</DropdownMenuRadioItem>
          {floors.map((f) => (
            <DropdownMenuRadioItem key={f} value={f}>
              Floor {f}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>

        <DropdownMenuSeparator />

        <DropdownMenuLabel>Type</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={type} onValueChange={setType}>
          <DropdownMenuRadioItem value="all">All types</DropdownMenuRadioItem>
          {types.map((t) => (
            <DropdownMenuRadioItem key={t} value={t}>
              {t}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>

    {(floor !== "all" || type !== "all") && (
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => {
          setFloor("all");
          setType("all");
        }}
      >
        Reset
      </Button>
    )}
  </div>

  <RoomsTable
    rooms={filteredRooms}
    onEdit={(room) => {
      setMode("edit");
      setEditing(room);
      setDrawerOpen(true);
    }}
    onDelete={(room) => {
      setRooms((prev) => prev.filter((r) => r.id !== room.id));
    }}
  />
</>; */
}
