import type { CategoryItemsPoint } from "@/components/admin/analytics/analytics-queries";
import { formatNumber, formatUsd } from "@/components/admin/analytics/analytics-format";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function MenuCategoryMetricsTable({
  categories,
}: {
  categories: CategoryItemsPoint[];
}) {
  if (categories.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-muted-foreground">
        No categories found.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Category</TableHead>
          <TableHead className="text-right">Total</TableHead>
          <TableHead className="text-right">Available</TableHead>
          <TableHead className="text-right">Unavailable</TableHead>
          <TableHead className="text-right">Avg price</TableHead>
          <TableHead className="text-right">Avg rating</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {categories.map((row) => (
          <TableRow key={row.categoryId}>
            <TableCell className="font-medium">{row.categoryName}</TableCell>
            <TableCell className="text-right tabular-nums">
              {formatNumber(row.total)}
            </TableCell>
            <TableCell className="text-right tabular-nums">
              {formatNumber(row.available)}
            </TableCell>
            <TableCell className="text-right tabular-nums">
              {formatNumber(row.unavailable)}
            </TableCell>
            <TableCell className="text-right tabular-nums">
              {formatUsd(row.avgPrice)}
            </TableCell>
            <TableCell className="text-right tabular-nums">
              {row.avgRatingAverage.toFixed(2)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

