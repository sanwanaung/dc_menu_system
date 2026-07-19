"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getRoomServiceOrder } from "@/actions/client/room-service";
import { RoomServiceOrder, RoomServiceStatus } from "generated/prisma/client";
import RoomServiceInfos from "./infos";
import RoomServiceCard from "./room-service-card";

export const RoomServiceContainer = ({
  room,
  roomQR,
}: {
  room: string;
  roomQR: string;
}) => {
  const [roomServiceOrder, setRoomServiceOrder] =
    useState<RoomServiceOrder | null>(null);

  const data = useQuery({
    queryKey: ["service", roomQR],
    queryFn: () => getRoomServiceOrder(roomQR ?? ""),
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchInterval: 15000,
  });

  useEffect(() => {
    if (data.data?.data) {
      setRoomServiceOrder(data.data?.data);
    }
  }, [data.data?.data]);

  return (
    <>
      <RoomServiceInfos
        room={room}
        roomQR={roomQR}
        roomServiceOrder={roomServiceOrder}
      />
      <RoomServiceCard room={room} roomQR={roomQR} />
    </>
  );
};
