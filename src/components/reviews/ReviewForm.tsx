"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ReviewFormProps {
  requestId: string;
  applicationId: string;
  revieweeName: string;
  onSuccess?: () => void;
}

export default function ReviewForm({
  requestId,
  applicationId,
  revieweeName,
  onSuccess,
}: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [hasReviewed, setHasReviewed] =
    useState(false);

  const [isCheckingReview, setIsCheckingReview] =
    useState(true);

  // Check whether current user has already reviewed
  useEffect(() => {
    const checkReviewStatus = async () => {
      try {
        const response = await axios.get(
          `/api/help-request/${requestId}/review/${applicationId}`
        );

        setHasReviewed(
          response.data?.data?.hasReviewed ?? false
        );
      } catch (error: any) {
        console.error(
          "Check review status:",
          error?.response?.data || error
        );

        // Don't block the form if status check fails
        setHasReviewed(false);
      } finally {
        setIsCheckingReview(false);
      }
    };

    checkReviewStatus();
  }, [requestId, applicationId]);

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (rating < 1 || rating > 5) {
      toast.error("Please select a rating.");
      return;
    }

    try {
      setIsSubmitting(true);

      await axios.post(
        `/api/help-request/${requestId}/review/${applicationId}`,
        {
          rating,
          comment: comment.trim(),
        }
      );

      toast.success(
        "Review submitted successfully."
      );

      setRating(0);
      setComment("");

      // Immediately hide the form
      setHasReviewed(true);

      onSuccess?.();
    } catch (error: any) {
      console.error(
        "Submit review:",
        error?.response?.data || error
      );

      toast.error(
        error?.response?.data?.message ||
          "Failed to submit review."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading review status
  if (isCheckingReview) {
    return (
      <Card>
        <CardContent className="py-6 text-center text-sm text-muted-foreground">
          Checking review status...
        </CardContent>
      </Card>
    );
  }

  // Already reviewed
  if (hasReviewed) {
    return (
      <Card>
        <CardContent className="py-6 text-center">
          <p className="font-medium">
            You have already reviewed this task.
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            Thank you for your feedback.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Rate {revieweeName}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {/* Rating */}

          <div className="space-y-2">
            <p className="text-sm font-medium">
              Rating
            </p>

            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(
                (value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() =>
                      setRating(value)
                    }
                    disabled={isSubmitting}
                    className={`text-3xl transition ${
                      value <= rating
                        ? "text-yellow-400"
                        : "text-muted-foreground"
                    }`}
                    aria-label={`Rate ${value} out of 5`}
                  >
                    ★
                  </button>
                )
              )}
            </div>

            {rating > 0 && (
              <p className="text-sm text-muted-foreground">
                {rating}/5
              </p>
            )}
          </div>

          {/* Comment */}

          <div className="space-y-2">
            <label
              htmlFor="review-comment"
              className="text-sm font-medium"
            >
              Comment
            </label>

            <Textarea
              id="review-comment"
              value={comment}
              onChange={(e) =>
                setComment(e.target.value)
              }
              placeholder={`Share your experience with ${revieweeName}...`}
              maxLength={500}
              rows={4}
              disabled={isSubmitting}
            />

            <p className="text-xs text-muted-foreground">
              {comment.length}/500
            </p>
          </div>

          {/* Submit */}

          <Button
            type="submit"
            className="w-full"
            disabled={
              isSubmitting || rating === 0
            }
          >
            {isSubmitting
              ? "Submitting..."
              : "Submit Review"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}