import { format } from "date-fns";
import type { RecentRoomServiceOrder } from "@/components/admin/analytics/analytics-queries";
import { RoomServiceStatusPill } from "@/components/admin/analytics/labels";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function RecentRoomServiceOrdersTable({
  orders,
}: {
  orders: RecentRoomServiceOrder[];
}) {
  if (orders.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-muted-foreground">
        No room service orders yet.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Room</TableHead>
          <TableHead>Service date</TableHead>
          <TableHead>Time</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Created</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell className="font-medium">{order.roomName}</TableCell>
            <TableCell className="text-muted-foreground">
              {format(new Date(order.date), "PPP")}
            </TableCell>
            <TableCell className="text-muted-foreground">
              {order.startTime} – {order.endTime}
            </TableCell>
            <TableCell>
              <RoomServiceStatusPill status={order.status} />
            </TableCell>
            <TableCell className="text-right text-muted-foreground">
              {format(new Date(order.createdAt), "MMM d, HH:mm")}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

