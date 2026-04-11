import { updateRoomServiceStatus } from "@/actions/room-service";
import {
  RoomServiceDTOStatus,
  UpdateRoomServiceStatusResponse,
} from "@/types/room-service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type Vars = { id: string; status: RoomServiceDTOStatus };

export const useAcceptRsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<UpdateRoomServiceStatusResponse, Error, Vars>({
    mutationFn: ({ id, status }) => updateRoomServiceStatus(id, status),
    onSuccess: (data) => {
      if (data.error) throw new Error(data.error);
      queryClient.invalidateQueries({ queryKey: ["room-service"] });
      toast.success(`Marked as ${data.data?.status}`);
    },
    onError: (error) => {
      console.log("error: ", error);
      toast.error(`${error.message}`);
    },
  });
};
