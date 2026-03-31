"use client";

import { getFormatedData, normalize } from "@/utils";
import { User } from "generated/prisma/client";
import { useEffect, useMemo, useState } from "react";
import { DataTable } from "./data-table";
import { columns, UserType } from "./columns";

type Props = {
  initialUsers: User[];
};

const UserPage = ({ initialUsers }: Props) => {
  const [users, setUsers] = useState(() => initialUsers ?? []);
  const [query, setQuery] = useState<string>("");

  useEffect(() => {
    setUsers(initialUsers);
  }, [initialUsers]);

  const filteredUsers = useMemo(() => {
    const q = normalize(query);
    return users
      .filter((r) => {
        if (!q) return true;
        return (
          normalize(r.name).includes(q) ||
          normalize(r.role as string).includes(q) ||
          normalize(r.email).includes(q)
        );
      })
      .sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { numeric: true }),
      );
  }, [users, query]);

  const generatedUsers = getFormatedData(filteredUsers, [
    "id",
    "name",
    "email",
    "role",
  ]) as UserType[];

  console.log("ggg:");

  return (
    <>
      <DataTable
        data={generatedUsers}
        columns={columns}
        query={query}
        setQuery={setQuery}
      />
    </>
  );
};

export default UserPage;
