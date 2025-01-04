"use client";

import Loader from "@/components/loader";
import { Markdown } from "@/components/markdown";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const FormSchema = z.object({
  message: z
    .string()
    .min(1, "Message is required")
    .max(1000, "Message must be less than 1000 characters"),
});

interface Message {
  role: string;
  content: string;
}

export default function Page() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const messageEndRef = useRef<HTMLDivElement | null>(null); // Ref for the message container

  // Function to scroll to bottom of messages
  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll to the bottom every time messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      message: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    // Add user's message to messages array
    const userMessage = { role: "user", content: data.message };
    const updatedMessages = [...messages, userMessage];

    // Set the user's message in the messages array
    setMessages(updatedMessages);
    console.log(messages);
    try {
      setIsLoading(true);
      const response = await fetch("/api/chatbot-conv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      // Add the AI's response to the messages array
      const aiMessage = {
        role: "assistant",
        content: result.completion.content,
      };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
      console.log(messages);

      toast({
        title: "Response",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4 overflow-auto">
            <code className="text-white whitespace-pre-wrap">
              {JSON.stringify(result, null, 2)}
            </code>
          </pre>
        ),
      });

      // Reset form after successful submission
      form.reset();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4 overflow-auto">
            <code className="text-white whitespace-pre-wrap">
              {error instanceof Error ? error.message : "An error occurred"}
            </code>
          </pre>
        ),
      });
    } finally {
      setIsLoading(false);
    }
  }

  // Function to handle Enter key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevents newline insertion
      form.handleSubmit(onSubmit)(); // Trigger form submission
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Chat Container */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`my-2 p-4 rounded-xl max-w-md ${
              message.role === "user"
                ? "ml-auto bg-blue-500 text-white text-right"
                : "mr-auto bg-gray-200 text-black text-left"
            }`}
          >
            
            <h1 className="font-bold">{message.role}</h1>
            {/* <MarkdownDisplay text={message.content} /> */}
            <Markdown>{message.content}</Markdown>
          </div>
        ))}

        {/* Render the loader when loading */}
        {isLoading && <Loader />}

        {/* This div helps to scroll to the bottom */}
        <div ref={messageEndRef} />
      </div>

      {/* Sticky Input Form at Bottom */}
      <div className="p-4 border-t bg-white sticky bottom-0">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex items-center space-x-4"
          >
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem className="flex-grow">
                  <FormControl>
                    <Textarea
                      placeholder="Type your message here..."
                      className="resize-none w-full"
                      {...field}
                      onKeyDown={handleKeyDown} // Add keydown listener
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={isLoading}
              className="whitespace-nowrap"
            >
              {isLoading ? "Sending..." : "Send"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
