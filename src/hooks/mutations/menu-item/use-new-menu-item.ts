import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { FormInput } from "@/schemas/menu-item";
import { CreateNewMenuItemResponse } from "@/types/menu-item";
import { createNewMenuItem } from "@/actions/menu-item";

type Vars = { form: FormInput };

export const useNewMenuItemMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateNewMenuItemResponse, Error, Vars>({
    mutationFn: ({ form }) => createNewMenuItem({ data: form }),
    onSuccess: (data) => {
      if (data.error) throw new Error(data.error);
      queryClient.invalidateQueries({ queryKey: ["menu-item"] });
      toast.success("New menu-item is added successfully!");
    },
    onError: (error) => {
      toast.error(`${error.message}`);
    },
  });
};
