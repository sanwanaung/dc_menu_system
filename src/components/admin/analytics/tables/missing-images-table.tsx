import type { MenuAnalytics } from "@/components/admin/analytics/analytics-queries";
import { AvailabilityPill } from "@/components/admin/analytics/labels";
import { formatNumber, formatUsd } from "@/components/admin/analytics/analytics-format";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Row = MenuAnalytics["missingImages"][number];

export function MissingImagesTable({ items }: { items: Row[] }) {
  if (items.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-muted-foreground">
        Great — every menu item has at least one image.
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
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="max-w-[260px] truncate font-medium">
              {item.name}
            </TableCell>
            <TableCell className="max-w-[200px] truncate text-muted-foreground">
              {item.categoryName}
            </TableCell>
            <TableCell className="text-right tabular-nums">
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
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
