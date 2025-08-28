'use client'
import {z} from 'zod'
import axios, {AxiosError} from 'axios'
import { useState } from 'react'
import { ApiResponse } from '@/utils/ApiResponse'
import { verifyCodeSchema } from '@/app/schemas/verifyCodeSchema'
import {  useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useParams, useRouter } from 'next/navigation'
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const Page = () => {
    const params = useParams<{username : string}>()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const route = useRouter()
    const form = useForm<z.infer<typeof verifyCodeSchema>>({
        resolver : zodResolver(verifyCodeSchema),
        defaultValues : {
            code : ''
        }
    })
    const onSubmit = async(data : z.infer<typeof verifyCodeSchema>) =>{
        setIsSubmitting(true)
        try {
            const res = await axios.post<ApiResponse>('/api/verifyCode', {
                username : params.username,
                code : data.code
            })
            if(!res.data.success){
                return null
            }
            toast.success(res.data.message)
            route.replace('/dashboard')
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
            Verify Your Account
          </h1>
          <p className="mb-4">Enter the verification code sent to your email</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="code"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>Verify</Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default Page
