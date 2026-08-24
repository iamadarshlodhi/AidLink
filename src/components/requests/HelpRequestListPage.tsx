"use client";

import Link from "next/link";
import { useState } from "react";

import HelpRequestCard from "@/components/requests/HelpRequestCard";
import { useHelpRequests } from "@/hooks/useHelpRequests";

import type {
  HelpRequestCategory,
  HelpRequestMode,
  HelpRequestTaskType,
  HelpRequestUrgency,
  HelpRequestSort,
} from "@/types/help-request";

export default function HelpRequestListPage() {
 const [search, setSearch] = useState("");

  const [category, setCategory] =
    useState<HelpRequestCategory | "">("");

  const [mode, setMode] =
    useState<HelpRequestMode | "">("");

  const [taskType, setTaskType] =
    useState<HelpRequestTaskType | "">("");

  const [urgency, setUrgency] =
    useState<HelpRequestUrgency | "">("");

  const [sort, setSort] =
    useState<HelpRequestSort>("newest");

  const {
    data,
    isLoading,
    isError,
    error,
  } = useHelpRequests({
    q: search || undefined,
    category: category || undefined,
    mode: mode || undefined,
    taskType: taskType || undefined,
    urgency: urgency || undefined,
    status: "open",
    sort,
    page: 1,
    limit: 20,
  });

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setMode("");
    setTaskType("");
    setUrgency("");
    setSort("newest");
  };

  const hasFilters =
    search ||
    category ||
    mode ||
    taskType ||
    urgency ||
    sort !== "newest";

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">
            Help Requests
          </h1>

          <p className="text-sm text-muted-foreground">
            Browse available requests and find people
            who need help.
          </p>
        </div>

        <Link
          href="/help-request/create"
          className="shrink-0 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          Create Request
        </Link>
      </div>

      {/* Search + Filters */}
      <div className="space-y-4 rounded-lg border bg-card p-4">
        {/* Search */}
        <div className="flex gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search help requests..."
            className="h-10 flex-1 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          />

          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="rounded-md border px-4 text-sm hover:bg-muted"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {/* Category */}
          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value as HelpRequestCategory | "")
            }
            className="h-10 rounded-md border bg-background px-3 text-sm"
          >
            <option value="">
              All Categories
            </option>

            <option value="medical">
              Medical
            </option>

            <option value="food">
              Food
            </option>

            <option value="education">
              Education
            </option>

            <option value="transport">
              Transport
            </option>

            <option value="shelter">
              Shelter
            </option>

            <option value="other">
              Other
            </option>
          </select>

          {/* Mode */}
          <select
            value={mode}
            onChange={(e) =>
              setMode(e.target.value as HelpRequestMode | "")
            }
            className="h-10 rounded-md border bg-background px-3 text-sm"
          >
            <option value="">
              All Modes
            </option>

            <option value="online">
              Online
            </option>

            <option value="offline">
              Offline
            </option>
          </select>

          {/* Task Type */}
          <select
            value={taskType}
            onChange={(e) =>
              setTaskType(e.target.value as HelpRequestTaskType | "")
            }
            className="h-10 rounded-md border bg-background px-3 text-sm"
          >
            <option value="">
              All Task Types
            </option>

            <option value="volunteer">
              Volunteer
            </option>

            <option value="paid">
              Paid
            </option>
          </select>

          {/* Urgency */}
          <select
            value={urgency}
            onChange={(e) =>
              setUrgency(e.target.value as HelpRequestUrgency | "")
            }
            className="h-10 rounded-md border bg-background px-3 text-sm"
          >
            <option value="">
              All Urgency
            </option>

            <option value="low">
              Low
            </option>

            <option value="medium">
              Medium
            </option>

            <option value="high">
              High
            </option>

            <option value="critical">
              Critical
            </option>
          </select>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) =>
              setSort(e.target.value as HelpRequestSort)
            }
            className="h-10 rounded-md border bg-background px-3 text-sm"
          >
            <option value="newest">
              Newest
            </option>

            <option value="oldest">
              Oldest
            </option>

            <option value="deadline">
              Deadline
            </option>
          </select>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="rounded-lg border bg-card p-8 text-center">
          <p className="text-muted-foreground">
            Loading help requests...
          </p>
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="rounded-lg border border-destructive p-8 text-center">
          <h2 className="font-semibold text-destructive">
            Failed to load requests
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            {error instanceof Error
              ? error.message
              : "Something went wrong."}
          </p>
        </div>
      )}

      {/* Empty */}
      {!isLoading &&
        !isError &&
        data?.data.length === 0 && (
          <div className="rounded-lg border bg-card p-8 text-center">
            <h2 className="text-lg font-semibold">
              No Help Requests Found
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Try changing your search or filters.
            </p>

            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-4 rounded-md border px-4 py-2 text-sm hover:bg-muted"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

      {/* Results */}
      {!isLoading &&
        !isError &&
        data &&
        data.data.length > 0 && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {data.pagination.total}{" "}
              {data.pagination.total === 1
                ? "request"
                : "requests"}{" "}
              found
            </p>

            <div className="space-y-6">
              {data.data.map((request) => (
                <HelpRequestCard
                  key={request._id}
                  request={request}
                />
              ))}
            </div>
          </div>
        )}
    </div>
  );
}