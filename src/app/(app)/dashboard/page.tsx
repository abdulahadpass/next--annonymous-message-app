'use client'
import { useSession } from "next-auth/react";
import { User } from "next-auth";
import axios, { AxiosError } from "axios";
import { z } from "zod";
import { isAcceptingMessagesSchema } from "@/app/schemas/isAcceptingMessagesSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import { Message } from "@/models/User";
import { toast } from "sonner";
import { ApiResponse } from "@/utils/ApiResponse";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Loader2, RefreshCcw } from "lucide-react";
import { MessageCard } from "@/components/MessageCard";
const Page = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitch, setIsSwitch] = useState(false);

  const { data: session } = useSession();
  const user: User = session?.user as User;

  const form = useForm<z.infer<typeof isAcceptingMessagesSchema>>({
    resolver: zodResolver(isAcceptingMessagesSchema),
  });
  const { register, watch, setValue } = form;
  
  const acceptMessage = watch("acceptMessage");

  const handleDelete = async (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitch(true);
    try {
      const res = await axios.get<ApiResponse>(`/api/isAcceptingMessage`);
      setValue("acceptMessage", res.data.isAcceptingMessages );
      toast(res.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast(axiosError.response?.data.message);
    } finally {
      setIsSwitch(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      try {
        const response = await axios.get<ApiResponse>("/api/get-messages");
        setMessages(response.data.messages || []);

        if (refresh) {
          toast(response.data.message);
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast(axiosError.response?.data.message);
      } finally {
        setIsLoading(false);
      }
    },
    [setIsLoading, setMessages]
  );

  useEffect(() => {
    if (!session || !session.user) return;

    fetchAcceptMessage();
    fetchMessages();
  }, [fetchAcceptMessage, fetchMessages, session, setValue]);


  const handleSwitch = async (checked: boolean) => {
   console.log('check',checked);
   
    setIsSwitch(true);
    try {
      const response = await axios.post<ApiResponse>(
        "/api/isAcceptingMessage",
        {
          acceptMessage : checked

        }
      );
      setValue("acceptMessage", checked);
      toast(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast(axiosError.response?.data.message);
    } finally {
      setIsSwitch(false);
    }
  };
  if (!session || !session.user) {
    return
  }

  const {username} = user
console.log(user);

  const baseUrl = ` ${window.location.protocol}/${window.location.host}`;
  const personUrl = `${baseUrl}/u/${username}`;

  const copyToClipBoard = () => {
    navigator.clipboard.writeText(personUrl);
    toast("Copy Succcessfull");
  };
  return(
     <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
        <div className="flex items-center">
          <input
            type="text"
            value={personUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipBoard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register('acceptMessage')}
          checked={acceptMessage}
          onCheckedChange={handleSwitch}
          disabled={isSwitch}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessage ? 'On' : 'Off'}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
              key={index}
              message={message}
              onMessageDelete={handleDelete}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  )
};

export default Page;
