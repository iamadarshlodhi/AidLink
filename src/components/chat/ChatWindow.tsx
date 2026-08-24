"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Send } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

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
}

interface Message {
  _id: string;
  conversationId: string;
  sender: User;
  content: string;
  isRead: boolean;
  createdAt: string;
}

interface ChatWindowProps {
  conversation: Conversation | null;
  currentUserId: string;
}

export default function ChatWindow({
  conversation,
  currentUserId,
}: ChatWindowProps) {
  const [messages, setMessages] =
    useState<Message[]>([]);

  const [content, setContent] = useState("");

  const [isLoading, setIsLoading] =
    useState(false);

  const [isSending, setIsSending] =
    useState(false);

  const messagesEndRef =
    useRef<HTMLDivElement>(null);

  /*
   * Fetch messages only.
   * This function is also used by polling,
   * so it must NOT mark messages as read.
   */
  const fetchMessages = async (
    showLoading = false
  ) => {
    if (!conversation) return;

    try {
      if (showLoading) {
        setIsLoading(true);
      }

      const response = await axios.get(
        `/api/conversations/${conversation._id}/messages`
      );

      setMessages(response.data.data || []);
    } catch (error: any) {
      console.error(
        "Fetch messages:",
        error?.response?.data || error
      );

      if (showLoading) {
        toast.error(
          error?.response?.data?.message ||
            "Failed to load messages."
        );
      }
    } finally {
      if (showLoading) {
        setIsLoading(false);
      }
    }
  };

  /*
   * Mark messages from the other user as read.
   * This is called when opening/switching conversations,
   * not during polling.
   */
  const markMessagesAsRead = async () => {
    if (!conversation) return;

    try {
      await axios.patch(
        `/api/conversations/${conversation._id}/read`
      );
    } catch (error: any) {
      console.error(
        "Mark messages as read:",
        error?.response?.data || error
      );
    }
  };

  /*
   * Load messages when conversation changes.
   */
  useEffect(() => {
    if (!conversation) {
      setMessages([]);
      return;
    }

    const loadConversation = async () => {
      await fetchMessages(true);
      await markMessagesAsRead();
    };

    loadConversation();
  }, [conversation?._id]);

  /*
   * Poll for new messages every 3 seconds.
   *
   * IMPORTANT:
   * This only fetches messages.
   * It does NOT call /read.
   */
  useEffect(() => {
    if (!conversation) return;

    const interval = setInterval(() => {
      fetchMessages(false);
    }, 3000);

    return () => {
      clearInterval(interval);
    };
  }, [conversation?._id]);

  /*
   * Scroll to latest message.
   */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const handleSend = async () => {
    const trimmedContent =
      content.trim();

    if (!trimmedContent) return;

    if (!conversation) return;

    try {
      setIsSending(true);

      const response =
        await axios.post(
          `/api/conversations/${conversation._id}/messages`,
          {
            content: trimmedContent,
          }
        );

      const newMessage =
        response.data.data;

      setMessages((prev) => [
        ...prev,
        newMessage,
      ]);

      setContent("");
    } catch (error: any) {
      console.error(
        "Send message:",
        error?.response?.data || error
      );

      toast.error(
        error?.response?.data?.message ||
          "Failed to send message."
      );
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (
      e.key === "Enter" &&
      !e.shiftKey
    ) {
      e.preventDefault();

      handleSend();
    }
  };

  if (!conversation) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <div className="text-center">
          <p className="font-medium">
            Select a conversation
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            Choose a conversation to start
            messaging.
          </p>
        </div>
      </div>
    );
  }

  const otherUser =
    conversation.requester._id ===
    currentUserId
      ? conversation.helper
      : conversation.requester;

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Header */}

      <div className="flex items-center gap-3 border-b p-4">
        <Image
          src={
            otherUser.profilePicture ||
            "/default-avatar.png"
          }
          alt={otherUser.name}
          width={44}
          height={44}
          className="h-11 w-11 rounded-full object-cover"
        />

        <div className="min-w-0">
          <p className="font-semibold">
            {otherUser.name}
          </p>

          <p className="text-xs text-muted-foreground">
            @{otherUser.username}
          </p>

          <p className="truncate text-xs text-muted-foreground">
            {conversation.requestId.title}
          </p>
        </div>
      </div>

      {/* Messages */}

      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <p className="text-sm text-muted-foreground">
              Loading messages...
            </p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <p className="font-medium">
                No messages yet
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Start the conversation.
              </p>
            </div>
          </div>
        ) : (
          messages.map((message) => {
            const isMine =
              message.sender._id ===
              currentUserId;

            return (
              <div
                key={message._id}
                className={`flex ${
                  isMine
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                    isMine
                      ? "rounded-br-sm bg-primary text-primary-foreground"
                      : "rounded-bl-sm bg-muted"
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words text-sm">
                    {message.content}
                  </p>

                  <p
                    className={`mt-1 text-[10px] ${
                      isMine
                        ? "text-primary-foreground/70"
                        : "text-muted-foreground"
                    }`}
                  >
                    {new Date(
                      message.createdAt
                    ).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            );
          })
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}

      <div className="border-t p-3">
        <div className="flex items-end gap-2">
          <Textarea
            value={content}
            onChange={(e) =>
              setContent(e.target.value)
            }
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            maxLength={2000}
            rows={2}
            disabled={isSending}
            className="resize-none"
          />

          <Button
            type="button"
            size="icon"
            onClick={handleSend}
            disabled={
              isSending ||
              !content.trim()
            }
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        <p className="mt-1 text-right text-xs text-muted-foreground">
          {content.length}/2000
        </p>
      </div>
    </div>
  );
}