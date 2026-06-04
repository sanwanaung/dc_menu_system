import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ApiResponse } from "@/types/shared/api-response";
import { RoomServiceOrder } from "generated/prisma/client";
import { createRoomServiceOrder } from "@/actions/client/room-service";

type ResponseType = ApiResponse<RoomServiceOrder>;

type ParamTypes = Pick<
  RoomServiceOrder,
  "date" | "startTime" | "endTime" | "notes"
> & {
  room: string;
  roomQR: string;
};

export const useRequestRoomService = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, ParamTypes>({
    mutationFn: ({ date, startTime, endTime, notes, room, roomQR }) =>
      createRoomServiceOrder({ date, startTime, endTime, notes, room, roomQR }),
    onSuccess: (data) => {
      if (data.error) throw new Error(data.error);
      queryClient.invalidateQueries({ queryKey: ["room-service"] });
      toast.success("Room service request submitted successfully!");
    },
    onError: (error) => {
      toast.error(`${error.message}`);
    },
  });
};
