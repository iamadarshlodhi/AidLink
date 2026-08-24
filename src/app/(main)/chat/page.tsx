import { auth } from "@/auth";
import { redirect } from "next/navigation";
import ChatPage from "@/components/chat/ChatPage";

export default async function ChatRoute() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <ChatPage
        currentUserId={session.user.id}
      />
    </main>
  );
}