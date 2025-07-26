import { AxiosError } from 'axios';
import { QueryClient, UseQueryOptions, UseMutationOptions, DefaultOptions } from '@tanstack/react-query';
import { APIErrorResponse } from '@/types/global-types';

// Configure default options for TanStack Query
const queryConfig: DefaultOptions = {
  queries: {
    throwOnError: true, // Replaces useErrorBoundary
    refetchOnWindowFocus: false,
    retry: false,
  },
};

// Create a QueryClient instance with default options
export const queryClient = new QueryClient({ defaultOptions: queryConfig });

// Utility type to extract the resolved value of a Promise (replacing PromiseValue)
export type ExtractFnReturnType<FnType extends (...args: any) => any> = Awaited<ReturnType<FnType>>;

// Type for query configuration
export type QueryConfig<QueryFnType extends (...args: any) => any> = Omit<UseQueryOptions<ExtractFnReturnType<QueryFnType>>, 'queryKey' | 'queryFn'>;

// Type for mutation configuration
export type MutationConfig<MutationFnType extends (...args: any) => any, TError = AxiosError<APIErrorResponse>> = UseMutationOptions<
  ExtractFnReturnType<MutationFnType>,
  TError,
  Parameters<MutationFnType>[0]
>;
