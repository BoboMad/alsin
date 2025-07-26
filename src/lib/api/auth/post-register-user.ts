import axios, { AxiosError } from 'axios';
import { useMutation } from '@tanstack/react-query';
import type { RegisterFormValues } from '@/types/form-types';
import { axiosInstance } from '@/lib/axios';
import { MutationConfig } from '@/lib/react-query';
import { APIErrorResponse, MessageResponse } from '@/types/global-types';

export const postRegisterUser = async (data: RegisterFormValues): Promise<MessageResponse> => {
  const response = await axiosInstance.post<MessageResponse>(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, data, { withCredentials: true });
  return response.data;
};

type UseRegisterOptions = {
  config?: MutationConfig<typeof postRegisterUser, AxiosError<APIErrorResponse>>;
};

export const useRegisterUser = ({ config }: UseRegisterOptions = {}) => {
  return useMutation({
    mutationFn: postRegisterUser,
    ...config,
  });
};
