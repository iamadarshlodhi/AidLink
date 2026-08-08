import { notFound, redirect } from "next/navigation";

import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import HelpRequestModel from "@/model/HelpRequest";

import EditHelpRequestForm from "@/components/requests/EditHelpRequestForm";

interface EditPageProps {
  params: Promise<{
    requestId: string;
  }>;
}

export default async function EditHelpRequestPage({
  params,
}: EditPageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/sign-in");
  }

  const { requestId } = await params;

  await dbConnect();

  const request =
    await HelpRequestModel.findById(
      requestId
    ).lean();

  if (!request) {
    notFound();
  }

  return (
    <main className="container mx-auto max-w-3xl px-4 py-8">
      <EditHelpRequestForm
        request={{
          _id: request._id.toString(),
          title: request.title,
          description: request.description,
          category: request.category,
          urgency: request.urgency,
          mode: request.mode,
          taskType: request.taskType,
          helpersRequired:
            request.helpersRequired,
          tentativePayment:
            request.tentativePayment,
          deadline:
            request.deadline.toISOString(),
          location:
            request.location ?? "",
          images:
            request.images ?? [],
        }}
      />
    </main>
  );
}