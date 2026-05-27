import { QueryClient, QueryCache, MutationCache } from "@tanstack/react-query";
// import { toast } from "@/lib/toast";
import { AxiosError } from "axios";
import type { ApiError } from "./types";
import { toast } from "react-toastify";

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (err) => {
      const error = err as AxiosError<ApiError>;
      // Only show toast for actual API errors, not for canceled requests etc.
      if (error.response) {
        toast.error(
          error.response.data?.message || "An unexpected error occurred",
        );
      }
    },
  }),
  mutationCache: new MutationCache({
    onError: (err) => {
      const error = err as AxiosError<ApiError>;
      toast.error(error.response?.data?.message || "Something went wrong");
    },
  }),
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});
