"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Flag } from "lucide-react";

interface ReportDialogProps {
  targetType: "user" | "helpRequest";
  targetId: string;
}

export default function ReportDialog({
  targetType,
  targetId,
}: ReportDialogProps) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [alreadyReported, setAlreadyReported] =
    useState(false);

  const [submitError, setSubmitError] =
    useState("");

  /*
   * Check whether the current user has already
   * reported this target.
   */
  useEffect(() => {
    const checkExistingReport = async () => {
      try {
        setIsChecking(true);

        const response = await axios.get(
          `/api/report/check?targetType=${targetType}&targetId=${targetId}`
        );

        if (response.data.alreadyReported) {
          setAlreadyReported(true);
        } else {
          setAlreadyReported(false);
        }
      } catch (error: any) {
        console.error(
          "Check existing report:",
          error?.response?.data || error
        );
      } finally {
        setIsChecking(false);
      }
    };

    checkExistingReport();
  }, [targetType, targetId]);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setSubmitError("");

    if (!reason) {
      toast.error("Please select a reason.");
      return;
    }

    if (description.trim().length < 10) {
      toast.error(
        "Please provide at least 10 characters."
      );
      return;
    }

    try {
      setIsSubmitting(true);

      await axios.post("/api/report", {
        targetType,
        targetId,
        reason,
        description: description.trim(),
      });

      setAlreadyReported(true);
      setReason("");
      setDescription("");
      setSubmitError("");

      toast.success(
        "Report submitted successfully."
      );

      setOpen(false);
    } catch (error: any) {
      const status = error?.response?.status;

      const message =
        error?.response?.data?.message ||
        "Failed to submit report.";

      /*
       * Duplicate report.
       */
      if (status === 409) {
        setAlreadyReported(true);
        setSubmitError(
          "You have already reported this."
        );

        return;
      }

      console.error(
        "Submit report:",
        error?.response?.data || error
      );

      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (value: boolean) => {
    if (isSubmitting) {
      return;
    }

    if (!value) {
      setReason("");
      setDescription("");
      setSubmitError("");
    }

    setOpen(value);
  };

  /*
   * While checking the database, don't allow
   * the user to submit another report.
   */
  if (isChecking) {
    return (
      <Button
        variant="outline"
        disabled
        className="text-muted-foreground"
      >
        <Flag className="mr-2 h-4 w-4" />
        Checking...
      </Button>
    );
  }

  /*
   * Report already exists.
   */
  if (alreadyReported) {
    return (
      <Button
        variant="outline"
        disabled
        className="text-muted-foreground"
      >
        <Flag className="mr-2 h-4 w-4" />
        Already Reported
      </Button>
    );
  }

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="text-red-500 hover:text-red-600"
        >
          <Flag className="mr-2 h-4 w-4" />
          Report
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Report{" "}
            {targetType === "user"
              ? "User"
              : "Help Request"}
          </DialogTitle>

          <DialogDescription>
            Submit a report if you believe this{" "}
            {targetType === "user"
              ? "user"
              : "help request"}{" "}
            violates the platform rules.
          </DialogDescription>
        </DialogHeader>

        {submitError && (
          <div className="rounded-md border border-red-500/30 bg-red-500/10 p-4">
            <p className="font-medium text-red-500">
              Report already submitted
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              {submitError}
            </p>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {/* Reason */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Reason
            </label>

            <Select
              value={reason}
              onValueChange={setReason}
              disabled={isSubmitting}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="spam">
                  Spam
                </SelectItem>

                <SelectItem value="fake_request">
                  Fake Request
                </SelectItem>

                <SelectItem value="harassment">
                  Harassment
                </SelectItem>

                <SelectItem value="fraud">
                  Fraud
                </SelectItem>

                <SelectItem value="inappropriate">
                  Inappropriate Content
                </SelectItem>

                <SelectItem value="other">
                  Other
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label
              htmlFor="report-description"
              className="text-sm font-medium"
            >
              Description
            </label>

            <Textarea
              id="report-description"
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              placeholder="Explain the issue..."
              maxLength={1000}
              rows={5}
              disabled={isSubmitting}
            />

            <p className="text-xs text-muted-foreground">
              {description.length}/1000
            </p>

            {description.length > 0 &&
              description.trim().length < 10 && (
                <p className="text-xs text-red-500">
                  Description must be at least 10
                  characters.
                </p>
              )}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            variant="destructive"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Submitting..."
              : "Submit Report"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}