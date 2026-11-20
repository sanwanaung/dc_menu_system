"use client";

import { getRoomServices } from "@/features/room-service/actions";
import { DataTable } from "@/components/admin/room-service/data-table";
import { RoomServiceDTOStatus } from "@/features/room-service/types";
import { normalize } from "@/utils";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { PaginationState } from "@tanstack/react-table";
import { Loader2 } from "lucide-react";
import { useMemo, useState } from "react";

const RoomServicePage = () => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [status, setStatus] = useState<RoomServiceDTOStatus | "all">("all");
  const [query, setQuery] = useState<string>("");

  const datas = useQuery({
    queryKey: ["room-service", pagination.pageIndex],
    queryFn: () =>
      getRoomServices({
        limit: pagination.pageSize,
        offset: Number(pagination.pageIndex),
      }),
    placeholderData: keepPreviousData,
  });

  const allRoomService = useMemo(() => {
    return datas.data?.data?.items ?? [];
  }, [datas.data?.data]);

  const filterRoomServices = useMemo(() => {
    const q = normalize(query);
    return allRoomService
      .filter((o) => (status === "all" ? true : o.status === status))
      .filter((o) => {
        if (!q) return true;
        return (
          normalize(o.status).includes(q) ||
          normalize(o.room.name).includes(q) ||
          normalize(o.date.toLocaleString()).includes(q) ||
          normalize(o.startTime).includes(q) ||
          normalize(o.endTime).includes(q)
        );
      })
      .sort((a, b) => {
        const ta = new Date(a.createdAt).getTime();
        const tb = new Date(b.createdAt).getTime();
        return tb - ta;
      });
  }, [query, status, allRoomService]);

  const summary = useMemo(() => {
    const counts: Record<RoomServiceDTOStatus, number> = {
      PENDING: 0,
      ACCEPTED: 0,
      FINISHED: 0,
      CANCELED: 0,
    };
    for (const order of allRoomService) counts[order.status] += 1;
    return counts;
  }, [allRoomService]);

  return (
    <>
      {datas.isPending || datas.isLoading ? (
        <div className=" flex items-center justify-center w-full min-h-100">
          <Loader2 className="animate-spin size-6" />
        </div>
      ) : (
        <DataTable
          rs={filterRoomServices}
          status={status}
          setStatus={setStatus}
          query={query}
          setQuery={setQuery}
          summary={summary}
          pageCount={datas.data?.data?.meta.pageCount ?? 0}
          pagination={pagination}
          setPagination={setPagination}
        />
      )}
    </>
  );
};

export default RoomServicePage;
