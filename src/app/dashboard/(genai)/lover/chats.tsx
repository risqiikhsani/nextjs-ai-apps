"use client";

import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useChat } from "ai/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useEffect, useRef } from "react";

export interface PersonaType {
  picture: string;
  name: string;
  gender: string;
  personality: string;
  hobbies: string;
  preferences: string;
}

export default function Chat({
  user_name,
  persona,
}: {
  user_name: string;
  persona: PersonaType;
}) {
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
    setMessages,
  } = useChat({
    api: "/api/genai/langchain/love",
    body: {
      user_name: user_name,
      persona_name: persona.name,
      persona_gender: persona.gender,
      persona_personality: persona.personality,
      persona_hobbies: persona.hobbies,
      persona_preferences: persona.preferences,
    },
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

  // useEffect to refresh Chat when form is submitted
  useEffect(() => {
    // Effect will run when either userName or love changes
    setMessages([]);
  }, [persona, setMessages]);

  return (
    <div className="h-[600px]">
      <div className="p-6 flex flex-row gap-2 items-center justify-start">
        {persona.picture && (
          <Avatar>
            <AvatarImage src={persona.picture} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        )}
        <h1 className="text-2xl font-bold">{persona.name}</h1>
      </div>
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
            className={`p-3 rounded-md flex flex-col gap-2 ${
              m.role === "user"
                ? "bg-blue-100 text-blue-800 self-end"
                : "bg-gray-100 text-gray-800 self-start"
            }`}
          >
            <div className="flex flex-row gap-2 items-center">
            {m.role === "assistant" && persona.picture && (
              <Avatar>
                <AvatarImage src={persona.picture} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            )}
            <p className="font-medium">{m.role === "user" ? "You" : `${persona.name}`}</p>
            </div>
            
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
