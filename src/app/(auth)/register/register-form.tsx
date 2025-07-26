'use client';

import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '@/schemas/register-schema';
import { RegisterFormValues } from '@/types/form-types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useRegisterUser } from '@/lib/api/auth/post-register-user';
import { Spinner } from '@/components/ui/spinner';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import 'react-phone-input-2/lib/style.css';
import { DateOfBirthInput } from '@/components/ui/date-of-birth-input';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Camera } from 'lucide-react';
import { PasswordInput } from '@/components/ui/password-input';
import Logo from '@/components/icons/Logo';

//const PhoneInput = dynamic(() => import('react-phone-input-2'), { ssr: false });

export function RegisterForm() {
  const [isRegistered, setIsResistered] = useState(false);

  const {
    watch,
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
  });

  const router = useRouter();

  const { mutate: registerUser, isPending } = useRegisterUser({
    config: {
      onSuccess: data => {
        toast.success(data.message || 'Registration successful!');
        setIsResistered(true);
      },
      onError: error => {
        const message = error.response?.data?.message || 'Registration failed';
        toast.error(message || 'Registration failed');
      },
    },
  });

  const onSubmit = (data: RegisterFormValues) => {
    registerUser(data);
  };

  if (isRegistered) {
    return (
      <div className="flex flex-col max-w-md mx-auto text-center space-y-4 items-center h-screen p-6 justify-center">
        <h2 className="text-2xl font-bold">Registration Successful!</h2>
        <p className="text-gray-600">Please check your email to verify your account.</p>
        <Button onClick={() => router.push('/login')}>Go to Login</Button>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-md shadow-2xl flex gap-0 py-4">
      <div className="flex items-center justify-center mb-2">
        <Logo className="w-10 h-10" /> <h1 className='text-lg'>AlvsInn</h1>
      </div>
      <CardHeader className="flex justify-center">Create your account</CardHeader>
      <CardDescription className="flex justify-center">Welcome! Please fill in the details to get started</CardDescription>
      <CardContent className="p-0">

        <div className="flex flex-col p-6 gap-4">
          <Button className="h-8 px-6">
            Google <Camera />
          </Button>
          <div className="flex items-center gap-4">
            <Separator className="flex-1" />
            <span className="text-muted-foreground text-sm">or</span>
            <Separator className="flex-1" />
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 md:gap-8 max-w-md mx-auto px-6">
          <div className="flex gap-2">
            <div className="flex flex-col gap-1">
              <Label>First Name</Label>
              <Input {...register('firstName')} />
              {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
            </div>

            <div className="flex flex-col gap-1">
              <Label>Last Name</Label>
              <Input {...register('lastName')} />
              {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <Label>Email</Label>
            <Input type="email" {...register('email')} />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <Label>Password</Label>
            <PasswordInput {...register('password')} />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <Label>Confirm Password</Label>
            <PasswordInput {...register('confirmPassword')} />
            {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
          </div>

          {/* <div className="flex flex-col gap-1">
            <Label>Phone Number</Label>
            <Controller
              name="phoneNumber"
              control={control}
              render={({ field }) => (
                <PhoneInput
                  country="se"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  enableSearch={true}
                  disableSearchIcon={true}
                  inputProps={{
                    name: field.name,
                    required: true,
                  }}
                  inputClass="!w-full !bg-background !text-foreground !border !border-input !rounded-md !px-3 !pl-[4rem] !py-2 !text-sm !placeholder:text-muted-foreground !focus:outline-none !focus:ring-2 !focus:ring-ring !focus:border-ring"
                  buttonClass="!px-2"
                  containerClass="!w-full !border !border-input !rounded-md focus-within:ring-1 focus-within:ring-ring"
                  dropdownClass="!z-50"
                />
              )}
            />
            {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>}
          </div> */}

          <div className="flex flex-col gap-1">
            <Label>Date of Birth</Label>
            <Controller name="dateOfBirth" control={control} render={({ field }) => <DateOfBirthInput onChange={field.onChange} value={field.value} />} />
            {errors.dateOfBirth && <p className="text-red-500 text-sm">{errors.dateOfBirth.message}</p>}
          </div>

          {/* <div className="flex items-center gap-2">
            <Checkbox id="terms" {...register('acceptTerms')} />
            <Label htmlFor="terms">I accept the terms and conditions</Label>
          </div>
          {errors.acceptTerms && <p className="text-red-500 text-sm">{errors.acceptTerms.message}</p>} */}

          <Button type="submit" disabled={isPending || !isValid} className="w-full">
            {isPending ? (
              <div className="flex gap-2">
                <Spinner /> Registering
              </div>
            ) : (
              'Register'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
