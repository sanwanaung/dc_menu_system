"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ROOM_SERVICE_STATUSES, toStatusLabel } from "@/utils";
import RoomServiceDataTable from "@/components/admin/room-service/rs-table";
import { Tag } from "../shared/tag";
import {
  RoomServiceDTOStatus,
  RoomServiceWithRoomDTO,
} from "@/features/room-service/types";
import { OnChangeFn, PaginationState } from "@tanstack/react-table";

type Props = {
  rs: RoomServiceWithRoomDTO[];
  status: string;
  setStatus: (v: RoomServiceDTOStatus | "all") => void;
  query: string;
  setQuery: (v: string) => void;
  summary: Record<RoomServiceDTOStatus, number>;
  pageCount: number;
  pagination: PaginationState;
  setPagination: OnChangeFn<PaginationState>;
};

export function DataTable(rs: Props) {
  return (
    <div className="overflow-hidden">
      <Card>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative md:flex-1">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={rs.query}
                onChange={(e) => rs.setQuery(e.target.value)}
                placeholder="Search by order id, room, date, or status…"
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
              <DropdownMenuContent align="end" className="w-[320px]">
                <DropdownMenuLabel>Status</DropdownMenuLabel>
                <DropdownMenuRadioGroup
                  value={rs.status}
                  onValueChange={(v) =>
                    rs.setStatus(v as RoomServiceDTOStatus | "all")
                  }
                >
                  <DropdownMenuRadioItem value="all">
                    All statuses
                  </DropdownMenuRadioItem>
                  {ROOM_SERVICE_STATUSES.map((s) => (
                    <DropdownMenuRadioItem key={s} value={s}>
                      {toStatusLabel(s)}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            {rs.status !== "all" && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  rs.setStatus("all");
                }}
              >
                Reset
              </Button>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Tag>{rs.rs.length} Total</Tag>
            <Tag variant="warning">{rs.summary.PENDING} pending</Tag>
            <Tag variant="info">{rs.summary.ACCEPTED} accepted</Tag>
            <Tag variant="success">{rs.summary.FINISHED} finished</Tag>
            <Tag variant="danger">{rs.summary.CANCELED} canceled</Tag>
          </div>
          <RoomServiceDataTable rs={rs} />
        </CardContent>
        <div className="p-4 flex items-center justify-between">
          <div className="text-muted-foreground text-xs">
            <span>
              Page {rs.pagination.pageIndex + 1} of {rs.pageCount}
            </span>
          </div>
          <div className="flex items-center text-xs gap-x-2">
            <Button
              variant="outline"
              className=" text-xs"
              onClick={() => {
                if (rs.pagination.pageIndex !== 0) {
                  rs.setPagination((old) => {
                    return { ...old, pageIndex: old.pageIndex - 1 };
                  });
                }
              }}
              disabled={rs.pagination.pageIndex === 0}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              className="text-xs"
              onClick={() => {
                if (!rs.pageCount) return;
                if (rs.pagination.pageIndex < rs?.pageCount) {
                  rs.setPagination((old) => {
                    return { ...old, pageIndex: old.pageIndex + 1 };
                  });
                }
              }}
              disabled={rs.pagination.pageIndex >= rs.pageCount - 1}
            >
              Next
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
