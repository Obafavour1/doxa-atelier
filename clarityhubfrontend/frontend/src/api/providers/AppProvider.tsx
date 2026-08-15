import React, { Suspense } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../queryClient";
import LoadingSpinner from "../../shared/components/LoadingSpinner";
// import { queryClient } from "./queryClient";

export const AppProviders = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <Suspense fallback={<LoadingSpinner label="Preparing DOXA Atelier" />}>{children}</Suspense>
  </QueryClientProvider>
);
