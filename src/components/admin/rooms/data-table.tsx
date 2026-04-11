"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  PaginationState,
  OnChangeFn,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal } from "lucide-react";
import { FilterOptionType } from "./room-utils";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filterKey?: string;
  filterOptions: FilterOptionType[];
  isAvailabeFilter: boolean;
  filterValues: Record<string, string>;
  updateFilter: (name: string, value: string) => void;
  setQuery: (v: string) => void;
  query: string;
  pagination: PaginationState;
  setPagination: OnChangeFn<PaginationState>;
  rowsCount?: number;
  pageCount?: number;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  filterOptions,
  isAvailabeFilter = true,
  filterKey,
  setQuery,
  filterValues,
  updateFilter,
  query,
  rowsCount,
  pageCount,
  pagination,
  setPagination,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    rowCount: rowsCount,
    pageCount,
    manualPagination: true,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
  });

  const hasActiveFilter = Object.values(filterValues).some((v) => v !== "all");

  return (
    <div className="overflow-hidden rounded-sm">
      {isAvailabeFilter && (
        <div className="flex flex-col gap-3 md:flex-row md:items-center mb-2">
          <div className="relative md:flex-1">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={filterKey}
              className="pl-9"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" variant="outline" size="sm">
                <SlidersHorizontal className="mr-1.5 size-4" />
                Filters
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[280px]">
              {filterOptions.map((item) => {
                const lastOption = filterOptions[filterOptions.length - 1];
                return (
                  <div key={item.name}>
                    <DropdownMenuRadioGroup
                      key={item.name}
                      value={filterValues[item.name]}
                      onValueChange={(value) => updateFilter(item.name, value)}
                    >
                      <DropdownMenuLabel className="text-sm">
                        {item.name}
                      </DropdownMenuLabel>
                      <DropdownMenuRadioItem
                        className="text-[13px]"
                        value={"all"}
                      >
                        All {item.name}
                      </DropdownMenuRadioItem>
                      {item.values.map((v) => {
                        return (
                          <DropdownMenuRadioItem
                            key={v}
                            className="text-[13px]"
                            value={v}
                          >
                            {v}
                          </DropdownMenuRadioItem>
                        );
                      })}
                    </DropdownMenuRadioGroup>
                    {lastOption.name !== item.name && <DropdownMenuSeparator />}
                  </div>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>

          {hasActiveFilter && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                Object.keys(filterValues).forEach((key) =>
                  updateFilter(key, "all"),
                );
              }}
            >
              Reset
            </Button>
          )}
        </div>
      )}
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="ml-3 text-muted-foreground text-xs">
          <span>
            Page {pagination.pageIndex + 1} of {pageCount}
          </span>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
