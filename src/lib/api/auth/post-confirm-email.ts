import axios, { AxiosError } from 'axios';
import { useMutation } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axios';
import { MutationConfig } from '@/lib/react-query';
import { APIErrorResponse, MessageResponse } from '@/types/global-types';

interface PostConfirmEmailProps {
  email: string;
  token: string;
}

export const postConfirmEmail = async ({ email, token }: PostConfirmEmailProps): Promise<MessageResponse> => {
  const response = await axiosInstance.post<MessageResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/confirm-email`,
    { email, token },
    { withCredentials: true }
  );
  return response.data;
};

type UseConfirmEmailOptions = {
  config?: MutationConfig<typeof postConfirmEmail, AxiosError<APIErrorResponse>>;
};

export const useConfirmEmail = ({ config }: UseConfirmEmailOptions = {}) => {
  return useMutation({
    mutationFn: postConfirmEmail,
    ...config,
  });
};
