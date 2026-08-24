import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

import MyCreatedRequests from "@/components/requests/MyCreatedRequests";

export default async function MyCreatedRequestsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          My Created Requests
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Manage the help requests you have created.
        </p>
      </div>

      <MyCreatedRequests />
    </main>
  );
}