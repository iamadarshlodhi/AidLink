import cloudinary from "@/lib/cloudinary";

export async function uploadProfileImage(
  filePath: string,
  userId: string
) {
  const result = await cloudinary.uploader.upload(filePath, {
    folder: "aidlink/users/profile",

    public_id: userId,

    overwrite: true,

    resource_type: "image",

    transformation: [
      {
        width: 400,
        height: 400,
        crop: "fill",
        gravity: "face",
      },
      {
        quality: "auto",
      },
      {
        fetch_format: "auto",
      },
    ],
  });

  return result.secure_url;
}