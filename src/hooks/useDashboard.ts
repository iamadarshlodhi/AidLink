import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const getDashboard = async () => {
  const { data } = await axios.get("/api/dashboard");
  return data.data;
};

export function useDashboard() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboard,
  });
}