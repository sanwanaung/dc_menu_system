import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { PopularMenuItem } from "../../../../demo";

function toFixed1(value: number) {
  return Math.round(value * 10) / 10;
}

export function PopularItemsTable({ items }: { items: PopularMenuItem[] }) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item</TableHead>
            <TableHead className="hidden sm:table-cell">Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead className="text-right">Reviews</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell className="hidden sm:table-cell text-muted-foreground">
                {item.category}
              </TableCell>
              <TableCell>{item.price}</TableCell>
              <TableCell>
                <span className="inline-flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {toFixed1(item.ratingAverage)}
                  </span>
                  <span className="text-xs text-muted-foreground">/ 5</span>
                </span>
              </TableCell>
              <TableCell className="text-right text-muted-foreground">
                {item.ratingCount.toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
