"use client";

import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useChat } from "ai/react";
import { useEffect, useRef } from "react";

export default function Chat() {
  const { toast } = useToast();

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    stop,
    error,
    reload,
  } = useChat({
    api: "/api/genai/langchain/chat",
    maxSteps: 5,
    onFinish: () => {
      toast({ title: "Message sent!" });
    },
    onError: (error) => {
      toast({ title: "An error occurred: " + JSON.stringify(error) });
    },
    onResponse: () => {
      toast({ title: "Message received!" });
    },
  });

  const messageEndRef = useRef<HTMLDivElement | null>(null); // Ref for the message container

  // Function to scroll to bottom of messages
  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll to the bottom every time messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col h-screen">
      {/* Messages */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {error && (
          <div className="text-red-500 bg-red-100 p-3 rounded-md">
            <p>An error occurred. Please try again.</p>
            <Button variant="outline" onClick={() => reload}>
              Retry
            </Button>
          </div>
        )}

        {messages.map((m) => (
          <div
            key={m.id}
            className={`p-3 rounded-md ${
              m.role === "user"
                ? "bg-blue-100 text-blue-800 self-end"
                : "bg-gray-100 text-gray-800 self-start"
            }`}
          >
            <p className="font-medium">{m.role === "user" ? "You:" : "AI:"}</p>
            {m.toolInvocations ? (
              <pre className="text-sm">
                {JSON.stringify(m.toolInvocations, null, 2)}
              </pre>
            ) : (
              <p className="text-sm">{m.content}</p>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center space-x-3">
            <Loader />
            <Button variant="outline" size="sm" onClick={stop}>
              Stop
            </Button>
          </div>
        )}
        <div ref={messageEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-white sticky bottom-0">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <Input
            className="flex-1 border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            value={input}
            placeholder="Type your message..."
            onChange={handleInputChange}
          />
          <Button
            type="submit"
            className="bg-blue-500 text-white hover:bg-blue-600"
          >
            Send
          </Button>
        </form>
      </div>
    </div>
  );
}
