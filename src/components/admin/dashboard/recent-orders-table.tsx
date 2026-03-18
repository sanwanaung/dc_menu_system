import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { formatDistanceToNowStrict } from "date-fns";
import type { RecentOrder } from "../../../../demo";

const STATUS_STYLES: Record<RecentOrder["status"], string> = {
  Pending: "bg-amber-500/10 text-amber-700 ring-amber-500/20 dark:text-amber-300",
  Preparing: "bg-blue-500/10 text-blue-700 ring-blue-500/20 dark:text-blue-300",
  Completed: "bg-emerald-500/10 text-emerald-700 ring-emerald-500/20 dark:text-emerald-300",
  Cancelled: "bg-rose-500/10 text-rose-700 ring-rose-500/20 dark:text-rose-300",
};

function StatusPill({ status }: { status: RecentOrder["status"] }) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
        STATUS_STYLES[status],
      )}
    >
      {status}
    </span>
  );
}

export function RecentOrdersTable({ orders }: { orders: RecentOrder[] }) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead>Guest</TableHead>
            <TableHead className="hidden sm:table-cell">Items</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">When</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.id}</TableCell>
              <TableCell className="text-muted-foreground">
                {order.guestName}
              </TableCell>
              <TableCell className="hidden sm:table-cell text-muted-foreground">
                {order.itemsCount}
              </TableCell>
              <TableCell>{order.totalPrice}</TableCell>
              <TableCell>
                <StatusPill status={order.status} />
              </TableCell>
              <TableCell className="text-right text-muted-foreground">
                {formatDistanceToNowStrict(new Date(order.createdAt), {
                  addSuffix: true,
                })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
