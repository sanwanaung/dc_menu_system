import { AvailabilityPill } from "@/components/admin/analytics/labels";
import { formatNumber, formatUsd } from "@/components/admin/analytics/analytics-format";
import type { TopMenuItem } from "@/components/admin/analytics/analytics-queries";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function TopRatedMenuItemsTable({ items }: { items: TopMenuItem[] }) {
  if (items.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-muted-foreground">
        No menu items found.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Item</TableHead>
          <TableHead>Category</TableHead>
          <TableHead className="text-right">Price</TableHead>
          <TableHead className="text-right">Avg</TableHead>
          <TableHead className="text-right">Ratings</TableHead>
          <TableHead>Availability</TableHead>
          <TableHead className="text-right">Images</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="max-w-[220px] truncate font-medium">
              {item.name}
            </TableCell>
            <TableCell className="max-w-[160px] truncate text-muted-foreground">
              {item.categoryName}
            </TableCell>
            <TableCell className="text-right font-medium">
              {formatUsd(item.price)}
            </TableCell>
            <TableCell className="text-right tabular-nums">
              {item.ratingAverage.toFixed(2)}
            </TableCell>
            <TableCell className="text-right tabular-nums">
              {formatNumber(item.ratingCount)}
            </TableCell>
            <TableCell>
              <AvailabilityPill available={item.isAvailable} />
            </TableCell>
            <TableCell className="text-right tabular-nums">
              {item.imageCount}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

