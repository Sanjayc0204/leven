// components/QueryProvider.tsx
"use client"; // Mark this as a client-side component

import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a new QueryClient instance
const queryClient = new QueryClient();

interface QueryProviderProps {
  children: ReactNode; // Accept children to wrap
}

// QueryProvider component that wraps the app with QueryClientProvider
const QueryProvider = ({ children }: QueryProviderProps) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default QueryProvider;
