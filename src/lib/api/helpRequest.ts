import axios from "axios";

export async function createHelpRequest(data: any) {
  const response = await axios.post("/api/help-request", data);

  return response.data;
}