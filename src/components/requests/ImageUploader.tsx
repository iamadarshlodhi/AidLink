"use client";

import { useRef } from "react";

import { Button } from "@/components/ui/button";

import {
  ImagePlus,
  Trash2,
} from "lucide-react";

interface ImageUploaderProps {
  images: File[];
  setImages: React.Dispatch<
    React.SetStateAction<File[]>
  >;
}

export default function ImageUploader({
  images,
  setImages,
}: ImageUploaderProps) {
  const inputRef =
    useRef<HTMLInputElement>(null);

  function handleSelect(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const files = Array.from(
      e.target.files || []
    );

    const updated = [
      ...images,
      ...files,
    ].slice(0, 5);

    setImages(updated);
  }

  function removeImage(index: number) {
    setImages(
      images.filter(
        (_, i) => i !== index
      )
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="font-medium">
          Images
        </label>

        <Button
          type="button"
          variant="outline"
          onClick={() =>
            inputRef.current?.click()
          }
          disabled={images.length >= 5}
        >
          <ImagePlus className="mr-2 h-4 w-4" />
          Add Images
        </Button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={handleSelect}
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {images.map((image, index) => (
          <div
            key={index}
            className="relative overflow-hidden rounded-lg border"
          >
            <img
              src={URL.createObjectURL(image)}
              alt=""
              className="h-36 w-full object-cover"
            />

            <Button
              type="button"
              size="icon"
              variant="destructive"
              className="absolute right-2 top-2 h-8 w-8"
              onClick={() =>
                removeImage(index)
              }
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <p className="text-sm text-muted-foreground">
        Maximum 5 images.
      </p>
    </div>
  );
}