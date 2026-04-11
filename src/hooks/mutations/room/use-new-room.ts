import * as z from "zod";
import { createRoomSchema } from "@/schemas/rooms";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateRoomResponse } from "@/types/room";
import { createNewRoom } from "@/actions/room";
import { toast } from "sonner";

type FormInput = z.input<typeof createRoomSchema>;

type Vars = { form: FormInput };

export const useNewRoomMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateRoomResponse, Error, Vars>({
    mutationFn: ({ form }) => createNewRoom(form),
    onSuccess: (data) => {
      if (data.error) throw new Error(data.error);
      queryClient.invalidateQueries({ queryKey: ["room"] });
      toast.success("New room is added successfully!");
    },
    onError: (error) => {
      console.log("error: ", error);
      toast.error(`${error.message}`);
    },
  });
};
