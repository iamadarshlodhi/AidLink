import { ProfileFormData } from "@/types/forms";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

interface UpdateProfilePayload {
  values: ProfileFormData;
  image?: File;
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      values,
      image,
    }: UpdateProfilePayload) => {
      let profilePicture = values.profilePicture;

      if (image) {
        const formData = new FormData();
        formData.append("image", image);

        const uploadResponse = await axios.post(
          "/api/upload/profile-image",
          formData
        );

        profilePicture = uploadResponse.data.imageUrl;
      }

      const response = await axios.patch(
        "/api/user/profile",
        {
          ...values,
          profilePicture,
        }
      );

      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["profile"],
      });
    },
  });
}