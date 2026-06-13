"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import axios from "axios";
import { toast } from "sonner";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { resetPasswordSchema } from "@/schemas/resetPasswordSchema";

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

import { Loader2 } from "lucide-react";
import { Eye, EyeOff } from "lucide-react";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [isSendingOtp, setIsSendingOtp] =
    useState(false);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [cooldown, setCooldown] =
    useState(0);

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const form = useForm<
    z.infer<typeof resetPasswordSchema>
  >({
    resolver: zodResolver(
      resetPasswordSchema
    ),

    defaultValues: {
      email: "",
      verificationCode: "",
      password: "",
      confirmPassword: "",
    },
  });

  const sendOtp = async () => {
    const email =
      form.getValues("email");

    if (!email) {
      toast.error(
        "Please enter your email"
      );
      return;
    }

    try {
      setIsSendingOtp(true);

      const response =
        await axios.post(
          "/api/forgot-password/send-otp",
          {
            email,
          }
        );

      toast.success(
        response.data.message
      );

      setCooldown(60);

      const timer =
        setInterval(() => {
          setCooldown((prev) => {
            if (prev <= 1) {
              clearInterval(
                timer
              );
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
    } catch (error: any) {
      toast.error(
        error.response?.data
          ?.message ||
          "Failed to send OTP"
      );
    } finally {
      setIsSendingOtp(false);
    }
  };

  const onSubmit = async (
    data: z.infer<
      typeof resetPasswordSchema
    >
  ) => {
    try {
      setIsSubmitting(true);

      const response =
        await axios.post(
          "/api/forgot-password/reset-password",
          data
        );

      toast.success(
        response.data.message
      );

      router.replace("/sign-in");
    } catch (error: any) {
      toast.error(
        error.response?.data
          ?.message ||
          "Failed to reset password"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="w-full max-w-lg rounded-lg border bg-background p-8 shadow">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">
            Forgot Password
          </h1>

          <p className="mt-2 text-muted-foreground">
            Reset your password
            using OTP verification
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(
              onSubmit
            )}
            className="space-y-5"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>
                    Email
                  </FormLabel>

                  <div className="flex gap-2">
                    <FormControl>
                      <Input
                        placeholder="Enter email"
                        {...field}
                      />
                    </FormControl>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={sendOtp}
                      disabled={
                        isSendingOtp ||
                        cooldown > 0
                      }
                    >
                      {isSendingOtp ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : cooldown >
                        0 ? (
                        `Resend ${cooldown}s`
                      ) : (
                        "Send OTP"
                      )}
                    </Button>
                  </div>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="verificationCode"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>
                    OTP
                  </FormLabel>

                  <FormControl>
                    <Input
                      placeholder="Enter OTP"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>
                    New Password
                  </FormLabel>

                  <FormControl>
                    <div className="relative">
                      <Input
                        type={
                          showPassword
                            ? "text"
                            : "password"
                        }
                        placeholder="Enter new password"
                        {...field}
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(
                            !showPassword
                          )
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                      >
                        {showPassword ? (
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

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>
                    Confirm Password
                  </FormLabel>

                  <FormControl>
                    <div className="relative">
                      <Input
                        type={
                          showConfirmPassword
                            ? "text"
                            : "password"
                        }
                        placeholder="Confirm password"
                        {...field}
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(
                            !showConfirmPassword
                          )
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                      >
                        {showConfirmPassword ? (
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
              disabled={
                isSubmitting
              }
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resetting...
                </>
              ) : (
                "Reset Password"
              )}
            </Button>

            <div className="text-center">
              <Button
                type="button"
                variant="link"
                onClick={() =>
                  router.push(
                    "/sign-in"
                  )
                }
              >
                Back to Sign In
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}