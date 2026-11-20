import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ApiResponse } from "@/features/shared/types";
import { RoomServiceOrder } from "generated/prisma/client";
import { createRoomServiceOrder } from "@/features/client/room-service/actions";

type ResponseType = ApiResponse<RoomServiceOrder>;

type ParamTypes = {
  date: string;
  startTime: string;
  endTime: string;
  notes: string | null;
  room: string;
  roomQR: string;
};

export const useRequestRoomService = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, ParamTypes>({
    mutationFn: ({ date, startTime, endTime, notes, room, roomQR }) =>
      createRoomServiceOrder({ date, startTime, endTime, notes, room, roomQR }),
    onSuccess: (data, variables) => {
      if (data.error) throw new Error(data.error);
      queryClient.refetchQueries({
        queryKey: ["service", variables.roomQR],
      });
      toast.success("Room service request submitted successfully!");
    },
    onError: (error) => {
      toast.error(`${error.message}`);
    },
  });
};
