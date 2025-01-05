"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { HeartIcon, UploadCloudIcon } from "lucide-react";
import Image from "next/image";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import Chat, { PersonaType } from "./chats";

const random_persona = [
  {
    persona_picture: "/images/woman1.webp",
    persona_name: "Elena",
    persona_gender: "female",
    persona_personality: "Fun and Playful",
    persona_hobbies: "Cooking and Cycling",
    persona_preferences: "Nature Lover",
  },
  {
    persona_picture: "/images/woman2.jpg",
    persona_name: "Natasha",
    persona_gender: "female",
    persona_personality: "Fun and Playful",
    persona_hobbies: "Swimming and Cooking",
    persona_preferences: "Loves anything about foods",
  },
  {
    persona_picture: "/images/woman3.webp",
    persona_name: "Angeline",
    persona_gender: "female",
    persona_personality: "Fun and Playful",
    persona_hobbies: "Reading book, cooking, baking cake.",
    persona_preferences: "Loves family",
  }
]

const formSchema = z.object({
  user_name: z.string(),
  persona_picture: z
    //Rest of validations done via react dropzone
    .instanceof(File)
    .refine((file) => file.size !== 0, "Please upload an image"),
  persona_name: z.string(),
  persona_gender: z.string(),
  persona_personality: z.string(),
  persona_hobbies: z.string(),
  persona_preferences: z.string(),
});

export default function Page() {
  const [userName, setUserName] = useState("");
  const [love, setLove] = useState<PersonaType>({
    name: "",
    picture: "",
    gender: "",
    personality: "",
    hobbies: "",
    preferences: "",
  });
  const [preview, setPreview] = useState<string | ArrayBuffer | null>("");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      user_name: "",
      persona_picture: undefined,
      persona_name: "",
      persona_gender: "female",
      persona_personality: "Fun and Playful",
      persona_hobbies: "",
      persona_preferences: "",
    },
  });

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const reader = new FileReader();
      try {
        reader.onload = () => setPreview(reader.result);
        reader.readAsDataURL(acceptedFiles[0]);
        form.setValue("persona_picture", acceptedFiles[0]);
        form.clearErrors("persona_picture");
      } catch (error) {
        console.log(error);
        setPreview(null);
        form.resetField("persona_picture");
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

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log(values);
      setUserName(values.user_name);
      setLove({
        name: values.persona_name,
        picture: preview!.toString(),
        gender: values.persona_gender,
        personality: values.persona_personality,
        hobbies: values.persona_hobbies,
        preferences: values.persona_preferences,
      });
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  return (
    <div className="flex flex-col md:flex-row gap-2 min-h-screen">
      <div className="flex-1 flex flex-col gap-2 flex-grow">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="text-red-500" variant="outline"><HeartIcon /><HeartIcon /><HeartIcon />Create your own Lover<HeartIcon /><HeartIcon /><HeartIcon /></Button>
          </DialogTrigger>
          <DialogContent
            className={"lg:max-w-screen-lg overflow-y-scroll max-h-screen"}
          >
            <DialogHeader>
              <DialogTitle>Set up your lover AI</DialogTitle>
            </DialogHeader>
            <Form {...form} >
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid md:grid-cols-2 gap-4"
              >
                <FormField
                  control={form.control}
                  name="user_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your name</FormLabel>
                      <FormControl>
                        <Input placeholder="" type="" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="persona_picture"
                  render={() => (
                    <FormItem className="">
                      <FormLabel
                        className={`${
                          fileRejections.length !== 0 && "text-destructive"
                        }`}
                      >
                        <span
                          className={
                            form.formState.errors.persona_picture ||
                            fileRejections.length !== 0
                              ? "text-destructive"
                              : ""
                          }
                        >
                          Lover picture
                        </span>
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
                              height={200}
                              width={200}
                            />
                          )}
                          <UploadCloudIcon
                            className={`size-10 ${
                              preview ? "hidden" : "block"
                            }`}
                          />
                          <Input {...getInputProps()} type="file" />
                          <FormDescription>
                            {isDragActive
                              ? `Drop the image`
                              : `Click here or drag an image to upload it`}
                          </FormDescription>
                        </div>
                      </FormControl>
                      <FormMessage>
                        {fileRejections.length !== 0 && (
                          <p>
                            Image must be less than 1MB and of type png, jpg, or
                            jpeg
                          </p>
                        )}
                      </FormMessage>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="persona_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lover name</FormLabel>
                      <FormControl>
                        <Input placeholder="Sophia" type="" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="persona_gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lover gender</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="female">female</SelectItem>
                          <SelectItem value="male">male</SelectItem>
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="persona_personality"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lover personality</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Kind and Supportive">
                            Kind and Supportive
                          </SelectItem>
                          <SelectItem value="Fun and Playful">
                            Fun and Playful
                          </SelectItem>
                          <SelectItem value="Intellectual and Serious">
                            Intellectual and Serious
                          </SelectItem>
                          <SelectItem value="Caring and Maternal">
                            Caring and Maternal
                          </SelectItem>
                          <SelectItem value="Adventurous and Spontaneous">
                            Adventurous and Spontaneous
                          </SelectItem>
                          <SelectItem value="Independent and Ambitious">
                            Independent and Ambitious
                          </SelectItem>
                          <SelectItem value="Sweet and Romantic">
                            Sweet and Romantic
                          </SelectItem>
                          <SelectItem value="Funny and Witty">
                            Funny and Witty
                          </SelectItem>
                          <SelectItem value="Caring but Realistic">
                            Caring but Realistic
                          </SelectItem>
                          <SelectItem value="Supportive but Honest">
                            Supportive but Honest
                          </SelectItem>
                          <SelectItem value="Confident and Assertive">
                            Confident and Assertive
                          </SelectItem>
                          <SelectItem value="Optimistic and Positive">
                            Optimistic and Positive
                          </SelectItem>
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="persona_hobbies"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lover Hobbies</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="loves reading mystery novels, hiking, and painting."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="persona_preferences"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lover preferences</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="likes Italian food and enjoys going to art galleries."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogClose asChild>
                  <Button type="submit">Submit</Button>
                </DialogClose>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
        <div className="flex flex-row justify-around">
        {
          random_persona.length > 0 && random_persona.map((a,i) => (
            <div key={i} className="flex flex-col gap-1 p-2 items-center">
              <Image
                src={a.persona_picture}
                alt="image"
                width={100}
                height={100}
                className="object-cover object-top w-20 h-20 rounded-md"
              />
              <p>{a.persona_name}</p>
              <Button size="sm" onClick={() => {
                setLove({
                  name: a.persona_name,
                  picture: a.persona_picture,
                  gender: a.persona_gender,
                  personality: a.persona_personality,
                  hobbies: a.persona_hobbies,
                  preferences: a.persona_preferences,
                })
              }}>Choose</Button>
            </div>
          ))
        }
        </div>
      </div>
      <div className="flex-1">
      {love.name && <Chat user_name={userName} persona={love} />}
      </div>

    </div>
  );
}
