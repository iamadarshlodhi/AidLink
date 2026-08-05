import { auth } from "@/auth";
import { uploadRequestImage } from "@/lib/uploadRequestImages";

import { NextRequest, NextResponse } from "next/server";

import fs from "fs/promises";
import path from "path";
import os from "os";

export async function POST(req: NextRequest) {
  const tempFiles: string[] = [];

  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const formData = await req.formData();

    const images = formData.getAll(
      "images"
    ) as File[];

    if (!images.length) {
      return NextResponse.json(
        {
          success: false,
          message: "Please select at least one image.",
        },
        {
          status: 400,
        }
      );
    }

    if (images.length > 5) {
      return NextResponse.json(
        {
          success: false,
          message: "Maximum 5 images allowed.",
        },
        {
          status: 400,
        }
      );
    }

    const requestId = crypto.randomUUID();

    const imageUrls: string[] = [];

    for (let i = 0; i < images.length; i++) {
      const image = images[i];

      const bytes = await image.arrayBuffer();

      const buffer = Buffer.from(bytes);

      const extension =
        image.name.split(".").pop() ||
        "jpg";

      const tempPath = path.join(
        os.tmpdir(),
        `${requestId}-${i}.${extension}`
      );

      tempFiles.push(tempPath);

      await fs.writeFile(
        tempPath,
        buffer
      );

      const uploaded =
        await uploadRequestImage(
          tempPath,
          requestId,
          i + 1
        );

      imageUrls.push(
        uploaded.secure_url
      );
    }

    return NextResponse.json({
      success: true,
      imageUrls,
    });
  } catch (error) {
    console.error(
      "Request image upload:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to upload images.",
      },
      {
        status: 500,
      }
    );
  } finally {
    await Promise.all(
      tempFiles.map((file) =>
        fs.unlink(file).catch(() => {})
      )
    );
  }
}