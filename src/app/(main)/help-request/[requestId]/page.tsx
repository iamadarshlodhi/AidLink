import HelpRequestDetail from "@/components/requests/HelpRequestDetail";

export default async function Page({
  params,
}: {
  params: Promise<{
    requestId: string;
  }>;
}) {
  const { requestId } = await params;

  return (
    <HelpRequestDetail
      requestId={requestId}
    />
  );
}