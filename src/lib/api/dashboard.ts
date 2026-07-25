import axios from "axios";
import { DashboardResponse } from "@/types/dashboard"; 

export async function getDashboard(): Promise<DashboardResponse> {
  const { data } = await axios.get("/api/dashboard");

  return data.data;
}