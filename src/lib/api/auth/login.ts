import axios, { AxiosError } from 'axios';
import { useMutation } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axios';
import { MutationConfig } from '@/lib/react-query';
import { APIErrorResponse, MessageResponse } from '@/types/global-types';

interface LoginProps {
  email: string;
  password: string;
}

export const Login = async ({ email, password }: LoginProps): Promise<MessageResponse> => {
  const response = await axiosInstance.post<MessageResponse>(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, { email, password }, { withCredentials: true });
  return response.data;
};

type UseLogin = {
  config?: MutationConfig<typeof Login, AxiosError<APIErrorResponse>>;
};

export const useLogin = ({ config }: UseLogin = {}) => {
  return useMutation({
    mutationFn: Login,
    ...config,
  });
};
