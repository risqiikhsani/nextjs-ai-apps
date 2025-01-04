"use client";
import SpinnerAI2 from "@/components/spinner-ai-2";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  audio: z
    .instanceof(File)
    .refine((file) => file.size !== 0, "Please upload an audio file")
    .refine(
      (file) => file.type === "audio/flac",
      "Only .flac audio files are supported"
    ),
});

export default function Page() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
  });

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === "audio/flac") {
        form.setValue("audio", file);
      } else {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: "Please upload a .flac audio file",
        });
        e.target.value = ""; // Reset input
      }
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      setResult("");

      // Convert the file to base64
      const buffer = await values.audio.arrayBuffer();
      const base64Audio = Buffer.from(buffer).toString("base64");


      const response = await fetch("/api/speech-to-text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          audio: base64Audio,
          model: "facebook/wav2vec2-large-960h-lv60-self",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      setResult(data.text);

      toast({
        title: "Success",
        description: "Audio has been successfully transcribed!",
      });

      form.reset();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to process audio",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="py-10 grid md:grid-cols-2 gap-4 border-2 rounded-xl p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="audio"
            render={() => (
              <FormItem>
                <FormLabel>
                  <h2 className="text-xl font-semibold">
                    Upload or Record Audio (.flac)
                  </h2>
                </FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept=".flac"
                    onChange={handleFileChange}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold hover:file:bg-violet-100 file:bg-violet-50 file:text-violet-700"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Processing..." : "Transcribe Audio"}
          </Button>
        </form>
      </Form>

      <div>
        <h3 className="text-lg font-semibold mb-4">Transcription Result</h3>
        {isLoading && (
          <div className="flex items-center gap-2">
            <SpinnerAI2 />
            <p>Transcribing audio...</p>
          </div>
        )}
        {result && (
          <div className="p-4 bg-sky-50 rounded-lg">
            <p className="text-sky-900">{result}</p>
          </div>
        )}
      </div>
    </div>
  );
}
