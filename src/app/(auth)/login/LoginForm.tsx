'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, ChevronRight, Loader2 } from 'lucide-react';
import { PasswordInput } from '@/components/ui/password-input';
import { Separator } from '@/components/ui/separator';
import Logo from '@/components/icons/Logo';
import { useLogin } from '@/lib/api/auth/login';
import { toast } from 'sonner';

const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
});

interface LoginResponse {
  message: string;
}

async function loginUser(credentials: { email: string; password: string }) {
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Login failed');
  }

  return data;
}

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEmailConfirmed = searchParams.get('confirmed') === 'true';

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { mutate: login, isPending } = useLogin({
    config: {
      onSuccess: data => {
        toast.success(data.message);
        router.push('/');
      },
      onError: err => {
        toast.error(err.response?.data.message || 'Login failed');
      },
      retry: false,
    },
  });

  const onSubmit = (formData: z.infer<typeof formSchema>) => {
    login(formData);
  };

  return (
    <Card className="w-full max-w-md shadow-2xl flex gap-0">
      <div className="flex items-center justify-center">
        <Logo className="w-10 h-10" />
      </div>
      <CardHeader className="justify-center">
        <CardTitle className="text-xl">Sign in to AlvsInn</CardTitle>
      </CardHeader>

      <CardContent>
        <CardDescription className="mb-4 flex justify-center items-center">
          {isEmailConfirmed ? 'Email confirmed successfully Please sign in.' : 'Welcome back! Please sign in to continue'}
        </CardDescription>

        {!isEmailConfirmed && (
          <div className="flex flex-col">
            <Button className="h-8">
              Google <Camera />
            </Button>
            <div className="p-4">
              <div className="flex items-center gap-4">
                <Separator className="flex-1" />
                <span className="text-muted-foreground text-sm">or</span>
                <Separator className="flex-1" />
              </div>
            </div>
          </div>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
              <ChevronRight />
            </Button>
          </form>
        </Form>
        <div className="mt-4 text-center">
          <a href="/forgot-password" className="text-sm text-blue-600 hover:underline">
            Forgot password?
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
