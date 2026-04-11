import { deleteRoom } from "@/actions/room";
import { DeleteRoomResponse } from "@/types/room";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type Var = { id: string };

export const useDeleteRoomMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteRoomResponse, Error, Var>({
    mutationFn: ({ id }) => deleteRoom(id),
    onSuccess: (data) => {
      if (data.error) throw new Error(data.error);
      queryClient.invalidateQueries({ queryKey: ["room"] });
      toast.success("Deleted successfully!");
    },
    onError: (error) => {
      console.log("error: ", error);
      toast.error(`${error.message}`);
    },
  });
};
