"use client";

import { useState } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";

import { applyTaskSchema } from "@/schemas/applyTaskSchema";
import { useApplyToRequest } from "@/hooks/useApplyToRequest";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type ApplyFormValues = z.infer<
  typeof applyTaskSchema
>;

interface ApplyDialogProps {
  requestId: string;
}

export default function ApplyDialog({
  requestId,
}: ApplyDialogProps) {
  const [open, setOpen] =
    useState(false);

  const { mutate, isPending } =
    useApplyToRequest();

  const form = useForm<
    ApplyFormValues
  >({
    resolver: zodResolver(
      applyTaskSchema
    ),

    defaultValues: {
      interestNote: "",
    },
  });

  function onSubmit(
    values: ApplyFormValues
  ) {
    mutate(
      {
        requestId,
        interestNote:
          values.interestNote,
      },
      {
        onSuccess() {
          form.reset();

          setOpen(false);
        },
      }
    );
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button>
          Apply
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Apply to Help
          </DialogTitle>

          <DialogDescription>
            Tell the requester why
            you'd like to help.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(
              onSubmit
            )}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="interestNote"
              render={({
                field,
              } : any) => (
                <FormItem>
                  <FormLabel>
                    Message
                  </FormLabel>

                  <FormControl>
                    <Textarea
                      rows={5}
                      placeholder="Describe how you can help..."
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setOpen(false)
                }
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={isPending}
              >
                {isPending
                  ? "Applying..."
                  : "Apply"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}