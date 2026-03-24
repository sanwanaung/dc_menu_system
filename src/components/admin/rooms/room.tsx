"use client";

import { useEffect, useMemo, useState } from "react";
import { generateFilterOptions } from "@/utils";
import { DataTable } from "@/components/admin/rooms/data-table";
import { columns } from "@/components/admin/rooms/columns";
import { FilterOptionType } from "@/types";
import { Room } from "generated/prisma/client";

function normalize(input: string) {
  return input.trim().toLowerCase();
}

export function RoomsPage({ initialRooms }: { initialRooms: Room[] }) {
  const [rooms, setRooms] = useState<Room[]>(() => initialRooms ?? []);
  const [query, setQuery] = useState("");
  const [filterValues, setFilterValues] = useState<Record<string, string>>({
    Floors: "all",
    Types: "all",
  });

  useEffect(() => {
    setRooms(initialRooms);
  }, [initialRooms]);

  const updateFilter = (name: string, value: string) => {
    setFilterValues((prev) => ({ ...prev, [name]: value }));
  };

  const filteredRooms = useMemo(() => {
    const q = normalize(query);
    return rooms
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
        a.name.localeCompare(b.name, undefined, { numeric: true }),
      );
  }, [rooms, filterValues, query]);

  const filterOptions: FilterOptionType[] = useMemo(() => {
    const floors = generateFilterOptions(initialRooms, "floor");
    const types = generateFilterOptions(initialRooms, "type");

    return [
      { name: "Floors", values: floors },
      { name: "Types", values: types },
    ];
  }, [initialRooms]);

  return (
    <>
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
      />
    </>
  );
}
