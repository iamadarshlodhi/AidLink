import axios from "axios";

export async function uploadRequestImages(
  files: File[]
): Promise<string[]> {
  if (files.length === 0) {
    return [];
  }

  const formData = new FormData();

  files.forEach((file) => {
    formData.append("images", file);
  });

  const response = await axios.post(
    "/api/upload/request-images",
    formData
  );

  if (!response.data.success) {
    throw new Error(
      response.data.message ??
        "Image upload failed."
    );
  }

  return response.data.imageUrls;
}