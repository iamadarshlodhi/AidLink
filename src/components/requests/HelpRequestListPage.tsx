"use client";

import Link from "next/link";

export default function HelpRequestListPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Help Requests</h1>
          <p className="text-sm text-muted-foreground">
            Browse available requests and manage your own help posts.
          </p>
        </div>

        <Link
          href="/help-request/create"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Create Request
        </Link>
      </div>

      <div className="rounded-lg border bg-card p-6 text-sm text-muted-foreground">
        The request listing experience is ready to be wired to your data layer.
      </div>
    </div>
  );
}
