"use client";

import { RoomServiceOrder, RoomServiceStatus } from "generated/prisma/client";

type Props = {
  room: string;
  roomQR: string;
};

import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  CalendarDays,
  Clock,
  DoorOpen,
  Trash2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDeleteRoomService } from "@/hooks/client/use-delete-room-service";
import { useQuery } from "@tanstack/react-query";
import { getRoomServiceOrder } from "@/actions/client/room-service";
import { useEffect, useState } from "react";

export function getStatusBadge(status: RoomServiceStatus) {
  switch (status) {
    case "PENDING":
      return <Badge variant="secondary">Pending</Badge>;

    case "ACCEPTED":
      return <Badge className="bg-blue-500">Accepted</Badge>;

    case "FINISHED":
      return <Badge className="bg-green-500">Finished</Badge>;

    case "CANCELED":
      return <Badge variant="destructive">Canceled</Badge>;

    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
}

function StatusStep({
  label,
  active,
  done,
}: {
  label: string;
  active?: boolean;
  done?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`h-2 w-2 rounded-full ${
          done ? "bg-green-500" : active ? "bg-blue-500" : "bg-muted"
        }`}
      />
      <span
        className={
          active ? "font-medium text-foreground" : "text-muted-foreground"
        }
      >
        {label}
      </span>
    </div>
  );
}

const RoomServiceInfos = ({ room, roomQR }: Props) => {
  const mutation = useDeleteRoomService();
  const [roomServiceOrder, setRoomServiceOrder] =
    useState<RoomServiceOrder | null>(null);

  const deleteRoomServiceOrder = () => {
    if (!roomServiceOrder || !roomQR) return;
    mutation.mutate({
      id: roomServiceOrder.id,
      roomId: roomServiceOrder.roomId,
      roomQR,
    });
  };

  const data = useQuery({
    queryKey: ["room-service", roomQR],
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
    <div className="space-y-2">
      {roomServiceOrder ? (
        <Card className="border-primary/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <DoorOpen className="size-5" />
                Current Room Service
              </CardTitle>

              <div className="flex items-center gap-x-4 text-red-500">
                <Button
                  variant="destructive"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={deleteRoomServiceOrder}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                {getStatusBadge(roomServiceOrder.status)}
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid gap-3 text-sm">
              <div className="flex items-center gap-2">
                <CalendarDays className="size-4 text-muted-foreground" />
                <span>{new Date(roomServiceOrder.date).toDateString()}</span>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="size-4 text-muted-foreground" />
                <span>
                  {roomServiceOrder.startTime} → {roomServiceOrder.endTime}
                </span>
              </div>

              <div className="text-muted-foreground">Room No: {room}</div>

              {roomServiceOrder.notes && (
                <div className="rounded-md bg-muted p-2 text-sm">
                  {roomServiceOrder.notes}
                </div>
              )}
            </div>

            {roomServiceOrder.status === "CANCELED" &&
              roomServiceOrder.cancellationReason && (
                <div className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                  <AlertTriangle className="size-4" />
                  <span>{roomServiceOrder.cancellationReason}</span>
                </div>
              )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            No active room service request
          </CardContent>
        </Card>
      )}

      {roomServiceOrder && (
        <Card>
          <CardHeader>
            <CardTitle>Status Progress</CardTitle>
          </CardHeader>

          <CardContent className="space-y-2 text-sm">
            <StatusStep
              label="Pending"
              active={roomServiceOrder.status === "PENDING"}
              done={
                roomServiceOrder.status === "ACCEPTED" ||
                roomServiceOrder.status === "FINISHED"
              }
            />

            <StatusStep
              label="Accepted"
              active={roomServiceOrder.status === "ACCEPTED"}
              done={roomServiceOrder.status === "FINISHED"}
            />

            <StatusStep
              label="Finished"
              active={roomServiceOrder.status === "FINISHED"}
              done={false}
            />

            {roomServiceOrder.status === "CANCELED" && (
              <StatusStep label="Canceled" active done={false} />
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RoomServiceInfos;
