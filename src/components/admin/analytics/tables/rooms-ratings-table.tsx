import { formatNumber } from "@/components/admin/analytics/analytics-format";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type RoomRatingsRow = {
  id: string;
  name: string;
  floor: string;
  type: string;
  ratings: number;
  avgRating: number;
};

export function RoomsRatingsTable({ rooms }: { rooms: RoomRatingsRow[] }) {
  if (rooms.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-muted-foreground">
        No ratings in this range.
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
          <TableHead className="text-right">Ratings</TableHead>
          <TableHead className="text-right">Avg</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rooms.map((room) => (
          <TableRow key={room.id}>
            <TableCell className="font-medium">{room.name}</TableCell>
            <TableCell className="text-muted-foreground">{room.floor}</TableCell>
            <TableCell className="text-muted-foreground">{room.type}</TableCell>
            <TableCell className="text-right tabular-nums">
              {formatNumber(room.ratings)}
            </TableCell>
            <TableCell className="text-right tabular-nums">
              {room.avgRating.toFixed(2)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

