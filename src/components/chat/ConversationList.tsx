"use client";

import Image from "next/image";

interface Conversation {
  _id: string;
  requestId: {
    _id: string;
    title: string;
  };
  requester: {
    _id: string;
    name: string;
    username: string;
    profilePicture?: string;
  };
  helper: {
    _id: string;
    name: string;
    username: string;
    profilePicture?: string;
  };
  lastMessage?: {
    content: string;
    createdAt: string;
  } | null;
}

interface ConversationListProps {
  conversations: Conversation[];
  selectedId?: string;
  currentUserId: string;
  onSelect: (conversation: Conversation) => void;
}

export default function ConversationList({
  conversations,
  selectedId,
  currentUserId,
  onSelect,
}: ConversationListProps) {
  return (
    <div className="h-full overflow-y-auto">
      {conversations.length === 0 ? (
        <div className="p-6 text-center">
          <p className="font-medium">
            No conversations
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            Conversations will appear here after
            an application is accepted.
          </p>
        </div>
      ) : (
        <div className="divide-y">
          {conversations.map((conversation) => {
            const otherUser =
              conversation.requester._id ===
              currentUserId
                ? conversation.helper
                : conversation.requester;

            return (
              <button
                key={conversation._id}
                type="button"
                onClick={() =>
                  onSelect(conversation)
                }
                className={`flex w-full gap-3 p-4 text-left transition hover:bg-accent ${
                  selectedId === conversation._id
                    ? "bg-accent"
                    : ""
                }`}
              >
                <Image
                  src={
                    otherUser.profilePicture ||
                    "/default-avatar.png"
                  }
                  alt={otherUser.name}
                  width={44}
                  height={44}
                  className="h-11 w-11 shrink-0 rounded-full object-cover"
                />

                <div className="min-w-0 flex-1">
                  <p className="font-medium">
                    {otherUser.name}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    @{otherUser.username}
                  </p>

                  <p className="mt-1 truncate text-sm">
                    {conversation.lastMessage
                      ?.content ||
                      "No messages yet"}
                  </p>

                  <p className="mt-1 truncate text-xs text-muted-foreground">
                    {conversation.requestId.title}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}