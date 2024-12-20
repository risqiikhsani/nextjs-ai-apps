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

import Image from "next/image";
import SpinnerAI2 from "@/components/spinner-ai-2";
import { text_to_image_models } from "@/const/models";

const FormSchema = z.object({
  text: z
    .string()
    .min(1, "text is required")
    .max(1000, "text must be less than 1000 characters"),
  model: z.string(),
});

// Function to convert Blob to Base64
function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export default function Page() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState("");

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
      const response = await fetch("/api/text-to-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ model:data.model,text: data.text }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Get the Blob from the response
      const blob = await response.blob();
      const base64Image = await blobToBase64(blob); // Convert Blob to Base64
      setGeneratedImage(base64Image); // Set the Base64 string to the state

      toast({
        title: "Image Generated",
        description: "Your image has been generated successfully!",
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
    <div className="py-10 grid md:grid-cols-2 gap-4 border-2 rounded-xl p-4">
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
                      <SelectValue placeholder="Select a verified model to display" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {text_to_image_models.map((model,i) => (
                      <SelectItem key={i} value={model.model}>
                        {model.model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select the model you want to use for image generation.
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
                <FormLabel>Prompt</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Type your image here"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Sending..." : "Submit"}
          </Button>
        </form>
      </Form>

      <div>
      <h3 className="text-lg font-semibold">Image Result</h3>
      {isLoading && <p>{`Wait, generating image using model ${form.getValues("model")} is running...`}</p>}
      {isLoading && <SpinnerAI2/>}
      {generatedImage && (
        <div className="mt-6">
          <Image
            src={generatedImage}
            alt="Generated"
            height={1000}
            width={1000}
            className="rounded-lg"
          />
        </div>
      )}
      </div>
      
    </div>
  );
}
