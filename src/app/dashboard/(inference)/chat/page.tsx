"use client"

import { Markdown } from "@/components/markdown"
import SpinnerAI2 from "@/components/spinner-ai-2"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const FormSchema = z.object({
  message: z
    .string()
    .min(1, "Message is required")
    .max(1000, "Message must be less than 1000 characters")
})

export default function Page() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [result,setResult] = useState("")

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      message: "",
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setIsLoading(true)
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: data.message }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      setResult(result.completion.content)

      toast({
        title: "Response",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4 overflow-auto">
            <code className="text-white whitespace-pre-wrap">
              {JSON.stringify(result, null, 2)}
            </code>
          </pre>
        ),
      })

      // Reset form after successful submission
      form.reset()
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
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="py-10 grid md:grid-cols-2 gap-4 border-2 rounded-xl p-4">
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Type your message here..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button 
          type="submit" 
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Submit"}
        </Button>
      </form>
    </Form>

    <div>
      <h3 className="text-lg font-semibold">Result</h3>
      {isLoading && <p>Wait, Progress to generate text ...</p>}
      {isLoading && <SpinnerAI2/>}
      {/* Render result as progress bars */}
      <Markdown>{result}</Markdown>
      </div>
    </div>

  )
}