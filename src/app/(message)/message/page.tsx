'use client'
import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import { sendMessageSchema } from "@/app/schemas/sendMessageSchema";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApiResponse } from "@/utils/ApiResponse";
import { toast } from "sonner";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";

const Page = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSend, setIsSend] = useState(false);

  const form = useForm<z.infer<typeof sendMessageSchema>>({
    resolver: zodResolver(sendMessageSchema),
    defaultValues: {
      username : '',
      content: "",
    },
  });
  const onSubmit = async (data: z.infer<typeof sendMessageSchema>) => {
    try {
      const res = await axios.post<ApiResponse>("/api/send-message", data);
      toast(res.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast(axiosError.response?.data.message);
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
          <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                True Feedback
              </h1>
            </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  name="username"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <Input {...field} name="email" />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="content"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Send Message</FormLabel>
                      <Input {...field} name="email" />
                      <FormMessage />
                    </FormItem>
                  )}
                />
    
                <Button type="submit" className="w-full" disabled={isSend}>
                  {isSend ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send"
                  )}
                </Button>
              </form>
            </Form>
            <div className="text-center mt-4">
            </div>
          </div>
        </div>
  );
};

export default Page;
