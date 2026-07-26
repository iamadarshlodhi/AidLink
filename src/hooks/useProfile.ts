import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { ProfileResponse } from "@/types/profile";

export const useProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data } =
        await axios.get<ProfileResponse>(
          "/api/user/profile"
        );

      return data.data;
    },
  });
};