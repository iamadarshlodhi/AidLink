"use client";
import Image from "next/image";

interface RequestImageGalleryProps {
  images: string[];
}

export default function RequestImageGallery({
  images,
}: RequestImageGalleryProps) {
  if (images.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {images.map((image, index) => (
        <Image
          key={image}
          src={image}
          alt={`Request ${index + 1}`}
          className="h-64 w-full rounded-lg object-cover"
          width={600}
          height={400}
        />
      ))}
    </div>
  );
}