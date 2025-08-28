"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {  useForm } from "react-hook-form";
import { signinSchema } from "@/app/schemas/signinSchema";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import React, { useState } from "react";
import { ApiResponse } from "@/utils/ApiResponse";
import { toast } from "sonner";
import { signIn } from "next-auth/react";
import { Form , FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Page = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setIsLoading] = useState(false);

  const route = useRouter();

  const form = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },

});
const onSubmit = async(data : z.infer<typeof signinSchema>)=>{
    try {
        setIsSubmitting(true)
        setIsLoading(true)
        setMessage('')  
        const response  = await signIn('credentials', {
            redirect : false,
            identifier : data.identifier,
            password : data.password
        })
        if (response?.error) {
        if (response.error === "CredentialsSignin") {
          toast("Incorrect username or password");
        } else {
          toast(response.error);
        }
      }

      if(response?.url){
        route.replace('/dashboard')
      }
    } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>
        toast.dismiss(axiosError.response?.data.message)
    }finally{
      setIsSubmitting(false)
    }
}
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Welcome Back to True Feedback
          </h1>
          <p className="mb-4">Sign in to continue your secret conversations</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email/Username</FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <Input {...field} type="password" />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              Sign In
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Create a new Account?{" "}
            <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
};

export default Page;
