import { format } from "date-fns";
import type { NewUserRow } from "@/components/admin/analytics/analytics-queries";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function NewUsersTable({ users }: { users: NewUserRow[] }) {
  if (users.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-muted-foreground">
        No users found.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Verified</TableHead>
          <TableHead>Banned</TableHead>
          <TableHead className="text-right">Created</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium">{user.name}</TableCell>
            <TableCell className="text-muted-foreground">{user.email}</TableCell>
            <TableCell className="text-muted-foreground">
              {user.role ?? "—"}
            </TableCell>
            <TableCell className="text-muted-foreground">
              {user.emailVerified ? "Yes" : "No"}
            </TableCell>
            <TableCell className="text-muted-foreground">
              {user.banned ? "Yes" : "No"}
            </TableCell>
            <TableCell className="text-right text-muted-foreground">
              {format(new Date(user.createdAt), "MMM d, yyyy")}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

