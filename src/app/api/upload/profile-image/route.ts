import { auth } from "@/auth";
import { uploadProfileImage } from "@/lib/uploadProfileImage";
import { NextRequest, NextResponse } from "next/server";

import fs from "fs/promises";
import path from "path";
import os from "os";

export async function POST(req: NextRequest) {
  let tempFilePath: string | null = null;

  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const formData = await req.formData();

    const image = formData.get("image") as File | null;

    if (!image) {
      return NextResponse.json(
        {
          success: false,
          message: "Image is required",
        },
        { status: 400 }
      );
    }

    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const extension =
      image.name.split(".").pop() || "jpg";

    tempFilePath = path.join(
      os.tmpdir(),
      `${session.user.id}.${extension}`
    );

    await fs.writeFile(tempFilePath, buffer);

    const result = await uploadProfileImage(
      tempFilePath,
      session.user.id
    );

    return NextResponse.json({
      success: true,
      imageUrl: result.secure_url,
    });
  } catch (error) {
    console.error("Profile image upload error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to upload profile image",
      },
      {
        status: 500,
      }
    );
  } finally {
    if (tempFilePath) {
      await fs.unlink(tempFilePath).catch(() => {});
    }
  }
}