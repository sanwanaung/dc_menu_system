import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ApiResponse } from "@/types/shared/api-response";
import { RoomServiceOrder } from "generated/prisma/client";
import { deleteRoomServiceOrder } from "@/actions/client/room-service";

type ResponseType = ApiResponse<RoomServiceOrder>;

type ParamTypes = {
  roomId: string;
  id: string;
  roomQR: string;
};

export const useDeleteRoomService = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, ParamTypes>({
    mutationFn: ({ id, roomId, roomQR }) =>
      deleteRoomServiceOrder({ id, roomId, roomQR }),
    onSuccess: (data, variables) => {
      if (data.error) throw new Error(data.error);
      queryClient.invalidateQueries({
        queryKey: ["service", variables.roomQR],
      });
      toast.success("Deleted successfully!");
    },
    onError: (error) => {
      toast.error(`${error.message}`);
    },
  });
};
