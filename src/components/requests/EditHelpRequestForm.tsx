"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import axios from "axios";

import { helpRequestSchema } from "@/schemas/helpRequestSchema";

import CategorySelect from "@/components/requests/CategorySelect";
import UrgencySelect from "./UrgencySelect";
import ModeSelect from "./ModeSelect";
import TaskTypeSelect from "./TaskTypeSelect";
import PaymentInput from "./PaymentInput";
import DeadlinePicker from "./DeadlinePicker";
import ImageUploader from "./ImageUploader";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import type { z } from "zod";

type EditHelpRequestFormValues =
  z.infer<typeof helpRequestSchema>;

interface EditHelpRequestFormProps {
  request: {
    _id: string;
    title: string;
    description: string;
    category:
      | "medical"
      | "education"
      | "food"
      | "transport"
      | "shelter"
      | "other";
    urgency:
      | "low"
      | "medium"
      | "high"
      | "critical";
    mode: "online" | "offline";
    taskType: "paid" | "volunteer";
    helpersRequired: number;
    tentativePayment?: number;
    deadline: string | Date;
    location?: string;
    images?: string[];
  };
}

export default function EditHelpRequestForm({
  request,
}: EditHelpRequestFormProps) {
  const router = useRouter();

  const [images, setImages] = useState<File[]>(
    []
  );

  const [existingImages, setExistingImages] =
    useState<string[]>(
      request.images ?? []
    );

  const [isUploadingImages, setIsUploadingImages] =
    useState(false);

  const [isUpdating, setIsUpdating] =
    useState(false);

  const form = useForm<EditHelpRequestFormValues>({
    resolver: zodResolver(
      helpRequestSchema
    ) as Resolver<EditHelpRequestFormValues>,

    defaultValues: {
      title: request.title,
      description: request.description,
      category: request.category,
      urgency: request.urgency,
      mode: request.mode,
      taskType: request.taskType,
      helpersRequired:
        request.helpersRequired,
      tentativePayment:
        request.tentativePayment,
      deadline: new Date(request.deadline),
      location: request.location ?? "",
      images: request.images ?? [],
    },
  });

  const mode = form.watch("mode");
  const taskType = form.watch("taskType");

  /*
   * Keep form images synchronized with
   * existing images.
   */
  useEffect(() => {
    form.setValue(
      "images",
      existingImages
    );
  }, [existingImages, form]);

  async function onSubmit(
    values: EditHelpRequestFormValues
    ) {
    try {
        setIsUpdating(true);

        let newImageUrls: string[] = [];

        if (images.length > 0) {
        setIsUploadingImages(true);

        const { uploadRequestImages } =
            await import(
            "@/lib/api/upload"
            );

        newImageUrls =
            await uploadRequestImages(images);

        setIsUploadingImages(false);
        }

        const imageUrls = [
        ...existingImages,
        ...newImageUrls,
        ];

        const updateData = {
        title: values.title,
        description: values.description,
        category: values.category,
        urgency: values.urgency,
        mode: values.mode,
        taskType: values.taskType,
        helpersRequired:
            values.helpersRequired,

        tentativePayment:
            values.taskType === "paid"
            ? values.tentativePayment
            : undefined,

        deadline: values.deadline,

        location:
            values.mode === "offline"
            ? values.location
            : undefined,

        images: imageUrls,
        };

        console.log(
        "UPDATE DATA:",
        updateData
        );

        await axios.patch(
        `/api/help-request/${request._id}`,
        updateData
        );

        toast.success(
        "Help request updated successfully."
        );

        router.push(
        `/help-request/${request._id}`
        );

        router.refresh();
    } catch (error: any) {
        console.error(
        "UPDATE ERROR:",
        error?.response?.data
        );

        toast.error(
        error?.response?.data?.message ??
            "Failed to update help request."
        );
    } finally {
        setIsUpdating(false);
        setIsUploadingImages(false);
    }
    }
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Edit Help Request
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(
              onSubmit
            )}
            className="space-y-6"
          >
            {/* Title */}

            <FormField
              control={form.control}
              name="title"
              render={({ field } : { field: any }) => (
                <FormItem>
                  <FormLabel>
                    Title
                  </FormLabel>

                  <FormControl>
                    <Input
                      placeholder="Need help shifting luggage"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}

            <FormField
              control={form.control}
              name="description"
              render={({ field } : { field: any }) => (
                <FormItem>
                  <FormLabel>
                    Description
                  </FormLabel>

                  <FormControl>
                    <Textarea
                      rows={6}
                      placeholder="Describe your request..."
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Selects */}

            <div className="grid gap-4 md:grid-cols-2">
              <CategorySelect
                control={form.control}
              />

              <UrgencySelect
                control={form.control}
              />

              <ModeSelect
                control={form.control}
              />

              <TaskTypeSelect
                control={form.control}
              />
            </div>

            {/* Helpers */}

            <FormField
              control={form.control}
              name="helpersRequired"
              render={({ field } : { field: any }) => (
                <FormItem>
                  <FormLabel>
                    Helpers Required
                  </FormLabel>

                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={20}
                      value={
                        field.value ?? ""
                      }
                      onChange={(e) =>
                        field.onChange(
                          Number(
                            e.target.value
                          )
                        )
                      }
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Payment */}

            {taskType === "paid" && (
              <PaymentInput
                control={form.control}
              />
            )}

            {/* Deadline */}

            <DeadlinePicker
              control={form.control}
            />

            {/* Location */}

            {mode === "offline" && (
              <FormField
                control={form.control}
                name="location"
                render={({ field } : { field: any }) => (
                  <FormItem>
                    <FormLabel>
                      Location
                    </FormLabel>

                    <FormControl>
                      <Input
                        placeholder="Enter location"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* New images */}

            <div className="space-y-3">
              <FormLabel>
                Add Images
              </FormLabel>

              <ImageUploader
                images={images}
                setImages={setImages}
              />
            </div>

            {/* Existing images */}

            {existingImages.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm font-medium">
                  Existing Images
                </p>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  {existingImages.map(
                    (image, index) => (
                      <div
                        key={`${image}-${index}`}
                        className="relative overflow-hidden rounded-lg border"
                      >
                        <img
                          src={image}
                          alt={`Request image ${
                            index + 1
                          }`}
                          className="h-32 w-full object-cover"
                        />
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Buttons */}

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  router.back()
                }
                disabled={
                  isUpdating ||
                  isUploadingImages
                }
              >
                Cancel
              </Button>

              <Button
                type="submit"
                className="flex-1"
                disabled={
                  isUpdating ||
                  isUploadingImages
                }
              >
                {isUploadingImages
                  ? "Uploading Images..."
                  : isUpdating
                    ? "Updating..."
                    : "Update Help Request"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}