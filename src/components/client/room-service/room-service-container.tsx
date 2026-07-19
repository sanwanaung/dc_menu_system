"use client";

import { useQuery } from "@tanstack/react-query";
import { getRoomServiceOrder } from "@/actions/client/room-service";
import RoomServiceInfos from "./infos";
import RoomServiceCard from "./room-service-card";

export const RoomServiceContainer = ({
  room,
  roomQR,
}: {
  room: string;
  roomQR: string;
}) => {
  const { data } = useQuery({
    queryKey: ["service", roomQR],
    queryFn: () => getRoomServiceOrder(roomQR ?? ""),
    enabled: Boolean(roomQR),
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchInterval: 15000,
  });

  const roomServiceOrder = data?.data ?? null;

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
