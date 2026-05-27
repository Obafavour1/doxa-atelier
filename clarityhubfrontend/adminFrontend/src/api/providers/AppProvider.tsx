import React, { Suspense } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../queryClient";
// import { queryClient } from "./queryClient";

export const AppProviders = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
  </QueryClientProvider>
);
