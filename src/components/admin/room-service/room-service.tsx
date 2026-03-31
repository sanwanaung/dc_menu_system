"use client";

import { DataTable } from "@/components/admin/room-service/data-table";
import { RoomServiceOrder } from "generated/prisma/client";
import { normalize, RoomServiceStatus } from "@/utils";
import { useEffect, useMemo, useState } from "react";

type RoomServiceWithRoom = RoomServiceOrder & {
  room: {
    name: string;
  };
};

type Props = {
  rs: RoomServiceWithRoom[];
};

const RoomServicePage = ({ rs }: Props) => {
  const [roomServices, setRoomServices] = useState<RoomServiceWithRoom[]>(
    () => rs ?? [],
  );
  const [status, setStatus] = useState<RoomServiceStatus | "all">("all");
  const [query, setQuery] = useState<string>("");

  useEffect(() => {
    setRoomServices(rs);
  }, [rs]);

  const filterRoomServices = useMemo(() => {
    const q = normalize(query);

    return roomServices
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
  }, [query, status, roomServices]);

  const summary = useMemo(() => {
    const counts: Record<RoomServiceStatus, number> = {
      PENDING: 0,
      ACCEPTED: 0,
      FINISHED: 0,
      CANCELED: 0,
    };
    for (const order of rs) counts[order.status] += 1;
    return counts;
  }, [rs]);

  return (
    <>
      <DataTable
        rs={filterRoomServices}
        status={status}
        setStatus={setStatus}
        query={query}
        setQuery={setQuery}
        summary={summary}
      />
    </>
  );
};

export default RoomServicePage;
