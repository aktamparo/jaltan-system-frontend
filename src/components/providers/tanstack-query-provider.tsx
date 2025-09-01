"use client";
import { QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { queryClient } from "@/lib/react-query";

export const ReactQueryClientProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
