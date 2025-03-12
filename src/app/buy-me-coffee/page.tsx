// @ts-ignore
// @ts-nocheck

"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
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
import { Textarea } from "@/components/ui/textarea";
import { instance } from "@/lib/axios";

const formSchema = z.object({
  name: z.string().min(1),
  email: z.string().min(1),
  amount: z.coerce.number().min(0),
  message: z.string().optional(),
});

const CALLBACK_URL = `${process.env.NEXT_PUBLIC_API_URL}/buy-me-coffee/thankyou`

export default function Page() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          name: "",
          email: "",
          amount: 1000,
          message: "",
        },
      });
    
      useEffect(() => {
        const script = document.createElement("script");
        script.src =
          "https://sandbox.doku.com/jokul-checkout-js/v1/jokul-checkout-1.0.0.js";
        script.async = true;
        document.body.appendChild(script);
    
        script.onload = () => {
          if (typeof window !== "undefined" && window.loadJokulCheckout) {
            console.log("Jokul Checkout script loaded successfully");
          } else {
            console.error("Failed to load Jokul Checkout");
          }
        };
    
        return () => {
          document.body.removeChild(script);
        };
      }, []);
    
      async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
          console.log("Submitting:", values);
    
          const response = await instance.post("api/buy-me-coffee", 
            {
              name: values.name,
              email: values.email,
              amount: values.amount,
              message: values.message,
              callback_url: CALLBACK_URL,
            }
          );
    
          const paymentUrl = response.data?.data?.response?.payment?.url;
          if (!paymentUrl) {
            throw new Error("Payment URL not found in response");
          }
    
          console.log("Redirecting to payment URL:", paymentUrl);
          toast.success("Redirecting to payment...");
          
          // Ensure the function is available before calling
          if (typeof window !== "undefined" && window.loadJokulCheckout) {
            window.loadJokulCheckout(paymentUrl);
          } else {
            window.location.href = paymentUrl;
          }
          
        } catch (error) {
          console.error("Form submission error:", error);
          toast.error("Failed to process payment. Please try again.");
        }
      }

  return (
    <div className="container mx-auto">
      <h1 className="text-4xl font-bold text-center">Donate to the author</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 max-w-3xl mx-auto py-10"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>name</FormLabel>
                <FormControl>
                  <Input placeholder="" type="" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>email</FormLabel>
                <FormControl>
                  <Input placeholder="" type="" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>donate amount (IDR)</FormLabel>
                <FormControl>
                  <Input placeholder="" type="number" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message (optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Message me here"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">{form.formState.isSubmitting ? "Processing...":"Submit"}</Button>
        </form>
      </Form>
    </div>
  );
}
