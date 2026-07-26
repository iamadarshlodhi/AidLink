"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { changePasswordSchema } from "@/schemas/changePasswordSchema";
import { useChangePassword } from "@/hooks/useChangePassword";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Eye, EyeOff, Loader2 } from "lucide-react";

type FormData = z.infer<typeof changePasswordSchema>;

export default function ChangePasswordForm() {
  const router = useRouter();

  const mutation = useChangePassword();

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [
    showConfirmNewPassword,
    setShowConfirmNewPassword,
  ] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const onSubmit = async (values: FormData) => {
    try {
      await mutation.mutateAsync(values);

      form.reset();

      router.push("/settings");
    } catch {
      // Error is already handled in useChangePassword
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-lg rounded-lg border bg-background p-8 shadow">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">
            Change Password
          </h1>

          <p className="mt-2 text-muted-foreground">
            Update your account password.
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5"
          >
            {/* Current Password */}

            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>
                    Current Password
                  </FormLabel>

                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={
                          showCurrentPassword
                            ? "text"
                            : "password"
                        }
                        placeholder="Enter current password"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowCurrentPassword(
                            !showCurrentPassword
                          )
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* New Password */}

            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>
                    New Password
                  </FormLabel>

                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={
                          showNewPassword
                            ? "text"
                            : "password"
                        }
                        placeholder="Enter new password"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowNewPassword(
                            !showNewPassword
                          )
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Confirm Password */}

            <FormField
              control={form.control}
              name="confirmNewPassword"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>
                    Confirm New Password
                  </FormLabel>

                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={
                          showConfirmNewPassword
                            ? "text"
                            : "password"
                        }
                        placeholder="Confirm new password"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmNewPassword(
                            !showConfirmNewPassword
                          )
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                      >
                        {showConfirmNewPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Changing...
                </>
              ) : (
                "Change Password"
              )}
            </Button>

            <div className="text-center">
              <Button
                type="button"
                variant="link"
                onClick={() =>
                  router.push("/settings")
                }
              >
                Back to Settings
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}