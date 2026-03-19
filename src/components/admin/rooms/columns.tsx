"use client";

import { ColumnDef } from "@tanstack/react-table";
import Actions from "@/components/admin/rooms/actions";

export type RoomType = {
  //   id: string;
  name: string;
  roomQR: string;
  //   imgUrl: string;
  type: string;
  floor: string;
  //   createdAt: string;
  //   updatedAt: string;
};

export const columns: ColumnDef<RoomType>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "floor",
    header: "Floor",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "roomQR",
    header: "RoomQR",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return <Actions id={row.id} />;
    },
  },
];
