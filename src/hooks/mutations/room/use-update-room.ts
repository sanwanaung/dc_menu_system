import * as z from "zod";
import { editRoomSchema } from "@/schemas/rooms";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateRoomResponse } from "@/types/room";
import { updateRoom } from "@/actions/room";
import { toast } from "sonner";

type FormInput = z.input<typeof editRoomSchema>;

type Vars = { form: FormInput; id: string };

export const useUpdateRoomMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<UpdateRoomResponse, Error, Vars>({
    mutationFn: ({ form, id }) => updateRoom(form, id),
    onSuccess: (data) => {
      if (data.error) throw new Error(data.error);
      queryClient.invalidateQueries({ queryKey: ["room"] });
      toast.success("Updated successfully!");
    },
    onError: (error) => {
      console.log("error: ", error);
      toast.error(`${error.message}`);
    },
  });
};
