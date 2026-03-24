"use client";

import { ColumnDef } from "@tanstack/react-table";
import Actions from "@/components/admin/rooms/actions";
import { Checkbox } from "@/components/ui/checkbox";

export type RoomType = {
  id: string;
  name: string;
  roomQR: string;
  type: string;
  floor: string;
};

export const columns: ColumnDef<RoomType>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
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
      return <Actions id={row.original.id} />;
    },
  },
];
