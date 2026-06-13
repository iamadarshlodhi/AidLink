"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { signupSchema } from "@/schemas/signUpSchema";
import { Eye, EyeOff } from "lucide-react";

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
import { useDebounceValue } from "usehooks-ts";

export default function SignUpPage() {
  const router = useRouter();

    const [isSubmitting, setIsSubmitting] = useState(false);

    const [isSendingOtp, setIsSendingOtp] = useState(false);

    const [cooldown, setCooldown] = useState(0);

    const [usernameMessage, setUsernameMessage] = useState("");

    const [emailMessage, setEmailMessage] = useState("");

    const [isCheckingUsername, setIsCheckingUsername] = useState(false);

    const [isCheckingEmail, setIsCheckingEmail] = useState(false);

    const [showPassword, setShowPassword] =
      useState(false);

    const [ showConfirmPassword, setShowConfirmPassword] = 
      useState(false);

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),

    defaultValues: {
      name: "",
      username: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      verificationCode: "",
    },
  });

    const username = form.watch("username");

    const email = form.watch("email");

    const [debouncedUsername] = useDebounceValue(username, 500);

    const [debouncedEmail] = useDebounceValue(email, 500);

  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

    useEffect(() => {
        if (!debouncedUsername) {
            setUsernameMessage("");
            return;
        }

        const checkUsername =
            async () => {
            try {
                setIsCheckingUsername(true);

                const response =
                await axios.get(
                    `/api/auth/check-availability?username=${debouncedUsername}`
                );

                setUsernameMessage(
                response.data.message
                );
            } catch {
                setUsernameMessage(
                "Unable to check username"
                );
            } finally {
                setIsCheckingUsername(false);
            }
            };

        checkUsername();
    }, [debouncedUsername]);


    useEffect(() => {
        if (!debouncedEmail) {
            setEmailMessage("");
            return;
        }

        const checkEmail =
            async () => {
            try {
                setIsCheckingEmail(true);

                const response =
                await axios.get(
                    `/api/auth/check-availability?email=${debouncedEmail}`
                );

                setEmailMessage(
                response.data.message
                );
            } catch {
                setEmailMessage(
                "Unable to check email"
                );
            } finally {
                setIsCheckingEmail(false);
            }
            };

        checkEmail();
    }, [debouncedEmail]);


  const sendOtp = async () => {
    const email =
      form.getValues("email");

    const username =
      form.getValues("username");

    if (!email || !username) {
      toast.error(
        "Please enter username and email first"
      );
      return;
    }

    try {
      setIsSendingOtp(true);

      const response =
        await axios.post(
          "/api/send-otp",
          {
            email,
            username,
          }
        );

      toast.success(
        response.data.message
      );

      setCooldown(60);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Failed to send OTP"
      );
    } finally {
      setIsSendingOtp(false);
    }
  };

  const onSubmit = async (
    data: z.infer<typeof signupSchema>
  ) => {
    try {
      setIsSubmitting(true);

      const response =
        await axios.post(
          "/api/sign-up",
          data
        );

      toast.success(
        response.data.message
      );

      router.replace("/sign-in");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Failed to create account"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted py-10">
      <div className="w-full max-w-lg rounded-lg border bg-background p-8 shadow">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">
            Create Account
          </h1>

          <p className="mt-2 text-muted-foreground">
            Join AidLink today
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
              name="name"
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel>
                    Full Name
                  </FormLabel>

                  <FormControl>
                    <Input
                      placeholder="Enter your name"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="username"
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel>
                    Username
                  </FormLabel>

                  <FormControl>
                    <Input
                      placeholder="Choose a username"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />

                    {isCheckingUsername ? (
                    <p className="text-xs text-muted-foreground">
                        Checking username...
                    </p>
                    ) : usernameMessage ? (
                    <p
                        className={`text-xs ${
                        usernameMessage.includes(
                            "available"
                        )
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                    >
                        {usernameMessage}
                    </p>
                    ) : null}
                  
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }: any) => (
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
                        cooldown > 0 ||
                        isCheckingUsername ||
                        isCheckingEmail ||
                        usernameMessage ===
                            "Username already taken" ||
                        emailMessage ===
                            "Email already registered"
                      }
                    >
                      {isSendingOtp ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : cooldown > 0 ? (
                        `Resend ${cooldown}s`
                      ) : (
                        "Verify"
                      )}
                    </Button>
                  </div>

                  <FormMessage />

                    {isCheckingEmail ? (
                        <p className="text-xs text-muted-foreground">
                            Checking email...
                        </p>
                        ) : emailMessage ? (
                        <p
                            className={`text-xs ${
                            emailMessage.includes(
                                "available"
                            )
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                        >
                            {emailMessage}
                        </p>
                    ) : null}

                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel>
                    Phone
                  </FormLabel>

                  <FormControl>
                    <Input
                      placeholder="Enter phone number"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="verificationCode"
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel>
                    Verification Code
                  </FormLabel>

                  <FormControl>
                    <Input
                      placeholder="Enter 6-digit OTP"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {cooldown > 0 && (
              <p className="text-xs text-muted-foreground">
                You can request another OTP in{" "}
                {cooldown} seconds.
              </p>
            )}

            <FormField
              control={form.control}
              name="password"
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel>
                    Password
                  </FormLabel>

                  <FormControl>
                      
                    <div className="relative">
                      <Input
                        type={
                          showPassword
                            ? "text"
                            : "password"
                        }
                        placeholder="Enter password"
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
              render={({ field }: any) => (
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
                isSubmitting ||
                isCheckingUsername ||
                isCheckingEmail ||
                usernameMessage ===
                    "Username already taken" ||
                emailMessage ===
                    "Email already registered"
              }
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">
                Already have an account?{" "}
              </span>

              <Button
                type="button"
                variant="link"
                className="p-0 h-auto"
                onClick={() =>
                  router.push("/sign-in")
                }
              >
                Sign In
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}