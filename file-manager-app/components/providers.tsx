"use client";
import { queryClient } from "@/lib/queryclient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster position="top-right" />
    </QueryClientProvider>
  );
}