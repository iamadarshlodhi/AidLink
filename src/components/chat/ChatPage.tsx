"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";

import ConversationList from "./ConversationList";
import ChatWindow from "./ChatWindow";

interface User {
  _id: string;
  name: string;
  username: string;
  profilePicture?: string;
}

interface Conversation {
  _id: string;
  requestId: {
    _id: string;
    title: string;
  };
  requester: User;
  helper: User;
  lastMessage?: {
    content: string;
    createdAt: string;
  } | null;
}

interface ChatPageProps {
  currentUserId: string;
}

export default function ChatPage({
  currentUserId,
}: ChatPageProps) {
  const searchParams = useSearchParams();

  const conversationId =
    searchParams.get("conversationId");

  const [conversations, setConversations] =
    useState<Conversation[]>([]);

  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const fetchConversations = async () => {
    try {
      const response = await axios.get(
        "/api/conversations"
      );

      const data =
        response.data.data || [];

      setConversations(data);

      /*
       * If a conversationId was supplied in the URL,
       * select that conversation.
       */
      if (conversationId) {
        const matchingConversation =
          data.find(
            (conversation: Conversation) =>
              conversation._id ===
              conversationId
          );

        if (matchingConversation) {
          setSelectedConversation(
            matchingConversation
          );
        } else {
          toast.error(
            "Conversation not found."
          );
        }

        return;
      }

      /*
       * Otherwise select the first conversation.
       */
      if (data.length > 0) {
        setSelectedConversation(data[0]);
      }
    } catch (error: any) {
      console.error(
        "Fetch conversations:",
        error?.response?.data || error
      );

      toast.error(
        error?.response?.data?.message ||
          "Failed to load conversations."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [conversationId]);

  if (isLoading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Loading conversations...
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-background">
      <div className="grid h-[650px] md:grid-cols-[320px_1fr]">
        {/* Conversation list */}

        <div className="min-h-0 border-r">
          <div className="border-b p-4">
            <h2 className="font-semibold">
              Messages
            </h2>

            <p className="text-sm text-muted-foreground">
              Your conversations
            </p>
          </div>

          <div className="h-[calc(100%-73px)]">
            <ConversationList
              conversations={conversations}
              selectedId={
                selectedConversation?._id
              }
              currentUserId={
                currentUserId
              }
              onSelect={
                setSelectedConversation
              }
            />
          </div>
        </div>

        {/* Chat window */}

        <div className="min-h-0">
          <ChatWindow
            conversation={
              selectedConversation
            }
            currentUserId={
              currentUserId
            }
          />
        </div>
      </div>
    </div>
  );
}