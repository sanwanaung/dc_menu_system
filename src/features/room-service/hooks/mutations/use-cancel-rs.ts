import { cancelRoomService } from "@/features/room-service/actions";
import {
  CancelRoomServiceResponse,
  RoomServiceDTOStatus,
} from "@/features/room-service/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type Vars = { id: string; status: RoomServiceDTOStatus; option: string };

export const useCancelRsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<CancelRoomServiceResponse, Error, Vars>({
    mutationFn: ({ id, status, option }) =>
      cancelRoomService(id, status, option),
    onSuccess: (data) => {
      if (data.error) throw new Error(data.error);
      queryClient.invalidateQueries({ queryKey: ["room-service"] });
      toast.success(`Marked as canceled`);
    },
    onError: (error) => {
      console.log("error: ", error);
      toast.error(`${error.message}`);
    },
  });
};
