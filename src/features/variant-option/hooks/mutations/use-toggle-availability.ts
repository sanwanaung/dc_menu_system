import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { toggleAvailability } from "@/features/variant-option/actions";
import { ToggleAvailabiltyResponse } from "@/features/variant-option/types";

type Vars = { id: string };

export const useToggleAvailabilityMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<ToggleAvailabiltyResponse, Error, Vars>({
    mutationFn: ({ id }) => toggleAvailability({ id }),
    onSuccess: (data) => {
      if (data.error) throw new Error(data.error);
      queryClient.invalidateQueries({ queryKey: ["variant-option"] });
      toast.success(`${data.message}`);
    },
    onError: (error) => {
      console.log("error: ", error);
      toast.error(`${error.message}`);
    },
  });
};
