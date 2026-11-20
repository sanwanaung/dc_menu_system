"use client";

import { useMemo, useState } from "react";
import { generateFilterOptions, normalize } from "@/utils";
import { DataTable } from "@/components/admin/rooms/data-table";
import { columns } from "@/components/admin/rooms/columns";
import { FilterOptionType } from "./room-utils";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getRooms } from "@/features/room/actions";
import { Loader2 } from "lucide-react";
import { PaginationState } from "@tanstack/react-table";

export function RoomsPage() {
  const [query, setQuery] = useState("");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [filterValues, setFilterValues] = useState<Record<string, string>>({
    Floors: "all",
    Types: "all",
  });

  const datas = useQuery({
    queryKey: ["room", pagination.pageIndex, pagination.pageSize],
    queryFn: () =>
      getRooms({
        limit: pagination.pageSize,
        offset: Number(pagination.pageIndex),
      }),
    placeholderData: keepPreviousData,
  });

  const allRooms = useMemo(() => {
    return datas.data?.data?.items ?? [];
  }, [datas]);

  const updateFilter = (name: string, value: string) => {
    setFilterValues((prev) => ({ ...prev, [name]: value }));
  };

  const filteredRooms = useMemo(() => {
    const q = normalize(query);
    return allRooms
      .filter((r) =>
        filterValues.Floors === "all" ? true : r.floor === filterValues.Floors,
      )
      .filter((r) =>
        filterValues.Types === "all" ? true : r.type === filterValues.Types,
      )
      .filter((r) => {
        if (!q) return true;
        return (
          normalize(r.name).includes(q) ||
          normalize(r.roomQR).includes(q) ||
          normalize(r.floor).includes(q) ||
          normalize(r.type).includes(q)
        );
      })
      .sort((a, b) =>
        a.name?.localeCompare(b.name, undefined, { numeric: true }),
      );
  }, [allRooms, filterValues, query]);

  const filterOptions: FilterOptionType[] = useMemo(() => {
    const floors = generateFilterOptions(allRooms, "floor");
    const types = generateFilterOptions(allRooms, "type");

    return [
      { name: "Floors", values: floors },
      { name: "Types", values: types },
    ];
  }, [allRooms]);

  return (
    <>
      {datas.isPending || datas.isLoading ? (
        <div className=" flex items-center justify-center w-full min-h-100">
          <Loader2 className="animate-spin size-6" />
        </div>
      ) : (
        <DataTable
          data={filteredRooms}
          isAvailabeFilter
          filterKey="Search rooms by name, floor, type, or QR…"
          columns={columns}
          filterOptions={filterOptions}
          filterValues={filterValues}
          updateFilter={updateFilter}
          setQuery={setQuery}
          query={query || ""}
          pagination={pagination}
          setPagination={setPagination}
          pageCount={datas.data?.data?.meta.pageCount}
          rowsCount={datas.data?.data?.meta.total}
        />
      )}
    </>
  );
}
