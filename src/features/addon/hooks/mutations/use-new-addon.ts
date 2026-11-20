import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { FormInput } from "@/features/addon/schema";
import { CreateAddonResponse } from "@/features/addon/types";
import { createNewAddon } from "@/features/addon/actions";

type Vars = { form: FormInput };

export const useNewAddonMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateAddonResponse, Error, Vars>({
    mutationFn: ({ form }) => createNewAddon(form),
    onSuccess: (data) => {
      if (data.error) throw new Error(data.error);
      queryClient.invalidateQueries({ queryKey: ["addon"] });
      toast.success("New addon is added successfully!");
    },
    onError: (error) => {
      toast.error(`${error.message}`);
    },
  });
};
