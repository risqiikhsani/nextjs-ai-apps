"use client";
import SpinnerAI2 from "@/components/spinner-ai-2";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { image_to_image_models } from "@/const/models";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { UploadCloudIcon } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import { z } from "zod";


const formSchema = z.object({
  image: z
    //Rest of validations done via react dropzone
    .instanceof(File)
    .refine((file) => file.size !== 0, "Please upload an image"),
  text: z.string().optional(),
  model: z.string().optional(),
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
  const [preview, setPreview] = useState<string | ArrayBuffer | null>("");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: {
      image: new File([""], "filename"),
      text: "",
      model:"lllyasviel/sd-controlnet-depth"
    },
  });

  // const clearImage = () => {
  //   form.reset()
  //   setPreview(null)
  // }

  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      const reader = new FileReader();
      try {
        reader.onload = () => setPreview(reader.result);
        reader.readAsDataURL(acceptedFiles[0]);
        form.setValue("image", acceptedFiles[0]);
        form.clearErrors("image");
      } catch (error) {
        console.log(error);
        setPreview(null);
        form.resetField("image");
      }
    },
    [form]
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      maxFiles: 1,
      maxSize: 5000000,
      accept: { "image/png": [], "image/jpg": [], "image/jpeg": [] },
    });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: "Image Uploaded",
      description: `Image uploaded successfully 🎉 ${values.image.name}`,
    });
    try {
      setIsLoading(true);
      // Convert image file to base64
      const imageBase64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = () =>
          reject(new Error("Failed to convert image to base64"));
        reader.readAsDataURL(values.image);
      });

      const response = await fetch("/api/image-to-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          image: imageBase64.split(",")[1],
          text:values.text ,
          model:values.model
        }), // Remove the data URL prefix
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Get the Blob from the response
      const blob = await response.blob();
      const base64Image = await blobToBase64(blob); // Convert Blob to Base64
      setGeneratedImage(base64Image); // Set the Base64 string to the state

      toast({
        title: "Image Classification",
        description: "Your image has been classified successfully!",
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <FormField
          control={form.control}
          name="model"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Model</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a verified model to display" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {image_to_image_models.map((model,i) => (
                    <SelectItem key={i} value={model.model}>
                      {model.model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Select the model
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
          <FormField
            control={form.control}
            name="image"
            render={() => (
              <FormItem className="">
                <FormLabel
                  className={`${
                    fileRejections.length !== 0 && "text-destructive"
                  }`}
                >
                  <h2 className="text-lg font-semibold">
                    Upload your image
                    <span
                      className={
                        form.formState.errors.image ||
                        fileRejections.length !== 0
                          ? "text-destructive"
                          : "text-muted-foreground"
                      }
                    ></span>
                  </h2>
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
                    <UploadCloudIcon
                      className={`size-10 ${preview ? "hidden" : "block"}`}
                    />
                    <Input {...getInputProps()} type="file" />
                    {isDragActive ? (
                      <p>Drop the image!</p>
                    ) : (
                      <p>Click here or drag an image to upload it</p>
                    )}
                  </div>
                </FormControl>
                <FormMessage>
                  {fileRejections.length !== 0 && (
                    <p>
                      Image must be less than 1MB and of type png, jpg, or jpeg
                    </p>
                  )}
                </FormMessage>
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
                    placeholder="Type your prompt"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={form.formState.isSubmitting}>
            Submit
          </Button>
        </form>
      </Form>
      {/* <Button className="my-2" onClick={clearImage}>
        Clear image
      </Button> */}
      <div>
      <h3 className="text-lg font-semibold">Image Result</h3>
      {isLoading && <p>Wait, Progress to generate image from image ...</p>}
      {isLoading && <SpinnerAI2/>}
      {/* Render result as progress bars */}
      {generatedImage && (
        <div className="pt-2">
          <Image
            src={generatedImage}
            alt="Generated"
            className="rounded-lg"
            height={500}
            width={500}
          />
        </div>
      )}
      </div>
      
    </div>
  );
}
