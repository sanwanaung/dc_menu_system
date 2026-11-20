import { updateMenuItem } from "@/features/menu-item/actions";
import { FormInput } from "@/features/menu-item/schema";
import { UpdateMenuItemResponse } from "@/features/menu-item/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type Vars = { menuItemId: string; form: FormInput };

export const useUpdateMenuItemMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<UpdateMenuItemResponse, Error, Vars>({
    mutationFn: ({ menuItemId, form }) => updateMenuItem({ menuItemId, data: form }),
    onSuccess: (data) => {
      if (data.error) throw new Error(data.error);
      queryClient.invalidateQueries({ queryKey: ["menu-item"] });
      toast.success("Menu-item updated successfully!");
    },
    onError: (error) => {
      toast.error(`${error.message}`);
    },
  });
};

