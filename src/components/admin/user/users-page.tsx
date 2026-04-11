"use client";

import { getFormatedData, normalize } from "@/utils";
import { useMemo, useState } from "react";
import { DataTable } from "./data-table";
import { columns, UserType } from "./columns";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getUsers } from "@/actions/user";
import { PaginationState } from "@tanstack/react-table";
import { Loader2 } from "lucide-react";

const UserPage = () => {
  const [query, setQuery] = useState<string>("");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 2,
  });

  const { data, isPending, isLoading } = useQuery({
    queryKey: ["user", pagination.pageIndex, pagination.pageSize],
    queryFn: () =>
      getUsers({
        limit: pagination.pageSize,
        offset: Number(pagination.pageIndex),
      }),
    placeholderData: keepPreviousData,
  });

  const allUsers = useMemo(() => {
    return data?.data?.items ?? [];
  }, [data]);

  const filteredUsers = useMemo(() => {
    const q = normalize(query);
    return allUsers
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
  }, [allUsers, query]);

  const generatedUsers = getFormatedData(filteredUsers, [
    "id",
    "name",
    "email",
    "role",
  ]) as UserType[];

  return (
    <>
      {isPending || isLoading ? (
        <div className=" flex items-center justify-center w-full min-h-100">
          <Loader2 className="animate-spin size-6" />
        </div>
      ) : (
        <DataTable
          data={generatedUsers}
          columns={columns}
          query={query}
          setQuery={setQuery}
          pagination={pagination}
          setPagination={setPagination}
          rowsCount={data?.data?.meta.total ?? 0}
          pageCount={data?.data?.meta.pageCount ?? 0}
        />
      )}
    </>
  );
};

export default UserPage;
