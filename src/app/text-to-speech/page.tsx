"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import SpinnerAI2 from "@/components/spinner-ai-2";

const FormSchema = z.object({
  text: z
    .string()
    .min(1, "Text is required")
    .max(1000, "Text must be less than 1000 characters"),
  model: z.string(),
});

// Function to convert Blob to Object URL
function blobToAudioUrl(blob: Blob): string {
  return URL.createObjectURL(blob);
}

export default function Page() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [generatedAudioUrl, setGeneratedAudioUrl] = useState("");

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      text: "",
      model: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setIsLoading(true);
      const response = await fetch("/api/text-to-speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ model: data.model, text: data.text }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Get the Blob from the response
      const blob = await response.blob();
      const audioUrl = blobToAudioUrl(blob); // Convert Blob to an Object URL
      setGeneratedAudioUrl(audioUrl); // Set the Object URL to the state

      toast({
        title: "Audio Generated",
        description: "Your audio has been generated successfully!",
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

  return (
    <div className="py-10 grid grid-cols-2 gap-4 border-2 rounded-xl p-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-2/3 space-y-6"
        >
          <FormField
            control={form.control}
            name="model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Model</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a verified model" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="espnet/kan-bayashi_ljspeech_vits">
                      espnet/kan-bayashi_ljspeech_vits
                    </SelectItem>
                    <SelectItem value="myshell-ai/MeloTTS-English">
                      myshell-ai/MeloTTS-English
                    </SelectItem>
                    <SelectItem value="microsoft/speecht5_tts">microsoft/speecht5_tts</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select the model you want to use for audio generation.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="text"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Text</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Type your text here"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Generating..." : "Submit"}
          </Button>
        </form>
      </Form>

      <div className="mx-6">
        <h3 className="text-lg font-semibold">Audio Result</h3>
        {isLoading && (
          <>
            <p>{`Generating audio using model ${form.getValues("model")}...`}</p>
            <SpinnerAI2 />
          </>
        )}
        {generatedAudioUrl && (
          <div className="mt-6">
            <audio controls src={generatedAudioUrl} className="w-full">
              Your browser does not support the audio element.
            </audio>
          </div>
        )}
      </div>
    </div>
  );
}
