"use client";
import { Button } from "@/components/ui/button";
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/ui/file-upload";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import { questionsSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { experimental_useObject } from "ai/react";
import { CloudUpload, Paperclip } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { generateQuizTitle } from "./action";
import QuizModal from "@/components/quiz";

const formSchema = z.object({
  files: z.array(z.instanceof(File)).optional(),
});

export default function Page() {
  const [files, setFiles] = useState<File[] | null>(null);
  const [questions, setQuestions] = useState<z.infer<typeof questionsSchema>>(
    []
  );
  const [title, setTitle] = useState<string>();
  const dropZoneConfig = {
    maxFiles: 5,
    maxSize: 1024 * 1024 * 4,
    multiple: true,
  };
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const {
    submit,
    object: partialQuestions,
    isLoading,
  } = experimental_useObject({
    api: "/api/genai/vercel/generate-quiz",
    schema: questionsSchema,
    initialValue: undefined,
    onError: (error) => {
      console.error("Failed to generate quiz. Please try again.", error);
      setFiles([]);
    },
    onFinish: ({ object }) => {
      setQuestions(object ?? []);
    },
  });

  const encodeFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    try {
      const encodedFiles = await Promise.all(
        files!.map(async (file) => ({
          name: file.name,
          type: file.type,
          data: await encodeFileAsBase64(file),
        }))
      );
      const generatedTitle = await generateQuizTitle(encodedFiles[0].name);
      setTitle(generatedTitle);
      submit({ files: encodedFiles });
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  const progress = partialQuestions ? (partialQuestions.length / 4) * 100 : 0;

  const clearPDF = () => {
    setFiles([]);
    setQuestions([]);
  };

  if (questions.length === 4) {
    return (
      <div>
        <Progress value={progress} className="h-2" />
        <QuizModal
          title={title ?? "Quiz"}
          questions={questions}
          clearPDF={clearPDF}
        />
      </div>
    );
  }

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 max-w-3xl mx-auto py-10"
        >
          <FormField
            control={form.control}
            name="files"
            render={() => (
              <FormItem>
                <FormLabel>File</FormLabel>
                <FormControl>
                  <FileUploader
                    value={files}
                    onValueChange={setFiles}
                    dropzoneOptions={dropZoneConfig}
                    className="relative bg-background rounded-lg p-2"
                  >
                    <FileInput
                      id="fileInput"
                      className="outline-dashed outline-1 outline-slate-500"
                    >
                      <div className="flex items-center justify-center flex-col p-8 w-full ">
                        <CloudUpload className="text-gray-500 w-10 h-10" />
                        <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">Click to upload</span>
                          &nbsp; or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          SVG, PNG, JPG or GIF
                        </p>
                      </div>
                    </FileInput>
                    <FileUploaderContent>
                      {files &&
                        files.length > 0 &&
                        files.map((file, i) => (
                          <FileUploaderItem key={i} index={i}>
                            <Paperclip className="h-4 w-4 stroke-current" />
                            <span>{file.name}</span>
                          </FileUploaderItem>
                        ))}
                    </FileUploaderContent>
                  </FileUploader>
                </FormControl>
                <FormDescription>Select a file to upload.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
      {isLoading && <p>loading..</p>}
    </div>
  );
}
