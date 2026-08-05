import { UploadApiResponse } from "cloudinary";
import cloudinary from "@/lib/cloudinary";

export async function uploadRequestImage(
  filePath: string,
  requestId: string,
  imageIndex: number
): Promise<UploadApiResponse> {
  return cloudinary.uploader.upload(filePath, {
    folder: `aidlink/help-requests/${requestId}`,
    public_id: `image-${imageIndex}`,
    overwrite: true,
    resource_type: "image",

    transformation: [
      {
        width: 1200,
        crop: "limit",
      },
      {
        quality: "auto",
      },
      {
        fetch_format: "auto",
      },
    ],
  });
}