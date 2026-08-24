"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";

interface Review {
  id: string;
  rating: number;
  comment?: string;
  reviewerRole?: string;
  createdAt: string;
  reviewer?: {
    username: string;
    name: string;
    profilePicture?: string;
  };
}

interface PublicReviewsProps {
  username: string;
}

export default function PublicReviews({
  username,
}: PublicReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await axios.get(
          `/api/user/${username}/reviews`
        );

        setReviews(response.data?.data || []);
      } catch (error: any) {
        console.error(
          "Failed to load reviews:",
          error?.response?.data || error
        );

        setError(
          error?.response?.data?.message ||
            "Failed to load reviews."
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (username) {
      fetchReviews();
    }
  }, [username]);

  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="mb-5">
        <h2 className="text-lg font-semibold">
          Reviews
        </h2>

        <p className="text-sm text-muted-foreground">
          Feedback from people who have worked with{" "}
          @{username}.
        </p>
      </div>

      {isLoading && (
        <p className="text-sm text-muted-foreground">
          Loading reviews...
        </p>
      )}

      {!isLoading && error && (
        <p className="text-sm text-red-500">
          {error}
        </p>
      )}

      {!isLoading &&
        !error &&
        reviews.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No reviews yet.
          </p>
        )}

      {!isLoading &&
        !error &&
        reviews.length > 0 && (
          <div className="space-y-5">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="border-b pb-5 last:border-b-0 last:pb-0"
              >
                <div className="flex items-start gap-3">
                  <Image
                    src={
                      review.reviewer?.profilePicture ||
                      "/default-avatar.png"
                    }
                    alt={
                      review.reviewer?.name ||
                      "Reviewer"
                    }
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="font-medium">
                          {review.reviewer?.name ||
                            "Unknown user"}
                        </p>

                        {review.reviewer?.username && (
                          <p className="text-sm text-muted-foreground">
                            @{review.reviewer.username}
                          </p>
                        )}
                      </div>

                      <p className="text-sm text-muted-foreground">
                        {new Date(
                          review.createdAt
                        ).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="mt-2 flex items-center gap-1">
                      <span className="text-yellow-400">
                        {"★".repeat(review.rating)}
                      </span>

                      <span className="text-sm text-muted-foreground">
                        {review.rating}/5
                      </span>
                    </div>

                    {review.comment && (
                      <p className="mt-2 text-sm text-muted-foreground">
                        {review.comment}
                      </p>
                    )}

                    {review.reviewerRole && (
                      <p className="mt-2 text-xs capitalize text-muted-foreground">
                        {review.reviewerRole}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  );
}