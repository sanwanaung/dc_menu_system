import { format } from "date-fns";
import type { RecentRating } from "@/components/admin/analytics/analytics-queries";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function Stars({ value }: { value: number }) {
  return (
    <span className="font-mono tabular-nums">
      {value} / 5
    </span>
  );
}

export function RecentRatingsTable({ ratings }: { ratings: RecentRating[] }) {
  if (ratings.length === 0) {
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
          <TableHead>Rating</TableHead>
          <TableHead>Menu item</TableHead>
          <TableHead>Room</TableHead>
          <TableHead>User</TableHead>
          <TableHead>Comment</TableHead>
          <TableHead className="text-right">Created</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {ratings.map((row) => (
          <TableRow key={row.id}>
            <TableCell className="font-medium">
              <Stars value={row.rating} />
            </TableCell>
            <TableCell className="max-w-[200px] truncate">
              {row.menuItemName}
            </TableCell>
            <TableCell className="text-muted-foreground">{row.roomName}</TableCell>
            <TableCell className="text-muted-foreground">
              {row.userName ?? "—"}
            </TableCell>
            <TableCell className="max-w-[320px] truncate text-muted-foreground">
              {row.comment?.trim() ? row.comment : "—"}
            </TableCell>
            <TableCell className="text-right text-muted-foreground">
              {format(new Date(row.createdAt), "MMM d, HH:mm")}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

