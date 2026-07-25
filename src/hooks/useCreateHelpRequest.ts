import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createHelpRequest } from "@/lib/api/helpRequest";

export function useCreateHelpRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createHelpRequest,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });
    },
  });
}