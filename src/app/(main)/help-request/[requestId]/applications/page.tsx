import ApplicationsPage from "@/components/requests/ApplicationsPage";

export default async function Page({
  params,
}: {
  params: Promise<{ requestId: string }>;
}) {
  const { requestId } = await params;

  return (
    <ApplicationsPage requestId={requestId} />
  );
}