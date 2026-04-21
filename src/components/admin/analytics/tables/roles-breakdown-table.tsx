import { formatNumber } from "@/components/admin/analytics/analytics-format";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function RolesBreakdownTable({
  roles,
}: {
  roles: Array<{ role: string; count: number }>;
}) {
  if (roles.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-muted-foreground">
        No roles found.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Role</TableHead>
          <TableHead className="text-right">Users</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {roles.map((row) => (
          <TableRow key={row.role}>
            <TableCell className="font-medium">{row.role}</TableCell>
            <TableCell className="text-right tabular-nums">
              {formatNumber(row.count)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

