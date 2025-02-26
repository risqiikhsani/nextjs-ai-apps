"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDropzone } from "react-dropzone";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { UploadCloudIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";
import SpinnerAI2 from "@/components/spinner-ai-2";
import { ImageClassifier, FilesetResolver } from '@mediapipe/tasks-vision';

const formSchema = z.object({
  image: z
    .instanceof(File)
    .refine((file) => file.size !== 0, "Please upload an image"),
});

export default function Page() {
  const { toast } = useToast();
  const [preview, setPreview] = useState<string | ArrayBuffer | null>("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ categoryName: string; score: number }[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [imageClassifier, setImageClassifier] = useState<any>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: {
      image: new File([""], "filename"),
    },
  });

  // Initialize MediaPipe Image Classifier
  useEffect(() => {
    async function createImageClassifier() {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
        );

        const classifier = await ImageClassifier.createFromModelPath(
          vision,
          "/models/efficientnet_lite0.tflite"
        );
        setImageClassifier(classifier);
      } catch (error) {
        console.error("Error initializing classifier:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to initialize image classifier.",
        });
      }
    }
    createImageClassifier();
  }, [toast]);

  // Dropzone file handler
  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      const reader = new FileReader();
      try {
        reader.onload = () => setPreview(reader.result);
        reader.readAsDataURL(acceptedFiles[0]);
        form.setValue("image", acceptedFiles[0]);
        form.clearErrors("image");
      } catch (error) {
        console.error("Error reading file:", error);
        setPreview(null);
        form.resetField("image");
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to read the image file.",
        });
      }
    },
    [form, toast]
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    maxFiles: 1,
    maxSize: 5000000,
    accept: { "image/png": [], "image/jpg": [], "image/jpeg": [] },
  });

  // Helper function to extract top predictions
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function getTopPredictions(predictions: { classifications: { categories: any[]; }[]; }, limit = 5) {
    if (!predictions?.classifications?.[0]?.categories) {
      return [];
    }
    return predictions.classifications[0].categories
      .filter((category) => category.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  // Classify image and display results
  async function classifyImage(imageFile: File) {
    if (!imageClassifier) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Image classifier is not ready yet.",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Create an HTML image element from the file
      const img = document.createElement('img');
      const imageUrl = URL.createObjectURL(imageFile);
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = imageUrl;
      });

      const predictions = await imageClassifier.classify(img);
      const topPredictions = getTopPredictions(predictions);
      setResult(topPredictions);
      
      if (topPredictions.length > 0) {
        toast({
          title: "Image Classification",
          description: "Your image has been classified successfully!",
        });
      } else {
        toast({
          variant: "destructive",
          title: "No Results",
          description: "No classifications were found for this image.",
        });
      }
    } catch (error) {
      console.error("Error classifying image:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while classifying the image.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await classifyImage(values.image);
  }

  return (
    <div className="py-10 grid md:grid-cols-2 gap-4 border-2 rounded-xl p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <FormField
            control={form.control}
            name="image"
            render={() => (
              <FormItem>
                <FormLabel className={`${fileRejections.length !== 0 && "text-destructive"}`}>
                  <h2 className="text-lg font-semibold">Upload your image</h2>
                </FormLabel>
                <FormControl>
                  <div
                    {...getRootProps()}
                    className="mx-auto flex cursor-pointer flex-col items-center justify-center border-2 rounded-lg p-2"
                  >
                    {preview && (
                      <Image
                        src={preview as string}
                        alt="Uploaded image"
                        className="rounded-lg"
                        height={500}
                        width={500}
                      />
                    )}
                    <UploadCloudIcon className={`size-10 ${preview ? "hidden" : "block"}`} />
                    <Input {...getInputProps()} type="file" />
                    {isDragActive ? <p>Drop the image!</p> : <p>Click here or drag an image to upload it</p>}
                  </div>
                </FormControl>
                <FormMessage>
                  {fileRejections.length !== 0 && (
                    <p>Image must be less than 5MB and of type png, jpg, or jpeg</p>
                  )}
                </FormMessage>
              </FormItem>
            )}
          />
          <Button type="submit" disabled={form.formState.isSubmitting || isLoading}>Submit</Button>
        </form>
      </Form>
      <div>
        <h3 className="text-lg font-semibold">Classification Results</h3>
        {isLoading && (
          <div className="space-y-2">
            <p>Classifying image...</p>
            <SpinnerAI2 />
          </div>
        )}
        {result.length > 0 && (
          <div className="space-y-4 mt-4">
            {result.map(({ categoryName, score }, index) => (
              <div key={index} className="space-y-2">
                <p className="font-bold text-sky-500">{categoryName} - {Math.round(score * 100)}%</p>
                <Progress value={score * 100} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}