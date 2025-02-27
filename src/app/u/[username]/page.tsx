'use client';

import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CardHeader, CardContent, Card } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import * as z from 'zod';
import { ApiResponse } from '@/types/ApiResponse';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { messageSchema } from '@/schemas/messageSchema';

const parseStringMessages = (messageString: string): string[] => {
  return messageString.split('.').map(msg => msg.trim()).filter(Boolean);
};

const initialMessages = [
  "What's your favorite movie?",
  "Do you have any pets?",
  "What's your dream job?",
];

export default function SendMessage() {
  const params = useParams<{ username: string }>();
  const username = params.username;

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const messageContent = form.watch('content');

  const handleMessageClick = (message: string) => {
    form.setValue('content', message);
  };

  const [isLoading, setIsLoading] = useState(false);
  const [isSuggestLoading, setIsSuggestLoading] = useState(false);
  const [suggestedMessages, setSuggestedMessages] = useState<string[]>(initialMessages);

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>('/api/send-message', {
        ...data,
        username,
      });

      toast({
        title: response.data.message,
        variant: 'default',
      });
      form.reset({ ...form.getValues(), content: '' });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ?? 'Failed to send message',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSuggestedMessages = async () => {
    setIsSuggestLoading(true);
    try {
      const response = await axios.post('/api/suggest-messages', {
        input: "Suggest some anonymous messages for social media in one line only should be short and ends with a full stop with no star sign in the front",
      });
        console.log(response.data.response)
      if (response.data.response) {
        const newMessages = parseStringMessages(response.data.response);
        setSuggestedMessages(
          response.data.response
            .split('.')
            .map((msg: string) => msg.trim()) // Adding type annotation for msg
            .filter(Boolean)
        );
      } else {
        setSuggestedMessages(['No suggestions available.']);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      setSuggestedMessages(['Failed to fetch suggestions.']);
    } finally {
      setIsSuggestLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0e1f31] to-gray-600">
    <div className="container mx-auto my-8 p-6 bg-gradient-to-b from-[#193247] to-gray-400 shadow-lg rounded-lg max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-center text-black">
        Public Profile Link
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black">
                  Send Anonymous Message to @{username}
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your anonymous message here"
                    className="resize-none border-gray-400 text-black"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center">
            {isLoading ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button type="submit" disabled={isLoading || !messageContent}>
                Send It
              </Button>
            )}
          </div>
        </form>
      </Form>

      <div className="space-y-4 my-8">
        <div className="space-y-2 text-black">
          <Button
            onClick={fetchSuggestedMessages}
            className="my-4"
            disabled={isSuggestLoading}
          >
            {isSuggestLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              'Suggest Messages'
            )}
          </Button>
          <p>Click on any message below to select it.</p>
        </div>
        <Card className="bg-gradient-to-b from-navy-800 to-gray-600 text-white border-none shadow-lg">
          <CardHeader>
            <h3 className="text-xl font-semibold text-black">Messages</h3>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
            {suggestedMessages.length === 0 ? (
              <p className="text-black">No suggested messages yet.</p>
            ) : (
              suggestedMessages.map((message, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="mb-2 border-gray-400 text-black"
                  onClick={() => handleMessageClick(message)}
                >
                  {message}
                </Button>
              ))
            )}
          </CardContent>
        </Card>
      </div>
      <Separator className="my-6" />
      <div className="text-center text-black">
        <div className="mb-4">Get Your Message Board</div>
        <Link href={'/sign-up'}>
          <Button>Create Your Account</Button>
        </Link>
      </div>
    </div>
   </div>
  );
}
