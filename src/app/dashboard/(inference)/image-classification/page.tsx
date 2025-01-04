"use client";
import React, { useState } from "react";
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

const formSchema = z.object({
  image: z
    //Rest of validations done via react dropzone
    .instanceof(File)
    .refine((file) => file.size !== 0, "Please upload an image"),
});

export default function Page() {
  const { toast } = useToast();
  const [preview, setPreview] = useState<string | ArrayBuffer | null>("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ label: string; score: number }[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: {
      image: new File([""], "filename"),
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

    const formData = new FormData()
    formData.append("image",values.image)

    toast({
      title: "Image Uploaded",
      description: `Image uploaded successfully 🎉 ${values.image.name}`,
    });
    try {
      setIsLoading(true);

      const response = await fetch("/api/image-classification", {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResult(data.text);

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

          <Button type="submit" disabled={form.formState.isSubmitting}>
            Submit
          </Button>
        </form>
      </Form>
      {/* <Button className="my-2" onClick={clearImage}>
        Clear image
      </Button> */}
      <div>
      <h3 className="text-lg font-semibold">Classification Results</h3>
      {isLoading && <p>Wait, Progress to classify image ...</p>}
      {isLoading && <SpinnerAI2/>}
      {/* Render result as progress bars */}
      {result.length > 0 && (
        <div>

          {result.map(({ label, score }, index) => (
            <div key={index} className="space-y-2">
              <p className="font-bold text-sky-500">
                {label} - {Math.round(score * 100)}%
              </p>
              <Progress value={score * 100} />
            </div>
          ))}
        </div>
      )}
      </div>
      
    </div>
  );
}
