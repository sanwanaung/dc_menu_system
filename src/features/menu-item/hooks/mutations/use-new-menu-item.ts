import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { FormInput } from "@/features/menu-item/schema";
import { CreateNewMenuItemResponse } from "@/features/menu-item/types";
import { createNewMenuItem } from "@/features/menu-item/actions";

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
