"use client";

import { useRouter } from "next/navigation";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { helpRequestSchema } from "@/schemas/helpRequestSchema";
import { useCreateHelpRequest } from "@/hooks/useCreateHelpRequest";
import CategorySelect from "@/components/requests/CategorySelect";

import type { z } from "zod";

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
import UrgencySelect from "./UrgencySelect";
import ModeSelect from "./ModeSelect";
import TaskTypeSelect from "./TaskTypeSelect";
import PaymentInput from "./PaymentInput";
import DeadlinePicker from "./DeadlinePicker";
import { useState } from "react";
import ImageUploader from "./ImageUploader";
import { uploadRequestImages } from "@/lib/api/upload";

type HelpRequestFormValues = z.infer<typeof helpRequestSchema>;


export default function HelpRequestForm() {
  const router = useRouter();

  const { mutate, isPending } = useCreateHelpRequest();
  const [images, setImages] = useState<File[]>([]);
  const [isUploadingImages, setIsUploadingImages] = useState(false);

  const form = useForm<
    HelpRequestFormValues,
    any,
    HelpRequestFormValues
  >({
    resolver: zodResolver(helpRequestSchema) as Resolver<HelpRequestFormValues>,

    defaultValues: {
      title: "",
      description: "",
      category: "other",
      urgency: "medium",
      mode: "online",
      taskType: "volunteer",
      helpersRequired: 1,
      tentativePayment: undefined,
      deadline: undefined,
      location: "",
      images: [],
    },
  });

  const mode = form.watch("mode");
  const taskType = form.watch("taskType");

  async function onSubmit(
    values: HelpRequestFormValues
  ) {
    try {
      let imageUrls: string[] = [];

    if (images.length > 0) {
      setIsUploadingImages(true);

      imageUrls = await uploadRequestImages(images);

      setIsUploadingImages(false);
    }

    mutate(
      {
        ...values,
        images: imageUrls,
      },
      {
        onSuccess() {
          form.reset();
          setImages([]);

          toast.success(
            "Help request created successfully."
          );

          router.push("/help-request");
        },

        onError(error: any) {
          toast.error(
            error?.response?.data?.message ??
              "Something went wrong."
          );
        },
      }
    );
    }
    catch (error) {
      console.error(error);

      setIsUploadingImages(false);

      toast.error(
        "Failed to upload images."
      );
    }
  }

  return (
    <Card className="mx-auto max-w-3xl">
      <CardHeader>
        <CardTitle>Create Help Request</CardTitle>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            {/* Title */}

            <FormField
              control={form.control}
              name="title"
              render={({ field } : { field: any }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>

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
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>

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

            {/* Category, Urgency, Mode, Task Type */}
            {/* We'll replace these Inputs with Select components next */}

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

            {/* Helpers Required */}

            <FormField
              control={form.control}
              name="helpersRequired"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Helpers Required</FormLabel>

                  <Input
                    type="number"
                    min={1}
                    max={20}
                    {...field}
                    onChange={(e) =>
                      field.onChange(Number(e.target.value))
                    }
                  />

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
                render={({ field }: { field: any }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>

                    <Input
                      placeholder="Enter location"
                      {...field}
                    />

                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* ImageUploader component will go here */}
            <ImageUploader
              images={images}
              setImages={setImages}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={isPending || isUploadingImages}
            >
              {isUploadingImages
                ? "Uploading Images..."
                : isPending
                  ? "Creating..."
                  : "Create Help Request"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}