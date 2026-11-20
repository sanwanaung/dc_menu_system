import { deleteRoomService } from "@/features/room-service/actions";
import { DeleteRoomServiceResponse } from "@/features/room-service/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type Vars = { id: string };

export const useDeleteRsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteRoomServiceResponse, Error, Vars>({
    mutationFn: ({ id }) => deleteRoomService(id),
    onSuccess: (data) => {
      if (data.error) throw new Error(data.error);
      queryClient.invalidateQueries({ queryKey: ["room-service"] });
      toast.success(`Marked as deleted.`);
    },
    onError: (error) => {
      console.log("error: ", error);
      toast.error(`${error.message}`);
    },
  });
};
