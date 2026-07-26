import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export function useChangePassword() {
  return useMutation({
    mutationFn: async (data: ChangePasswordData) => {
      const response = await axios.patch(
        "/api/user/change-password",
        data
      );

      return response.data;
    },

    onSuccess: (data) => {
      toast.success(data.message);
    },

    onError: (error: any) => {
      toast.error(
        error.response?.data?.message ??
          "Something went wrong"
      );
    },
  });
}