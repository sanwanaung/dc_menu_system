import type { RoomActivity } from "@/components/admin/analytics/analytics-queries";
import { formatNumber } from "@/components/admin/analytics/analytics-format";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function RoomsActivityTable({ rooms }: { rooms: RoomActivity[] }) {
  if (rooms.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-muted-foreground">
        No room activity in this range.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Room</TableHead>
          <TableHead>Floor</TableHead>
          <TableHead>Type</TableHead>
          <TableHead className="text-right">Orders</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rooms.map((room) => (
          <TableRow key={room.id}>
            <TableCell className="font-medium">{room.name}</TableCell>
            <TableCell className="text-muted-foreground">{room.floor}</TableCell>
            <TableCell className="text-muted-foreground">{room.type}</TableCell>
            <TableCell className="text-right tabular-nums">
              {formatNumber(room.orders)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

